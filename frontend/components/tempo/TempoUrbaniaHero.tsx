"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { TempoVehicle } from "@/src/lib/fetchTempoVehicles";

export default function TempoUrbaniaHero({
  vehicles,
}: {
  vehicles: TempoVehicle[];
}) {
  const [index, setIndex] = useState(0);

  /* ---------------- SLIDESHOW ---------------- */
  useEffect(() => {
    if (vehicles.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % vehicles.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [vehicles.length]);

  if (!vehicles.length) {
    // No tempo vehicles available right now — fall back to a static,
    // still on-brand hero instead of rendering nothing at all.
    return (
      <section className="relative flex h-[60vh] items-center justify-center bg-black">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="uppercase tracking-[0.4em] text-[#ecb100]">
            Premium Group Travel
          </p>
          <h1 className="mt-5 text-4xl font-bold text-white md:text-5xl">
            Tempo Traveller & Urbania Fleet
          </h1>
          <p className="mt-6 text-lg text-[#c7c7c7]">
            Our travellers are being updated. Please check back shortly, or contact us directly to book.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* SLIDES */}
      {vehicles.map((v, i) => (
        <Image
          key={v.id}
          src={v.imageUrl || "/images/fallback.jpg"}
          alt={`${v.name} — ${v.category} rental`}
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/70" />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
        <div>
          <p className="uppercase tracking-[0.4em] text-[#ecb100]">
            Premium Group Travel
          </p>

          <h1 className="mt-5 text-5xl font-bold text-white md:text-6xl">
            Tempo Traveller & Urbania Fleet
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-[#c7c7c7]">
            Spacious AC travellers designed for weddings, tours, and corporate group journeys with maximum comfort.
          </p>

          {/* INDICATORS */}
          <div className="mt-8 flex gap-2">
            {vehicles.map((_, i) => (
              <div
                key={i}
                className={`h-1 w-6 rounded-full transition-all ${
                  i === index ? "bg-[#ecb100]" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}