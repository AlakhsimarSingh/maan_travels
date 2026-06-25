"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, ArrowUpRight, Car, Plane, Star, Route } from "lucide-react";

export type FleetCardViewContext = "luxury" | "self-drive" | "taxi" | "default";

type FleetCardProps = {
  name: string;
  image: string;
  description: string;
  capacity?: string;
  category?: string;
  price?: number;
  isSelfDrive?: boolean;
  isTaxiFleet?: boolean;
  passengerCapacity?: number;
  // Which filter context this card is currently being rendered under.
  // Needed because a vehicle can be BOTH self-drive and taxi-fleet at
  // once (e.g. Innova Crysta) — in that case the right price/label
  // depends on which filter view the user is looking at, not on the
  // vehicle's raw flags alone. Defaults to "default" for call sites
  // that don't pass a filter context (keeps old behavior for those).
  viewContext?: FleetCardViewContext;
};

function getPriceLabel(
  category: string,
  viewContext: FleetCardViewContext
): { label: string; icon: React.ReactNode } | null {
  const cat = category.toLowerCase();

  // View context wins when explicitly known — this is what lets a dual
  // self-drive + taxi vehicle show "/day rental" under Self Drive and
  // "/trip" under Taxi Fleet, instead of one fixed label everywhere.
  if (viewContext === "self-drive") return { label: "/day rental", icon: <Car size={11} /> };
  if (viewContext === "luxury") return { label: "/event", icon: <Star size={11} /> };
  if (viewContext === "taxi") {
    if (cat.includes("tempo") || cat.includes("urbania")) {
      return { label: "/trip", icon: <Route size={11} /> };
    }
    return { label: "/trip", icon: <Plane size={11} /> };
  }

  // Fallback for call sites that don't know/pass a filter context yet —
  // preserves the original single-flag-based guess.
  if (cat.includes("luxury")) return { label: "/event", icon: <Star size={11} /> };
  if (cat.includes("tempo") || cat.includes("urbania")) {
    return { label: "/trip", icon: <Route size={11} /> };
  }
  return { label: "/trip", icon: <Plane size={11} /> };
}

function getCategoryBadge(category: string, viewContext: FleetCardViewContext): string {
  const cat = category.toLowerCase();
  if (viewContext === "self-drive") return "Self Drive";
  if (viewContext === "luxury") return "Luxury";
  if (cat.includes("tempo") || cat.includes("urbania")) return "Traveller";
  if (cat.includes("suv")) return "SUV";
  if (cat.includes("sedan")) return "Sedan";
  if (cat.includes("mpv")) return "MPV";
  if (cat.includes("hatchback")) return "Hatchback";
  return category;
}

export default function FleetCard({
  name,
  image,
  description,
  capacity,
  category = "",
  price,
  isSelfDrive = false,
  isTaxiFleet = true,
  passengerCapacity,
  viewContext = "default",
}: FleetCardProps) {
  const router = useRouter();

  const handleNavigation = () => {
    const cat = category.toLowerCase();

    if (isSelfDrive || cat.includes("self")) {
      router.push("/self-drive");
      return;
    }
    if (cat.includes("luxury")) {
      router.push("/luxury-cars");
      return;
    }
    if (cat.includes("tempo") || cat.includes("urbania")) {
      router.push("/tempo-traveller-urbania");
      return;
    }
    if (
      isTaxiFleet ||
      cat.includes("mpv") ||
      cat.includes("sedan") ||
      cat.includes("suv") ||
      cat.includes("hatchback")
    ) {
      router.push("/go-taxi");
      return;
    }

    router.push("/fleet");
  };

  const priceInfo = price ? getPriceLabel(category, viewContext) : null;

  const badgeLabel = getCategoryBadge(category, viewContext);
  const displayCapacity =
    capacity || (passengerCapacity ? `${passengerCapacity} passengers` : null);

  return (
    <div
      className="
        group overflow-hidden rounded-3xl border border-[#252525]
        bg-[#141414] transition-all duration-300 cursor-pointer
        hover:border-[#ecb100] hover:shadow-[0_0_35px_rgba(236,177,0,0.18)]
        active:scale-[0.98]
        translate-y-0 hover:-translate-y-1.5
      "
      onClick={handleNavigation}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleNavigation()}
      aria-label={`View details for ${name}`}
    >
      {/* IMAGE */}
      <div className="relative h-56 overflow-hidden sm:h-64">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

        {/* TOP-LEFT: category badge only */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full border border-[#ecb100]/30 bg-[#ecb100]/10 px-3 py-1 text-xs text-[#ecb100] backdrop-blur-sm">
            {badgeLabel}
          </span>
        </div>

        {/* BOTTOM: price with context label */}
        {price && priceInfo && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
            <span className="opacity-50">{priceInfo.icon}</span>
            <span className="font-semibold">
              ₹{price.toLocaleString("en-IN")}
            </span>
            <span className="text-[#8a8a8a]">{priceInfo.label}</span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5 sm:p-6">
        <h3 className="text-lg font-bold text-white sm:text-xl">{name}</h3>

        {/* description — the actual vehicle description text, not the category */}
        {description && description !== category && (
          <p className="mt-1.5 line-clamp-2 text-sm text-[#8a8a8a]">
            {description}
          </p>
        )}

        {displayCapacity && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#ecb100]/80">
            <Users size={13} />
            {displayCapacity}
          </div>
        )}

        {/* 
          Button is purely decorative/visual — the entire card is the click target.
          pointer-events-none prevents it from swallowing touch events on mobile
          which was causing the dead zone on the lower 50% of the screen.
        */}
        <div
          className="
            mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl
            border border-[#ecb100] py-2.5 text-sm text-[#ecb100]
            transition-all duration-200
            group-hover:bg-[#ecb100] group-hover:text-black
            pointer-events-none select-none
          "
          aria-hidden="true"
        >
          View Details
          <ArrowUpRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </div>
  );
}