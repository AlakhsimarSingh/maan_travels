"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/src/services/bookingService";

type City = {
  id: string;
  name: string;
  canPickup: boolean;
  canDrop: boolean;
  active: boolean;
};

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
        ${active
          ? "border-[#ecb100] bg-[#ecb100]/10 text-[#ecb100]"
          : "border-[#252525] text-white/40 hover:border-white/20"}
      `}
    >
      {children}
    </button>
  );
}

export default function AirportCitiesAdminPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", canPickup: true, canDrop: true });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await fetch(`${API_URL}/api/airport-cities/all`, { credentials: "include" });
      const data = await res.json();
      setCities(data.cities || []);
    } catch {
      setError("Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

  const createCity = async () => {
    setError("");
    if (!form.name) {
      setError("City name is required");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/airport-cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to create city");
        return;
      }
      setForm({ name: "", canPickup: true, canDrop: true });
      fetchCities();
    } catch {
      setError("Failed to create city");
    }
  };

  const updateCity = async (id: string, patch: Partial<City>) => {
    try {
      const res = await fetch(`${API_URL}/api/airport-cities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (data.success) fetchCities();
    } catch {
      setError("Failed to update city");
    }
  };

  const deleteCity = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/airport-cities/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to delete city");
        return;
      }

      fetchCities();
    } catch {
      setError("Failed to delete city");
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Loading cities...</div>;
  }

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Airport transfer cities</h1>
      <p className="text-sm text-white/60">
        Add the cities customers can travel to or from for airport transfers, and control which direction each city supports.
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#111] border border-[#252525] p-5 rounded-2xl grid gap-4 md:grid-cols-2">
        <input
          className="md:col-span-2 p-2.5 bg-black border border-[#252525] rounded-lg outline-none focus:border-[#ecb100]/60"
          placeholder="City name (e.g. Ludhiana)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <div className="md:col-span-2 flex flex-wrap gap-2">
          <Chip active={form.canPickup} onClick={() => setForm({ ...form, canPickup: !form.canPickup })}>
            Pickup → Airport
          </Chip>
          <Chip active={form.canDrop} onClick={() => setForm({ ...form, canDrop: !form.canDrop })}>
            Airport → Drop
          </Chip>
        </div>

        <button
          onClick={createCity}
          className="md:col-span-2 bg-[#ecb100] text-black p-2.5 rounded-lg font-medium hover:bg-[#f6c94c] transition"
        >
          Add city
        </button>
      </div>

      <div className="space-y-2">
        {cities.map((c) => (
          <div
            key={c.id}
            className="flex flex-col gap-3 bg-[#111] border border-[#252525] p-4 rounded-xl sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{c.name}</p>
              <p className="text-xs text-white/50">{c.active ? "Active" : "Inactive"}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:justify-end">
              <Chip active={c.canPickup} onClick={() => updateCity(c.id, { canPickup: !c.canPickup })}>
                Pickup → Airport
              </Chip>
              <Chip active={c.canDrop} onClick={() => updateCity(c.id, { canDrop: !c.canDrop })}>
                Airport → Drop
              </Chip>
              <button onClick={() => updateCity(c.id, { active: !c.active })} className="text-white/60 text-sm hover:text-white px-2">
                {c.active ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => deleteCity(c.id)} className="text-red-400 text-sm hover:text-red-300 px-2">
                Delete
              </button>
            </div>
          </div>
        ))}

        {!cities.length && (
          <p className="text-sm text-white/40 text-center py-8">No cities added yet.</p>
        )}
      </div>
    </div>
  );
}