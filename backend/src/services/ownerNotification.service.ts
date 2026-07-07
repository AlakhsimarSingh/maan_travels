// backend/src/services/ownerNotification.service.ts
//
// Sends an email to the owner at maantravelcabs@gmail.com whenever a new
// booking arrives. Uses Resend's HTTP API — no SMTP, no port issues on Render.
//
// Required .env:
//   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
//
// No domain verification needed — uses Resend's default onboarding@resend.dev
// sender which works immediately on the free tier.

const OWNER_EMAIL = "maantravelcabs@gmail.com";
const FROM = "Maan Travels Bookings <onboarding@resend.dev>";

function fmt(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function fmtDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function row(label: string, value: any): string {
  if (!value && value !== 0) return "";
  return `
    <tr>
      <td style="padding:8px 12px;color:#8a8a8a;font-size:13px;white-space:nowrap;border-bottom:1px solid #1c1c1c;">${label}</td>
      <td style="padding:8px 12px;color:#ffffff;font-size:13px;border-bottom:1px solid #1c1c1c;">${value}</td>
    </tr>`;
}

function section(title: string, rows: string): string {
  if (!rows.trim()) return "";
  return `
    <div style="margin-bottom:20px;">
      <div style="font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#ecb100;padding:0 0 8px 0;">${title}</div>
      <table style="width:100%;border-collapse:collapse;background:#111;border-radius:12px;overflow:hidden;border:1px solid #1c1c1c;">
        ${rows}
      </table>
    </div>`;
}

function buildHtml(booking: any): string {
  const b = booking;
  const customer = b.customer || {};
  const balance = (b.totalAmount || 0) - (b.amountPaid || 0);

  // Service-specific details
  let serviceRows = "";
  if (b.taxi) {
    serviceRows = [
      row("Mode", b.taxi.rideMode),
      row("Pickup", b.taxi.pickup),
      row("Drop", b.taxi.drop),
      row("Vehicle", b.taxi.vehicle),
      row("Travel Date", fmtDate(b.taxi.travelDate)),
      row("Pickup Time", b.taxi.pickupTime),
      row("Return Time", b.taxi.returnTime),
      row("Requirements", b.taxi.requirements),
    ].join("");
  } else if (b.airport) {
    const isFromAirport = b.airport.direction === "FROM_AIRPORT";
    serviceRows = [
      row("Direction", isFromAirport ? "Airport → City (Drop)" : "City → Airport (Pickup)"),
      row("City", b.airport.city?.name),
      row(isFromAirport ? "Drop" : "Pickup", b.airport.pickup),
      row("Airport", b.airport.airport),
      row("Terminal", b.airport.terminal),
      row("Travel Date", fmtDate(b.airport.travelDate)),
      row("Pickup Time", b.airport.pickupTime),
      row("Vehicle", b.airport.vehicle),
      row("Passengers", b.airport.passengers),
      row("Suitcases", b.airport.suitcases),
      row("Handbags", b.airport.handbags),
    ].join("");
  } else if (b.tour) {
    serviceRows = [
      row("Pickup City", b.tour.pickupCity),
      row("Destination", b.tour.destination),
      row("Route", b.tour.route),
      row("Pickup Address", b.tour.pickupAddress),
      row("Travel Date", fmtDate(b.tour.travelDate)),
      row("Requirements", b.tour.requirements),
    ].join("");
  } else if (b.selfDrive) {
    serviceRows = [
      row("Vehicle", b.selfDrive.vehicle?.name),
      row("Pickup Date", fmtDate(b.selfDrive.pickupDate)),
      row("Return Date", fmtDate(b.selfDrive.returnDate)),
      row("License", b.selfDrive.license),
      row("Requirements", b.selfDrive.requirements),
    ].join("");
  } else if (b.luxury) {
    serviceRows = [
      row("Car", b.luxury.luxuryCar?.name),
      row("Pickup", b.luxury.pickup),
      row("Destination", b.luxury.destination),
      row("Event Date", fmtDate(b.luxury.eventDate)),
      row("Hours", b.luxury.hours),
      row("Event Type", b.luxury.eventType),
      row("Requirements", b.luxury.requirements),
    ].join("");
  } else if (b.wedding) {
    serviceRows = [
      row("Car", b.wedding.luxuryCar?.name),
      row("Pickup", b.wedding.pickup),
      row("Venue", b.wedding.venue),
      row("Wedding Date", fmtDate(b.wedding.weddingDate)),
      row("Guests", b.wedding.guests),
      row("Cars Required", b.wedding.carsRequired),
      row("Decoration", b.wedding.decoration),
      row("Requirements", b.wedding.requirements),
    ].join("");
  } else if (b.tempo) {
    serviceRows = [
      row("Vehicle", b.tempo.vehicle?.name),
      row("Pickup", b.tempo.pickup),
      row("Destination", b.tempo.destination),
      row("Travel Date", fmtDate(b.tempo.travelDate)),
      row("Passengers", b.tempo.passengers),
      row("Suitcases", b.tempo.suitcaseCount),
      row("Trip Type", b.tempo.tripType),
      row("Requirements", b.tempo.requirements),
    ].join("");
  }

  const customerSection = section("Customer", [
    row("Name", customer.name),
    row("Phone", customer.phone),
    row("Email", customer.email),
  ].join(""));

  const paymentSection = section("Payment", [
    row("Total", fmt(b.totalAmount)),
    row("Paid", fmt(b.amountPaid)),
    row("Balance", balance > 0 ? fmt(balance) : "Fully paid"),
    row("Payment Type", b.paymentType),
    row("Payment Status", b.paymentStatus),
  ].join(""));

  const serviceSection = section(`${b.serviceType} Details`, serviceRows);

  const adminUrl = "https://www.maantravels.com/admin/bookings";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#141414;border-radius:16px;overflow:hidden;border:1px solid #252525;">

    <!-- Header -->
    <div style="background:#111;padding:24px 28px;border-bottom:1px solid #252525;">
      <div style="font-size:18px;font-weight:700;color:#ecb100;">Maan Tour & Travels</div>
      <div style="font-size:11px;color:#555;margin-top:2px;">New Booking Alert</div>
    </div>

    <!-- Alert banner -->
    <div style="background:#ecb100;padding:16px 28px;display:flex;align-items:center;gap:12px;">
      <div>
        <div style="font-size:15px;font-weight:700;color:#000;">New ${b.serviceType} Booking</div>
        <div style="font-size:12px;color:#000;opacity:0.7;margin-top:2px;">
          ${fmtDate(b.createdAt)} · ID: ${b.id?.slice(-8).toUpperCase()}
        </div>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:24px 28px;">
      ${customerSection}
      ${serviceSection}
      ${paymentSection}

      <!-- CTA -->
      <a href="${adminUrl}" style="display:block;margin-top:8px;background:#ecb100;color:#000;text-align:center;padding:14px;border-radius:12px;font-weight:700;font-size:14px;text-decoration:none;">
        View in Admin Panel →
      </a>
    </div>

    <div style="padding:16px 28px;border-top:1px solid #1c1c1c;font-size:11px;color:#333;text-align:center;">
      Maan Tour & Travels · Jalandhar, Punjab · India
    </div>
  </div>
</body>
</html>`;
}

export async function notifyOwnerNewBookingEmail(booking: any): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[resend] RESEND_API_KEY not set — skipping owner email notification");
    return;
  }

  const serviceType = booking?.serviceType || "Booking";
  const customerName = booking?.customer?.name || "Unknown";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: FROM,
        to: [OWNER_EMAIL],
        subject: `🚗 New ${serviceType} Booking — ${customerName}`,
        html: buildHtml(booking),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[resend] Owner notification failed:", data);
    } else {
      console.log("[resend] Owner notification sent:", data.id);
    }
  } catch (err) {
    console.error("[resend] Owner notification error:", err);
  }
}