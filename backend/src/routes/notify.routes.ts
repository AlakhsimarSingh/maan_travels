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

function getBookingRoute(booking: any): string {
  if (booking.taxi) return `${booking.taxi.pickup} → ${booking.taxi.drop || "—"}`;
  if (booking.airport) return `${booking.airport.pickup} → ${booking.airport.airport}`;
  if (booking.tour) return `${booking.tour.pickupCity} → ${booking.tour.destination}`;
  if (booking.selfDrive) return `Self Drive — ${booking.selfDrive.vehicle?.name || ""}`;
  if (booking.luxury) return `${booking.luxury.pickup} → ${booking.luxury.destination}`;
  if (booking.wedding) return `Wedding — ${booking.wedding.venue}`;
  if (booking.tempo) return `${booking.tempo.pickup} → ${booking.tempo.destination}`;
  return booking.serviceType || "Booking";
}

function buildWhatsAppLink(phone: string, message: string): string {
  const clean = phone.replace(/[^0-9+]/g, "");
  // Add country code if missing
  const normalized = clean.startsWith("+") ? clean : `+91${clean}`;
  return `https://wa.me/${normalized.replace("+", "")}?text=${encodeURIComponent(message)}`;
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
  return `✅ *Booking Confirmed — Maan Travels*

Hello ${booking.customer.name},

Your booking has been *confirmed*. 🎉

📋 *Details*
Service: ${booking.serviceType}
Route: ${route}
Total Fare: ${formatAmount(booking.totalAmount)}
Amount Paid: ${formatAmount(booking.amountPaid)}${balanceText}

For any queries, call us: +91 98765 43210
🌐 https://www.maantravels.com`;
}

function cancelledWA(booking: any): string {
  return `❌ *Booking Cancelled — Maan Travels*

Hello ${booking.customer.name},

Your booking for *${booking.serviceType}* has been cancelled.

If this is a mistake or you'd like to rebook, please call us:
📞 +91 98765 43210
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
📞 +91 98765 43210`;
}

function completedWA(booking: any): string {
  return `🙏 *Thank you — Maan Travels*

Hello ${booking.customer.name},

Your trip has been completed. We hope you had a great experience!

We'd love to hear your feedback:
⭐ https://www.maantravels.com/feedback

Thank you for choosing Maan Travels! 🚗`;
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