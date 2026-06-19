import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/* ---------------- GET ALL VEHICLES (ADMIN) ---------------- */
router.get("/all", async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, vehicles });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
});

/* ---------------- CREATE VEHICLE ---------------- */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      imageUrl,
      available,

      isTaxiFleet,
      isSelfDrive,

      fuelType,
      transmission,
      seats,
      modelYear,
      rentalPerDay,

      passengerCapacity,
      suitcaseCapacity,

      description,
    } = req.body;

    // 🚀 FIXED VALIDATION (IMPORTANT)
    // ONLY block if BOTH are explicitly TRUE/FALSE conflict, NOT missing both
    const isTaxi = isTaxiFleet === true;
    const isSelf = isSelfDrive === true;

    // ❌ ONLY invalid if BOTH are true (optional business rule)
    if (isTaxi && isSelf) {
      return res.status(400).json({
        success: false,
        message: "Vehicle cannot be both Taxi and Self Drive",
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        category,
        price: price ? Number(price) : 0,
        imageUrl: imageUrl || null,
        available: available ?? true,

        // 🚖 FLAGS (NOW SAFE FOR TEMPO)
        isTaxiFleet: isTaxi,
        isSelfDrive: isSelf,

        // 🚗 SELF DRIVE (only used if self drive true)
        fuelType: isSelf ? fuelType || null : null,
        transmission: isSelf ? transmission || null : null,
        seats: isSelf && seats ? Number(seats) : null,
        modelYear: isSelf && modelYear ? Number(modelYear) : null,
        rentalPerDay: isSelf && rentalPerDay ? Number(rentalPerDay) : null,

        // 🚌 TEMPO / URBANIA (always allowed)
        passengerCapacity: passengerCapacity
          ? Number(passengerCapacity)
          : null,

        suitcaseCapacity: suitcaseCapacity
          ? Number(suitcaseCapacity)
          : null,

        description: description || null,
      },
    });

    res.json({ success: true, vehicle });

  } catch (error) {
    console.error("CREATE VEHICLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
    });
  }
});

/* ---------------- UPDATE VEHICLE ---------------- */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      price,
      imageUrl,
      available,

      isTaxiFleet,
      isSelfDrive,

      fuelType,
      transmission,
      seats,
      modelYear,
      rentalPerDay,

      passengerCapacity,
      suitcaseCapacity,

      description,
    } = req.body;

    const isTaxi = isTaxiFleet === true;
    const isSelf = isSelfDrive === true;

    if (isTaxi && isSelf) {
      return res.status(400).json({
        success: false,
        message: "Vehicle cannot be both Taxi and Self Drive",
      });
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        name,
        category,
        price: price ? Number(price) : 0,
        imageUrl: imageUrl || null,
        available,

        isTaxiFleet: isTaxi,
        isSelfDrive: isSelf,

        fuelType: isSelf ? fuelType || null : null,
        transmission: isSelf ? transmission || null : null,
        seats: isSelf && seats ? Number(seats) : null,
        modelYear: isSelf && modelYear ? Number(modelYear) : null,
        rentalPerDay: isSelf && rentalPerDay ? Number(rentalPerDay) : null,

        passengerCapacity: passengerCapacity
          ? Number(passengerCapacity)
          : null,

        suitcaseCapacity: suitcaseCapacity
          ? Number(suitcaseCapacity)
          : null,

        description: description || null,
      },
    });

    res.json({ success: true, vehicle });

  } catch (error) {
    console.error("UPDATE VEHICLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
    });
  }
});

/* ---------------- TOGGLE ---------------- */
router.patch("/:id/toggle", async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const updated = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: {
        available: !vehicle.available,
      },
    });

    res.json({ success: true, vehicle: updated });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle vehicle",
    });
  }
});

/* ---------------- DELETE ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.vehicle.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true, message: "Vehicle deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
});

/* ---------------- ACTIVE ---------------- */
router.get("/", async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { available: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, vehicles });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
});

export default router;