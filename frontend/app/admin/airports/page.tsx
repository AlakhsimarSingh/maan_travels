"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/src/services/bookingService";

type Airport = {
  id: string;
  name: string;
  shortName: string;
  image: string | null;
  description: string | null;
  active: boolean;
};

export default function AirportsAdminPage() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", shortName: "", description: "" });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const res = await fetch(`${API_URL}/api/airports/all`);
      const data = await res.json();
      setAirports(data.airports || []);
    } catch {
      setError("Failed to load airports");
    } finally {
      setLoading(false);
    }
  };

  const createAirport = async () => {
    setError("");

    if (!form.name || !form.shortName) {
      setError("Name and short name are required");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("shortName", form.shortName);
      data.append("description", form.description);
      if (file) data.append("image", file);

      const res = await fetch(`${API_URL}/api/airports`, { method: "POST", body: data });
      const resData = await res.json();

      if (!resData.success) {
        setError(resData.message || "Failed to create airport");
        return;
      }

      setForm({ name: "", shortName: "", description: "" });
      setFile(null);
      fetchAirports();
    } catch {
      setError("Failed to create airport");
    }
  };

  const toggleActive = async (airport: Airport) => {
    try {
      const data = new FormData();
      data.append("active", String(!airport.active));
      const res = await fetch(`${API_URL}/api/airports/${airport.id}`, { method: "PUT", body: data });
      const resData = await res.json();
      if (resData.success) fetchAirports();
    } catch {
      setError("Failed to update airport");
    }
  };

  const deleteAirport = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/airports/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to delete airport");
        return;
      }

      fetchAirports();
    } catch {
      setError("Failed to delete airport");
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Loading airports...</div>;
  }

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Airport management</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#111] border border-[#252525] p-5 rounded-2xl grid gap-3 md:grid-cols-2">
        <input
          className="p-2.5 bg-black border border-[#252525] rounded-lg outline-none focus:border-[#ecb100]/60"
          placeholder="Full name (e.g. Amritsar Airport)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="p-2.5 bg-black border border-[#252525] rounded-lg outline-none focus:border-[#ecb100]/60"
          placeholder="Short name (e.g. Amritsar)"
          value={form.shortName}
          onChange={(e) => setForm({ ...form, shortName: e.target.value })}
        />

        <textarea
          className="md:col-span-2 p-2.5 bg-black border border-[#252525] rounded-lg outline-none focus:border-[#ecb100]/60 min-h-20"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="md:col-span-2">
          <p className="text-sm text-white/70 mb-2">Airport image</p>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
        </div>

        <button
          onClick={createAirport}
          className="md:col-span-2 bg-[#ecb100] text-black p-2.5 rounded-lg font-medium hover:bg-[#f6c94c] transition"
        >
          Add airport
        </button>
      </div>

      <div className="space-y-2">
        {airports.map((a) => (
          <div key={a.id} className="flex items-center justify-between bg-[#111] border border-[#252525] p-4 rounded-xl">
            <div className="flex items-center gap-3">
              {a.image ? (
                <img src={`${API_URL}${a.image}`} alt={a.name} className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-white/30 text-xs">
                  No image
                </div>
              )}
              <div>
                <p className="font-medium">{a.name}</p>
                <p className="text-xs text-white/50">{a.shortName} · {a.active ? "Active" : "Inactive"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => toggleActive(a)} className="text-white/60 text-sm hover:text-white">
                {a.active ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => deleteAirport(a.id)} className="text-red-400 text-sm hover:text-red-300">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}