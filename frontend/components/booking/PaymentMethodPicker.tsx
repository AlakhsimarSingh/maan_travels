"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/src/services/bookingService";
import { resolveImageUrl } from "@/src/lib/resolveImageUrl";

export type PaymentType = "full" | "partial" | "later";

type Props = {
  totalAmount: number;
  paymentType: PaymentType;
  onPaymentTypeChange: (type: PaymentType) => void;
  partialAmount: string;
  onPartialAmountChange: (value: string) => void;
  onScreenshotChange: (file: File | null) => void;
};

export default function PaymentMethodPicker({
  totalAmount,
  paymentType,
  onPaymentTypeChange,
  partialAmount,
  onPartialAmountChange,
  onScreenshotChange,
}: Props) {
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    if (paymentType === "later") return;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/payment/settings`);
        const data = await res.json();
        setQrCode(data.settings?.qrCodeImage || null);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [paymentType]);

  if (!totalAmount || totalAmount <= 0) {
    return (
      <div className="rounded-xl border border-[#252525] bg-[#111] p-4 text-sm text-white/60">
        Pricing for this booking will be confirmed by our team. You can pay once it's confirmed.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-[#252525] bg-[#111] p-4">
      <p className="text-sm font-medium text-white">How would you like to pay?</p>

      <div className="flex gap-2 flex-wrap">
        {(["full", "partial", "later"] as PaymentType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onPaymentTypeChange(t)}
            className={`
              px-4 py-2 rounded-lg text-sm border transition-colors
              ${paymentType === t
                ? "bg-[#ecb100] text-black border-[#ecb100]"
                : "border-[#333] text-white/70 hover:border-[#ecb100]/40"
              }
            `}
          >
            {t === "full" && "Pay full amount"}
            {t === "partial" && "Pay partial amount"}
            {t === "later" && "Pay later"}
          </button>
        ))}
      </div>

      {paymentType === "partial" && (
        <Input
          type="number"
          placeholder="How much are you paying now (₹)"
          value={partialAmount}
          onChange={(e) => onPartialAmountChange(e.target.value)}
        />
      )}

      {(paymentType === "full" || paymentType === "partial") && (
        <div className="space-y-3">
          {qrCode ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={resolveImageUrl(qrCode, API_URL)}
                alt="Payment QR code"
                className="w-40 h-40 rounded-lg border border-[#252525]"
              />
              <p className="text-xs text-white/50">
                Scan and pay {paymentType === "full" ? `₹${totalAmount}` : `₹${partialAmount || 0}`}
              </p>
            </div>
          ) : (
            <p className="text-xs text-white/40">Loading payment QR code...</p>
          )}

          <div>
            <p className="text-sm text-white/70 mb-2">Upload a screenshot of your payment</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onScreenshotChange(e.target.files?.[0] || null)}
              className="text-sm text-white/70"
            />
          </div>
        </div>
      )}
    </div>
  );
}