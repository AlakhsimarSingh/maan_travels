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
      venue,
      weddingDate,
      guests,
      carsRequired,
      decoration,
      requirements
    } = req.body;

    const carId = String(luxuryCarId);

    const carExists = await prisma.luxuryCar.findUnique({
      where: { id: carId }
    });

    if (!carExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid luxury car selected"
      });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone
      }
    });

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceType: "WEDDING",
        wedding: {
          create: {
            luxuryCarId: carId,   // ✅ FIXED
            pickup,
            venue,
            weddingDate: new Date(weddingDate),
            guests: Number(guests),
            carsRequired: Number(carsRequired),
            decoration,
            requirements
          }
        }
      },
      include: {
        customer: true,
        wedding: true
      }
    });

    res.json({
      success: true,
      booking
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Wedding booking failed"
    });
  }
});



export default router;