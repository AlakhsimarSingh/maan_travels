"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

type LocationImage = {
  id: string;
  name: string;
  imageUrl?: string | null;
};

export default function DestinationHero({
  destination,
  locations,
  activeIndex,
  autoRotate = true,
  onTick,
}: {
  destination: string;
  locations: LocationImage[];
  activeIndex: number;
  autoRotate?: boolean;
  onTick?: () => void;
}) {
  // Tracks the previous image so we can crossfade rather than hard-cut
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [displayIndex, setDisplayIndex] = useState(activeIndex);

  useEffect(() => {
    if (activeIndex === displayIndex) return;
    setPrevIndex(displayIndex);
    setDisplayIndex(activeIndex);

    const t = setTimeout(() => setPrevIndex(null), 1200);
    return () => clearTimeout(t);
  }, [activeIndex, displayIndex]);

  // Self-contained auto-rotation — the hero owns its own timer rather than
  // relying on a parent to manage slide indices, so this component is
  // fully responsible for its own animation timing.
  useEffect(() => {
    if (!autoRotate || !onTick || locations.length <= 1) return;

    const interval = setInterval(onTick, 4500);
    return () => clearInterval(interval);
  }, [autoRotate, onTick, locations.length]);

  const current = locations[displayIndex];
  const previous = prevIndex !== null ? locations[prevIndex] : null;

  const fallbackGradients = [
    "from-[#3a2a00] via-[#1a1206] to-black",
    "from-[#1a1a3a] via-[#0d0d1f] to-black",
    "from-[#2a1a3a] via-[#150d1f] to-black",
    "from-[#1a3a2a] via-[#0d1f15] to-black",
  ];

  const gradientFor = (idx: number) =>
    fallbackGradients[idx % fallbackGradients.length];

  return (
    <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-black">
      {/* PREVIOUS IMAGE — fading out underneath */}
      {previous && (
        <div className="hero-fade-out absolute inset-0">
          <HeroLayer location={previous} gradientClass={gradientFor(prevIndex!)} />
        </div>
      )}

      {/* CURRENT IMAGE — fading + zooming in on top */}
      <div key={displayIndex} className="hero-fade-in absolute inset-0">
        <HeroLayer location={current} gradientClass={gradientFor(displayIndex)} kenBurns />
      </div>

      {/* GRADIENT OVERLAY for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-40 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <p className="hero-text-up flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#ecb100]">
            <MapPin size={13} className="animate-pulse" />
            {destination ? "Selected destination" : "Explore Punjab's gateway to"}
          </p>

          <h1
            key={`title-${displayIndex}`}
            className="hero-text-up mt-4 text-5xl font-bold tracking-tight text-white sm:text-7xl"
          >
            {current?.name || "Your Next Journey"}
          </h1>

          <p
            key={`sub-${displayIndex}`}
            className="hero-text-up mt-4 max-w-xl text-[#c7c7c7]"
            style={{ animationDelay: "0.1s" }}
          >
            {destination
              ? `Book a customized tour to ${current?.name}. Pick your vehicle and travel date below.`
              : "Customized tour packages across the mountains, deserts and shrines of North India."}
          </p>
        </div>
      </div>

      {/* SLIDE INDICATORS — only shown during the auto-rotating preview, not once a destination is locked in */}
      {!destination && locations.length > 1 && (
        <div className="absolute bottom-28 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {locations.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === displayIndex ? "w-8 bg-[#ecb100]" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HeroLayer({
  location,
  gradientClass,
  kenBurns,
}: {
  location?: LocationImage;
  gradientClass: string;
  kenBurns?: boolean;
}) {
  if (location?.imageUrl) {
    return (
      <img
        src={location.imageUrl}
        alt={location.name}
        className={`h-full w-full object-cover ${kenBurns ? "hero-ken-burns" : ""}`}
      />
    );
  }

  // Tasteful placeholder gradient for destinations without an image yet
  return (
    <div className={`h-full w-full bg-gradient-to-br ${gradientClass}`}>
      <div className="flex h-full w-full items-center justify-center opacity-[0.04]">
        <MapPin size={200} strokeWidth={0.5} className="text-white" />
      </div>
    </div>
  );
}