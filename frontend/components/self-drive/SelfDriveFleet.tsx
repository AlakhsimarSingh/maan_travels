"use client";

import { useEffect, useRef, useState } from "react";

import SelfDriveCard from "./SelfDriveCard";
import SelfDriveBookingForm from "./SelfDriveBookingForm";

import { getActiveVehicles } from "@/src/services/vehicleService";

export default function SelfDriveFleet() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [bookingVehicle, setBookingVehicle] = useState<any | null>(null);

  const bookingRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- FETCH SELF DRIVE VEHICLES ---------------- */
  const fetchVehicles = async () => {
    try {
      setLoading(true);

      const res = await getActiveVehicles();

      if (res?.success) {
        const selfDriveVehicles = (res.vehicles || []).filter(
          (v: any) => v.isSelfDrive === true && v.available === true
        );

        setVehicles(selfDriveVehicles);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error("Self drive fetch error:", err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <section id="fleet" className="py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* HEADER */}
        <div className="mb-14 text-center">
          <p className="uppercase tracking-[0.3em] text-[#ecb100]">Self Drive Rentals</p>

          <h2 className="mt-4 text-4xl font-bold text-white">Choose Your Perfect Vehicle</h2>

          <p className="mt-4 text-[#8a8a8a]">
            Premium vehicles available for flexible self-drive rentals.
          </p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-[#1b1b1b] animate-pulse" />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="rounded-2xl border border-[#252525] bg-[#141414] p-12 text-center">
            <p className="text-[#8a8a8a]">
              No self-drive vehicles are available right now. Please check back shortly.
            </p>
          </div>
        ) : (
          /* VEHICLE GRID */
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => {
              const isSelected = selectedVehicle === vehicle.id;

              return (
                <div
                  key={vehicle.id}
                  className={isSelected ? "lg:col-span-3 md:col-span-2" : ""}
                >
                  <SelfDriveCard
                    vehicle={vehicle}
                    expanded={isSelected}
                    onToggle={() => {
                      setSelectedVehicle(isSelected ? null : vehicle.id);
                    }}
                    onBook={() => {
                      setBookingVehicle(vehicle);

                      setTimeout(() => {
                        bookingRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 100);
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* BOOKING FORM */}
        {bookingVehicle && (
          <div ref={bookingRef} className="mt-20 scroll-mt-24">
            <SelfDriveBookingForm
              vehicle={bookingVehicle}
              onClose={() => setBookingVehicle(null)}
            />
          </div>
        )}
      </div>
    </section>
  );
}