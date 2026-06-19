import { Router } from "express";
import prisma from "../prisma";

const router = Router();

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
/* ---------------- GET ALL FEEDBACKS ---------------- */
router.get("/", async (req, res) => {
  try {
    const { visible } = req.query;

    const feedbacks = await prisma.feedback.findMany({
      where:
        visible === "true"
          ? { showOnWebsite: true }
          : {},
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
});

/* ---------------- TOGGLE VISIBILITY ---------------- */
router.patch("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;

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