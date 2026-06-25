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
      travelDate,
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

      // NOTE: no fallback to vehicle.price / vehicle.rentalPerDay here.
      // Those fields are taxi/rental pricing and are not valid for tours.
      // If there's no RoutePricing row for this route+vehicle, totalAmount
      // stays 0 — price is unconfirmed and the team follows up manually.
    }

    const type = paymentType === "full" || paymentType === "partial" ? paymentType : "later";

    // No quoted price to pay against — block full/partial payment even
    // if the client somehow sends one (defends against a tampered or
    // direct API request, since the UI already prevents this case).
    if (totalAmount === 0 && type !== "later") {
      return res.status(400).json({
        success: false,
        message: "Price is not yet confirmed for this route — payment is not available until our team confirms pricing",
      });
    }

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
          create: { pickupCity, destination, route, pickupAddress, travelDate: travelDate ? new Date(travelDate) : null, requirements },
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