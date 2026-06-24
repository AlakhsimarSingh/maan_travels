import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/* ---------------- CREATE SELF DRIVE BOOKING ---------------- */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      vehicleId,
      pickupDate,
      returnDate,
      license,
      requirements,
    } = req.body;

    /* ---------------- VALIDATION ---------------- */
    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!phone) missing.push("phone");
    if (!vehicleId) missing.push("vehicleId");
    if (!pickupDate) missing.push("pickupDate");
    if (!returnDate) missing.push("returnDate");
    if (!license) missing.push("license");

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    const parsedPickup = new Date(pickupDate);
    const parsedReturn = new Date(returnDate);

    if (Number.isNaN(parsedPickup.getTime()) || Number.isNaN(parsedReturn.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup or return date",
      });
    }

    if (parsedReturn < parsedPickup) {
      return res.status(400).json({
        success: false,
        message: "Return date cannot be before pickup date",
      });
    }

    /* ---------------- CONFIRM VEHICLE IS SELF-DRIVE & AVAILABLE ---------------- */
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (!vehicle.isSelfDrive) {
      return res.status(400).json({
        success: false,
        message: "Selected vehicle is not available for self drive",
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

    /* ---------------- CREATE BASE BOOKING + SELF DRIVE BOOKING TOGETHER ---------------- */
    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceType: "SELF_DRIVE",
        status: "pending",
        returnDate: parsedReturn,
        requirements,
        vehicleId,
        selfDrive: {
          create: {
            vehicleId,
            pickupDate: parsedPickup,
            returnDate: parsedReturn,
            license,
            requirements,
          },
        },
      },
      include: {
        selfDrive: true,
        customer: true,
      },
    });

    return res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("SELF DRIVE BOOKING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create self drive booking",
    });
  }
});

export default router;