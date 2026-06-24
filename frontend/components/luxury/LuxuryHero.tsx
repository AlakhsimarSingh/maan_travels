"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type LuxuryCarLite = {
  id: string;
  name?: string;
  image?: string;
  vehicle?: { imageUrl?: string | null };
};

export default function LuxuryHero({ cars: allCars }: { cars: LuxuryCarLite[] }) {
  const cars = allCars.filter((c) => c.image || c.vehicle?.imageUrl);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (cars.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % cars.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [cars.length]);

  if (cars.length === 0) {
    return (
      <section className="relative flex h-[85vh] items-center justify-center bg-black">
        <p className="text-white/40">No luxury vehicles available right now.</p>
      </section>
    );
  }

  return (
    <section className="relative h-[85vh] overflow-hidden">

      {cars.map((car, i) => {
        const img = car.image || car.vehicle?.imageUrl;
        if (!img) return null;

        return (
          <Image
            key={car.id}
            src={img}
            alt={car.name || "Luxury car"}
            fill
            priority={i === 0}
            className={`object-cover transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
          />
        );
      })}

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
        <div
          className={`transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="uppercase tracking-[0.4em] text-[#ecb100]">Premium Mobility</p>

          <h1 className="mt-5 max-w-4xl text-5xl font-bold text-white md:text-7xl">
            Luxury Car Rental Experience in Punjab
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-[#c7c7c7]">
            Arrive in style with our exclusive fleet of luxury cars including
            Mercedes Maybach, G-Wagon, Range Rover and premium SUVs.
          </p>

          <div className="mt-8 flex gap-2">
            {cars.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-1 rounded-full transition-all ${
                  i === index ? "w-8 bg-[#ecb100]" : "w-6 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}