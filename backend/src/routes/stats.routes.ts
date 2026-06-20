import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/* ---------------- GET DASHBOARD STATS ---------------- */
router.get("/", async (req, res) => {
  try {
    const [
      totalVehicles,
      totalBookings,
      totalFeedback,
      pendingBookings,
      confirmedBookings,
      revenueAgg,
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.booking.count(),
      prisma.feedback.count(),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.booking.count({ where: { status: "confirmed" } }),
      prisma.booking.aggregate({ _sum: { amountPaid: true } }),
    ]);

    res.json({
      success: true,
      stats: {
        totalVehicles,
        totalBookings,
        totalFeedback,
        pendingBookings,
        confirmedBookings,
        totalRevenue: revenueAgg._sum.amountPaid || 0,
      },
    });
  } catch (error) {
    console.error("STATS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

export default router;