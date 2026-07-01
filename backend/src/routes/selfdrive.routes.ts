import { Router } from "express";
import prisma from "../prisma";
import { notifyOwnerNewBooking } from "../services/whatsapp.service";
import { notifyOwnerNewBookingEmail } from "../services/ownerNotification.service";
import { findOrCreateCustomer } from "../lib/customerUpsert";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, phone, vehicleId, pickupDate, returnDate, license, requirements } = req.body;

    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!phone) missing.push("phone");
    if (!vehicleId) missing.push("vehicleId");
    if (!pickupDate) missing.push("pickupDate");
    if (!returnDate) missing.push("returnDate");
    if (!license) missing.push("license");
    if (missing.length > 0) return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(", ")}` });

    const parsedPickup = new Date(pickupDate);
    const parsedReturn = new Date(returnDate);
    if (Number.isNaN(parsedPickup.getTime()) || Number.isNaN(parsedReturn.getTime())) return res.status(400).json({ success: false, message: "Invalid pickup or return date" });
    if (parsedReturn < parsedPickup) return res.status(400).json({ success: false, message: "Return date cannot be before pickup date" });

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });
    if (!vehicle.isSelfDrive) return res.status(400).json({ success: false, message: "Selected vehicle is not available for self drive" });
    if (!vehicle.available) return res.status(400).json({ success: false, message: "Selected vehicle is currently unavailable" });

    const customer = await findOrCreateCustomer({ name, phone });

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceType: "SELF_DRIVE",
        status: "pending",
        returnDate: parsedReturn,
        requirements,
        vehicleId,
        selfDrive: { create: { vehicleId, pickupDate: parsedPickup, returnDate: parsedReturn, license, requirements } },
      },
      include: { selfDrive: { include: { vehicle: true } }, customer: true },
    });

    notifyOwnerNewBooking(booking).catch((err) => console.error("[whatsapp] Owner notify failed:", err));
    notifyOwnerNewBookingEmail(booking).catch((err) => console.error("[resend] Owner notify failed:", err));

    return res.json({ success: true, booking });
  } catch (error) {
    console.error("SELF DRIVE BOOKING ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to create self drive booking" });
  }
});

export default router;