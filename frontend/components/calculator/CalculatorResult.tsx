"use client";

import { MessageCircle, AlertTriangle } from "lucide-react";
import { siteConfig } from "@/src/config/site";

export default function CalculatorResult({
  low,
  high,
  vehicleName,
  distance,
  tripType,
}: {
  low: number;
  high: number;
  vehicleName: string;
  distance: number;
  tripType: "oneway" | "round";
}) {
  const sendWhatsApp = () => {
    // Deliberately does NOT include the calculated estimate — this tool is a
    // free, informal indicator for the customer only and must never be read
    // as a quote from Maan Travels. Our team gives the actual price.
    const message = `Hello Maan Travels,

I used the trip cost calculator on your website and would like an official quote for:

Vehicle: ${vehicleName}
Trip type: ${tripType === "round" ? "Round trip" : "One way"}
Approx. distance: ${distance} km

Please share your actual pricing and confirm availability.`;

    const phone = siteConfig.contact.phone.replace(/[^\d]/g, "");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <div className="rounded-2xl border border-[#ecb100]/30 bg-gradient-to-b from-[#ecb100]/5 to-transparent p-6 text-center">
      <p className="text-sm text-[#8a8a8a]">Estimated Trip Cost</p>

      <h3 className="mt-2 flex items-baseline justify-center gap-2 text-3xl font-bold text-white sm:text-4xl">
        <span>₹{low.toLocaleString("en-IN")}</span>
        <span className="text-lg text-[#666]">–</span>
        <span>₹{high.toLocaleString("en-IN")}</span>
      </h3>

      {/* CAUTION DISCLAIMER */}
      <div className="mx-auto mt-4 flex max-w-md items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-left">
        <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-400" />
        <p className="text-xs leading-relaxed text-amber-200/80">
          This covers fuel and toll costs only — it excludes driver allowance, service charges
          and taxes. It is a free estimation tool and does not reflect Maan Travels' actual
          pricing. Contact us for the final, confirmed fare.
        </p>
      </div>

      <button
        onClick={sendWhatsApp}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-black transition-all duration-200 hover:bg-[#2ee375] active:scale-[0.98]"
      >
        <MessageCircle size={18} />
        Get Official Quote on WhatsApp
      </button>
    </div>
  );
}