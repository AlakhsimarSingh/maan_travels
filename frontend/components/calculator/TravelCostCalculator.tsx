"use client";

import { useState, useEffect } from "react";

import ServiceSelector from "./ServiceSelector";
import VehicleSelector from "./VehicleSelector";
import CalculatorResult from "./CalculatorResult";

import { travelPricing } from "@/src/data/pricing";

export default function TravelCostCalculator() {
  const [service, setService] =
    useState<"taxi" | "group" | "luxury">("taxi");

  const [vehicle, setVehicle] = useState("");
  const [days, setDays] = useState(1);
  const [distance, setDistance] = useState(100);

  useEffect(() => {
    setVehicle("");
  }, [service]);

  const vehicles =
    travelPricing[service as keyof typeof travelPricing];

  const selectedVehicle = vehicles.find(
    (item: any) => item.id === vehicle
  );

  const calculatePrice = () => {
    if (!selectedVehicle) return 0;

    if (service === "taxi") {
      return (
      selectedVehicle.base +
        distance * selectedVehicle.perKm
      );
    }

    return selectedVehicle.perDay * days;
  };

  const amount = calculatePrice();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">

        {/* HEADER */}
        <div className="text-center">
          <p className="uppercase tracking-[0.3em] text-sm text-[#ecb100]">
            Travel Calculator
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white">
            Estimate Your Trip Cost
          </h2>
        </div>

        {/* BOX */}
        <div className="mt-12 rounded-3xl border border-[#252525] bg-[#141414] p-8">

          <ServiceSelector
            selected={service}
            setSelected={(value) =>
              setService(value as any)
            }
          />

          <VehicleSelector
            vehicles={vehicles}
            selected={vehicle}
            setSelected={setVehicle}
          />

          {/* INPUTS */}
          {service === "taxi" ? (
            <div className="mt-8">
              <label className="text-sm text-[#8a8a8a]">
                Approx Distance (KM)
              </label>

              <input
                type="number"
                value={distance}
                onChange={(e) =>
                  setDistance(Number(e.target.value))
                }
                className="mt-2 w-full rounded-xl border border-[#252525] bg-black/40 p-3 text-white"
              />
            </div>
          ) : (
            <div className="mt-8">
              <label className="text-sm text-[#8a8a8a]">
                Number of Days
              </label>

              <input
                type="number"
                value={days}
                onChange={(e) =>
                  setDays(Number(e.target.value))
                }
                className="mt-2 w-full rounded-xl border border-[#252525] bg-black/40 p-3 text-white"
              />
            </div>
          )}

          <CalculatorResult amount={amount} />
        </div>
      </div>
    </section>
  );
}