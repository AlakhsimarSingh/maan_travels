import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { requireAdminDevice, AuthedRequest } from "../middleware/requireAdminDevice";

const router = Router();

function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
}

/* ---------------- SUBMIT FEEDBACK (PUBLIC) ---------------- */
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      travelDate,
      route,
      satisfaction,
      vehicleRating,
      supportRating,
      driverExperience,
      comments,
      recommend,
    } = req.body;

    const feedback = await prisma.feedback.create({
      data: {
        customerName,
        travelDate: travelDate ? new Date(travelDate) : null,
        route,
        satisfaction,
        vehicleRating: Number(vehicleRating),
        supportRating: Number(supportRating),
        driverExperience,
        comments,
        recommend: recommend === "yes" || recommend === true,
      },
    });

    res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Feedback submission failed",
    });
  }
});

/* ---------------- GET FEEDBACK — DUAL PURPOSE ----------------
   This single route serves two very different audiences depending
   on the ?visible= query param, so the admin check has to live
   INSIDE the handler rather than as router-level middleware (which
   can't see the query param before deciding whether to apply itself).

   ?visible=true  -> PUBLIC. Returns only feedback the admin has
                     explicitly approved for the website's
                     testimonials section. No auth required.

   no query param -> ADMIN MODERATION VIEW. Returns EVERY feedback
                     ever submitted, including hidden/unapproved
                     ones, with full customer names and raw comments.
                     This branch must be gated — otherwise anyone
                     can scrape every submission, including ones a
                     customer never agreed to have shown publicly.
------------------------------------------------------------------ */
router.get("/", async (req: AuthedRequest, res: Response) => {
  const isPublicTestimonialsRequest = req.query.visible === "true";

  if (!isPublicTestimonialsRequest) {
    // Not the public path — verify this is a trusted admin device
    // before going any further, using the same middleware everything
    // else relies on so there's exactly one source of truth for what
    // counts as "authenticated".
    return requireAdminDevice(req, res, async () => {
      await sendFeedback(req, res, { onlyVisible: false });
    });
  }

  await sendFeedback(req, res, { onlyVisible: true });
});

async function sendFeedback(
  req: Request,
  res: Response,
  { onlyVisible }: { onlyVisible: boolean }
) {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: onlyVisible ? { showOnWebsite: true } : {},
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      feedbacks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedbacks",
    });
  }
}

/* ---------------- TOGGLE VISIBILITY (ADMIN) ---------------- */
router.patch("/:id/toggle", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);

    const feedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: {
        showOnWebsite: !feedback.showOnWebsite,
      },
    });

    res.json({
      success: true,
      feedback: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update feedback",
    });
  }
});

export default router;