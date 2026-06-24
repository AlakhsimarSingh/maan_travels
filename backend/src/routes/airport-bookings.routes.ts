import { Router } from "express";
import prisma from "../prisma";
import {
  paymentUpload,
  uploadPaymentScreenshot,
} from "../middleware/uploadPayment";

const router = Router();

/* ---------------- CREATE AIRPORT TRANSFER BOOKING (PUBLIC) ---------------- */
router.post("/", paymentUpload.single("paymentScreenshot"), async (req, res) => {
  try {
    const {
      name,
      phone,
      pickup,
      airport,
      airportId,
      terminal,
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

    if (!airport) {
      return res.status(400).json({ success: false, message: "airport is required" });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });

    if (!vehicle) {
      return res.status(400).json({ success: false, message: "Invalid vehicle" });
    }

    // Resolve price from AirportPricing if airportId is provided,
    // then fall back to RoutePricing, then vehicle base price.
    let totalAmount = 0;

    if (airportId) {
      const airportPricing = await prisma.airportPricing.findUnique({
        where: { airportId_vehicleId: { airportId, vehicleId } },
      });
      if (airportPricing) totalAmount = airportPricing.price;
    }

    if (!totalAmount && routeId) {
      const routePricing = await prisma.routePricing.findUnique({
        where: { routeId_vehicleId: { routeId, vehicleId } },
      });
      if (routePricing) totalAmount = routePricing.price;
    }

    if (!totalAmount) {
      totalAmount = vehicle.price || vehicle.rentalPerDay || 0;
    }

    const type =
      paymentType === "full" || paymentType === "partial" ? paymentType : "later";

    let resolvedAmountPaid = 0;
    if (type === "full") resolvedAmountPaid = totalAmount;
    if (type === "partial") resolvedAmountPaid = Number(amountPaid) || 0;

    if ((type === "full" || type === "partial") && !req.file) {
      return res.status(400).json({
        success: false,
        message: "A payment screenshot is required for full or partial payment",
      });
    }

    const screenshotPath = req.file
      ? await uploadPaymentScreenshot(req.file)
      : null;

    const customer = await prisma.customer.create({
      data: { name, phone },
    });

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceType: "AIRPORT",
        vehicleId,
        routeId: routeId || undefined,
        totalAmount,
        paymentType: type,
        amountPaid: resolvedAmountPaid,
        paymentScreenshot: screenshotPath,
        paymentStatus: type === "later" ? "not_required" : "pending",
        airport: {
          create: {
            pickup,
            airport,
            terminal: terminal || null,
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
    console.error("AIRPORT BOOKING ERROR:", error);
    res.status(500).json({ success: false, message: "Airport booking failed" });
  }
});

export default router;