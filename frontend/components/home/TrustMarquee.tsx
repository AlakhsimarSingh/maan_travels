"use client";

import { useEffect, useState } from "react";
import { CarFront, Clock3, Award, ShieldCheck, MapPinned, Headset } from "lucide-react";

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
    <span style={{ fontFamily: "var(--font-geist-mono)" }} className="text-2xl font-bold text-white">
      {count}
      {suffix}
    </span>
  );
}

const STATS = [
  { icon: CarFront, value: 50, suffix: "+", label: "Luxury Vehicles" },
  { icon: Clock3, value: 24, suffix: "/7", label: "Taxi Availability" },
  { icon: Award, value: 15, suffix: "+", label: "Years Of Excellence" },
  { icon: ShieldCheck, value: 10000, suffix: "+", label: "Rides Completed" },
];

const BADGES = [
  { icon: MapPinned, label: "Punjab · Himachal · J&K · Rajasthan · Delhi" },
  { icon: Headset, label: "24/7 Live Booking Support" },
  { icon: ShieldCheck, label: "Verified, Background-Checked Taxi Drivers" },
  { icon: Award, label: "On-Time Guarantee" },
];

function StatCard({ icon: Icon, value, suffix, label }: (typeof STATS)[number]) {
  return (
    <div className="flex shrink-0 items-center gap-3.5 whitespace-nowrap rounded-2xl border border-[#252525] bg-[#111] px-6 py-3.5">
      <Icon className="h-7 w-7 shrink-0 text-[#ecb100] opacity-80" strokeWidth={1.5} />
      <div>
        <Counter value={value} suffix={suffix} />
        <p className="text-xs text-[#8a8a8a]">{label}</p>
      </div>
    </div>
  );
}

function BadgeCard({ icon: Icon, label }: (typeof BADGES)[number]) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-[#252525] bg-black px-5 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-[#ecb100]" strokeWidth={1.75} />
      <p className="text-xs font-medium text-[#c7c7c7]">{label}</p>
    </div>
  );
}

export default function TrustMarquee() {
  return (
    <section className="border-y border-[#1c1c1c] bg-black py-6">
      <div className="trust-marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track-a flex w-max gap-4">
          {[...STATS, ...STATS, ...STATS].map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>
      </div>

      <div className="trust-marquee relative mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track-b flex w-max gap-3">
          {[...BADGES, ...BADGES, ...BADGES].map((b, i) => (
            <BadgeCard key={i} {...b} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .trust-marquee:hover .marquee-track-a,
        .trust-marquee:hover .marquee-track-b {
          animation-play-state: paused;
        }
        .marquee-track-a {
          animation: trust-marquee-left 26s linear infinite;
        }
        .marquee-track-b {
          animation: trust-marquee-right 32s linear infinite;
        }
        @keyframes trust-marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-33.3333%); }
        }
        @keyframes trust-marquee-right {
          from { transform: translateX(-33.3333%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}