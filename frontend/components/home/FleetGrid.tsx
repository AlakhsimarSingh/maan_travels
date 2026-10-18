"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

import FleetCard, { type FleetCardViewContext } from "./FleetCard";
import Reveal from "@/components/common/Reveal";

import {
  FLEET_FILTER_PARAM,
  filterVehicles,
  parseFleetFilterParam,
  type FleetFilterType,
} from "@/src/lib/vehicleCategory";

export type FleetVehicle = {
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

function resolveViewContext(
  activeFilter: FleetFilterType,
  vehicle: FleetVehicle
): FleetCardViewContext {
  if (activeFilter !== "all") return activeFilter;
  if ((vehicle.category || "").toLowerCase().includes("luxury")) return "luxury";
  if (vehicle.isSelfDrive) return "self-drive";
  return "taxi";
}

function resolvePrice(viewContext: FleetCardViewContext, vehicle: FleetVehicle) {
  if (viewContext === "self-drive") return vehicle.rentalPerDay ?? undefined;
  return vehicle.price ?? undefined;
}

export default function FleetGrid({
  vehicles,
  activeFilter,
}: {
  vehicles: FleetVehicle[];
  activeFilter: FleetFilterType;
}) {
  const filtered = filterVehicles(vehicles, activeFilter);
  const preview = filtered.slice(0, 6);

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {preview.length > 0 ? (
          preview.map((item, i) => {
            const viewContext = resolveViewContext(activeFilter, item);
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
            href={activeFilter === "all" ? "/fleet" : `/fleet?type=${activeFilter}`}
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
    </>
  );
}

// Reads the `?type=` filter on the client so the homepage itself can stay
// statically rendered. Must be wrapped in <Suspense>.
export function FleetGridFromParams({ vehicles }: { vehicles: FleetVehicle[] }) {
  const searchParams = useSearchParams();
  const activeFilter = parseFleetFilterParam(searchParams.get(FLEET_FILTER_PARAM));
  return <FleetGrid vehicles={vehicles} activeFilter={activeFilter} />;
}
