"use client";

import { useEffect, useState } from "react";

import FleetCard from "./FleetCard";
import { API_URL } from "@/src/services/bookingService";

type Vehicle = {
  id: string;
  name: string;
  imageUrl?: string | null;
  category?: string | null;
  price?: number | null;
};

export default function FleetSection() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/vehicles`);
        const data = await res.json();

        if (data?.success) {
          setVehicles((data.vehicles || []).slice(0, 6));
        } else {
          setVehicles([]);
        }
      } catch (err) {
        console.error("Fleet fetch error:", err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <section id="fleet" className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}
        <div className="mb-14 text-center">
          <p className="mb-3 uppercase tracking-[0.3em] text-[#ecb100]">
            Our Fleet
          </p>

          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Choose Your Preferred Vehicle
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[#8a8a8a]">
            Comfortable sedans, premium SUVs and luxury vehicles for every journey.
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl bg-[#1a1a1a]"
              />
            ))
          ) : vehicles.length > 0 ? (
            vehicles.map((item) => (
              <FleetCard
                key={item.id}
                name={item.name}
                image={item.imageUrl || "/placeholder.jpg"}
                description={item.category || "Premium Vehicle"}

                /* ✅ FIXED: these were missing */
                category={item.category || ""}
                price={item.price ?? undefined}
              />
            ))
          ) : (
            <p className="text-center text-[#8a8a8a] col-span-full">
              No vehicles available right now.
            </p>
          )}

        </div>

      </div>
    </section>
  );
}