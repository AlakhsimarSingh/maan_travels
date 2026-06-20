"use client";

import { useEffect, useState } from "react";
import { Plane } from "lucide-react";
import { API_URL } from "@/src/services/bookingService";
import type { Airport } from "@/src/hooks/useAirports";

type Props = {
  airports: Airport[];
  selectedAirport: Airport | null;
  onSelectAirport: (airport: Airport) => void;
};

export default function AirportHero({ airports, selectedAirport, onSelectAirport }: Props) {
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    if (selectedAirport || airports.length < 2) return;

    const interval = setInterval(() => {
      setPreviewIndex((prev) => (prev + 1) % airports.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedAirport, airports.length]);

  const displayAirport = selectedAirport || airports[previewIndex];

  return (
    <section className="relative min-h-[80vh] overflow-hidden pt-32">
      <div className="absolute inset-0">
        {displayAirport?.image ? (
          <img
            src={`${API_URL}${displayAirport.image}`}
            alt={displayAirport.name}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
            <Plane size={64} className="text-white/10" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl items-center px-6">
        <div className="max-w-3xl">
          <p className="mb-5 uppercase tracking-[0.4em] text-[#ecb100]">Airport Transfer</p>

          <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
            Premium Airport Transfers
            <span className="block text-[#ecb100]">Across Punjab & North India</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#c7c7c7]">
            {displayAirport?.description || "Select an airport to see route details."}
          </p>

          <div className="mt-10">
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[#8a8a8a]">Select Airport</p>

            <div className="flex flex-wrap gap-3">
              {airports.map((airport) => (
                <button
                  key={airport.id}
                  onClick={() => onSelectAirport(airport)}
                  className={`
                    rounded-full border px-5 py-3 text-sm font-medium transition-all duration-300
                    ${selectedAirport?.id === airport.id
                      ? "border-[#ecb100] bg-[#ecb100] text-black shadow-[0_0_25px_rgba(236,177,0,0.25)]"
                      : "border-[#252525] bg-black/40 text-white hover:border-[#ecb100] hover:text-[#ecb100]"
                    }
                  `}
                >
                  {airport.shortName}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-[#8a8a8a]">
            <span>✓ 24/7 Availability</span>
            <span>✓ Professional Chauffeurs</span>
            <span>✓ On-Time Pickup</span>
          </div>
        </div>
      </div>
    </section>
  );
}