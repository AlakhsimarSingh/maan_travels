"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, KeyRound, CarFront, LayoutGrid } from "lucide-react";

import FleetCard, { type FleetCardViewContext } from "./FleetCard";
import Reveal from "@/components/common/Reveal";

import {
  countByFilterType,
  filterVehicles,
  type FleetFilterType,
} from "@/src/lib/vehicleCategory";

type Vehicle = {
  id: string;
  name: string;
  imageUrl?: string | null;
  category?: string | null;
  price?: number | null;
  description?: string | null;
  isSelfDrive?: boolean;
  isTaxiFleet?: boolean;
  passengerCapacity?: number | null;
  rentalPerDay?: number | null;
};

const OPTIONS: {
  value: FleetFilterType;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { value: "all",        label: "All Vehicles", icon: LayoutGrid },
  { value: "luxury",     label: "Luxury",       icon: Sparkles   },
  { value: "self-drive", label: "Self Drive",   icon: KeyRound   },
  { value: "taxi",       label: "Taxi Fleet",   icon: CarFront   },
];

function resolveViewContext(
  activeFilter: FleetFilterType,
  vehicle: Vehicle
): FleetCardViewContext {
  if (activeFilter !== "all") return activeFilter;
  if ((vehicle.category || "").toLowerCase().includes("luxury")) return "luxury";
  if (vehicle.isSelfDrive) return "self-drive";
  return "taxi";
}

function resolvePrice(viewContext: FleetCardViewContext, vehicle: Vehicle) {
  if (viewContext === "self-drive") return vehicle.rentalPerDay ?? undefined;
  return vehicle.price ?? undefined;
}

export default function FleetSectionClient({ vehicles }: { vehicles: Vehicle[] }) {
  const [active, setActive] = useState<FleetFilterType>("all");

  const counts = countByFilterType(vehicles);
  const filtered = filterVehicles(vehicles, active);
  const preview = filtered.slice(0, 6);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-10 text-center">
          <p className="mb-3 uppercase tracking-[0.3em] text-[#ecb100]">Our Fleet</p>
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Choose Your Preferred Vehicle
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#8a8a8a]">
            Comfortable sedans, premium SUVs and luxury vehicles for every journey.
          </p>
        </Reveal>

        {/* Filter tabs — local state only, no URL change */}
        <Reveal className="mb-12 flex justify-center" delay={60}>
          <div className="flex items-center gap-1 rounded-full border border-[#2a2a2a] bg-[#0d0d0d] p-1.5 sm:p-2">
            {OPTIONS.map(({ value, label, icon: Icon }) => {
              const isActive = active === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActive(value)}
                  className={`
                    flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5
                    text-[13px] font-medium transition-all duration-200 sm:gap-2 sm:px-5 sm:text-sm
                    ${isActive
                      ? "bg-gradient-to-b from-[#ffd54a] to-[#ecb100] text-black shadow-[0_4px_20px_-2px_rgba(236,177,0,0.65)]"
                      : "text-white/55 hover:text-white/80"
                    }
                  `}
                >
                  <Icon size={14} className={isActive ? "text-black" : "text-[#ecb100]/70"} />
                  {label}
                  <span className="ml-1 text-[11px] opacity-60">
                    {counts[value]}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {preview.length > 0 ? (
            preview.map((item, i) => {
              const viewContext = resolveViewContext(active, item);
              return (
                <Reveal key={item.id} delay={i * 80}>
                  <FleetCard
                    name={item.name}
                    image={item.imageUrl || "/placeholder.jpg"}
                    description={item.description || ""}
                    category={item.category || ""}
                    price={resolvePrice(viewContext, item)}
                    isSelfDrive={item.isSelfDrive ?? false}
                    isTaxiFleet={item.isTaxiFleet ?? true}
                    passengerCapacity={item.passengerCapacity ?? undefined}
                    viewContext={viewContext}
                  />
                </Reveal>
              );
            })
          ) : (
            <p className="col-span-full text-center text-[#8a8a8a]">
              {vehicles.length > 0
                ? "No vehicles match this filter right now."
                : "No vehicles available right now."}
            </p>
          )}
        </div>

        {filtered.length > preview.length && (
          <Reveal delay={preview.length * 80 + 100} className="mt-14 text-center">
            <Link
              href={active === "all" ? "/fleet" : `/fleet?type=${active}`}
              className="group inline-flex items-center gap-2 rounded-full border border-[#ecb100]/40 px-6 py-3 text-sm text-[#ecb100] transition-all duration-200 hover:border-[#ecb100] hover:bg-[#ecb100]/5"
            >
              View Full Fleet
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}