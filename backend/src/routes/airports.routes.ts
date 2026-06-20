import { Router } from "express";
import prisma from "../prisma";
import { upload } from "../middleware/upload";

const router = Router();

// PUBLIC — active airports only
router.get("/", async (req, res) => {
  try {
    const airports = await prisma.airport.findMany({
      where: { active: true },
      include: { pricing: true },
      orderBy: { createdAt: "asc" },
    });

    res.json({ success: true, airports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch airports" });
  }
});

// ADMIN — everything, including inactive
router.get("/all", async (req, res) => {
  try {
    const airports = await prisma.airport.findMany({
      include: { pricing: true },
      orderBy: { createdAt: "asc" },
    });

    res.json({ success: true, airports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch airports" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, shortName, description } = req.body;

    if (!name || !shortName) {
      return res.status(400).json({ success: false, message: "name and shortName are required" });
    }

    const airport = await prisma.airport.create({
      data: {
        name,
        shortName,
        description,
        image: req.file ? `/uploads/${req.file.filename}` : null,
      },
    });

    res.json({ success: true, airport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create airport" });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const  id  = req.params.id as string;
    const { name, shortName, description, active } = req.body;

    const data: any = { name, shortName, description };
    if (active !== undefined) data.active = active === "true" || active === true;
    if (req.file) data.image = `/uploads/${req.file.filename}`;

    const airport = await prisma.airport.update({ where: { id }, data });

    res.json({ success: true, airport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update airport" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.airport.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete airport" });
  }
});

router.post("/pricing", async (req, res) => {
  try {
    const { airportId, vehicleId, price } = req.body;

    if (!airportId || !vehicleId || price === undefined) {
      return res.status(400).json({ success: false, message: "airportId, vehicleId, and price are required" });
    }

    const updated = await prisma.airportPricing.upsert({
      where: { airportId_vehicleId: { airportId, vehicleId } },
      update: { price },
      create: { airportId, vehicleId, price },
    });

    res.json({ success: true, updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update pricing" });
  }
});

export default router;