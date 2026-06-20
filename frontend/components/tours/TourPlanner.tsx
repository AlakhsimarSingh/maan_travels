"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import {
  getActiveLocations,
  getPickupLocations,
  getDropLocations,
} from "@/src/services/locationService";

import DestinationHero from "./DestinationHero";
import TourBookingCard from "./TourBookingCard";

type Location = {
  id: string;
  name: string;
  imageUrl?: string | null;
  canPickup: boolean;
  canDrop: boolean;
};

export default function TourPlanner() {
  const [pickupLocations, setPickupLocations] = useState<Location[]>([]);
  const [dropLocations, setDropLocations] = useState<Location[]>([]);
  const [heroLocations, setHeroLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [activeRes, pickupRes, dropRes] = await Promise.all([
          getActiveLocations(),
          getPickupLocations(),
          getDropLocations(),
        ]);

        if (activeRes.success) setHeroLocations(activeRes.locations);
        if (pickupRes.success) setPickupLocations(pickupRes.locations);
        if (dropRes.success) setDropLocations(dropRes.locations);
      } catch (err) {
        console.error("Failed to load locations", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Auto-rotate the hero through destination-capable locations, only while
  // nothing's been explicitly selected yet
  const rotatingPool = useMemo(
    () => (dropLocations.length > 0 ? dropLocations : heroLocations),
    [dropLocations, heroLocations]
  );

  useEffect(() => {
    if (destination) return;
    if (rotatingPool.length <= 1) return;

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % rotatingPool.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [destination, rotatingPool.length]);

  // When a destination is explicitly chosen, lock the hero to that location
  const activeIndex = useMemo(() => {
    if (!destination) return slideIndex;
    const idx = rotatingPool.findIndex((l) => l.name === destination);
    return idx >= 0 ? idx : 0;
  }, [destination, rotatingPool, slideIndex]);

  const canSubmit = pickup && destination;

  return (
    <main>
      <DestinationHero
        destination={destination}
        locations={rotatingPool}
        activeIndex={activeIndex}
      />

      <section className="relative -mt-24 z-20 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-[#252525] bg-[#111]/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <h2 className="text-xl font-semibold text-white">Plan your journey</h2>
            <p className="mt-1 text-sm text-[#8a8a8a]">
              Choose where you're starting from and where you'd like to go.
            </p>

            <div className="mt-6 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
              <LocationSelect
                label="Pickup city"
                value={pickup}
                onChange={setPickup}
                options={pickupLocations}
                loading={loading}
                placeholder="Select pickup city"
              />

              <div className="hidden justify-center md:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a2a] bg-black/40 text-[#ecb100]">
                  <ArrowRight size={16} />
                </div>
              </div>

              <LocationSelect
                label="Destination"
                value={destination}
                onChange={(val) => {
                  setDestination(val);
                }}
                options={dropLocations}
                loading={loading}
                placeholder="Select destination"
              />
            </div>

            {/* live route preview chip */}
            <div
              className={`mt-5 flex items-center gap-2 overflow-hidden rounded-xl border px-4 transition-all duration-300 ${
                canSubmit
                  ? "max-h-16 border-[#ecb100]/30 bg-[#ecb100]/5 py-3 opacity-100"
                  : "max-h-0 border-transparent py-0 opacity-0"
              }`}
            >
              <span className="text-sm text-white">
                {pickup} <span className="mx-2 text-[#ecb100]">→</span> {destination}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <TourBookingCard pickup={pickup} destination={destination} />
      </section>
    </main>
  );
}

function LocationSelect({
  label,
  value,
  onChange,
  options,
  loading,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Location[];
  loading: boolean;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-wide text-[#8a8a8a]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="
          w-full rounded-xl border border-[#252525] bg-black/50 p-4
          text-white outline-none transition focus:border-[#ecb100]
          disabled:opacity-50
        "
      >
        <option value="">{loading ? "Loading..." : placeholder}</option>
        {options.map((loc) => (
          <option key={loc.id} value={loc.name}>
            {loc.name}
          </option>
        ))}
      </select>
    </div>
  );
}