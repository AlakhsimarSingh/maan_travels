import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/*
------------------------------------------------
GET ALL LUXURY CARS (ADMIN)
------------------------------------------------
*/
router.get("/all", async (req, res) => {
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
GET SINGLE LUXURY CAR
------------------------------------------------
*/
router.get("/:slug", async (req, res) => {
  try {
    const car = await prisma.luxuryCar.findUnique({
      where: {
        slug: req.params.slug,
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
CREATE LUXURY CAR (UPDATED FOR NEW VEHICLE SCHEMA)
------------------------------------------------
*/
router.post("/", async (req, res) => {
  try {
    const {
      name,
      price,
      imageUrl,
      available,
      slug,
      description,
      features,
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {

      // 1. CREATE VEHICLE (ENFORCED LUXURY CONFIG)
      const vehicle = await tx.vehicle.create({
        data: {
          name,
          category: "Luxury",
          price: Number(price),
          imageUrl: imageUrl || null,
          available: available ?? true,

          // FORCE LUXURY RULES
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
          slug,
          image: imageUrl,
          category: "Luxury",
          description,
          features: features || [],
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
UPDATE LUXURY CAR (SYNCED WITH VEHICLE SCHEMA)
------------------------------------------------
*/
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      price,
      imageUrl,
      available,
      slug,
      description,
      features,
    } = req.body;

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

    const updated = await prisma.$transaction(async (tx) => {

      // UPDATE VEHICLE (ENFORCE LUXURY RULES AGAIN)
      await tx.vehicle.update({
        where: { id: luxuryCar.vehicleId },
        data: {
          name,
          price: Number(price),
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
          slug,
          description,
          features: features || [],
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
DELETE LUXURY CAR
------------------------------------------------
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

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