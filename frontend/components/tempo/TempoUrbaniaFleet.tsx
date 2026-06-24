"use client";

import { useRef, useState } from "react";

import TempoUrbaniaCard from "./TempoUrbaniaCard";
import TempoUrbaniaBookingForm from "./TempoUrbaniaBookingForm";

import type { TempoVehicle } from "@/src/lib/fetchTempoVehicles";

export default function TempoUrbaniaFleet({
  vehicles,
}: {
  vehicles: TempoVehicle[];
}) {
  const [selectedVehicle, setSelectedVehicle] = useState<TempoVehicle | null>(null);

  const bookingRef = useRef<HTMLDivElement>(null);

  const selectVehicle = (vehicle: TempoVehicle) => {
    setSelectedVehicle(vehicle);

    setTimeout(() => {
      bookingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  return (
    <section id="fleet" className="py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <p className="uppercase tracking-[0.3em] text-[#ecb100]">
            Tempo Traveller & Urbania
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white">
            Choose Your Travel Partner
          </h2>

          <p className="mt-4 text-[#8a8a8a]">
            Premium AC travellers with professional chauffeurs.
          </p>
        </div>

        {/* GRID */}
        {vehicles.length === 0 ? (
          <div className="rounded-2xl border border-[#252525] bg-[#141414] p-12 text-center">
            <p className="text-[#8a8a8a]">
              No travellers are available right now. Please check back shortly, or
              contact us directly for availability.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id}>
                <TempoUrbaniaCard
                  vehicle={vehicle}
                  expanded={selectedVehicle?.id === vehicle.id}
                  onBook={() => selectVehicle(vehicle)}
                />
              </div>
            ))}
          </div>
        )}

        {/* BOOKING FORM */}
        {selectedVehicle && (
          <div ref={bookingRef} className="scroll-mt-24">
            <TempoUrbaniaBookingForm
              vehicle={selectedVehicle}
              onClose={() => setSelectedVehicle(null)}
            />
          </div>
        )}
      </div>
    </section>
  );
}