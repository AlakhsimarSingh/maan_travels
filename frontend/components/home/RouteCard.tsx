"use client";

import { useState } from "react";

type Pricing = { vehicleId: string; price: number };
type Vehicle = { id: string; name: string };

type Props = {
  title: string;
  from?: string;
  to?: string;
  category?: string;
  index?: number;
  pricing?: Pricing[];
  vehicles?: Vehicle[];
  onBook: (vehicleId: string | undefined, price: number) => void;
};

const categoryLabels: Record<string, string> = {
  destination: "Destination",
  one_way: "One way",
  local: "Local",
  airport: "Airport",
  tour: "Tour",
};

export default function RouteCard({
  title,
  from,
  to,
  category,
  index = 0,
  pricing = [],
  vehicles = [],
  onBook,
}: Props) {
  const label = category ? categoryLabels[category] ?? category : null;

  const pricedVehicles = vehicles.filter((v) =>
    pricing.some((p) => p.vehicleId === v.id)
  );

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>(
    pricedVehicles[0]?.id
  );

  const price = pricing.find((p) => p.vehicleId === selectedVehicleId)?.price || 0;

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      className="
        card-enter group relative
        bg-[#111] border border-[#252525] rounded-2xl overflow-hidden
        transition-all duration-300
        hover:-translate-y-1 hover:border-[#ecb100]/50
        hover:shadow-[0_8px_24px_-8px_rgba(236,177,0,0.25)]
      "
    >
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between mb-4 h-5">
          {label && (
            <span className="text-[11px] tracking-wide text-[#ecb100] border border-[#ecb100]/35 rounded-full px-2.5 py-1">
              {label}
            </span>
          )}
        </div>

        {title && (
          <h3
            className={`font-semibold text-white transition-all duration-500 ease-out ${
              from || to
                ? "mb-3 text-[13px] text-white/60 tracking-wide truncate"
                : "text-[16px]"
            }`}
          >
            {title}
          </h3>
        )}

        {from || to ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative w-[7px] h-[7px] rounded-full bg-[#ecb100] flex-shrink-0">
                <span className="route-dot-pulse" />
              </span>
              <span className="route-line" />
              <span className="w-[7px] h-[7px] rounded-full border-[1.5px] border-[#ecb100] flex-shrink-0" />
            </div>

            <div className="flex items-center justify-between text-[15px] font-medium text-white gap-2">
              <span className="truncate">{from}</span>
              <span className="truncate text-right">{to}</span>
            </div>
          </>
        ) : null}

        {pricedVehicles.length > 0 && (
          /* Use a grid so buttons are equal width and always tappable on mobile.
             Two columns keeps them readable even on narrow screens. */
          <div className="grid grid-cols-2 gap-1.5 mt-4">
            {pricedVehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVehicleId(v.id)}
                className={`
                  text-[12px] px-2 py-2 rounded-lg border transition-colors text-center
                  min-h-[36px] touch-manipulation
                  ${
                    selectedVehicleId === v.id
                      ? "bg-[#ecb100] text-black border-[#ecb100] font-medium"
                      : "border-[#333] text-white/60 hover:border-[#ecb100]/40 active:bg-[#1a1a1a]"
                  }
                `}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-[#2a2a2a] mx-5" />

      <div className="flex items-center justify-between px-5 py-4">
        <div>
          {price > 0 ? (
            <>
              <p className="text-[11px] text-white/40">Starting from</p>
              <p
                style={{ fontFamily: "var(--font-geist-mono)" }}
                className="text-xl font-medium text-white"
              >
                ₹{price}
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] text-white/40">Best fare guaranteed</p>
              <p className="text-sm font-medium text-[#ecb100]">Get a quote →</p>
            </>
          )}
        </div>

        <button
          onClick={() => onBook(selectedVehicleId, price)}
          className="
            bg-[#ecb100] text-black text-sm font-medium rounded-lg px-4 py-2.5
            transition-transform duration-150 min-h-[40px] touch-manipulation
            hover:bg-[#f6c94c] active:scale-95
          "
        >
          Book now
        </button>
      </div>
    </div>
  );
}