"use client";

import { useEffect, useRef, useState } from "react";
import { Plane } from "lucide-react";
import { API_URL } from "@/src/services/bookingService";

type Vehicle = { id: string; name: string; isTaxiFleet?: boolean };
type Pricing = { vehicleId: string; price: number };
type Airport = { id: string; name: string; pricing: Pricing[] };

export default function AirportPricingMatrix() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [flashKey, setFlashKey] = useState<string | null>(null);

  // Lets the Save button read the input's live DOM value instead of the
  // last-known price from state — onBlur alone covers desktop tabbing away,
  // but on mobile someone is far more likely to type then tap Save directly
  // without blurring first.
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [r1, r2] = await Promise.all([
        fetch(`${API_URL}/api/airports/all`, { credentials: "include" }),
        fetch(`${API_URL}/api/vehicles`, { credentials: "include" }),
      ]);

      const d1 = await r1.json();
      const d2 = await r2.json();

      const taxiVehicles = (d2.vehicles || []).filter((v: Vehicle) => v.isTaxiFleet);

      setAirports(d1.airports || []);
      setVehicles(taxiVehicles);
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = async (airportId: string, vehicleId: string, price: number) => {
    const key = `${airportId}_${vehicleId}`;
    setSavingKey(key);

    try {
      const res = await fetch(`${API_URL}/api/airports/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ airportId, vehicleId, price }),
        credentials: "include"
      });

      const data = await res.json();

      if (data.success) {
        setAirports((prev) =>
          prev.map((a) => {
            if (a.id !== airportId) return a;
            const exists = a.pricing.find((p) => p.vehicleId === vehicleId);
            const newPricing = exists
              ? a.pricing.map((p) => (p.vehicleId === vehicleId ? { ...p, price } : p))
              : [...a.pricing, { vehicleId, price }];
            return { ...a, pricing: newPricing };
          })
        );

        setFlashKey(key);
        setTimeout(() => setFlashKey(null), 600);
      }
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) return <div className="text-white/60 text-sm">Loading pricing...</div>;

  if (!vehicles.length) {
    return <div className="text-white/60 text-sm">No taxi-fleet vehicles found.</div>;
  }

  return (
    <div className="space-y-6 text-white">
      {airports.map((airport, ri) => (
        <div
          key={airport.id}
          style={{ animationDelay: `${Math.min(ri, 10) * 50}ms` }}
          className="card-enter border border-[#252525] rounded-2xl bg-[#111] p-5"
        >
          <h2 className="flex items-center gap-2 font-bold mb-5 text-[#ecb100]">
            <Plane size={16} />
            {airport.name}
          </h2>

          {/* Column headers — desktop only, the mobile stacked layout doesn't need them */}
          <div className="hidden sm:grid grid-cols-[1fr_130px_90px_90px] gap-6 text-xs uppercase tracking-wide text-gray-500 mb-2 px-1">
            <span>Vehicle</span>
            <span>Price</span>
            <span>Status</span>
            <span></span>
          </div>

          {vehicles.map((v) => {
            const existing = airport.pricing.find((p) => p.vehicleId === v.id);
            const key = `${airport.id}_${v.id}`;
            const isSet = !!existing?.price;

            return (
              <div
                key={v.id}
                className={`
                  flex flex-col gap-3 py-3.5 px-2 border-t border-[#1d1d1d] rounded-md
                  transition-colors duration-300 hover:bg-white/[0.015]
                  sm:grid sm:grid-cols-[1fr_130px_90px_90px] sm:items-center sm:gap-6 sm:py-3
                  ${flashKey === key ? "price-flash" : ""}
                `}
              >
                <span className="min-w-0 truncate font-medium sm:font-normal">{v.name}</span>

                {/* On mobile this row groups price + status together; at sm+,
                    `contents` makes the wrapper disappear so its two children
                    drop straight into the desktop grid's price/status columns. */}
                <div className="flex items-center gap-3 sm:contents">
                  <div className="relative flex-1 sm:flex-none sm:w-[130px]">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                      ₹
                    </span>
                    <input
                      ref={(el) => { inputRefs.current[key] = el; }}
                      defaultValue={existing?.price ?? 0}
                      onBlur={(e) => updatePrice(airport.id, v.id, Number(e.target.value))}
                      type="number"
                      min={0}
                      inputMode="decimal"
                      aria-label={`Price for ${v.name} at ${airport.name}`}
                      style={{ fontFamily: "var(--font-geist-mono)" }}
                      className="w-full bg-black border border-[#333] rounded-lg pl-5.5 pr-2 py-2 text-right outline-none focus:border-[#ecb100]/60"
                    />
                  </div>

                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${isSet ? "bg-[#ecb100]" : "border border-gray-500"}`} />
                    {isSet ? "Set" : "Not set"}
                  </span>
                </div>

                <button
                  onClick={() =>
                    updatePrice(airport.id, v.id, Number(inputRefs.current[key]?.value || 0))
                  }
                  disabled={savingKey === key}
                  className="w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded-lg bg-[#ecb100] text-black text-xs font-medium hover:bg-[#f6c94c] disabled:opacity-50"
                >
                  {savingKey === key ? "Saving" : "Save"}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}