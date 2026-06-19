import { Router } from "express";

import prisma from "../prisma";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/", upload.single("paymentScreenshot"), async (req, res) => {
  try {
    const {
      name,
      phone,
      pickup,
      airport,
      travelDate,
      pickupTime,
      vehicleId,
      passengers,
      suitcases,
      handbags,
      routeId,
      paymentType,
      amountPaid,
    } = req.body;

    if (!vehicleId) {
      return res.status(400).json({ success: false, message: "vehicleId is required" });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });

    if (!vehicle) {
      return res.status(400).json({ success: false, message: "Invalid vehicle" });
    }

    let totalAmount = 0;

    if (routeId) {
      const pricing = await prisma.routePricing.findUnique({
        where: { routeId_vehicleId: { routeId, vehicleId } },
      });
      if (pricing) totalAmount = pricing.price;
    }

    if (!totalAmount) {
      totalAmount = vehicle.price || vehicle.rentalPerDay || 0;
    }

    const type = paymentType === "full" || paymentType === "partial" ? paymentType : "later";

    let resolvedAmountPaid = 0;
    if (type === "full") resolvedAmountPaid = totalAmount;
    if (type === "partial") resolvedAmountPaid = Number(amountPaid) || 0;

    if ((type === "full" || type === "partial") && !req.file) {
      return res.status(400).json({
        success: false,
        message: "A payment screenshot is required for full or partial payment",
      });
    }

    const customer = await prisma.customer.create({ data: { name, phone } });

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceType: "AIRPORT",
        vehicleId,
        routeId: routeId || undefined,
        totalAmount,
        paymentType: type,
        amountPaid: resolvedAmountPaid,
        paymentScreenshot: req.file ? `/uploads/${req.file.filename}` : null,
        paymentStatus: type === "later" ? "not_required" : "pending",
        airport: {
          create: {
            pickup,
            airport,
            travelDate: travelDate ? new Date(travelDate) : new Date(),
            pickupTime,
            vehicle: vehicle.name,
            passengers: Number(passengers),
            suitcases: Number(suitcases || 0),
            handbags: Number(handbags || 0),
          },
        },
      },
      include: { customer: true, airport: true, vehicle: true },
    });

    res.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Airport booking failed" });
  }
});

export default router;