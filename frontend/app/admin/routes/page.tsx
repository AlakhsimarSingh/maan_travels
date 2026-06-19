"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/src/services/bookingService";

type Route = {
  id: string;
  title: string;
  from: string;
  to: string;
  category: "destination" | "one_way" | "local" | "airport" | "tour";
  baseType: "taxi" | "airport" | "tour";
  pricing: { price: number }[];
};

export default function RoutesAdminPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    from: "",
    to: "",
    category: "destination",
    baseType: "taxi",
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/routes`);
      const data = await res.json();
      setRoutes(data.routes || []);
    } catch {
      setError("Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  const createRoute = async () => {
    setError("");

    if (!form.title || !form.category || !form.baseType) {
      setError("Title, category, and base type are required");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to create route");
        return;
      }

      setForm({ title: "", from: "", to: "", category: "destination", baseType: "taxi" });
      fetchRoutes();
    } catch {
      setError("Failed to create route");
    }
  };

  const deleteRoute = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/routes/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to delete route");
        return;
      }

      fetchRoutes();
    } catch {
      setError("Failed to delete route");
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Loading routes...</div>;
  }

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Route management</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* CREATE ROUTE */}
      <div className="bg-[#111] border border-[#252525] p-5 rounded-2xl grid gap-3 md:grid-cols-2">
        <input
          className="p-2.5 bg-black border border-[#252525] rounded-lg outline-none transition-colors focus:border-[#ecb100]/60"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="p-2.5 bg-black border border-[#252525] rounded-lg outline-none transition-colors focus:border-[#ecb100]/60"
          placeholder="From"
          value={form.from}
          onChange={(e) => setForm({ ...form, from: e.target.value })}
        />

        <input
          className="p-2.5 bg-black border border-[#252525] rounded-lg outline-none transition-colors focus:border-[#ecb100]/60"
          placeholder="To"
          value={form.to}
          onChange={(e) => setForm({ ...form, to: e.target.value })}
        />

        <select
          className="p-2.5 bg-black border border-[#252525] rounded-lg outline-none transition-colors focus:border-[#ecb100]/60"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="destination">Destination</option>
          <option value="one_way">One way</option>
          <option value="local">Local</option>
          <option value="airport">Airport</option>
          <option value="tour">Tour</option>
        </select>

        <select
          className="p-2.5 bg-black border border-[#252525] rounded-lg outline-none transition-colors focus:border-[#ecb100]/60"
          value={form.baseType}
          onChange={(e) => setForm({ ...form, baseType: e.target.value })}
        >
          <option value="taxi">Taxi</option>
          <option value="airport">Airport</option>
          <option value="tour">Tour</option>
        </select>

        <button
          onClick={createRoute}
          className="
            md:col-span-2 bg-[#ecb100] text-black p-2.5 rounded-lg font-medium
            transition-transform duration-150
            hover:bg-[#f6c94c] active:scale-[0.99]
          "
        >
          Create route
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {routes.map((r, i) => {
          const lowestPrice = r.pricing?.length
            ? Math.min(...r.pricing.map((p) => p.price))
            : null;

          return (
            <div
              key={r.id}
              style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
              className="
                card-enter flex items-center justify-between
                bg-[#111] border border-[#252525] p-4 rounded-xl
                transition-colors hover:border-[#333]
              "
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{r.title}</p>

                <div className="flex items-center gap-2 mt-1.5 max-w-[260px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ecb100] flex-shrink-0" />
                  <span className="route-line" />
                  <span className="w-1.5 h-1.5 rounded-full border border-[#ecb100] flex-shrink-0" />
                </div>

                <p className="text-xs text-white/50 mt-1.5">
                  {r.from} → {r.to} · {r.category.replace("_", " ")} ·{" "}
                  <span style={{ fontFamily: "var(--font-geist-mono)" }}>
                    {lowestPrice !== null ? `From ₹${lowestPrice}` : "No pricing set"}
                  </span>
                </p>
              </div>

              <button
                onClick={() => deleteRoute(r.id)}
                className="text-red-400 text-sm hover:text-red-300 transition-colors ml-4"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}