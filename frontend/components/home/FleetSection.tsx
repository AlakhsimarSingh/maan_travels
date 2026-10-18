import { Suspense } from "react";

import FleetFilter from "./FleetFilter";
import FleetGrid, { FleetGridFromParams, type FleetVehicle } from "./FleetGrid";
import Reveal from "@/components/common/Reveal";

// Static placeholder shown while FleetFilter (a client component using
// useSearchParams) suspends during the initial server render. Sized to
// roughly match the real pill row so there's no layout jump on hydration.
function FleetFilterFallback() {
  return (
    <div className="h-[50px] w-full max-w-md animate-pulse rounded-full border border-[#2a2a2a] bg-[#0d0d0d]" />
  );
}

export default function FleetSection({ vehicles }: { vehicles: FleetVehicle[] }) {
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

        {/* The unfiltered grid is prerendered into the HTML; the client
            swaps in the filtered grid if `?type=` is present. */}
        <Suspense fallback={<FleetGrid vehicles={vehicles} activeFilter="all" />}>
          <FleetGridFromParams vehicles={vehicles} />
        </Suspense>
      </div>
    </section>
  );
}
