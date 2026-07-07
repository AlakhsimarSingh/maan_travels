import { Router } from "express";
import nodemailer from "nodemailer";
import prisma from "../prisma";
import { requireAdminDevice } from "../middleware/requireAdminDevice";

const router = Router();

// ── Gmail SMTP transporter ─────────────────────────────────────
// Set GMAIL_USER=maantravelcabs@gmail.com and GMAIL_APP_PASSWORD
// in your .env. Use a Gmail App Password (not your regular password):
// https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "maantravelcabs@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ── Helpers ────────────────────────────────────────────────────
function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
}

function formatAmount(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return `₹${amount.toLocaleString("en-IN")}`;
}

function airportRouteText(a: any): string {
  const isFromAirport = a.direction === "FROM_AIRPORT";
  return isFromAirport ? `${a.airport} → ${a.pickup}` : `${a.pickup} → ${a.airport}`;
}

function getBookingRoute(booking: any): string {
  if (booking.taxi) return `${booking.taxi.pickup} → ${booking.taxi.drop || "—"}`;
  if (booking.airport) return airportRouteText(booking.airport);
  if (booking.tour) return `${booking.tour.pickupCity} → ${booking.tour.destination}`;
  if (booking.selfDrive) return `Self Drive — ${booking.selfDrive.vehicle?.name || ""}`;
  if (booking.luxury) return `${booking.luxury.pickup} → ${booking.luxury.destination}`;
  if (booking.wedding) return `Wedding — ${booking.wedding.venue}`;
  if (booking.tempo) return `${booking.tempo.pickup} → ${booking.tempo.destination}`;
  return booking.serviceType || "Booking";
}

// ── Airport-specific detail helpers (keeps notify consistent with admin modal) ──
function airportDetailsRows(booking: any): string {
  if (!booking.airport) return "";
  const a = booking.airport;
  const isFromAirport = a.direction === "FROM_AIRPORT";
  const rows = [
    `<div class="info-row"><span class="info-label">Direction</span><span class="info-value">${isFromAirport ? "Airport → City" : "City → Airport"}</span></div>`,
    `<div class="info-row"><span class="info-label">${isFromAirport ? "Drop" : "Pickup"}</span><span class="info-value">${a.pickup}</span></div>`,
    `<div class="info-row"><span class="info-label">Airport</span><span class="info-value">${a.airport}</span></div>`,
  ];
  if (a.terminal) {
    rows.push(`<div class="info-row"><span class="info-label">Terminal</span><span class="info-value">${a.terminal}</span></div>`);
  }
  if (a.travelDate) {
    rows.push(`<div class="info-row"><span class="info-label">Travel Date</span><span class="info-value">${new Date(a.travelDate).toLocaleDateString("en-IN")}</span></div>`);
  }
  if (a.pickupTime) {
    rows.push(`<div class="info-row"><span class="info-label">Time</span><span class="info-value">${a.pickupTime}</span></div>`);
  }
  return rows.join("");
}

function airportDetailsWA(booking: any): string {
  if (!booking.airport) return "";
  const a = booking.airport;
  const isFromAirport = a.direction === "FROM_AIRPORT";
  let lines = `Direction: ${isFromAirport ? "Airport → City" : "City → Airport"}\n${isFromAirport ? "Drop" : "Pickup"}: ${a.pickup}\nAirport: ${a.airport}`;
  if (a.terminal) lines += `\nTerminal: ${a.terminal}`;
  if (a.travelDate) lines += `\nTravel Date: ${new Date(a.travelDate).toLocaleDateString("en-IN")}`;
  if (a.pickupTime) lines += `\nTime: ${a.pickupTime}`;
  return lines;
}

function taxiDetailsRows(booking: any): string {
  if (!booking.taxi) return "";
  const t = booking.taxi;
  const rows = [];
  if (t.pickupTime) {
    rows.push(`<div class="info-row"><span class="info-label">Pickup Time</span><span class="info-value">${t.pickupTime}</span></div>`);
  }
  if (t.returnTime) {
    rows.push(`<div class="info-row"><span class="info-label">Return Time</span><span class="info-value">${t.returnTime}</span></div>`);
  }
  return rows.join("");
}

function taxiDetailsWA(booking: any): string {
  if (!booking.taxi) return "";
  const t = booking.taxi;
  let lines = "";
  if (t.pickupTime) lines += `\nPickup Time: ${t.pickupTime}`;
  if (t.returnTime) lines += `\nReturn Time: ${t.returnTime}`;
  return lines;
}

// ── Phone normalization ─────────────────────────────────────────
// Handles:
//   9501038811        -> 919501038811   (plain 10-digit local number)
//   09501038811        -> 919501038811   (leading trunk 0)
//   919501038811        -> 919501038811   (already has country code, no +)
//   +919501038811       -> 919501038811   (already has +)
function normalizePhone(phone: string): string {
  let digits = phone.replace(/[^0-9+]/g, "");

  // Already has a + prefix — trust it, just strip the +
  if (digits.startsWith("+")) {
    return digits.slice(1);
  }

  // Strip leading zero(s) — trunk prefix like 09501038811
  digits = digits.replace(/^0+/, "");

  // Already has country code without + (e.g. 919501038811 — 12 digits starting with 91)
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits;
  }

  // Plain 10-digit local number — assume India
  return `91${digits}`;
}

function buildWhatsAppLink(phone: string, message: string): string {
  const normalized = normalizePhone(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

// ── Email templates ────────────────────────────────────────────
function emailBase(title: string, bodyHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 560px; margin: 32px auto; background: #141414; border-radius: 16px; overflow: hidden; border: 1px solid #252525; }
    .header { background: #111; padding: 28px 32px; border-bottom: 1px solid #252525; }
    .brand { font-size: 20px; font-weight: 700; color: #ecb100; }
    .tagline { font-size: 12px; color: #555; margin-top: 2px; }
    .body { padding: 28px 32px; }
    h2 { font-size: 18px; font-weight: 600; color: #fff; margin: 0 0 16px; }
    p { font-size: 14px; color: #8a8a8a; line-height: 1.6; margin: 0 0 12px; }
    .highlight { color: #fff; }
    .chip { display: inline-block; background: #ecb100; color: #000; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 100px; margin-bottom: 20px; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #1c1c1c; font-size: 14px; }
    .info-label { color: #555; }
    .info-value { color: #fff; font-weight: 500; text-align: right; }
    .cta { display: block; margin: 24px 0 0; background: #ecb100; color: #000; font-size: 14px; font-weight: 700; text-align: center; padding: 14px 24px; border-radius: 12px; text-decoration: none; }
    .footer { padding: 20px 32px; border-top: 1px solid #1c1c1c; font-size: 11px; color: #333; text-align: center; }
    .qr-note { background: #111; border: 1px solid #252525; border-radius: 12px; padding: 16px; margin-top: 16px; }
    .qr-note p { font-size: 13px; color: #8a8a8a; margin: 0 0 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="brand">Maan Tour & Travels</div>
      <div class="tagline">Jalandhar, Punjab · India</div>
    </div>
    <div class="body">
      <h2>${title}</h2>
      ${bodyHtml}
    </div>
    <div class="footer">
      Maan Tour & Travels · BMC Chowk, Jawahar Nagar, Jalandhar 144001<br />
      maantravelcabs@gmail.com · <a href="https://www.maantravels.com" style="color:#ecb100;text-decoration:none;">maantravels.com</a>
    </div>
  </div>
</body>
</html>`;
}

function confirmedEmail(booking: any, balance: number): string {
  return emailBase("Your booking is confirmed ✓", `
    <div class="chip">Confirmed</div>
    <p>Hello <span class="highlight">${booking.customer.name}</span>,</p>
    <p>Your booking with Maan Travels has been <strong style="color:#ecb100">confirmed</strong>. We look forward to serving you.</p>
    <div>
      <div class="info-row"><span class="info-label">Service</span><span class="info-value">${booking.serviceType}</span></div>
      <div class="info-row"><span class="info-label">Route</span><span class="info-value">${getBookingRoute(booking)}</span></div>
      ${airportDetailsRows(booking)}
      ${taxiDetailsRows(booking)}
      <div class="info-row"><span class="info-label">Total Fare</span><span class="info-value">${formatAmount(booking.totalAmount)}</span></div>
      <div class="info-row"><span class="info-label">Amount Paid</span><span class="info-value">${formatAmount(booking.amountPaid)}</span></div>
      ${balance > 0 ? `<div class="info-row"><span class="info-label">Balance Due</span><span class="info-value" style="color:#ecb100">${formatAmount(balance)}</span></div>` : ""}
    </div>
    <p style="margin-top:16px;">For any queries, contact us at <a href="tel:+919876543210" style="color:#ecb100;">+91 98765 43210</a> or reply to this email.</p>
    <a class="cta" href="https://www.maantravels.com">Visit maantravels.com</a>
  `);
}

function cancelledEmail(booking: any): string {
  return emailBase("Booking Cancelled", `
    <div class="chip" style="background:#ef4444;color:#fff;">Cancelled</div>
    <p>Hello <span class="highlight">${booking.customer.name}</span>,</p>
    <p>Unfortunately your booking has been <strong style="color:#ef4444">cancelled</strong>.</p>
    <div>
      <div class="info-row"><span class="info-label">Service</span><span class="info-value">${booking.serviceType}</span></div>
      <div class="info-row"><span class="info-label">Route</span><span class="info-value">${getBookingRoute(booking)}</span></div>
    </div>
    <p style="margin-top:16px;">If you believe this is a mistake or need to rebook, please contact us at <a href="tel:+919876543210" style="color:#ecb100;">+91 98765 43210</a>.</p>
    <a class="cta" href="https://www.maantravels.com">Book again</a>
  `);
}

function paymentRejectedEmail(booking: any, qrCodeUrl: string, upiId: string): string {
  return emailBase("Action required: Payment not verified", `
    <div class="chip" style="background:#f59e0b;color:#000;">Payment Unverified</div>
    <p>Hello <span class="highlight">${booking.customer.name}</span>,</p>
    <p>We were unable to verify your payment for the following booking. Please complete the payment and share a screenshot on WhatsApp.</p>
    <div>
      <div class="info-row"><span class="info-label">Service</span><span class="info-value">${booking.serviceType}</span></div>
      <div class="info-row"><span class="info-label">Total Fare</span><span class="info-value">${formatAmount(booking.totalAmount)}</span></div>
    </div>
    <div class="qr-note">
      <p>Pay via UPI: <strong style="color:#ecb100">${upiId}</strong></p>
      ${qrCodeUrl ? `<img src="${qrCodeUrl}" alt="Payment QR Code" style="max-width:180px;display:block;margin:8px auto;border-radius:8px;" />` : ""}
      <p style="margin-top:8px;font-size:12px;">After payment, WhatsApp the screenshot to us.</p>
    </div>
    <a class="cta" href="https://wa.me/919876543210">Send screenshot on WhatsApp</a>
  `);
}

function completedEmail(booking: any): string {
  return emailBase("Trip completed — share your feedback!", `
    <div class="chip" style="background:#22c55e;color:#fff;">Completed</div>
    <p>Hello <span class="highlight">${booking.customer.name}</span>,</p>
    <p>Thank you for choosing Maan Travels! We hope you had a comfortable journey.</p>
    <p>It would mean a lot to us if you could take a moment to share your experience.</p>
    <a class="cta" href="https://www.maantravels.com/feedback">Leave Feedback →</a>
    <p style="margin-top:16px;font-size:12px;color:#333;">Your feedback helps us improve and helps other travellers choose with confidence.</p>
  `);
}

// ── WhatsApp message templates ──────────────────────────────────
function confirmedWA(booking: any, balance: number): string {
  const route = getBookingRoute(booking);
  const balanceText = balance > 0 ? `\nBalance due: ${formatAmount(balance)}` : "";
  const airportExtra = booking.airport ? `\n${airportDetailsWA(booking)}` : "";
  const taxiExtra = booking.taxi ? taxiDetailsWA(booking) : "";
  return `✅ *Booking Confirmed — Maan Travels*

Hello ${booking.customer.name},

Your booking has been *confirmed*. 🎉

📋 *Details*
Service: ${booking.serviceType}
Route: ${route}${airportExtra}
Total Fare: ${formatAmount(booking.totalAmount)}
Amount Paid: ${formatAmount(booking.amountPaid)}${balanceText}

For any queries, call us: +91 80544 04591
🌐 https://www.maantravels.com`;
}

function cancelledWA(booking: any): string {
  return `❌ *Booking Cancelled — Maan Travels*

Hello ${booking.customer.name},

Your booking for *${booking.serviceType}* has been cancelled.

If this is a mistake or you'd like to rebook, please call us:
📞 +91 80544 04591
🌐 https://www.maantravels.com`;
}

function paymentRejectedWA(booking: any, qrCodeUrl: string, upiId: string): string {
  return `⚠️ *Payment Not Verified — Maan Travels*

Hello ${booking.customer.name},

We could not verify your payment for your *${booking.serviceType}* booking (${formatAmount(booking.totalAmount)}).

Please complete the payment:
💳 *UPI ID:* ${upiId}
${qrCodeUrl ? `🔗 *QR Code:* ${qrCodeUrl}` : ""}

After paying, please send the screenshot in this chat.
📞 +91 80544 04591`;
}

function completedWA(booking: any): string {
  return `🙏 *Thank you — Maan Travels*

Hello ${booking.customer.name},

Your trip has been completed. We hope you had a great experience!

We'd love to hear your feedback:
⭐ https://www.maantravels.com/feedback

Thank you for choosing Maan Travels! 🚗`;
}

function driverDetailsEmail(booking: any, driverName: string, driverPhone: string, carNumber: string): string {
  return emailBase("Your driver details", `
    <div class="chip" style="background:#3b82f6;color:#fff;">Driver Assigned</div>
    <p>Hello <span class="highlight">${booking.customer.name}</span>,</p>
    <p>Your driver has been assigned for your upcoming trip. Please find the details below.</p>
    <div>
      <div class="info-row"><span class="info-label">Driver Name</span><span class="info-value">${driverName}</span></div>
      <div class="info-row"><span class="info-label">Driver Phone</span><span class="info-value">${driverPhone}</span></div>
      <div class="info-row"><span class="info-label">Car Number</span><span class="info-value">${carNumber}</span></div>
      <div class="info-row"><span class="info-label">Route</span><span class="info-value">${getBookingRoute(booking)}</span></div>
    </div>
    <p style="margin-top:16px;">Please save this number and reach out directly to your driver for any pickup coordination.</p>
    <a class="cta" href="tel:${driverPhone.replace(/[^0-9+]/g, "")}">Call Driver</a>
  `);
}

function driverDetailsWA(booking: any, driverName: string, driverPhone: string, carNumber: string): string {
  return `🚖 *Driver Assigned — Maan Travels*

Hello ${booking.customer.name},

Your driver has been assigned for your trip.

👤 *Driver:* ${driverName}
📞 *Phone:* ${driverPhone}
🚘 *Car Number:* ${carNumber}
📍 *Route:* ${getBookingRoute(booking)}

Please contact your driver directly for pickup coordination.

For any other queries, call us: +91 80544 04591`;
}

// ── Route: POST /api/notify/:id ────────────────────────────────
// type: "confirmed" | "cancelled" | "payment_rejected" | "completed"
router.post("/:id", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);
    const { type } = req.body as { type: string };

    const booking = await prisma.booking.findUnique({
      where: { id },
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

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const { name, email, phone } = booking.customer;
    const balance = (booking.totalAmount || 0) - (booking.amountPaid || 0);

    // Fetch payment settings if needed
    let qrCodeUrl = "";
    let upiId = "";
    if (type === "payment_rejected") {
      const settings = await prisma.paymentSettings.findUnique({ where: { id: "default" } });
      qrCodeUrl = settings?.qrCodeImage || "";
      upiId = settings?.upiId || "";
    }

    // Build content
    let subject = "";
    let html = "";
    let waMessage = "";

    switch (type) {
      case "confirmed":
        subject = "Your Maan Travels booking is confirmed ✓";
        html = confirmedEmail(booking, balance > 0 ? balance : 0);
        waMessage = confirmedWA(booking, balance > 0 ? balance : 0);
        break;
      case "cancelled":
        subject = "Your Maan Travels booking has been cancelled";
        html = cancelledEmail(booking);
        waMessage = cancelledWA(booking);
        break;
      case "payment_rejected":
        subject = "Action required: Payment not verified — Maan Travels";
        html = paymentRejectedEmail(booking, qrCodeUrl, upiId);
        waMessage = paymentRejectedWA(booking, qrCodeUrl, upiId);
        break;
      case "completed":
        subject = "Thank you for travelling with Maan Travels — share your feedback!";
        html = completedEmail(booking);
        waMessage = completedWA(booking);
        break;

      case "driver_details": {
        const { driverName, driverPhone, carNumber } = req.body as {
          driverName?: string; driverPhone?: string; carNumber?: string;
        };
        if (!driverName?.trim() || !driverPhone?.trim() || !carNumber?.trim()) {
          return res.status(400).json({
            success: false,
            message: "driverName, driverPhone and carNumber are required",
          });
        }
        subject = "Your driver details — Maan Travels";
        html = driverDetailsEmail(booking, driverName.trim(), driverPhone.trim(), carNumber.trim());
        waMessage = driverDetailsWA(booking, driverName.trim(), driverPhone.trim(), carNumber.trim());
        break;
      }
      default:
        return res.status(400).json({ success: false, message: "Invalid notification type" });
      
    }

    // Send email if address exists
    let emailSent = false;
    let emailError = "";
    if (email) {
      try {
        await transporter.sendMail({
          from: `"Maan Tour & Travels" <${process.env.GMAIL_USER || "maantravelcabs@gmail.com"}>`,
          to: email,
          subject,
          html,
        });
        emailSent = true;
      } catch (err: any) {
        emailError = err.message || "Email failed";
        console.error("Email send error:", err);
      }
    }

    // Build WhatsApp link (always, even if no phone — let frontend decide)
    const waLink = phone ? buildWhatsAppLink(phone, waMessage) : null;

    res.json({
      success: true,
      emailSent,
      emailError: emailError || null,
      waLink,
      hasEmail: !!email,
      hasPhone: !!phone,
    });
  } catch (error) {
    console.error("Notify error:", error);
    res.status(500).json({ success: false, message: "Notification failed" });
  }
});

export default router;