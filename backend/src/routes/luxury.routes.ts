import { Router } from "express";
import prisma from "../prisma";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      luxuryCarId,
      pickup,
      destination,
      eventDate,
      hours,
      eventType,
      requirements,
    } = req.body;

    if (!luxuryCarId) {
      return res.status(400).json({ success: false, message: "luxuryCarId is required" });
    }

    const luxuryCar = await prisma.luxuryCar.findUnique({
      where: { id: luxuryCarId },
      include: { vehicle: true },
    });

    if (!luxuryCar) {
      return res.status(400).json({ success: false, message: "Invalid luxury car" });
    }

    const totalAmount = luxuryCar.vehicle.price || luxuryCar.vehicle.rentalPerDay || 0;

    const customer = await prisma.customer.create({
      data: { name, phone },
    });

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceType: "LUXURY",
        vehicleId: luxuryCar.vehicleId,
        totalAmount,
        paymentType: "later",
        amountPaid: 0,
        paymentStatus: "not_required",
        luxury: {
          create: {
            luxuryCarId,
            pickup,
            destination,
            eventDate: new Date(eventDate),
            hours,
            eventType,
            requirements,
          },
        },
      },
      include: {
        customer: true,
        luxury: true,
        vehicle: true,
      },
    });

    res.json({
      success: true,
      bookingId: booking.id,
      booking,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Luxury booking failed",
    });
  }
});

export default router;