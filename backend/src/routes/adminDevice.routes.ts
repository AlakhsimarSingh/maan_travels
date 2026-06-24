import { Router, Request, Response } from "express";
import prisma from "../prisma";
import {
  generateDeviceToken,
  hashDeviceToken,
  generateInviteCode,
} from "../lib/deviceAuth";
import {
  requireAdminDevice,
  AuthedRequest,
  ADMIN_DEVICE_COOKIE_NAME,
} from "../middleware/requireAdminDevice";

const router = Router();

/**
 * Express route params are typed as `string` by default, but some
 * @types/express versions / configurations type them as
 * `string | string[] | undefined` (e.g. to account for repeated query-style
 * params). Route params from a path segment like "/:id" are realistically
 * always a single string at runtime, but we normalize defensively here so
 * every call site has a definite, correctly-typed string instead of each
 * one needing its own cast.
 */
function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
}

const INVITE_EXPIRY_MINUTES = 15;
const isProduction = process.env.NODE_ENV === "production";

function setDeviceCookie(res: Response, rawToken: string) {
  res.cookie(ADMIN_DEVICE_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    // 1 year — this is a long-lived trusted-device session by design.
    // Revocation happens via the device's status, not cookie expiry.
    maxAge: 1000 * 60 * 60 * 24 * 365,
    path: "/",
  });
}

/* ------------------------------------------------------------------
   REGISTER DEVICE
   - If this is the very first device ever, auto-approve it (bootstrap).
   - Otherwise, requires a valid, unredeemed, unexpired invite code.
   - Always responds the same shape so the frontend doesn't need two
     separate registration flows.
------------------------------------------------------------------ */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, fingerprint, userAgent } = req.body;

    // req.body.inviteCode can be typed as string | string[] depending on
    // body-parser/typing setup (e.g. if a client sends it twice as a form
    // field, or via certain stricter Request typings). Normalize to a
    // single string up front so every downstream use is unambiguous.
    const rawInviteCode = req.body.inviteCode;
    const inviteCode: string | undefined = Array.isArray(rawInviteCode)
      ? rawInviteCode[0]
      : rawInviteCode;

    if (!name || !fingerprint) {
      return res.status(400).json({
        success: false,
        message: "Missing device information",
      });
    }

    const existing = await prisma.adminDevice.findUnique({
      where: { fingerprint },
    });

    if (existing) {
      // Re-registering an already-known device — just re-issue its cookie
      // if it's approved. Don't silently re-activate a revoked device.
      if (existing.status === "approved") {
        // We don't have the original raw token (only its hash is stored),
        // so a re-registration on a device that lost its cookie needs a
        // fresh token. This invalidates the old one, which is the correct
        // behavior — only one valid session per device at a time.
        const rawToken = generateDeviceToken();
        await prisma.adminDevice.update({
          where: { id: existing.id },
          data: { deviceToken: hashDeviceToken(rawToken) },
        });

        setDeviceCookie(res, rawToken);

        return res.json({
          success: true,
          status: "approved",
          message: "Device re-verified",
        });
      }

      return res.status(403).json({
        success: false,
        status: existing.status,
        message:
          existing.status === "pending"
            ? "This device is still awaiting approval."
            : "This device's access has been revoked.",
      });
    }

    const deviceCount = await prisma.adminDevice.count();
    const isFirstDeviceEver = deviceCount === 0;

    let status = "pending";
    let invite = null;

    if (!isFirstDeviceEver) {
      if (!inviteCode) {
        return res.status(403).json({
          success: false,
          code: "INVITE_REQUIRED",
          message:
            "An invite from an already-trusted device is required to register a new device.",
        });
      }

      invite = await prisma.adminDeviceInvite.findUnique({
        where: { code: inviteCode },
      });

      if (!invite) {
        return res.status(404).json({
          success: false,
          message: "Invite code not found",
        });
      }

      if (invite.redeemedAt) {
        return res.status(409).json({
          success: false,
          message: "This invite has already been used",
        });
      }

      if (invite.expiresAt < new Date()) {
        return res.status(410).json({
          success: false,
          message: "This invite has expired. Generate a new one.",
        });
      }
    }

    const rawToken = generateDeviceToken();

    const device = await prisma.$transaction(async (tx) => {
      const created = await tx.adminDevice.create({
        data: {
          name,
          fingerprint,
          userAgent,
          deviceToken: hashDeviceToken(rawToken),
          status: isFirstDeviceEver ? "approved" : "pending",
          active: isFirstDeviceEver,
        },
      });

      if (invite) {
        await tx.adminDeviceInvite.update({
          where: { id: invite.id },
          data: {
            redeemedAt: new Date(),
            redeemedByDeviceId: created.id,
          },
        });
      }

      return created;
    });

    if (isFirstDeviceEver) {
      setDeviceCookie(res, rawToken);
    }

    res.json({
      success: true,
      status: device.status,
      message: isFirstDeviceEver
        ? "First device registered and auto-approved"
        : "Device registered — awaiting approval from a trusted device",
    });
  } catch (error) {
    console.error("Device registration error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register device",
    });
  }
});

/* ------------------------------------------------------------------
   POLL REGISTRATION STATUS
   A pending device has no cookie yet (we don't issue one until approved),
   so it polls this endpoint by fingerprint to find out when it's been
   approved, then re-hits /register to receive its real cookie+token.
------------------------------------------------------------------ */
router.get("/status/:fingerprint", async (req: Request, res: Response) => {
  try {
    const device = await prisma.adminDevice.findUnique({
      where: { fingerprint: getParam(req.params.fingerprint) },
      select: { status: true },
    });

    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    res.json({ success: true, status: device.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to check device status" });
  }
});

/* ------------------------------------------------------------------
   WHO AM I — lets the frontend check "is this browser currently a
   trusted device" without needing to re-run fingerprinting.
------------------------------------------------------------------ */
router.get("/me", requireAdminDevice, async (req: AuthedRequest, res: Response) => {
  res.json({
    success: true,
    device: req.adminDevice,
  });
});

/* ------------------------------------------------------------------
   CREATE INVITE — only a trusted (approved) device can invite another.
------------------------------------------------------------------ */
router.post(
  "/invites",
  requireAdminDevice,
  async (req: AuthedRequest, res: Response) => {
    try {
      const code = generateInviteCode();
      const expiresAt = new Date(Date.now() + INVITE_EXPIRY_MINUTES * 60 * 1000);

      const invite = await prisma.adminDeviceInvite.create({
        data: {
          code,
          createdByDeviceId: req.adminDevice!.id,
          expiresAt,
        },
      });

      res.json({
        success: true,
        invite: {
          code: invite.code,
          expiresAt: invite.expiresAt,
        },
      });
    } catch (error) {
      console.error("Create invite error:", error);
      res.status(500).json({ success: false, message: "Failed to create invite" });
    }
  }
);

/* ------------------------------------------------------------------
   LIST PENDING INVITES CREATED BY THIS DEVICE (so the UI can show /
   cancel outstanding ones)
------------------------------------------------------------------ */
router.get(
  "/invites",
  requireAdminDevice,
  async (req: AuthedRequest, res: Response) => {
    try {
      const invites = await prisma.adminDeviceInvite.findMany({
        where: { createdByDeviceId: req.adminDevice!.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      res.json({ success: true, invites });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to fetch invites" });
    }
  }
);

/* ------------------------------------------------------------------
   APPROVE A PENDING DEVICE
------------------------------------------------------------------ */
router.patch(
  "/:id/approve",
  requireAdminDevice,
  async (req: AuthedRequest, res: Response) => {
    try {
      const device = await prisma.adminDevice.findUnique({
        where: { id: getParam(req.params.id) },
      });

      if (!device) {
        return res.status(404).json({ success: false, message: "Device not found" });
      }

      if (device.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: `Device is already ${device.status}`,
        });
      }

      const updated = await prisma.adminDevice.update({
        where: { id: getParam(req.params.id) },
        data: { status: "approved", active: true },
      });

      res.json({ success: true, device: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to approve device" });
    }
  }
);

/* ------------------------------------------------------------------
   REVOKE A DEVICE (replaces the old generic "toggle")
   A device can't revoke itself — that's almost always a mistake
   (locking yourself out) rather than an intentional action.
------------------------------------------------------------------ */
router.patch(
  "/:id/revoke",
  requireAdminDevice,
  async (req: AuthedRequest, res: Response) => {
    try {
      if (getParam(req.params.id) === req.adminDevice!.id) {
        return res.status(400).json({
          success: false,
          message: "You can't revoke the device you're currently using.",
        });
      }

      const device = await prisma.adminDevice.findUnique({
        where: { id: getParam(req.params.id) },
      });

      if (!device) {
        return res.status(404).json({ success: false, message: "Device not found" });
      }

      const updated = await prisma.adminDevice.update({
        where: { id: getParam(req.params.id) },
        data: { status: "revoked", active: false },
      });

      res.json({ success: true, device: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to revoke device" });
    }
  }
);

/* ------------------------------------------------------------------
   GET ALL DEVICES (admin-only — view the full trust roster)
------------------------------------------------------------------ */
router.get("/", requireAdminDevice, async (req: AuthedRequest, res: Response) => {
  try {
    const devices = await prisma.adminDevice.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        userAgent: true,
        status: true,
        active: true,
        lastUsed: true,
        createdAt: true,
        // deviceToken and fingerprint are intentionally excluded —
        // there's no legitimate reason for the admin UI to ever display
        // another device's raw fingerprint or token hash.
      },
    });

    res.json({ success: true, devices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch devices" });
  }
});

/* ------------------------------------------------------------------
   DELETE DEVICE
------------------------------------------------------------------ */
router.delete(
  "/:id",
  requireAdminDevice,
  async (req: AuthedRequest, res: Response) => {
    try {
      if (getParam(req.params.id) === req.adminDevice!.id) {
        return res.status(400).json({
          success: false,
          message: "You can't delete the device you're currently using.",
        });
      }

      await prisma.adminDevice.delete({ where: { id: getParam(req.params.id) } });

      res.json({ success: true, message: "Device removed" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to delete device" });
    }
  }
);

/* ------------------------------------------------------------------
   LOGOUT THIS DEVICE (clears the cookie; device row stays, so it can
   re-register via /register and pick up a fresh token instantly,
   without needing a brand new invite)
------------------------------------------------------------------ */
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie(ADMIN_DEVICE_COOKIE_NAME, { path: "/" });
  res.json({ success: true });
});

export default router;