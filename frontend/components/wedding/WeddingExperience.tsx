"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Car, Crown, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import WeddingCard from "./WeddingCard";

type LuxuryCar = {
  id: string;
  name: string;
  slug: string;
  image?: string | null; // FIX: schema field is `image`, not `imageUrl`
  category?: string | null;
  price?: number | null;
  description?: string | null;
  features?: string[];
};

export default function WeddingExperience({ cars }: { cars: LuxuryCar[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const hasCars = cars.length > 0;
  const active = hasCars ? cars[activeIndex] : null;

  // Auto-rotate the hero through the fleet, pausing on hover/interaction
  useEffect(() => {
    if (!hasCars || cars.length <= 1 || paused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cars.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [hasCars, cars.length, paused]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    setPaused(true);
    // resume auto-rotation after a pause window so manual browsing feels responsive
    setTimeout(() => setPaused(false), 8000);
  };

  const scrollToCard = (index: number) => {
    goTo(index);
    const card = gridRef.current?.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <section className="relative">
      {/* ---------------- HERO SLIDESHOW ---------------- */}
      <div
        className="relative h-[80vh] min-h-[560px] w-full overflow-hidden bg-black"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {hasCars ? (
          cars.map((car, i) => (
            <div
              key={car.id}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
                i === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {car.image ? (
                <Image
                  src={car.image}
                  alt={`${car.name} wedding car rental Punjab`}
                  fill
                  priority={i === 0}
                  className={`object-cover ${
                    i === activeIndex ? "scale-105" : "scale-100"
                  } transition-transform duration-[5000ms] ease-out`}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-black" />
              )}
            </div>
          ))
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-black" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40" />

        {/* CONTENT */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24">
          <p className="text-sm uppercase tracking-[0.35em] text-[#ecb100]">
            Royal Wedding Transport
          </p>

          <h1
            key={active?.id || "default"}
            className="reveal reveal-visible mt-5 max-w-3xl text-5xl font-bold leading-tight text-white md:text-6xl"
          >
            {active ? active.name : "Luxury Wedding Car Rental Punjab"}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c7c7c7]">
            {active?.description ||
              "Create a grand wedding entrance with premium luxury cars, chauffeur-driven across Punjab."}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {active ? (
              <Button
                asChild
                className="bg-[#ecb100] px-8 py-6 text-black hover:bg-[#f6c94c]"
              >
                <Link href={`/wedding-booking/${active.slug}`}>
                  <Car size={16} />
                  Book {active.name.split(" ")[0]}
                </Link>
              </Button>
            ) : (
              <Button asChild className="bg-[#ecb100] px-8 py-6 text-black hover:bg-[#f6c94c]">
                <Link href="#fleet-grid">View Wedding Cars</Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              className="border-[#ecb100] px-8 py-6 text-[#ecb100] hover:bg-[#ecb100] hover:text-black"
            >
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>
        </div>

        {/* SLIDE CONTROLS */}
        {hasCars && cars.length > 1 && (
          <>
            <button
              onClick={() => scrollToCard((activeIndex - 1 + cars.length) % cars.length)}
              className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:border-[#ecb100]/60 hover:text-[#ecb100] sm:flex"
              aria-label="Previous car"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollToCard((activeIndex + 1) % cars.length)}
              className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:border-[#ecb100]/60 hover:text-[#ecb100] sm:flex"
              aria-label="Next car"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {cars.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToCard(i)}
                  aria-label={`Show ${cars[i].name}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === activeIndex ? "w-8 bg-[#ecb100]" : "w-1.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ---------------- FLEET GRID ---------------- */}
      <div id="fleet-grid" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="uppercase tracking-[0.3em] text-[#ecb100]">Wedding Fleet</p>
            <h2 className="mt-4 text-4xl font-bold text-white">
              Luxury Cars For Your Special Day
            </h2>
            <p className="mt-4 text-[#8a8a8a]">
              Choose from our premium wedding cars for groom entry, bride arrival and family
              transportation.
            </p>
          </div>

          {hasCars ? (
            <div
              ref={gridRef}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {cars.map((car, i) => (
                <div
                  key={car.id}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`transition-all duration-300 ${
                    i === activeIndex ? "scale-[1.02]" : ""
                  }`}
                >
                  <WeddingCard car={car} highlighted={i === activeIndex} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#252525] py-20 text-center text-[#8a8a8a]">
              <Crown size={32} className="mx-auto mb-3 text-[#333]" />
              No luxury cars available right now.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}