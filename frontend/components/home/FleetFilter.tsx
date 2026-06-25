"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Sparkles, KeyRound, CarFront, LayoutGrid } from "lucide-react";

import {
  FLEET_FILTER_PARAM,
  type FleetFilterType,
} from "@/src/lib/vehicleCategory";

const OPTIONS: {
  value: FleetFilterType;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { value: "all", label: "All Vehicles", shortLabel: "All", icon: LayoutGrid },
  { value: "luxury", label: "Luxury", shortLabel: "Luxury", icon: Sparkles },
  { value: "self-drive", label: "Self Drive", shortLabel: "Self Drive", icon: KeyRound },
  { value: "taxi", label: "Taxi Fleet", shortLabel: "Taxi", icon: CarFront },
];

export default function FleetFilter({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = useMemo<FleetFilterType>(() => {
    const v = searchParams.get(FLEET_FILTER_PARAM);
    if (v === "luxury" || v === "self-drive" || v === "taxi") return v;
    return "all";
  }, [searchParams]);

  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const measure = () => {
    const el = itemRefs.current[active];
    const track = trackRef.current;
    if (!el || !track) return;
    // Use offsetLeft (relative to the scrolling track), not
    // getBoundingClientRect, since the track can be horizontally
    // scrolled on mobile — a viewport-relative rect would put the
    // indicator in the wrong place the moment the row is scrolled.
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  };

  useEffect(measure, [active]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  // Keep the active pill in view (and the indicator visible) if it's
  // scrolled off-screen when selected via keyboard/programmatically.
  useEffect(() => {
    itemRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  const select = (value: FleetFilterType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(FLEET_FILTER_PARAM);
    } else {
      params.set(FLEET_FILTER_PARAM, value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div
      className={`
        relative w-full
        before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-20 before:w-6 before:bg-gradient-to-r before:from-[#0a0a0a] before:to-transparent before:content-['']
        after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-20 after:w-6 after:bg-gradient-to-l after:from-[#0a0a0a] after:to-transparent after:content-['']
        sm:before:hidden sm:after:hidden
        ${className}
      `}
    >
      <div
        ref={trackRef}
        role="tablist"
        aria-label="Filter fleet by type"
        className="
          relative flex items-center gap-1 overflow-x-auto rounded-full
          border border-[#2a2a2a] bg-[#0d0d0d] p-1.5 sm:p-2
          shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          snap-x snap-mandatory sm:snap-none
          sm:inline-flex sm:w-auto sm:flex-wrap sm:overflow-visible
        "
      >
        {/* Sliding gold indicator — positioned with offsetLeft against
            the scrolling track itself, so it tracks correctly whether
            the row is scrolled or not. */}
        {indicator && (
          <span
            aria-hidden
            className="
              absolute top-1.5 bottom-1.5 rounded-full
              bg-gradient-to-b from-[#ffd54a] to-[#ecb100]
              shadow-[0_4px_20px_-2px_rgba(236,177,0,0.65)]
              transition-[left,width] duration-400 ease-out
              motion-reduce:transition-none
              sm:top-2 sm:bottom-2
            "
            style={{ left: indicator.left, width: indicator.width }}
          />
        )}

        {OPTIONS.map(({ value, label, shortLabel, icon: Icon }) => {
          const isActive = active === value;

          return (
            <button
              key={value}
              ref={(node) => {
                itemRefs.current[value] = node;
              }}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => select(value)}
              className={`
                relative z-10 flex shrink-0 items-center gap-1.5 whitespace-nowrap
                snap-center rounded-full px-4 py-2.5 text-[13px] font-medium
                transition-colors duration-300 sm:gap-2 sm:px-5 sm:text-sm
                ${isActive ? "text-black" : "text-white/55"}
              `}
            >
              <Icon size={14} className={isActive ? "text-black" : "text-[#ecb100]/70"} />
              <span className="sm:hidden">{shortLabel}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}