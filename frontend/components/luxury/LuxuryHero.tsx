"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getAllLuxuryCars } from "@/src/services/luxuryCarService";

export default function LuxuryHero() {
  const [cars, setCars] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH CARS ---------------- */
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await getAllLuxuryCars();

        if (res?.success) {
          // only cars with images
          const valid = res.luxuryCars.filter(
            (c: any) => c.image || c.vehicle?.imageUrl
          );

          setCars(valid);
        }
      } catch (err) {
        console.error("Hero fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  /* ---------------- AUTO SLIDER ---------------- */
  useEffect(() => {
    if (cars.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % cars.length);
    }, 4000); // 4s per slide

    return () => clearInterval(interval);
  }, [cars]);

  if (loading) {
    return (
      <section className="relative h-[85vh] bg-black flex items-center justify-center">
        <p className="text-white">Loading luxury experience...</p>
      </section>
    );
  }

  const currentImage =
    cars[index]?.image || cars[index]?.vehicle?.imageUrl;

  return (
    <section className="relative h-[85vh] overflow-hidden">

      {/* IMAGE SLIDES */}
      {cars.map((car, i) => {
        const img = car.image || car.vehicle?.imageUrl;

        return (
          <Image
            key={car.id}
            src={img}
            alt={car.name || "Luxury car"}
            fill
            priority={i === 0}
            className={`
              object-cover
              transition-opacity
              duration-1000
              ${i === index ? "opacity-100" : "opacity-0"}
            `}
          />
        );
      })}

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/70" />

      {/* TEXT CONTENT */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">

        <div>
          <p className="uppercase tracking-[0.4em] text-[#ecb100]">
            Premium Mobility
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-bold text-white md:text-7xl">
            Luxury Car Rental Experience in Punjab
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-[#c7c7c7]">
            Arrive in style with our exclusive fleet of luxury cars including
            Mercedes Maybach, G-Wagon, Range Rover and premium SUVs.
          </p>

          {/* optional mini indicator */}
          <div className="mt-8 flex gap-2">
            {cars.map((_, i) => (
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