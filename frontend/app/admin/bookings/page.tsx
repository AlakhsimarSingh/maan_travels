"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Trash2 } from "lucide-react";

import BookingDetailsModal from "@/components/admin/bookings/BookingDetailsModal";
import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "@/src/services/bookingAdminService";

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];

const statusStyle: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings();
      setBookings(res?.success ? res.bookings : []);
    } catch (err) {
      console.error("Booking fetch error:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateBookingStatus(id, status);
      fetchBookings();
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this booking permanently?")) return;
    try {
      await deleteBooking(id);
      fetchBookings();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-white md:text-3xl">Bookings</h2>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          {bookings.length > 0 ? `${bookings.length} total` : "Manage customer bookings"}
        </p>
      </div>

      {/* ── MOBILE: card list ── */}
      <div className="md:hidden space-y-3">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-[#141414] border border-[#1c1c1c] animate-pulse"
            />
          ))}

        {!loading && bookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#252525] py-16 text-center text-sm text-[#555]">
            No bookings yet
          </div>
        )}

        {!loading &&
          bookings.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-[#1c1c1c] bg-[#141414] overflow-hidden"
            >
              {/* Top row: name + status badge */}
              <div
                className="flex items-center justify-between px-4 pt-4 pb-2"
                onClick={() => setSelectedBooking(b)}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{b.customer?.name}</p>
                  <p className="text-xs text-[#8a8a8a]">{b.customer?.phone}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] capitalize ${
                      statusStyle[b.status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    }`}
                  >
                    {b.status}
                  </span>
                  <ChevronRight size={16} className="text-[#444]" />
                </div>
              </div>

              {/* Mid row: service + date */}
              <div
                className="flex items-center justify-between px-4 pb-3"
                onClick={() => setSelectedBooking(b)}
              >
                <span className="text-xs text-[#ecb100] capitalize">{b.serviceType}</span>
                <span className="text-xs text-[#555]">
                  {new Date(b.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                  })}
                </span>
              </div>

              {/* Bottom row: status changer + delete */}
              <div className="flex items-center gap-2 border-t border-[#1c1c1c] px-4 py-2.5">
                <select
                  value={b.status}
                  onChange={(e) => handleStatusChange(b.id, e.target.value)}
                  className="flex-1 rounded-lg border border-[#252525] bg-[#0f0f0f] px-2 py-1.5 text-xs text-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/20 text-red-400 active:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* ── DESKTOP: table (unchanged) ── */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-[#252525] bg-[#141414]">
        <table className="w-full text-sm text-white">
          <thead className="bg-[#0f0f0f] text-xs uppercase tracking-wider text-[#8a8a8a]">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="text-left">Service</th>
              <th>Status</th>
              <th>Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-[#1b1b1b]">
                  <td colSpan={5} className="p-4">
                    <div className="h-4 w-full rounded bg-[#1a1a1a] animate-pulse" />
                  </td>
                </tr>
              ))}

            {!loading && bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#8a8a8a]">
                  No bookings found
                </td>
              </tr>
            )}

            {!loading &&
              bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-[#1b1b1b] hover:bg-[#1b1b1b] transition"
                >
                  <td className="p-4">
                    <div className="font-medium">{b.customer?.name}</div>
                    <div className="text-xs text-[#8a8a8a]">{b.customer?.phone}</div>
                  </td>
                  <td className="text-[#c7c7c7]">{b.serviceType}</td>
                  <td>
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs capitalize ${
                          statusStyle[b.status] || "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {b.status}
                      </span>
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className="rounded border border-[#252525] bg-black p-1 text-xs text-white"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="text-[#8a8a8a]">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="space-x-3 p-4 text-right">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="text-[#ecb100] hover:underline"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* DETAILS MODAL */}
      <BookingDetailsModal
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onBookingUpdate={fetchBookings}
      />
    </div>
  );
}