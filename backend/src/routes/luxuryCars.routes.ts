import { Router } from "express";
import prisma from "../prisma";
import { requireAdminDevice } from "../middleware/requireAdminDevice";

const router = Router();

// See booking.routes.ts / routes.routes.ts / vehicle.routes.ts for why this
// normalization is needed — some @types/express configurations type route
// params as string | string[] | undefined rather than plain string.
function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
}

/*
------------------------------------------------
GET ALL LUXURY CARS (ADMIN)
------------------------------------------------
*/
router.get("/all", requireAdminDevice, async (req, res) => {
  try {
    const luxuryCars = await prisma.luxuryCar.findMany({
      include: {
        vehicle: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      luxuryCars,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch luxury cars",
    });
  }
});

/*
------------------------------------------------
GET ACTIVE LUXURY CARS (PUBLIC)
------------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const luxuryCars = await prisma.luxuryCar.findMany({
      where: {
        vehicle: {
          available: true,
        },
      },
      include: {
        vehicle: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      luxuryCars,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch luxury cars",
    });
  }
});

/*
------------------------------------------------
GET SINGLE LUXURY CAR (PUBLIC — /luxury-cars/[slug] detail page)
------------------------------------------------
*/
router.get("/:slug", async (req, res) => {
  try {
    const car = await prisma.luxuryCar.findUnique({
      where: {
        slug: getParam(req.params.slug),
      },
      include: {
        vehicle: true,
      },
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Luxury car not found",
      });
    }

    res.json({
      success: true,
      car,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch luxury car",
    });
  }
});

/*
------------------------------------------------
CREATE LUXURY CAR (ADMIN)
------------------------------------------------
*/
router.post("/", requireAdminDevice, async (req, res) => {
  try {
    const { name, price, imageUrl, available, slug, description, features } = req.body;

    /* ---------------- VALIDATION ---------------- */
    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!slug) missing.push("slug");
    if (price === undefined || price === null || price === "") missing.push("price");

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a number greater than 0",
      });
    }

    const normalizedSlug = String(slug).trim().toLowerCase();
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(normalizedSlug)) {
      return res.status(400).json({
        success: false,
        message: "Slug must contain only lowercase letters, numbers and hyphens",
      });
    }

    const existingSlug = await prisma.luxuryCar.findUnique({
      where: { slug: normalizedSlug },
    });
    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: "A luxury car with this slug already exists",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. CREATE VEHICLE (ENFORCED LUXURY CONFIG)
      const vehicle = await tx.vehicle.create({
        data: {
          name,
          category: "Luxury",
          price: numericPrice,
          imageUrl: imageUrl || null,
          available: available ?? true,

          // FORCE LUXURY RULES — a luxury car is never part of the taxi
          // fleet or self drive fleet, regardless of what the client sends.
          isTaxiFleet: false,
          isSelfDrive: false,

          // no self-drive specs
          fuelType: null,
          transmission: null,
          seats: null,
          modelYear: null,
          rentalPerDay: null,

          // luxury usually doesn't need capacity fields
          passengerCapacity: null,
          suitcaseCapacity: null,
        },
      });

      // 2. CREATE LUXURY CAR
      const luxuryCar = await tx.luxuryCar.create({
        data: {
          vehicleId: vehicle.id,
          name,
          slug: normalizedSlug,
          image: imageUrl,
          category: "Luxury",
          description,
          features: features || [],
        },
        include: {
          vehicle: true,
        },
      });

      return luxuryCar;
    });

    res.json({
      success: true,
      luxuryCar: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create luxury car",
    });
  }
});

/*
------------------------------------------------
UPDATE LUXURY CAR (ADMIN)
------------------------------------------------
*/
router.put("/:id", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);

    const { name, price, imageUrl, available, slug, description, features } = req.body;

    /* ---------------- VALIDATION ---------------- */
    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!slug) missing.push("slug");
    if (price === undefined || price === null || price === "") missing.push("price");

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a number greater than 0",
      });
    }

    const normalizedSlug = String(slug).trim().toLowerCase();
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(normalizedSlug)) {
      return res.status(400).json({
        success: false,
        message: "Slug must contain only lowercase letters, numbers and hyphens",
      });
    }

    const luxuryCar = await prisma.luxuryCar.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!luxuryCar) {
      return res.status(404).json({
        success: false,
        message: "Luxury car not found",
      });
    }

    // If the slug changed, make sure the new one isn't already taken by a
    // different luxury car.
    if (normalizedSlug !== luxuryCar.slug) {
      const existingSlug = await prisma.luxuryCar.findUnique({
        where: { slug: normalizedSlug },
      });
      if (existingSlug && existingSlug.id !== id) {
        return res.status(409).json({
          success: false,
          message: "A luxury car with this slug already exists",
        });
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      // UPDATE VEHICLE (ENFORCE LUXURY RULES AGAIN)
      await tx.vehicle.update({
        where: { id: luxuryCar.vehicleId },
        data: {
          name,
          price: numericPrice,
          imageUrl,
          available,

          isTaxiFleet: false,
          isSelfDrive: false,
        },
      });

      // UPDATE LUXURY DETAILS
      return await tx.luxuryCar.update({
        where: { id },
        data: {
          name,
          image: imageUrl,
          category: "Luxury",
          slug: normalizedSlug,
          description,
          features: features || [],
        },
        include: {
          vehicle: true,
        },
      });
    });

    res.json({
      success: true,
      luxuryCar: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update luxury car",
    });
  }
});

/*
------------------------------------------------
DELETE LUXURY CAR (ADMIN)
------------------------------------------------
*/
router.delete("/:id", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);

    const luxuryCar = await prisma.luxuryCar.findUnique({
      where: { id },
    });

    if (!luxuryCar) {
      return res.status(404).json({
        success: false,
        message: "Luxury car not found",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.luxuryCar.delete({
        where: { id },
      });

      await tx.vehicle.delete({
        where: { id: luxuryCar.vehicleId },
      });
    });

    res.json({
      success: true,
      message: "Luxury car deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete luxury car",
    });
  }
});

export default router;