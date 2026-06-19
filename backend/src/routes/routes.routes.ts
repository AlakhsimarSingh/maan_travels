import express from "express";
import prisma from "../prisma";

const router = express.Router();

// ================= GET ALL ROUTES =================
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

// ================= CREATE ROUTE =================
router.post("/", async (req, res) => {
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

// ================= UPDATE ROUTE =================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
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

// ================= DELETE ROUTE =================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.route.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /routes/:id error:", err);
    res.status(500).json({ success: false, error: "Failed to delete route" });
  }
});

// ================= UPDATE PRICING =================
router.post("/pricing", async (req, res) => {
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