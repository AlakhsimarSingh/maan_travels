import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/* ---------------- CREATE TEMPO BOOKING (PUBLIC) ---------------- */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      pickup,
      destination,
      travelDate,
      vehicleId,
      passengers,
      suitcases,
      tripType,
      requirements,
    } = req.body;

    /* ---------------- VALIDATION ---------------- */
    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!phone) missing.push("phone");
    if (!vehicleId) missing.push("vehicleId");
    if (!pickup) missing.push("pickup");
    if (!destination) missing.push("destination");
    if (!travelDate) missing.push("travelDate");

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    const parsedTravelDate = new Date(travelDate);
    if (Number.isNaN(parsedTravelDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid travel date",
      });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // 🚫 TEMPO SAFETY RULES — a tempo booking must use a vehicle that's
    // neither self-drive nor taxi fleet (matches the Tempo/Urbania fleet
    // rule established for the admin side: both flags must be false).
    if (vehicle.isSelfDrive) {
      return res.status(400).json({
        success: false,
        message: "Self-drive vehicles cannot be used for tempo bookings",
      });
    }

    if (vehicle.isTaxiFleet) {
      return res.status(400).json({
        success: false,
        message: "Taxi fleet vehicles cannot be used for tempo bookings",
      });
    }

    if (!vehicle.available) {
      return res.status(400).json({
        success: false,
        message: "Selected vehicle is currently unavailable",
      });
    }

    /* ---------------- FIND OR CREATE CUSTOMER (by name + phone) ---------------- */
    let customer = await prisma.customer.findFirst({
      where: { name, phone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { name, phone },
      });
    }

    /* ---------------- CREATE BASE BOOKING + TEMPO BOOKING TOGETHER ---------------- */
    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceType: "TEMPO",
        vehicleId,
        requirements: requirements || null,
        tempo: {
          create: {
            vehicleId,
            pickup,
            destination,
            travelDate: parsedTravelDate,
            passengers: Number(passengers) || 0,
            suitcaseCount: Number(suitcases) || 0,
            tripType,
            requirements: requirements || null,
          },
        },
      },
      include: {
        tempo: true,
        customer: true,
      },
    });

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Tempo booking error:", error);

    res.status(500).json({
      success: false,
      message: "Tempo booking failed",
    });
  }
});

export default router;