"use client";

import { useEffect, useState } from "react";

import WeddingCard from "./WeddingCard";
import { API_URL } from "@/src/services/bookingService";

type LuxuryCar = {
  id: string;
  name: string;
  imageUrl?: string | null;
  category?: string | null;
  price?: number | null;
  description?: string | null;
};

export default function WeddingFleet() {
  const [cars, setCars] = useState<LuxuryCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/luxury-cars`);
        const data = await res.json();
        console.log("Wedding fleet fetch response:", data);

        if (data?.success) {
          setCars(data.luxuryCars || []);
        } else {
          setCars([]);
        }
      } catch (err) {
        console.error("Wedding fleet fetch error:", err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}
        <div className="text-center mb-14">

          <p className="uppercase tracking-[0.3em] text-[#ecb100]">
            Wedding Fleet
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white">
            Luxury Cars For Your Special Day
          </h2>

          <p className="mt-4 text-[#8a8a8a]">
            Choose from our premium wedding cars for groom entry, bride arrival and family transportation.
          </p>

        </div>

        {/* GRID */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-[#1a1a1a] animate-pulse"
              />
            ))
          ) : cars.length > 0 ? (
            cars.map((car) => (
              <WeddingCard
                key={car.id}
                car={{
                  ...car,
                  /* 🔥 NEW FIELD FOR UI */
                  startingPrice: car.price,
                }}
              />
            ))
          ) : (
            <p className="text-center text-[#8a8a8a] col-span-full">
              No luxury cars available right now.
            </p>
          )}

        </div>

      </div>
    </section>
  );
}