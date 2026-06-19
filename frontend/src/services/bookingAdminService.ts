import { API_URL } from "./bookingService";

/* ---------------- GET ALL BOOKINGS ---------------- */
export const getAllBookings = async () => {
  const res = await fetch(`${API_URL}/api/bookings/all`);
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
      body: JSON.stringify({ status }),
    }
  );

  return res.json();
};

/* ---------------- DELETE BOOKING ---------------- */
export const deleteBooking = async (id: string) => {
  const res = await fetch(`${API_URL}/api/bookings/${id}`, {
    method: "DELETE",
  });

  return res.json();
};