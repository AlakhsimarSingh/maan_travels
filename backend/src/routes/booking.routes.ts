import { Router } from "express";

import prisma from "../prisma";
import adminDeviceAuth from "../middleware/adminDeviceAuth";
import { upload } from "../middleware/upload";
import PDFDocument from "pdfkit";

const router = Router();

/* ---------------- GET ALL BOOKINGS (ADMIN) ---------------- */
router.get("/all", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        vehicle: true,
        route: true,
        taxi: true,
        airport: true,
        tour: true,
        selfDrive: { include: { vehicle: true } },
        luxury: { include: { luxuryCar: true } },
        wedding: { include: { luxuryCar: true } },
        tempo: { include: { vehicle: true } },
      },
    });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
});

/* ---------------- UPDATE BOOKING STATUS ---------------- */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        vehicle: true,
        route: true,
        taxi: true,
        airport: true,
        tour: true,
        selfDrive: true,
        luxury: true,
        wedding: true,
        tempo: true,
      },
    });

    res.json({ success: true, booking: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update booking status" });
  }
});

/* ---------------- DELETE BOOKING ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    await prisma.booking.delete({ where: { id } });

    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete booking" });
  }
});

/* ---------------- GET ALL BOOKINGS ---------------- */
router.get("/", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        vehicle: true,
        route: true,
        taxi: true,
        airport: true,
        tour: true,
        selfDrive: { include: { vehicle: true } },
        luxury: { include: { luxuryCar: true } },
        wedding: { include: { luxuryCar: true } },
        tempo: { include: { vehicle: true } },
      },
    });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
});

/* ---------------- GET SINGLE BOOKING ---------------- */
router.get("/:id", async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        vehicle: true,
        route: true,
        taxi: true,
        airport: true,
        tour: true,
        selfDrive: true,
        luxury: true,
        wedding: true,
        tempo: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch booking" });
  }
});

/* ---------------- CREATE TAXI BOOKING ---------------- */
router.post("/", upload.single("paymentScreenshot"), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      pickup,
      drop,
      rideMode,
      vehicleId,
      routeId,
      travelDate,
      requirements,
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

    // Resolve the authoritative price ourselves — never trust a client-sent price
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

    const customer = await prisma.customer.create({
      data: { name, email, phone },
    });

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceType: "TAXI",
        vehicleId,
        routeId: routeId || undefined,
        totalAmount,
        paymentType: type,
        amountPaid: resolvedAmountPaid,
        paymentScreenshot: req.file ? `/uploads/${req.file.filename}` : null,
        paymentStatus: type === "later" ? "not_required" : "pending",
        taxi: {
          create: {
            rideMode,
            pickup,
            drop,
            vehicle: vehicle.name,
            travelDate: travelDate ? new Date(travelDate) : null,
            requirements,
          },
        },
      },
      include: { customer: true, taxi: true, vehicle: true },
    });

    res.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Taxi booking failed" });
  }
});

/* ---------------- DOWNLOAD RECEIPT (PDF) ---------------- */
router.get("/:id/receipt", async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { customer: true, vehicle: true, route: true, taxi: true, airport: true, tour: true },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=receipt-${booking.id}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).fillColor("#ecb100").text("Maan Travels");
    doc.fontSize(12).fillColor("#000").text("Payment receipt");
    doc.moveDown();

    doc.fontSize(10).fillColor("#555").text(`Booking ID: ${booking.id}`);
    doc.text(`Date: ${booking.createdAt.toDateString()}`);
    doc.moveDown();

    doc.fillColor("#000").fontSize(12).text(`Customer: ${booking.customer.name}`);
    doc.text(`Phone: ${booking.customer.phone}`);
    if (booking.customer.email) doc.text(`Email: ${booking.customer.email}`);
    doc.moveDown();

    if (booking.route) doc.text(`Route: ${booking.route.title}`);
    if (booking.vehicle) doc.text(`Vehicle: ${booking.vehicle.name}`);

    if (booking.taxi) {
      doc.text(`Pickup: ${booking.taxi.pickup}`);
      if (booking.taxi.drop) doc.text(`Drop: ${booking.taxi.drop}`);
    }

    if (booking.airport) {
      doc.text(`Pickup: ${booking.airport.pickup}`);
      doc.text(`Airport: ${booking.airport.airport}`);
    }

    if (booking.tour) {
      doc.text(`Pickup city: ${booking.tour.pickupCity}`);
      doc.text(`Destination: ${booking.tour.destination}`);
    }

    doc.moveDown();

    doc.fontSize(14).text(`Total fare: Rs. ${booking.totalAmount ?? 0}`);
    doc.text(`Amount paid: Rs. ${booking.amountPaid ?? 0}`);

    const balance = (booking.totalAmount || 0) - (booking.amountPaid || 0);
    doc.text(`Balance due: Rs. ${balance > 0 ? balance : 0}`);
    doc.moveDown();

    doc.fontSize(10).fillColor("#777").text(`Payment type: ${booking.paymentType}`);
    doc.text(`Payment status: ${booking.paymentStatus}`);

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to generate receipt" });
  }
});

export default router;