"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import TaxiBookingForm from "@/components/booking/TaxiBookingForm";
import TourBookingForm from "@/components/booking/TourBookingForm";
import AirportTransferForm from "@/components/booking/AirportTransferForm";

import { API_URL } from "@/src/services/bookingService";

type Vehicle = {
  id: string;
  name: string;
  category: string;
  passengerCapacity?: number | null;
  suitcaseCapacity?: number | null;
};

type Category = "Sedan" | "SUV" | "MPV";

export default function BookingForm() {

  const [rideMode, setRideMode] =
    useState<"oneway" | "round" | "local">("oneway");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // ✅ SINGLE SOURCE OF TRUTH
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/vehicles`);
        const data = await res.json();
        setVehicles(data.vehicles || []);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const grouped = useMemo(() => ({
    Sedan: vehicles.filter(v => v.category?.toLowerCase().includes("sedan")),
    SUV: vehicles.filter(v => v.category?.toLowerCase().includes("suv")),
    MPV: vehicles.filter(v => v.category?.toLowerCase().includes("mpv")),
  }), [vehicles]);

  const openCategory = (cat: Category) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveCategory(cat);
  };

  const closeCategory = () => {
    hoverTimeout.current = setTimeout(() => {
      setActiveCategory(null);
    }, 140);
  };

  return (
    <div className="
      mx-auto max-w-5xl rounded-3xl border border-[#252525]
      bg-[#141414] p-8
    ">

      <h2 className="mb-8 text-3xl font-bold text-white">
        Book Your Journey
      </h2>

      <Tabs defaultValue="taxi">

        <TabsList className="mb-8 flex flex-wrap bg-[#111]">

          <TabsTrigger value="taxi">Taxi / Cab</TabsTrigger>
          <TabsTrigger value="airport">Airport Transfer</TabsTrigger>
          <TabsTrigger value="tour">Tour Package</TabsTrigger>

        </TabsList>

        {/* ================= TAXI ================= */}
        <TabsContent value="taxi">

          <div className="space-y-6">

            {/* Ride Mode */}
            <div className="flex gap-4 flex-wrap text-sm">

              {["oneway", "round", "local"].map(mode => (
                <button
                  key={mode}
                  onClick={() => setRideMode(mode as any)}
                  className={`
                    px-4 py-2 rounded-lg border transition
                    ${rideMode === mode
                      ? "bg-[#ecb100] text-black border-[#ecb100]"
                      : "bg-[#111] text-white border-[#252525]"
                    }
                  `}
                >
                  {mode === "oneway" && "One Way"}
                  {mode === "round" && "Round Trip"}
                  {mode === "local" && "Local Ride"}
                </button>
              ))}

            </div>

            {/* ================= FLEET SELECTOR ================= */}
            <div className="grid grid-cols-3 gap-4">

              {(Object.keys(grouped) as Category[]).map(cat => (
                <div key={cat} className="relative">

                  <div
                    onMouseEnter={() => openCategory(cat)}
                    onMouseLeave={closeCategory}
                    className="
                      bg-[#111] border border-[#252525]
                      rounded-xl p-4 cursor-pointer
                      transition hover:border-[#ecb100]/40
                    "
                  >
                    <p className="text-white font-medium">{cat}</p>

                    {selectedVehicle?.category
                      ?.toLowerCase()
                      .includes(cat.toLowerCase()) && (
                      <p className="text-xs text-[#ecb100] mt-1">
                        Selected: {selectedVehicle.name}
                      </p>
                    )}
                  </div>

                  {activeCategory === cat && (
                    <div
                      onMouseEnter={() => openCategory(cat)}
                      onMouseLeave={closeCategory}
                      className="
                        absolute left-0 top-full mt-2 w-full
                        bg-black/95 border border-[#252525]
                        rounded-xl z-50 overflow-hidden
                      "
                    >
                      {grouped[cat].map(v => (
                        <div
                          key={v.id}
                          onClick={() => {
                            setSelectedVehicle(v);
                            setActiveCategory(null);
                          }}
                          className={`
                            px-4 py-3 text-sm cursor-pointer transition
                            ${selectedVehicle?.id === v.id
                              ? "bg-[#1f1f1f] text-[#ecb100]"
                              : "text-white hover:bg-white/5"
                            }
                          `}
                        >
                          {v.name}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}

            </div>

            {/* Details */}
            {selectedVehicle && (
              <div className="
                rounded-xl border border-[#252525]
                bg-black/40 p-4 text-sm text-white
              ">
                <p>Passenger Capacity: {selectedVehicle.passengerCapacity ?? "-"}</p>
                <p>Storage Capacity: {selectedVehicle.suitcaseCapacity ?? "-"}</p>
                <p className="text-[#ecb100] mt-1">
                  Selected: {selectedVehicle.name}
                </p>
              </div>
            )}

            {/* PASS VEHICLE DOWN */}
            <TaxiBookingForm
              rideMode={rideMode}
              selectedVehicleId={selectedVehicle?.id || ""}
            />

          </div>

        </TabsContent>

        <TabsContent value="airport">
          <AirportTransferForm />
        </TabsContent>

        <TabsContent value="tour">
          <TourBookingForm />
        </TabsContent>

      </Tabs>
    </div>
  );
}