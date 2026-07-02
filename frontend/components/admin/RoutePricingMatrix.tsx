"use client";

import { useEffect, useState, useRef } from "react";
import { Check, Loader2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { API_URL } from "@/src/services/bookingService";

type Vehicle = { id: string; name: string; isTaxiFleet?: boolean };
type RoutePricing = { vehicleId: string; price: number };
type Route = { id: string; title: string; category?: string; pricing: RoutePricing[] };

const CATEGORY_LABELS: Record<string, string> = {
  destination: "Destinations",
  one_way: "One Way",
  local: "Local",
  airport: "Airport",
  tour: "Tour",
};

export default function RoutePricingMatrix() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // localValues holds per-cell edited values before save
  const [localValues, setLocalValues] = useState<Record<string, number>>({});

  useEffect(() => { loadData(); }, []);

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

      // Pre-populate localValues
      const init: Record<string, number> = {};
      for (const route of d1.routes || []) {
        for (const v of taxiVehicles) {
          const key = `${route.id}_${v.id}`;
          const existing = route.pricing.find((p: RoutePricing) => p.vehicleId === v.id);
          init[key] = existing?.price ?? 0;
        }
      }
      setLocalValues(init);
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = async (routeId: string, vehicleId: string) => {
    const key = `${routeId}_${vehicleId}`;
    const price = localValues[key] ?? 0;
    setSavingKey(key);

    try {
      const res = await fetch(`${API_URL}/api/routes/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routeId, vehicleId, price }),
        credentials: "include",
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
        setSavedKey(key);
        setTimeout(() => setSavedKey(null), 1500);
      }
    } finally {
      setSavingKey(null);
    }
  };

  const toggleCollapse = (id: string) =>
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredRoutes = routes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const grouped = filteredRoutes.reduce<Record<string, Route[]>>((acc, r) => {
    const cat = r.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="space-y-3 max-w-4xl mx-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-[#111] border border-[#1c1c1c] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!vehicles.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#252525] py-16 text-center text-sm text-[#444]">
        No taxi-fleet vehicles found. Mark vehicles as "Taxi fleet" first.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28 md:pb-10">

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search routes…"
          className="w-full rounded-xl border border-[#1c1c1c] bg-[#111] py-2.5 pl-9 pr-4 text-sm text-white outline-none placeholder:text-[#333] focus:border-[#ecb100]/40"
        />
      </div>

      {filteredRoutes.length === 0 && (
        <div className="py-12 text-center text-sm text-[#444]">No routes match your search.</div>
      )}

      {/* Grouped sections */}
      {Object.entries(grouped).map(([cat, catRoutes]) => (
        <div key={cat}>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#333]">
            {CATEGORY_LABELS[cat] ?? cat}
          </p>

          <div className="space-y-3">
            {catRoutes.map((route) => {
              const isCollapsed = collapsed[route.id];
              const setPrices = route.pricing.filter((p) => p.price > 0).length;

              return (
                <div
                  key={route.id}
                  className="rounded-2xl border border-[#1c1c1c] bg-[#111] overflow-hidden"
                >
                  {/* Route header — tap to collapse */}
                  <button
                    onClick={() => toggleCollapse(route.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#161616] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{route.title}</p>
                      <p className="text-[11px] text-[#444] mt-0.5">
                        {setPrices} / {vehicles.length} vehicles priced
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      {/* Progress pill */}
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="w-20 h-1 rounded-full bg-[#1c1c1c] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#ecb100] transition-all duration-500"
                            style={{ width: `${vehicles.length ? (setPrices / vehicles.length) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[#444]">
                          {vehicles.length ? Math.round((setPrices / vehicles.length) * 100) : 0}%
                        </span>
                      </div>
                      {isCollapsed
                        ? <ChevronDown size={15} className="text-[#444]" />
                        : <ChevronUp size={15} className="text-[#444]" />
                      }
                    </div>
                  </button>

                  {/* Vehicle rows */}
                  {!isCollapsed && (
                    <div className="border-t border-[#1a1a1a]">
                      {vehicles.map((v, vi) => {
                        const key = `${route.id}_${v.id}`;
                        const isSet = (route.pricing.find((p) => p.vehicleId === v.id)?.price ?? 0) > 0;
                        const isSaving = savingKey === key;
                        const isSaved = savedKey === key;
                        const currentVal = localValues[key] ?? 0;

                        return (
                          <div
                            key={v.id}
                            className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                              vi > 0 ? "border-t border-[#141414]" : ""
                            } ${isSaved ? "bg-[#ecb100]/5" : "hover:bg-[#161616]"}`}
                          >
                            {/* Vehicle name */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{v.name}</p>
                              {/* Mobile: status below name */}
                              <p className={`text-[10px] mt-0.5 sm:hidden ${isSet ? "text-[#ecb100]" : "text-[#333]"}`}>
                                {isSet ? `₹${(route.pricing.find(p => p.vehicleId === v.id)?.price ?? 0).toLocaleString("en-IN")} set` : "Not set"}
                              </p>
                            </div>

                            {/* Status dot (desktop) */}
                            <div className="hidden sm:flex items-center gap-1.5 w-16 shrink-0">
                              <span className={`h-1.5 w-1.5 rounded-full ${isSet ? "bg-[#ecb100]" : "border border-[#333]"}`} />
                              <span className="text-xs text-[#444]">{isSet ? "Set" : "—"}</span>
                            </div>

                            {/* Price input */}
                            <div className="relative shrink-0">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#444]">₹</span>
                              <input
                                type="number"
                                value={currentVal === 0 ? "" : currentVal}
                                placeholder="0"
                                onChange={(e) =>
                                  setLocalValues((prev) => ({
                                    ...prev,
                                    [key]: Number(e.target.value),
                                  }))
                                }
                                onKeyDown={(e) => e.key === "Enter" && updatePrice(route.id, v.id)}
                                style={{ fontFamily: "var(--font-geist-mono)" }}
                                className="w-24 sm:w-28 rounded-lg border border-[#1c1c1c] bg-[#0d0d0d] py-2 pl-6 pr-2 text-sm text-white outline-none focus:border-[#ecb100]/50 transition-colors"
                              />
                            </div>

                            {/* Save button */}
                            <button
                              onClick={() => updatePrice(route.id, v.id)}
                              disabled={isSaving}
                              className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all active:scale-95 disabled:opacity-50 ${
                                isSaved
                                  ? "bg-green-500/15 text-green-400"
                                  : "bg-[#ecb100] text-black hover:bg-[#f6c94c]"
                              }`}
                            >
                              {isSaving ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : isSaved ? (
                                <Check size={13} />
                              ) : (
                                <span className="text-[11px] font-bold">↵</span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}