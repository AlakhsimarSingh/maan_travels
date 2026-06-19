import { Router } from "express";

import prisma from "../prisma";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/", upload.single("paymentScreenshot"), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      pickupCity,
      destination,
      route,
      pickupAddress,
      requirements,
      vehicleId,
      routeId,
      paymentType,
      amountPaid,
    } = req.body;

    let totalAmount = 0;
    let vehicle = null;

    if (vehicleId) {
      vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });

      if (routeId) {
        const pricing = await prisma.routePricing.findUnique({
          where: { routeId_vehicleId: { routeId, vehicleId } },
        });
        if (pricing) totalAmount = pricing.price;
      }

      if (!totalAmount && vehicle) {
        totalAmount = vehicle.price || vehicle.rentalPerDay || 0;
      }
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

    const customer = await prisma.customer.create({ data: { name, email, phone } });

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceType: "TOUR",
        vehicleId: vehicleId || undefined,
        routeId: routeId || undefined,
        totalAmount,
        paymentType: type,
        amountPaid: resolvedAmountPaid,
        paymentScreenshot: req.file ? `/uploads/${req.file.filename}` : null,
        paymentStatus: type === "later" ? "not_required" : "pending",
        tour: {
          create: { pickupCity, destination, route, pickupAddress, requirements },
        },
      },
      include: { customer: true, tour: true, vehicle: true },
    });

    res.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Tour booking failed" });
  }
});

export default router;