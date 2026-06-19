import { Router } from "express";
import prisma from "../prisma";

const router = Router();

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
    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is required",
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

    // 🚫 TEMPO SAFETY RULES
    if (vehicle.isSelfDrive) {
      return res.status(400).json({
        success: false,
        message: "Self-drive vehicles cannot be used for tempo bookings",
      });
    }

    if (vehicle.category === "Self Drive") {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle category for tempo booking",
      });
    }

    /* ---------------- CREATE CUSTOMER ---------------- */
    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
      },
    });

    /* ---------------- CREATE BASE BOOKING ---------------- */
    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceType: "TEMPO",
        requirements: requirements || null,
      },
    });

    /* ---------------- CREATE TEMPO BOOKING ---------------- */
    const tempo = await prisma.tempoBooking.create({
      data: {
        bookingId: booking.id,
        vehicleId,

        pickup,
        destination,
        travelDate: new Date(travelDate),

        // FIXED TYPES
        passengers: Number(passengers),
        suitcaseCount: Number(suitcases || 0),

        tripType,
        requirements: requirements || null,
      },
    });

    res.json({
      success: true,
      booking,
      tempo,
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