"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/src/services/bookingService";

type Vehicle = {
  id: string;
  name: string;
  isTaxiFleet?: boolean;
};

type RoutePricing = { vehicleId: string; price: number };
type Route = { id: string; title: string; pricing: RoutePricing[] };

export default function RoutePricingMatrix() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [flashKey, setFlashKey] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [r1, r2] = await Promise.all([
        fetch(`${API_URL}/api/routes`),
        fetch(`${API_URL}/api/vehicles`),
      ]);

      const d1 = await r1.json();
      const d2 = await r2.json();

      const taxiVehicles = (d2.vehicles || []).filter((v: Vehicle) => v.isTaxiFleet);

      setRoutes(d1.routes || []);
      setVehicles(taxiVehicles);
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = async (routeId: string, vehicleId: string, price: number) => {
    const key = `${routeId}_${vehicleId}`;
    setSavingKey(key);

    try {
      const res = await fetch(`${API_URL}/api/routes/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routeId, vehicleId, price }),
      });

      const data = await res.json();

      if (data.success) {
        setRoutes((prev) =>
          prev.map((r) => {
            if (r.id !== routeId) return r;
            const exists = r.pricing.find((p) => p.vehicleId === vehicleId);
            const newPricing = exists
              ? r.pricing.map((p) => (p.vehicleId === vehicleId ? { ...p, price } : p))
              : [...r.pricing, { vehicleId, price }];
            return { ...r, pricing: newPricing };
          })
        );

        setFlashKey(key);
        setTimeout(() => setFlashKey(null), 600);
      }
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return <div className="text-white/60 text-sm">Loading pricing matrix...</div>;
  }

  if (!vehicles.length) {
    return (
      <div className="text-white/60 text-sm">
        No taxi-fleet vehicles found. Mark vehicles as "Taxi fleet" first.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      {routes.map((route, ri) => (
        <div
          key={route.id}
          style={{ animationDelay: `${Math.min(ri, 10) * 50}ms` }}
          className="card-enter border border-[#252525] rounded-2xl bg-[#111] p-4"
        >
          <h2 className="font-bold mb-4 text-[#ecb100]">{route.title}</h2>

          <div className="grid grid-cols-[1fr_120px_90px_90px] gap-4 text-xs uppercase tracking-wide text-gray-500 mb-1 px-1">
            <span>Vehicle</span>
            <span>Price</span>
            <span>Status</span>
            <span></span>
          </div>

          {vehicles.map((v) => {
            const existing = route.pricing.find((p) => p.vehicleId === v.id);
            const key = `${route.id}_${v.id}`;
            const isSet = !!existing?.price;

            return (
              <div
                key={v.id}
                className={`
                  grid grid-cols-[1fr_120px_90px_90px] gap-4 items-center
                  py-2.5 px-1 border-t border-[#222] rounded-md
                  transition-colors duration-300
                  ${flashKey === key ? "price-flash" : ""}
                `}
              >
                <span className="truncate">{v.name}</span>

                <input
                  defaultValue={existing?.price ?? 0}
                  onBlur={(e) => updatePrice(route.id, v.id, Number(e.target.value))}
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                  className="
                    bg-black border border-[#333] rounded-lg px-2 py-1.5 w-24
                    outline-none transition-colors focus:border-[#ecb100]/60
                  "
                />

                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSet ? "bg-[#ecb100]" : "border border-gray-500"
                    }`}
                  />
                  {isSet ? "Set" : "Not set"}
                </span>

                <button
                  onClick={() => updatePrice(route.id, v.id, existing?.price || 0)}
                  disabled={savingKey === key}
                  className="
                    px-3 py-1.5 rounded-lg bg-[#ecb100] text-black text-xs font-medium
                    transition-transform duration-150
                    hover:bg-[#f6c94c] active:scale-95 disabled:opacity-50
                  "
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