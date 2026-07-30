"use client";

import { useMemo, useState } from "react";
import { CarFront, PlaneTakeoff, Compass, Car, Users } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BookingStep from "@/components/booking/BookingStep";
import TaxiBookingForm from "@/components/booking/TaxiBookingForm";
import TourBookingForm from "@/components/booking/TourBookingForm";
import AirportTransferForm from "@/components/booking/AirportTransferForm";

type Vehicle = {
  id: string;
  name: string;
  category: string;
  passengerCapacity?: number | null;
  suitcaseCapacity?: number | null;
};

type Category = "Sedan" | "SUV" | "MPV";
type RideMode = "oneway" | "round" | "local";

const CATEGORY_ICON: Record<Category, typeof Car> = {
  Sedan: Car,
  SUV: CarFront,
  MPV: Users,
};

const RIDE_MODES: { value: RideMode; label: string }[] = [
  { value: "oneway", label: "One Way" },
  { value: "round", label: "Round Trip" },
  { value: "local", label: "Local Ride" },
];

export default function HeroBookingWidget({ vehicles = [] }: { vehicles?: Vehicle[] }) {
  const [rideMode, setRideMode] = useState<RideMode | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [openStep, setOpenStep] = useState<0 | 1 | 2>(1);
  const [expandedCategory, setExpandedCategory] = useState<Category | null>(null);

  const grouped = useMemo(
    () => ({
      Sedan: vehicles.filter((v) => v.category?.toLowerCase().includes("sedan")),
      SUV: vehicles.filter((v) => v.category?.toLowerCase().includes("suv")),
      MPV: vehicles.filter((v) => v.category?.toLowerCase().includes("mpv")),
    }),
    [vehicles]
  );

  return (
    <div
      id="book"
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[28px] border border-[#252525] bg-black/40 p-5 shadow-[0_0_50px_rgba(236,177,0,0.08)] backdrop-blur-xl"
    >
      <div className="absolute left-0 top-8 h-14 w-1 rounded-r-full bg-[#ecb100]" />

      <p className="mb-1 text-[11px] uppercase tracking-[0.35em] text-[#ecb100]">Quick Booking</p>
      <h2 className="mb-4 text-xl font-bold text-white">Book Your Journey</h2>

      <Tabs defaultValue="taxi" onValueChange={() => { setOpenStep(1); setExpandedCategory(null); }}>
        <TabsList className="mb-4 grid w-full grid-cols-3 gap-1 rounded-full bg-[#111] p-1">
          <TabsTrigger value="taxi" className="flex items-center justify-center gap-1.5 rounded-full text-xs data-[state=active]:bg-[#ecb100] data-[state=active]:text-black">
            <CarFront size={14} /> Taxi
          </TabsTrigger>
          <TabsTrigger value="airport" className="flex items-center justify-center gap-1.5 rounded-full text-xs data-[state=active]:bg-[#ecb100] data-[state=active]:text-black">
            <PlaneTakeoff size={14} /> Airport
          </TabsTrigger>
          <TabsTrigger value="tour" className="flex items-center justify-center gap-1.5 rounded-full text-xs data-[state=active]:bg-[#ecb100] data-[state=active]:text-black">
            <Compass size={14} /> Tour
          </TabsTrigger>
        </TabsList>

        <TabsContent value="taxi">
          <div className="space-y-2.5">
            {/* Step 1 — Ride type */}
            <BookingStep
              index={1}
              title="Ride Type"
              summary={rideMode ? RIDE_MODES.find((m) => m.value === rideMode)?.label : undefined}
              isOpen={openStep === 1}
              isDone={!!rideMode}
              onToggle={() => setOpenStep(openStep === 1 ? 0 : 1)}
            >
              <div className="grid grid-cols-3 gap-2 text-xs">
                {RIDE_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => { setRideMode(mode.value); setOpenStep(2); }}
                    className={`rounded-full border px-2 py-2 font-medium transition-colors ${
                      rideMode === mode.value
                        ? "border-[#ecb100] bg-[#ecb100] text-black"
                        : "border-[#252525] bg-black/40 text-white hover:border-[#ecb100]/40"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </BookingStep>

            {/* Step 2 — Vehicle (inline expand, no absolute flyout) */}
            <BookingStep
              index={2}
              title="Vehicle"
              summary={selectedVehicle ? selectedVehicle.name : undefined}
              isOpen={openStep === 2}
              isDone={!!selectedVehicle}
              onToggle={() => setOpenStep(openStep === 2 ? 0 : 2)}
            >
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(grouped) as Category[]).map((cat) => {
                  const Icon = CATEGORY_ICON[cat];
                  const isActive = expandedCategory === cat;
                  const isSelected = selectedVehicle?.category?.toLowerCase().includes(cat.toLowerCase());
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setExpandedCategory(isActive ? null : cat)}
                      className={`rounded-xl border p-2.5 text-center transition-all duration-200 ${
                        isActive || isSelected
                          ? "border-[#ecb100] bg-[#ecb100]/10"
                          : "border-[#252525] bg-black/40 hover:border-[#ecb100]/40"
                      }`}
                    >
                      <Icon size={16} className={`mx-auto mb-1 ${isActive || isSelected ? "text-[#ecb100]" : "text-[#8a8a8a]"}`} />
                      <p className="text-[11px] font-medium text-white">{cat}</p>
                    </button>
                  );
                })}
              </div>

              {expandedCategory && (
                <div className="mt-2 overflow-hidden rounded-xl border border-[#252525] bg-black/40">
                  {grouped[expandedCategory].length ? (
                    grouped[expandedCategory].map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVehicle(v);
                          setExpandedCategory(null);
                          setOpenStep(0);
                        }}
                        className={`flex w-full items-center justify-between border-b border-[#1c1c1c] px-3 py-2.5 text-left text-xs transition-colors last:border-b-0 ${
                          selectedVehicle?.id === v.id ? "bg-[#1f1f1f] text-[#ecb100]" : "text-white hover:bg-white/5"
                        }`}
                      >
                        <span>{v.name}</span>
                        {v.passengerCapacity && <span className="text-[10px] text-[#8a8a8a]">{v.passengerCapacity} seats</span>}
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2.5 text-xs text-[#8a8a8a]">No vehicles in this category</p>
                  )}
                </div>
              )}
            </BookingStep>

            {/* Step 3+ — handled internally by TaxiBookingForm */}
            <TaxiBookingForm rideMode={rideMode ?? "oneway"} selectedVehicleId={selectedVehicle?.id || ""} startIndex={3} />
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