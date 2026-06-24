import express from "express";
import prisma from "../prisma";
import { requireAdminDevice } from "../middleware/requireAdminDevice";

const router = express.Router();

// See booking.routes.ts / airports.routes.ts / vehicle.routes.ts for why
// this normalization is needed — some @types/express configurations type
// route params as string | string[] | undefined rather than plain string.
function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
}

// ================= GET ALL ROUTES =================
// Public — the website needs this to show routes/pricing to customers.
router.get("/", async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      include: { pricing: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, routes });
  } catch (err) {
    console.error("GET /routes error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch routes" });
  }
});

// ================= CREATE ROUTE (ADMIN) =================
router.post("/", requireAdminDevice, async (req, res) => {
  try {
    const { title, from, to, category, baseType, image } = req.body;

    if (!title || !category || !baseType) {
      return res.status(400).json({
        success: false,
        error: "title, category, and baseType are required",
      });
    }

    const route = await prisma.route.create({
      data: { title, from, to, category, baseType, image },
    });

    res.json({ success: true, route });
  } catch (err) {
    console.error("POST /routes error:", err);
    res.status(500).json({ success: false, error: "Failed to create route" });
  }
});

// ================= UPDATE ROUTE (ADMIN) =================
// Was missing requireAdminDevice — anyone with the URL could rewrite any
// route's title/from/to/category/active state.
router.put("/:id", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);
    const { title, from, to, category, baseType, image, active } = req.body;

    const route = await prisma.route.update({
      where: { id },
      data: { title, from, to, category, baseType, image, active },
    });

    res.json({ success: true, route });
  } catch (err) {
    console.error("PUT /routes/:id error:", err);
    res.status(500).json({ success: false, error: "Failed to update route" });
  }
});

// ================= DELETE ROUTE (ADMIN) =================
router.delete("/:id", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);

    await prisma.route.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /routes/:id error:", err);
    res.status(500).json({ success: false, error: "Failed to delete route" });
  }
});

// ================= UPDATE PRICING (ADMIN) =================
// Was missing requireAdminDevice — anyone with the URL could overwrite
// per-vehicle pricing on any route.
router.post("/pricing", requireAdminDevice, async (req, res) => {
  try {
    const { routeId, vehicleId, price } = req.body;

    if (!routeId || !vehicleId || price === undefined) {
      return res.status(400).json({
        success: false,
        error: "routeId, vehicleId, and price are required",
      });
    }

    const updated = await prisma.routePricing.upsert({
      where: { routeId_vehicleId: { routeId, vehicleId } },
      update: { price },
      create: { routeId, vehicleId, price },
    });

    res.json({ success: true, updated });
  } catch (err) {
    console.error("POST /routes/pricing error:", err);
    res.status(500).json({ success: false, error: "Failed to update pricing" });
  }
});

export default router;