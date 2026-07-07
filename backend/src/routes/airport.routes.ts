import { Router } from "express";
import prisma from "../prisma";
import multer from "multer";
import { supabase } from "../lib/supabase";
import { deletePublicImage } from "../middleware/uploadPublic";
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

const AIRPORT_IMAGE_BUCKET = "vehicles"; // public bucket — airport images are marketing assets

async function uploadAirportImage(file: Express.Multer.File): Promise<string> {
  const ext = file.originalname.split(".").pop() || "jpg";
  const fileName = `airports/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(AIRPORT_IMAGE_BUCKET)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from(AIRPORT_IMAGE_BUCKET)
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
}

function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
}

function toLegacyPricing(cityPricing: Array<{ vehicleId: string; price: number }>) {
  const pricingMap = new Map<string, number>();

  for (const entry of cityPricing) {
    if (entry.vehicleId) {
      pricingMap.set(entry.vehicleId, entry.price);
    }
  }

  return Array.from(pricingMap.entries()).map(([vehicleId, price]) => ({ vehicleId, price }));
}

function serializeAirports(airports: Array<{ id: string; name: string; shortName: string; image: string | null; description: string | null; active: boolean; cityPricing: Array<{ vehicleId: string; price: number }>; createdAt: Date; updatedAt: Date }>) {
  return airports.map((airport) => ({
    ...airport,
    pricing: toLegacyPricing(airport.cityPricing || []),
  }));
}

// PUBLIC — active airports only
router.get("/", async (req, res) => {
  try {
    const airports = await prisma.airport.findMany({
      where: { active: true },
      include: { cityPricing: true },
      orderBy: { createdAt: "asc" },
    });

    res.json({ success: true, airports: serializeAirports(airports as any) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch airports" });
  }
});

// ADMIN — everything, including inactive
router.get("/all", requireAdminDevice, async (req, res) => {
  try {
    const airports = await prisma.airport.findMany({
      include: { cityPricing: true },
      orderBy: { createdAt: "asc" },
    });

    res.json({ success: true, airports: serializeAirports(airports as any) });
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
// If a new image is uploaded, the OLD one is deleted from storage only
// after the new file uploads successfully AND the database row is
// updated — so a failed upload or failed DB write never leaves the
// record pointing at a file that's already gone.
router.put("/:id", requireAdminDevice, imageUpload.single("image"), async (req, res) => {
  try {
    const id = getParam(req.params.id);
    const { name, shortName, description, active } = req.body;

    const existing = await prisma.airport.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Airport not found" });
    }

    const data: any = { name, shortName, description };
    if (active !== undefined) data.active = active === "true" || active === true;

    let newImageUrl: string | null = null;
    if (req.file) {
      newImageUrl = await uploadAirportImage(req.file);
      data.image = newImageUrl;
    }

    const airport = await prisma.airport.update({ where: { id }, data });

    if (newImageUrl) {
      await deletePublicImage(existing.image, AIRPORT_IMAGE_BUCKET);
    }

    res.json({ success: true, airport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update airport" });
  }
});

// ADMIN — delete airport
// Cleans up the associated image in storage only after the database row
// is confirmed deleted.
router.delete("/:id", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);

    const existing = await prisma.airport.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Airport not found" });
    }

    await prisma.airport.delete({ where: { id } });

    await deletePublicImage(existing.image, AIRPORT_IMAGE_BUCKET);

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

    const city = await prisma.airportCity.findFirst({
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });

    if (!city) {
      return res.status(400).json({ success: false, message: "No airport city is available for pricing" });
    }

    const updated = await prisma.airportCityPricing.upsert({
      where: {
        airportId_cityId_vehicleId_direction: {
          airportId,
          cityId: city.id,
          vehicleId,
          direction: "TO_AIRPORT",
        },
      },
      update: { price },
      create: {
        airportId,
        cityId: city.id,
        vehicleId,
        direction: "TO_AIRPORT",
        price,
      },
    });

    res.json({ success: true, updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update pricing" });
  }
});

export default router;