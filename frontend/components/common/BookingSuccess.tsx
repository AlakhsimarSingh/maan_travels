"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/src/services/bookingService";

type Props = {
  open: boolean;
  onClose: () => void;
  bookingId?: string;
  message?: string;
  title?: string;
  showId?: boolean;
  totalAmount?: number;
  amountPaid?: number;
};

export default function BookingSuccess({
  open,
  onClose,
  bookingId,
  message,
  title = "Booking Confirmed",
  showId = true,
  totalAmount,
  amountPaid,
}: Props) {
  if (!open) return null;

  const hasPaymentInfo =
    amountPaid !== undefined && totalAmount !== undefined && totalAmount > 0;

  const priceUnconfirmed = totalAmount === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-2xl border border-[#252525] bg-[#141414] p-6 text-center">

        <CheckCircle className="mx-auto text-green-400" size={48} />

        <h2 className="mt-4 text-2xl font-bold text-white">{title}</h2>

        <p className="mt-2 text-[#8a8a8a]">
          {message || "We have received your request. Our team will contact you shortly."}
        </p>

        {priceUnconfirmed && (
          <p className="mt-2 text-sm text-[#ecb100]">
            Our team will contact you shortly to confirm the price for this booking.
          </p>
        )}

        {showId && bookingId && (
          <p className="mt-3 text-sm text-[#ecb100]">ID: {bookingId}</p>
        )}

        {hasPaymentInfo && (
          <div className="mt-4 rounded-xl border border-[#252525] bg-[#111] p-4 text-sm text-white">
            <p>
              Amount paid:{" "}
              <span style={{ fontFamily: "var(--font-geist-mono)" }} className="text-[#ecb100]">
                ₹{amountPaid}
              </span>{" "}
              of ₹{totalAmount}
            </p>

            {bookingId && (
             <a
                href={`${API_URL}/api/bookings/${bookingId}/receipt`}
                className="inline-block mt-3 px-4 py-2 rounded-lg bg-[#ecb100] text-black text-sm font-medium hover:bg-[#f6c94c]"
              >
                Download receipt
              </a>
            )}
          </div>
        )}

        <Button className="mt-6 w-full bg-[#ecb100] text-black" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}