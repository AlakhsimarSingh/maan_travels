import { Router } from "express";
import prisma from "../prisma";
import { notifyOwnerNewBooking } from "../services/whatsapp.service";
import { notifyOwnerNewBookingEmail } from "../services/ownerNotification.service";
import { findOrCreateCustomer } from "../lib/customerUpsert";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, phone, luxuryCarId, pickup, venue, weddingDate, guests, carsRequired, decoration, requirements } = req.body;

    if (!name || !phone || !luxuryCarId || !pickup || !venue || !weddingDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const carId = String(luxuryCarId);
    const carExists = await prisma.luxuryCar.findUnique({ where: { id: carId }, include: { vehicle: true } });
    if (!carExists) return res.status(400).json({ success: false, message: "Invalid luxury car selected" });

    const parsedDate = new Date(weddingDate);
    if (isNaN(parsedDate.getTime())) return res.status(400).json({ success: false, message: "Invalid wedding date" });

    const customer = await findOrCreateCustomer({ name, phone });
    const totalAmount = carExists.vehicle?.price || 0;

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceType: "WEDDING",
        totalAmount,
        paymentType: "later",
        paymentStatus: "not_required",
        wedding: { create: { luxuryCarId: carId, pickup, venue, weddingDate: parsedDate, guests: Number(guests) || 0, carsRequired: Number(carsRequired) || 1, decoration: decoration || null, requirements: requirements || null } },
      },
      include: { customer: true, wedding: { include: { luxuryCar: true } } },
    });

    notifyOwnerNewBooking(booking).catch((err) => console.error("[whatsapp] Owner notify failed:", err));
    notifyOwnerNewBookingEmail(booking).catch((err) => console.error("[resend] Owner notify failed:", err));

    res.json({ success: true, bookingId: booking.id, booking });
  } catch (error: any) {
    console.error("WEDDING BOOKING ERROR:", error);
    res.status(500).json({ success: false, message: "Wedding booking failed", detail: process.env.NODE_ENV !== "production" ? error?.message : undefined });
  }
});

export default router;