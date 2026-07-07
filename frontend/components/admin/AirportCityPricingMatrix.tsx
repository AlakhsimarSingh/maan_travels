"use client";

import { useEffect, useRef, useState } from "react";
import { Plane, ChevronDown } from "lucide-react";
import { API_URL } from "@/src/services/bookingService";

type Vehicle = { id: string; name: string; isTaxiFleet?: boolean };
type City = { id: string; name: string; canPickup: boolean; canDrop: boolean; active: boolean };
type Airport = { id: string; name: string };
type Direction = "TO_AIRPORT" | "FROM_AIRPORT";
type PriceCellData = { cityId: string; vehicleId: string; direction: Direction; price: number };

export default function AirportCityPricingMatrix() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedAirportId, setSelectedAirportId] = useState("");
  const [pricing, setPricing] = useState<PriceCellData[]>([]);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [flashKey, setFlashKey] = useState<string | null>(null);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    loadBase();
  }, []);

  useEffect(() => {
    if (selectedAirportId) loadPricing(selectedAirportId);
  }, [selectedAirportId]);

  const loadBase = async () => {
    try {
      const [r1, r2, r3] = await Promise.all([
        fetch(`${API_URL}/api/airports/all`, { credentials: "include" }),
        fetch(`${API_URL}/api/airport-cities/all`, { credentials: "include" }),
        fetch(`${API_URL}/api/vehicles`, { credentials: "include" }),
      ]);
      const [d1, d2, d3] = await Promise.all([r1.json(), r2.json(), r3.json()]);

      const taxiVehicles = (d3.vehicles || []).filter((v: Vehicle) => v.isTaxiFleet);
      const airportList = d1.airports || [];

      setAirports(airportList);
      setCities((d2.cities || []).filter((c: City) => c.active));
      setVehicles(taxiVehicles);
      if (airportList.length) setSelectedAirportId(airportList[0].id);
    } finally {
      setLoading(false);
    }
  };

  const loadPricing = async (airportId: string) => {
    setLoadingPricing(true);
    try {
      const res = await fetch(`${API_URL}/api/airport-cities/pricing/${airportId}/all`, { credentials: "include" });
      const data = await res.json();
      setPricing(data.pricing || []);
    } finally {
      setLoadingPricing(false);
    }
  };

  const priceFor = (cityId: string, vehicleId: string, direction: Direction) =>
    pricing.find((p) => p.cityId === cityId && p.vehicleId === vehicleId && p.direction === direction)?.price ?? 0;

  const updatePrice = async (cityId: string, vehicleId: string, direction: Direction, price: number) => {
    const key = `${cityId}_${vehicleId}_${direction}`;
    setSavingKey(key);
    try {
      const res = await fetch(`${API_URL}/api/airport-cities/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ airportId: selectedAirportId, cityId, vehicleId, direction, price }),
      });
      const data = await res.json();
      if (data.success) {
        setPricing((prev) => {
          const exists = prev.find((p) => p.cityId === cityId && p.vehicleId === vehicleId && p.direction === direction);
          return exists
            ? prev.map((p) =>
                p.cityId === cityId && p.vehicleId === vehicleId && p.direction === direction ? { ...p, price } : p
              )
            : [...prev, { cityId, vehicleId, direction, price }];
        });
        setFlashKey(key);
        setTimeout(() => setFlashKey(null), 600);
      }
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) return <div className="text-white/60 text-sm">Loading pricing...</div>;
  if (!airports.length) return <div className="text-white/60 text-sm">No airports found. Add an airport first.</div>;
  if (!cities.length) return <div className="text-white/60 text-sm">No cities found. Add a city first.</div>;
  if (!vehicles.length) return <div className="text-white/60 text-sm">No taxi-fleet vehicles found.</div>;

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-center gap-3">
        <Plane size={16} className="text-[#ecb100]" />
        <select
          value={selectedAirportId}
          onChange={(e) => setSelectedAirportId(e.target.value)}
          className="bg-black border border-[#252525] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#ecb100]/60"
        >
          {airports.map((a) => (
            <option key={a.id} value={a.id} className="bg-[#111]">{a.name}</option>
          ))}
        </select>
        {loadingPricing && <span className="text-xs text-white/40">Loading pricing…</span>}
      </div>

      <div className="space-y-3">
        {cities.map((city) => {
          const isOpen = expandedCity === city.id;
          return (
            <div key={city.id} className="border border-[#252525] rounded-2xl bg-[#111] overflow-hidden">
              <button
                onClick={() => setExpandedCity(isOpen ? null : city.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div>
                  <p className="font-bold text-[#ecb100]">{city.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {city.canPickup ? "To Airport" : ""}
                    {city.canPickup && city.canDrop ? " · " : ""}
                    {city.canDrop ? "From Airport" : ""}
                  </p>
                </div>
                <ChevronDown size={18} className={`text-white/40 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="border-t border-[#1d1d1d] px-5 pb-5 pt-2">
                  <div className="hidden sm:grid grid-cols-[1fr_150px_150px] gap-6 text-xs uppercase tracking-wide text-gray-500 mb-2 px-1">
                    <span>Vehicle</span>
                    {city.canPickup && <span>To Airport (₹)</span>}
                    {city.canDrop && <span>From Airport (₹)</span>}
                  </div>

                  {vehicles.map((v) => (
                    <div
                      key={v.id}
                      className="flex flex-col gap-3 py-3.5 px-2 border-t border-[#1d1d1d] rounded-md transition-colors duration-300 hover:bg-white/[0.015] sm:grid sm:grid-cols-[1fr_150px_150px] sm:items-center sm:gap-6 sm:py-3"
                    >
                      <span className="min-w-0 truncate font-medium sm:font-normal">{v.name}</span>

                      {city.canPickup && (
                        <PriceCell
                          cityId={city.id}
                          vehicleId={v.id}
                          direction="TO_AIRPORT"
                          value={priceFor(city.id, v.id, "TO_AIRPORT")}
                          savingKey={savingKey}
                          flashKey={flashKey}
                          inputRefs={inputRefs}
                          onSave={updatePrice}
                          label={`To airport price for ${v.name}, ${city.name}`}
                        />
                      )}
                      {city.canDrop && (
                        <PriceCell
                          cityId={city.id}
                          vehicleId={v.id}
                          direction="FROM_AIRPORT"
                          value={priceFor(city.id, v.id, "FROM_AIRPORT")}
                          savingKey={savingKey}
                          flashKey={flashKey}
                          inputRefs={inputRefs}
                          onSave={updatePrice}
                          label={`From airport price for ${v.name}, ${city.name}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PriceCell({
  cityId,
  vehicleId,
  direction,
  value,
  savingKey,
  flashKey,
  inputRefs,
  onSave,
  label,
}: {
  cityId: string;
  vehicleId: string;
  direction: Direction;
  value: number;
  savingKey: string | null;
  flashKey: string | null;
  inputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onSave: (cityId: string, vehicleId: string, direction: Direction, price: number) => void;
  label: string;
}) {
  const key = `${cityId}_${vehicleId}_${direction}`;
  const isSet = !!value;

  return (
    <div className={`flex items-center gap-2 ${flashKey === key ? "price-flash" : ""}`}>
      <div className="relative flex-1 sm:w-[130px]">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500">₹</span>
        <input
          ref={(el) => { inputRefs.current[key] = el; }}
          defaultValue={value}
          onBlur={(e) => onSave(cityId, vehicleId, direction, Number(e.target.value))}
          type="number"
          min={0}
          inputMode="decimal"
          aria-label={label}
          style={{ fontFamily: "var(--font-geist-mono)" }}
          className={`
            w-full bg-black border rounded-lg pl-5.5 pr-2 py-2 text-right outline-none
            ${isSet ? "border-[#333]" : "border-[#ecb100]/20"}
            focus:border-[#ecb100]/60
          `}
        />
      </div>
      <button
        onClick={() => onSave(cityId, vehicleId, direction, Number(inputRefs.current[key]?.value || 0))}
        disabled={savingKey === key}
        className="shrink-0 px-3 py-2 rounded-lg bg-[#ecb100] text-black text-xs font-medium hover:bg-[#f6c94c] disabled:opacity-50"
      >
        {savingKey === key ? "…" : "Save"}
      </button>
    </div>
  );
}