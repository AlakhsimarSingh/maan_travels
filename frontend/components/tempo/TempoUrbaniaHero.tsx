"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getTempoUrbaniaVehicles } from "@/src/services/tempoUrbaniaService";

export default function TempoUrbaniaHero() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH FROM DB ---------------- */
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await getTempoUrbaniaVehicles();

        // 🔥 STRICT FILTER (DB safety layer)
        const filtered = (res || []).filter(
          (v: any) =>
            v.category === "Tempo Traveller" ||
            v.category === "Urbania"
        );

        setVehicles(filtered);
      } catch (err) {
        console.error("Hero error:", err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  /* ---------------- SLIDESHOW ---------------- */
  useEffect(() => {
    if (vehicles.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % vehicles.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [vehicles]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <section className="h-[80vh] flex items-center justify-center bg-black">
        <p className="text-white">Loading premium travellers...</p>
      </section>
    );
  }

  if (!vehicles.length) return null;

  return (
    <section className="relative h-[80vh] overflow-hidden">

      {/* SLIDES */}
      {vehicles.map((v, i) => (
        <Image
          key={v.id}
          src={v.imageUrl || "/images/fallback.jpg"}
          alt={v.name || "Luxury Traveller"}
          fill
          priority={i === 0}
          className={`
            object-cover
            transition-opacity
            duration-1000
            ${i === index ? "opacity-100" : "opacity-0"}
          `}
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