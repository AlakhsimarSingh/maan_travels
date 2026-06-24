import express from "express";
import prisma from "../prisma";

// const prisma = new PrismaClient();
const router = express.Router();

/**
 * GET /api/pricing?routeId=xxx&vehicleId=yyy
 *
 * Public — confirmed the only caller is `useRoutePricing`, a client hook
 * with no credentials that powers a live price preview on a public
 * booking form as the customer picks a route + vehicle. The customer
 * sees this price regardless, so there's no security reason to gate it,
 * and gating it was actively breaking the price preview (every call
 * 401'd, silently falling back to ₹0). Admin price *edits* go through
 * the separately-guarded POST /api/routes/pricing in routes.routes.ts —
 * that one should stay behind requireAdminDevice; this read-only lookup
 * should not.
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