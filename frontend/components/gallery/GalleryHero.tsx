"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/src/hooks/useInView";

const stats = [
  { value: 10, suffix: "+", label: "Years of service" },
  { value: 50, suffix: "+", label: "Premium vehicles" },
  { value: 15000, suffix: "+", label: "Happy customers" },
  { value: 24, suffix: "/7", label: "Always available" },
];

function StatCounter({
  value, suffix, label, inView,
}: { value: number; suffix: string; label: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1200;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <div>
      <p style={{ fontFamily: "var(--font-geist-mono)" }} className="text-3xl font-semibold text-[#ecb100] md:text-4xl">
        {count}{suffix}
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.1em] text-white/50">{label}</p>
    </div>
  );
}

export default function GalleryHero() {
  const { ref, inView } = useInView(0.3);

  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden pb-16 pt-32">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/gallery-bg.jpg')" }}
      />

      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <p className="uppercase tracking-[0.3em] text-[#ecb100]">Our Gallery</p>

        <h1 className="mt-4 text-5xl font-bold text-white">
          Luxury Fleet & Travel Moments
        </h1>

        <p className="mt-5 max-w-2xl text-[#c7c7c7]">
          Explore our premium fleet, wedding cars, and unforgettable journeys across Punjab and North India.
        </p>

        <div ref={ref} className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
          {stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}