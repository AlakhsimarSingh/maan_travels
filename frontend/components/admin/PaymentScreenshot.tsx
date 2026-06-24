// Drop this component into your admin booking detail view wherever you
// currently render the payment screenshot directly.
//
// Instead of: <img src={booking.paymentScreenshot} />
// Use this:

"use client";

import { useState } from "react";
import { API_URL } from "@/src/services/bookingService";

export function PaymentScreenshot({ bookingId }: { bookingId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadScreenshot = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/bookings/${bookingId}/screenshot`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setUrl(data.url);
      } else {
        setError(data.message || "Couldn't load screenshot");
      }
    } catch {
      setError("Couldn't reach the server");
    } finally {
      setLoading(false);
    }
  };

  if (url) {
    return (
      <div className="space-y-2">
        <img
          src={url}
          alt="Payment screenshot"
          className="max-h-96 w-full rounded-xl border border-[#252525] object-contain"
        />
        <p className="text-xs text-[#666]">
          This link expires in 1 hour. Refresh if it stops loading.
        </p>
      </div>
    );
  }

  return (
    <div>
      {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
      <button
        onClick={loadScreenshot}
        disabled={loading}
        className="rounded-xl border border-[#252525] bg-[#141414] px-4 py-2 text-sm text-[#ecb100] transition hover:border-[#ecb100]/40 disabled:opacity-60"
      >
        {loading ? "Loading..." : "View Payment Screenshot"}
      </button>
    </div>
  );
}