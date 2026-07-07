import { Router } from "express";
import prisma from "../prisma";
import { paymentUpload, uploadPaymentScreenshot } from "../middleware/uploadPayment";
import { notifyOwnerNewBooking } from "../services/whatsapp.service";
import { notifyOwnerNewBookingEmail } from "../services/ownerNotification.service";
import { findOrCreateCustomer } from "../lib/customerUpsert";

const router = Router();
const VALID_DIRECTIONS = ["TO_AIRPORT", "FROM_AIRPORT"];

router.post("/", paymentUpload.single("paymentScreenshot"), async (req, res) => {
  try {
    const {
      name, phone, pickup, airport, airportId, terminal, travelDate, pickupTime,
      vehicleId, passengers, suitcases, handbags, routeId,
      cityId, direction,
      paymentType, amountPaid,
    } = req.body;

    if (!vehicleId) return res.status(400).json({ success: false, message: "vehicleId is required" });
    if (!airport) return res.status(400).json({ success: false, message: "airport is required" });

    const resolvedDirection = VALID_DIRECTIONS.includes(direction) ? direction : "TO_AIRPORT";

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return res.status(400).json({ success: false, message: "Invalid vehicle" });

    // Validate the city actually supports the requested direction
    if (cityId) {
      const city = await prisma.airportCity.findUnique({ where: { id: cityId } });
      if (!city || !city.active) {
        return res.status(400).json({ success: false, message: "Invalid city" });
      }
      if (resolvedDirection === "TO_AIRPORT" && !city.canPickup) {
        return res.status(400).json({ success: false, message: "This city does not support airport pickup" });
      }
      if (resolvedDirection === "FROM_AIRPORT" && !city.canDrop) {
        return res.status(400).json({ success: false, message: "This city does not support airport drop-off" });
      }
    }

    let totalAmount = 0;

    // Most specific: airport + city + vehicle + direction
    if (airportId && cityId) {
      const cityPricing = await prisma.airportCityPricing.findUnique({
        where: { airportId_cityId_vehicleId_direction: { airportId, cityId, vehicleId, direction: resolvedDirection } },
      });
      if (cityPricing) totalAmount = cityPricing.price;
    }

    // Fallback: legacy flat per-airport pricing (airports not yet migrated to city pricing)
    if (!totalAmount && airportId) {
      const airportPricing = await prisma.airportPricing.findUnique({
        where: { airportId_vehicleId: { airportId, vehicleId } },
      });
      if (airportPricing) totalAmount = airportPricing.price;
    }

    // Legacy fallback: route pricing
    if (!totalAmount && routeId) {
      const routePricing = await prisma.routePricing.findUnique({ where: { routeId_vehicleId: { routeId, vehicleId } } });
      if (routePricing) totalAmount = routePricing.price;
    }

    const type = paymentType === "full" || paymentType === "partial" ? paymentType : "later";
    let resolvedAmountPaid = 0;
    if (type === "full") resolvedAmountPaid = totalAmount;
    if (type === "partial") resolvedAmountPaid = Number(amountPaid) || 0;

    if ((type === "full" || type === "partial") && !req.file) {
      return res.status(400).json({ success: false, message: "A payment screenshot is required for full or partial payment" });
    }

    const screenshotPath = req.file ? await uploadPaymentScreenshot(req.file) : null;
    const customer = await findOrCreateCustomer({ name, phone });

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
            pickup, airport, terminal: terminal || null,
            travelDate: travelDate ? new Date(travelDate) : new Date(),
            pickupTime, vehicle: vehicle.name,
            passengers: Number(passengers),
            suitcases: Number(suitcases || 0),
            handbags: Number(handbags || 0),
            cityId: cityId || null,
            direction: resolvedDirection,
          },
        },
      },
      include: { customer: true, airport: true, vehicle: true },
    });

    notifyOwnerNewBooking(booking).catch((err) => console.error("[whatsapp] Owner notify failed:", err));
    notifyOwnerNewBookingEmail(booking).catch((err) => console.error("[resend] Owner notify failed:", err));

    res.json({ success: true, booking });
  } catch (error) {
    console.error("AIRPORT BOOKING ERROR:", error);
    res.status(500).json({ success: false, message: "Airport booking failed" });
  }
});

export default router;