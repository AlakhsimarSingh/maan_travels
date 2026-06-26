import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import FleetCard, { type FleetCardViewContext } from "./FleetCard";
import FleetFilter from "./FleetFilter";
import Reveal from "@/components/common/Reveal";

import {
  filterVehicles,
  parseFleetFilterParam,
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

// Static placeholder shown while FleetFilter (a client component using
// useSearchParams) suspends during the initial server render. Sized to
// roughly match the real pill row so there's no layout jump on hydration.
function FleetFilterFallback() {
  return (
    <div className="h-[50px] w-full max-w-md animate-pulse rounded-full border border-[#2a2a2a] bg-[#0d0d0d]" />
  );
}

export default function FleetSection({
  vehicles,
  filterValue,
}: {
  vehicles: Vehicle[];
  filterValue?: string;
}) {
  const activeFilter = parseFleetFilterParam(filterValue);
  const filtered = filterVehicles(vehicles, activeFilter);
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

        <Reveal className="mb-12 flex justify-center" delay={60}>
          <Suspense fallback={<FleetFilterFallback />}>
            <FleetFilter />
          </Suspense>
        </Reveal>

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
      </div>
    </section>
  );
}