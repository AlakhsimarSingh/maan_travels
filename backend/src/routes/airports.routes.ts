import { Router } from "express";
import prisma from "../prisma";
import multer from "multer";
import { supabase } from "../lib/supabase";
import { requireAdminDevice } from "../middleware/requireAdminDevice";

const router = Router();

// Memory-only multer for airport images — goes to public vehicles bucket,
// same as vehicle/gallery/location images. NOT the private payment bucket.
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

async function uploadAirportImage(file: Express.Multer.File): Promise<string> {
  const ext = file.originalname.split(".").pop() || "jpg";
  const fileName = `airports/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

  const { data, error } = await supabase.storage
    .from("vehicles") // public bucket — airport images are marketing assets
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from("vehicles")
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
}

function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
}

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
router.get("/all", requireAdminDevice, async (req, res) => {
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

// ADMIN — create airport
router.post("/", requireAdminDevice, imageUpload.single("image"), async (req, res) => {
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
        image: req.file ? await uploadAirportImage(req.file) : null,
      },
    });

    res.json({ success: true, airport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create airport" });
  }
});

// ADMIN — update airport
router.put("/:id", requireAdminDevice, imageUpload.single("image"), async (req, res) => {
  try {
    const id = getParam(req.params.id);
    const { name, shortName, description, active } = req.body;

    const data: any = { name, shortName, description };
    if (active !== undefined) data.active = active === "true" || active === true;
    if (req.file) data.image = await uploadAirportImage(req.file);

    const airport = await prisma.airport.update({ where: { id }, data });

    res.json({ success: true, airport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update airport" });
  }
});

// ADMIN — delete airport
router.delete("/:id", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);
    await prisma.airport.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete airport" });
  }
});

// ADMIN — set/update per-vehicle pricing for an airport
router.post("/pricing", requireAdminDevice, async (req, res) => {
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