import Link from "next/link";
import { ArrowRight } from "lucide-react";

import FleetCard from "./FleetCard";
import Reveal from "@/components/common/Reveal";

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

export default function FleetSection({ vehicles }: { vehicles: Vehicle[] }) {
  const preview = vehicles.slice(0, 6);

  return (
    <section id="fleet" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-14 text-center">
          <p className="mb-3 uppercase tracking-[0.3em] text-[#ecb100]">Our Fleet</p>
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Choose Your Preferred Vehicle
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#8a8a8a]">
            Comfortable sedans, premium SUVs and luxury vehicles for every journey.
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {preview.length > 0 ? (
            preview.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <FleetCard
                  name={item.name}
                  image={item.imageUrl || "/placeholder.jpg"}
                  description={item.description || ""}
                  category={item.category || ""}
                  price={item.isSelfDrive ? (item.rentalPerDay ?? undefined) : (item.price ?? undefined)}
                  isSelfDrive={item.isSelfDrive ?? false}
                  isTaxiFleet={item.isTaxiFleet ?? true}
                  passengerCapacity={item.passengerCapacity ?? undefined}
                />
              </Reveal>
            ))
          ) : (
            <p className="col-span-full text-center text-[#8a8a8a]">
              No vehicles available right now.
            </p>
          )}
        </div>

        {vehicles.length > preview.length && (
          <Reveal delay={preview.length * 80 + 100} className="mt-14 text-center">
            <Link
              href="/fleet"
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