"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Key, ArrowRight } from "lucide-react";

import { getActiveVehicles } from "@/src/services/vehicleService";

type FleetVehicle = {
  id: string;
  name: string;
  category: string;
  imageUrl?: string | null;
  rentalPerDay?: number | null;
  price: number;
};

const AUTO_ROTATE_MS = 4500;

export default function SelfDriveHero() {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getActiveVehicles();
        if (res?.success) {
          const fleet = (res.vehicles || []).filter(
            (v: any) => v.isSelfDrive === true && v.available === true && v.imageUrl
          );
          setVehicles(fleet);
        }
      } catch (err) {
        console.error("Hero fleet fetch error:", err);
      }
    })();
  }, []);

  // Auto-rotate the slideshow unless a thumbnail is being hovered.
  useEffect(() => {
    if (vehicles.length <= 1 || isHovering) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % vehicles.length);
    }, AUTO_ROTATE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [vehicles.length, isHovering]);

  const activeVehicle = vehicles[activeIndex];

  // Cap the visible rail to a reasonable number so it stays usable.
  const railVehicles = useMemo(() => vehicles.slice(0, 8), [vehicles]);

  return (
    <section className="relative overflow-hidden">
      {/* SLIDESHOW BACKDROP */}
      <div className="absolute inset-0">
        {vehicles.map((v, i) => (
          <div
            key={v.id}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
          >
            <div
              className={i === activeIndex ? "hero-ken-burns h-full w-full" : "h-full w-full"}
              key={`${v.id}-${i === activeIndex ? "active" : "idle"}`}
            >
              <Image
                src={v.imageUrl || "/placeholder.jpg"}
                alt={`${v.name} — self drive rental`}
                fill
                priority={i === 0}
                className="object-cover"
              />
            </div>
          </div>
        ))}

        {/* Gradient scrim so text and rail stay legible over any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-[640px] max-w-7xl flex-col px-6 pt-32 pb-10">
        <div className="flex-1">
          <p className="uppercase tracking-[0.3em] text-[#ecb100]">Maan Travels</p>

          <h1 className="mt-4 max-w-2xl text-5xl font-bold leading-tight text-white sm:text-6xl">
            Self Drive Car Rentals
          </h1>

          <p className="mt-6 max-w-xl text-lg text-[#c7c7c7]">
            Rent premium SUVs and cars with flexible packages. Pick your car, pick your dates —
            the keys are yours.
          </p>

          {/* Active vehicle callout, changes with the slideshow / hover */}
          {activeVehicle && (
            <div
              key={activeVehicle.id}
              className="hero-text-up mt-8 inline-flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 backdrop-blur-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ecb100]/15 text-[#ecb100]">
                <Key size={18} />
              </div>

              <div>
                <p className="text-sm text-[#8a8a8a]">{activeVehicle.category}</p>
                <p className="font-semibold text-white">{activeVehicle.name}</p>
              </div>

              <div className="ml-2 border-l border-white/10 pl-4">
                <p className="text-xs text-[#8a8a8a]">Starting at</p>
                <p className="font-semibold text-[#ecb100]">
                  ₹{activeVehicle.rentalPerDay || activeVehicle.price}
                  <span className="text-xs text-[#8a8a8a]">/day</span>
                </p>
              </div>

              <a
                href="#fleet"
                className="ml-2 flex items-center gap-1 text-sm font-medium text-white transition hover:text-[#ecb100]"
              >
                View fleet <ArrowRight size={14} />
              </a>
            </div>
          )}
        </div>

        {/* THUMBNAIL RAIL — hover to preview that car in the hero */}
        {railVehicles.length > 0 && (
          <div className="mt-10 flex gap-3 overflow-x-auto pb-2">
            {railVehicles.map((v, i) => (
              <button
                key={v.id}
                onMouseEnter={() => {
                  setIsHovering(true);
                  setActiveIndex(i);
                }}
                onMouseLeave={() => setIsHovering(false)}
                onFocus={() => {
                  setIsHovering(true);
                  setActiveIndex(i);
                }}
                onBlur={() => setIsHovering(false)}
                className={`group relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  i === activeIndex
                    ? "border-[#ecb100] shadow-[0_0_16px_rgba(236,177,0,0.35)]"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <Image
                  src={v.imageUrl || "/placeholder.jpg"}
                  alt={v.name}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1">
                  <p className="truncate text-[11px] font-medium text-white">{v.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}