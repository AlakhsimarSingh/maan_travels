import { Router } from "express";
import prisma from "../prisma";

const router = Router();

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

    /* ---------------- 1. CREATE CUSTOMER ---------------- */
    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
      },
    });

    /* ---------------- 2. CREATE BASE BOOKING ---------------- */
    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceType: "SELF_DRIVE",
        status: "pending",
        returnDate: new Date(returnDate),
        requirements,
      },
    });

    /* ---------------- 3. CREATE SELF DRIVE BOOKING ---------------- */
    const selfDrive = await prisma.selfDriveBooking.create({
      data: {
        bookingId: booking.id,
        vehicleId,
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        license,
        requirements,
      },
    });

    return res.json({
      success: true,
      booking,
      selfDrive,
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