import express from "express";
import prisma from "../prisma";

// const prisma = new PrismaClient();
const router = express.Router();

/**
 * GET /api/pricing?routeId=xxx&vehicleId=yyy
 */
router.get("/", async (req, res) => {
  try {
    const { routeId, vehicleId } = req.query;

    if (!routeId || !vehicleId) {
      return res.status(400).json({
        success: false,
        message: "routeId and vehicleId required"
      });
    }

    const price = await prisma.routePricing.findUnique({
      where: {
        routeId_vehicleId: {
          routeId: String(routeId),
          vehicleId: String(vehicleId),
        },
      },
    });

    res.json({
      success: true,
      price: price?.price || 0,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;