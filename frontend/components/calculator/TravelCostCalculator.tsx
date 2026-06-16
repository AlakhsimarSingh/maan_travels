"use client";

import { useState, useEffect } from "react";

import ServiceSelector from "./ServiceSelector";
import VehicleSelector from "./VehicleSelector";

import { travelPricing } from "@/src/data/pricing";

import CalculatorStep from "./CalculatorStep";
import FairResult from "./FairResult";

export default function TravelCostCalculator() {
  const [service, setService] =
    useState<"taxi" | "group" | "luxury">("taxi");

  const [vehicle, setVehicle] = useState("");
  const [days, setDays] = useState(1);
  const [distance, setDistance] = useState(100);

  // 🌍 Mappls states
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [liveDistance, setLiveDistance] = useState<number | null>(null);

  useEffect(() => {
    setVehicle("");
  }, [service]);

  const vehicles =
    travelPricing[service as keyof typeof travelPricing];

  const selectedVehicle = vehicles.find(
    (item: any) => item.id === vehicle
  );

  // 🚀 Fetch distance from Mappls API
  const fetchDistance = async () => {
    if (!origin || !destination) return;

    setLoading(true);

    try {
      const res = await fetch("/api/distance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin,
          destination,
        }),
      });

      const data = await res.json();

      if (data?.distanceKm) {
        setLiveDistance(data.distanceKm);

        // 🔥 auto-feed pricing engine
        setDistance(data.distanceKm);
      }
    } catch (err) {
      console.error("Distance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

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

        {/* MAIN BOX */}
        <div className="mt-12 rounded-3xl border border-[#252525] bg-[#141414] p-8">

          {/* STEP 1 */}
          <CalculatorStep step={1} title="Choose Service & Vehicle">
            <ServiceSelector
              selected={service}
              setSelected={setService}
            />

            <VehicleSelector
              vehicles={vehicles}
              selected={vehicle}
              setSelected={setVehicle}
            />
          </CalculatorStep>

          {/* STEP 2 - MAPPLS ROUTE */}
          <CalculatorStep step={2} title="Journey Details">

            <div className="grid gap-4">

              <input
                placeholder="From (e.g. Amritsar)"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full rounded-xl border border-[#252525] bg-black/40 p-3 text-white"
              />

              <input
                placeholder="To (e.g. Dalhousie)"
                value={destination}
                onChange={(e) =>
                  setDestination(e.target.value)
                }
                className="w-full rounded-xl border border-[#252525] bg-black/40 p-3 text-white"
              />

              <button
                onClick={fetchDistance}
                className="rounded-xl bg-[#ecb100] px-4 py-3 font-semibold text-black"
              >
                {loading
                  ? "Calculating Route..."
                  : "Get Distance"}
              </button>

              {liveDistance !== null && (
                <p className="text-sm text-[#8a8a8a]">
                  Distance:{" "}
                  {liveDistance.toFixed(2)} km
                </p>
              )}

            </div>
          </CalculatorStep>

          {/* STEP 3 - RESULT */}
          <CalculatorStep step={3} title="Estimated Fare">
            <FairResult
              selectedVehicle={selectedVehicle}
              service={service}
              distance={distance}
              days={days}
            />
          </CalculatorStep>

        </div>
      </div>
    </section>
  );
}