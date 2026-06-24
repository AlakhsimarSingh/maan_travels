"use client";

import { useEffect, useState } from "react";
import { CarFront, Clock3, Award } from "lucide-react";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [value]);

  return (
    <h3 style={{ fontFamily: "var(--font-geist-mono)" }} className="text-5xl font-bold text-white">
      {count}{suffix}
    </h3>
  );
}

export default function HeroTrustCard() {
  return (
    <div className="relative w-[350px] rounded-3xl border border-[#252525] bg-black/40 backdrop-blur-xl p-9 shadow-[0_0_50px_rgba(236,177,0,0.08)]">

      <div className="absolute left-0 top-8 h-16 w-1 bg-[#ecb100] rounded-r-full" />

      <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#ecb100]">
        Trusted Experience
      </p>

      <div className="space-y-7">
        <div className="flex items-center justify-between">
          <div>
            <Counter value={50} suffix="+" />
            <p className="text-[#8a8a8a]">Luxury Vehicles</p>
          </div>
          <CarFront className="h-10 w-10 text-[#ecb100] opacity-80" strokeWidth={1.5} />
        </div>

        <div className="h-px bg-[#252525]" />

        <div className="flex items-center justify-between">
          <div>
            <Counter value={24} suffix="/7" />
            <p className="text-[#8a8a8a]">Chauffeur Availability</p>
          </div>
          <Clock3 className="h-10 w-10 text-[#ecb100] opacity-80" strokeWidth={1.5} />
        </div>

        <div className="h-px bg-[#252525]" />

        <div className="flex items-center justify-between">
          <div>
            <Counter value={15} suffix="+" />
            <p className="text-[#8a8a8a]">Years Of Excellence</p>
          </div>
          <Award className="h-10 w-10 text-[#ecb100] opacity-80" strokeWidth={1.5} />
        </div>
      </div>

    </div>
  );
}