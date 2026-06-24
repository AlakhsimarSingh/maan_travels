import { API_URL } from "./bookingService";

/* ---------------- GET ALL BOOKINGS ----------------
   Hits a route behind requireAdminDevice (cookie-based). Without
   credentials: "include" the browser won't attach the admin_device_token
   cookie on this cross-origin request, so this silently came back as
   { success: false, code: "NO_DEVICE_TOKEN" } — which the page then
   renders as an empty bookings list instead of an error. */
export const getAllBookings = async () => {
  const res = await fetch(`${API_URL}/api/bookings/all`, {
    credentials: "include",
  });
  return res.json();
};

/* ---------------- UPDATE STATUS ---------------- */
export const updateBookingStatus = async (
  id: string,
  status: string
) => {
  const res = await fetch(
    `${API_URL}/api/bookings/${id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    }
  );

  return res.json();
};

/* ---------------- DELETE BOOKING ---------------- */
export const deleteBooking = async (id: string) => {
  const res = await fetch(`${API_URL}/api/bookings/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return res.json();
};

export const updatePaymentStatus = async (id: string, paymentStatus: string) => {
  // Mirror updateBookingStatus exactly — same transport, same auth handling —
  // just hitting /payment-status instead of /status.
  const res = await fetch(`${API_URL}/api/bookings/${id}/payment-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentStatus }),
  });

  return res.json();
};