import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { hashDeviceToken } from "../lib/deviceAuth";

const COOKIE_NAME = "admin_device_token";

// Express's default req.cookies is undefined unless cookie-parser is used.
// We parse the single cookie we care about by hand so this middleware has
// no extra dependency requirement beyond what's already in package.json.
function readCookie(req: Request, name: string): string | null {
  const header = req.headers.cookie;
  if (!header) return null;

  const parts = header.split(";").map((p) => p.trim());
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq);
    if (key === name) {
      return decodeURIComponent(part.slice(eq + 1));
    }
  }
  return null;
}

export type AuthedRequest = Request & {
  adminDevice?: {
    id: string;
    name: string;
  };
};

/**
 * Protects a route or an entire router. Apply once per router with
 * `router.use(requireAdminDevice)`, or per-route for routers that mix
 * public and admin actions on the same path.
 *
 * Checks, in order:
 *  1. A device token cookie is present
 *  2. It matches a known device (by hash, never by raw value)
 *  3. That device's status is "approved" (not pending, not revoked)
 *
 * On success, attaches `req.adminDevice` and updates `lastUsed` (fire and
 * forget — we don't want a slow write to add latency to every admin request).
 */
export async function requireAdminDevice(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const rawToken = readCookie(req, COOKIE_NAME);

    if (!rawToken) {
      return res.status(401).json({
        success: false,
        code: "NO_DEVICE_TOKEN",
        message: "No admin device session found. Please register this device.",
      });
    }

    const tokenHash = hashDeviceToken(rawToken);

    const device = await prisma.adminDevice.findUnique({
      where: { deviceToken: tokenHash },
    });

    if (!device) {
      return res.status(401).json({
        success: false,
        code: "UNKNOWN_DEVICE",
        message: "This device is not recognized. Please register it again.",
      });
    }

    if (device.status === "pending") {
      return res.status(403).json({
        success: false,
        code: "DEVICE_PENDING",
        message: "This device is awaiting approval from a trusted device.",
      });
    }

    if (device.status === "revoked") {
      return res.status(403).json({
        success: false,
        code: "DEVICE_REVOKED",
        message: "This device's access has been revoked.",
      });
    }

    req.adminDevice = { id: device.id, name: device.name };

    // Best-effort, non-blocking — a failure here should never block the
    // actual admin action the request is trying to perform.
    prisma.adminDevice
      .update({ where: { id: device.id }, data: { lastUsed: new Date() } })
      .catch((err) => console.error("Failed to update device lastUsed:", err));

    next();
  } catch (error) {
    console.error("requireAdminDevice error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify admin device",
    });
  }
}

export const ADMIN_DEVICE_COOKIE_NAME = COOKIE_NAME;