// backend/src/services/whatsapp.service.ts
//
// Thin wrapper around the WhatsApp Cloud API for sending the owner a
// notification whenever a new booking comes in. Uses a pre-approved
// message template so it works reliably regardless of 24h session state.
//
// Required .env vars:
//   WHATSAPP_PHONE_NUMBER_ID   — from Meta App Dashboard > WhatsApp > API Setup
//   WHATSAPP_ACCESS_TOKEN      — permanent System User token (see setup notes)
//   OWNER_WHATSAPP_NUMBER      — owner's number in E.164 format, no '+', e.g. 919876543210

const GRAPH_API_VERSION = "v21.0";

function getConfig() {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const ownerNumber = process.env.OWNER_WHATSAPP_NUMBER;

  if (!phoneNumberId || !accessToken || !ownerNumber) {
    console.warn(
      "[whatsapp] Missing WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN / OWNER_WHATSAPP_NUMBER — skipping send"
    );
    return null;
  }

  return { phoneNumberId, accessToken, ownerNumber };
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

function formatAmount(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

/**
 * Notify the owner of a new booking via WhatsApp Cloud API.
 *
 * Uses a message template named "new_booking_alert" — you must create
 * and get this approved in Meta Business Suite > WhatsApp Manager > Message Templates.
 *
 * Suggested template body (Utility category, English):
 *   "New booking received! 🚗
 *
 *   Customer: {{1}}
 *   Phone: {{2}}
 *   Service: {{3}}
 *   Route: {{4}}
 *   Amount: {{5}}
 *
 *   Check the admin panel for full details."
 *
 * If you'd rather not wait for template approval right now, you can swap
 * this to a free-form text send (sendOwnerFreeTextNotification below) —
 * but that ONLY works if the owner has messaged your business number
 * within the last 24 hours, so it's not reliable for unattended alerts.
 */
export async function notifyOwnerNewBooking(booking: any): Promise<{ success: boolean; error?: string }> {
  const config = getConfig();
  if (!config) return { success: false, error: "WhatsApp not configured" };

  const { phoneNumberId, accessToken, ownerNumber } = config;

  const customerName = booking.customer?.name || "Unknown";
  const customerPhone = booking.customer?.phone || "—";
  const serviceType = booking.serviceType || "—";
  const route = getBookingRoute(booking);
  const amount = formatAmount(booking.totalAmount);

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: ownerNumber,
    type: "template",
    template: {
      name: "new_booking_alert",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: customerName },
            { type: "text", text: customerPhone },
            { type: "text", text: serviceType },
            { type: "text", text: route },
            { type: "text", text: amount },
          ],
        },
      ],
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[whatsapp] Send failed:", data);
      return { success: false, error: data?.error?.message || "Unknown error" };
    }

    return { success: true };
  } catch (err: any) {
    console.error("[whatsapp] Request error:", err);
    return { success: false, error: err.message || "Request failed" };
  }
}

/**
 * Free-form text fallback — only works within the 24h customer-service
 * window (i.e. owner must have messaged the business number recently).
 * Not recommended as the primary path, but useful once you have an
 * active conversation thread going for quick testing without template approval.
 */
export async function sendOwnerFreeTextNotification(message: string): Promise<{ success: boolean; error?: string }> {
  const config = getConfig();
  if (!config) return { success: false, error: "WhatsApp not configured" };

  const { phoneNumberId, accessToken, ownerNumber } = config;
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: ownerNumber,
        type: "text",
        text: { body: message },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[whatsapp] Free-text send failed:", data);
      return { success: false, error: data?.error?.message || "Unknown error" };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Request failed" };
  }
}