"use client";

import { useEffect, useState } from "react";
import { Calculator, MapPin, Navigation, Loader2 } from "lucide-react";

import VehicleSelector from "./VehicleSelector";
import CalculatorStep from "./CalculatorStep";
import FareResult from "./FareResult";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

type Vehicle = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string | null;
};

export default function TravelCostCalculator() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicle, setVehicle] = useState("");
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState<"oneway" | "round">("oneway");

  const [loadingDistance, setLoadingDistance] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [routeError, setRouteError] = useState("");
  const [routeMeta, setRouteMeta] = useState<{ origin: string; destination: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoadingVehicles(true);
        const res = await fetch(`${API_URL}/api/vehicles`);
        const data = await res.json();
        const taxiOnly = (data?.vehicles || []).filter((v: any) => v.isTaxiFleet);
        setVehicles(taxiOnly);
      } catch (err) {
        console.error("Failed to load vehicles", err);
      } finally {
        setLoadingVehicles(false);
      }
    })();
  }, []);

  const selectedVehicle = vehicles.find((v) => v.id === vehicle);

  const fetchDistance = async () => {
    if (!origin || !destination) {
      setRouteError("Enter both a starting point and a destination.");
      return;
    }

    setRouteError("");
    setLoadingDistance(true);
    setDistance(null);

    try {
      const res = await fetch("/api/distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination }),
      });

      const data = await res.json();

      if (!data.success) {
        setRouteError(data.message || "Couldn't calculate the distance.");
        return;
      }

      setDistance(data.distanceKm);
      setRouteMeta({ origin: data.origin, destination: data.destination });
    } catch (err) {
      console.error("Distance fetch error:", err);
      setRouteError("Couldn't reach the routing service. Please try again.");
    } finally {
      setLoadingDistance(false);
    }
  };

  const effectiveDistance = distance ? (tripType === "round" ? distance * 2 : distance) : null;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* HEADER */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#ecb100]">
            Free Travel Calculator
          </p>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            Estimate Your Trip Cost
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#8a8a8a]">
            Get an instant, no-obligation fare estimate for any taxi route — powered by real
            road distance, current fuel prices and toll estimates.
          </p>
          <p className="mx-auto mt-3 max-w-lg text-xs text-[#666]">
            This is a free planning tool only — figures are an approximate trip cost and exclude
            service charges, taxes and driver allowance. It does not represent Maan Travels'
            official pricing.
          </p>
        </div>

        {/* MAIN BOX */}
        <div className="mt-12 rounded-3xl border border-[#252525] bg-[#141414] p-6 sm:p-8">

          {/* STEP 1 — ROUTE */}
          <CalculatorStep step={1} title="Where are you going?">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <MapPin
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100]"
                  aria-hidden="true"
                />
                <input
                  aria-label="Starting point"
                  placeholder="From (e.g. Jalandhar)"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchDistance()}
                  className="h-12 w-full rounded-xl border border-[#252525] bg-black/40 pl-11 pr-4 text-white outline-none transition-colors focus:border-[#ecb100]"
                />
              </div>

              <div className="relative">
                <Navigation
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100]"
                  aria-hidden="true"
                />
                <input
                  aria-label="Destination"
                  placeholder="To (e.g. Dalhousie)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchDistance()}
                  className="h-12 w-full rounded-xl border border-[#252525] bg-black/40 pl-11 pr-4 text-white outline-none transition-colors focus:border-[#ecb100]"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div
                className="flex rounded-xl border border-[#252525] bg-black/30 p-1"
                role="group"
                aria-label="Trip type"
              >
                {(["oneway", "round"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTripType(t)}
                    aria-pressed={tripType === t}
                    className={`rounded-lg px-4 py-2 text-sm transition-colors duration-200 ${
                      tripType === t
                        ? "bg-[#ecb100] text-black"
                        : "text-[#8a8a8a] hover:text-white"
                    }`}
                  >
                    {t === "oneway" ? "One way" : "Round trip"}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchDistance}
                disabled={loadingDistance}
                aria-label="Calculate distance and fare estimate"
                className="flex items-center gap-2 rounded-xl bg-[#ecb100] px-5 py-3 font-semibold text-black transition-all duration-200 hover:bg-[#f6c94c] active:scale-[0.98] disabled:opacity-60"
              >
                {loadingDistance ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Calculating route...
                  </>
                ) : (
                  <>
                    <Calculator size={16} aria-hidden="true" />
                    Get Distance
                  </>
                )}
              </button>
            </div>

            {routeError && (
              <p
                role="alert"
                className="mt-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400"
              >
                {routeError}
              </p>
            )}

            {distance !== null && routeMeta && (
              <div className="mt-4 rounded-xl border border-[#ecb100]/30 bg-[#ecb100]/5 px-4 py-3 text-sm">
                <p className="text-white">
                  <span className="text-[#ecb100]">{distance} km</span> one-way
                  {tripType === "round" && (
                    <span className="text-[#8a8a8a]">
                      {" "}· {effectiveDistance} km round trip
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs text-[#666]">
                  Route distance via OpenStreetMap — actual road distance may vary slightly.
                </p>
              </div>
            )}
          </CalculatorStep>

          {/* STEP 2 — VEHICLE */}
          <CalculatorStep step={2} title="Choose your vehicle">
            {loadingVehicles ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-2xl bg-black/30" />
                ))}
              </div>
            ) : (
              <VehicleSelector
                vehicles={vehicles}
                selected={vehicle}
                setSelected={setVehicle}
              />
            )}
          </CalculatorStep>

          {/* STEP 3 — RESULT */}
          <CalculatorStep step={3} title="Estimated fare">
            <FareResult
              selectedVehicle={selectedVehicle}
              distance={effectiveDistance}
              tripType={tripType}
            />
          </CalculatorStep>
        </div>

        {/* SEO-friendly explainer content */}
        <div className="mt-10 grid gap-6 text-sm text-[#8a8a8a] sm:grid-cols-3">
          <div className="rounded-2xl border border-[#252525] bg-black/20 p-5">
            <p className="font-medium text-white">Real road distance</p>
            <p className="mt-1.5 leading-6">
              Distance is calculated using actual road routing via OpenStreetMap, not a
              straight-line estimate.
            </p>
          </div>
          <div className="rounded-2xl border border-[#252525] bg-black/20 p-5">
            <p className="font-medium text-white">Live fuel pricing</p>
            <p className="mt-1.5 leading-6">
              Fuel cost factors in current petrol/diesel rates and each vehicle category's
              real-world mileage.
            </p>
          </div>
          <div className="rounded-2xl border border-[#252525] bg-black/20 p-5">
            <p className="font-medium text-white">Toll-inclusive estimate</p>
            <p className="mt-1.5 leading-6">
              Highway toll charges are factored in based on typical plaza frequency for your
              route distance.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#555]">
          Map data © OpenStreetMap contributors. This calculator gives an indicative trip cost
          only — final pricing, including any service charges, is confirmed by our team.
        </p>
      </div>
    </section>
  );
}