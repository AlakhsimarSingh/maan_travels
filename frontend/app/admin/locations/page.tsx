"use client";

import { useEffect, useState } from "react";
import { ImageOff, Plus, Pencil, Trash2, MapPin, CheckCircle2, XCircle } from "lucide-react";
import LocationModal from "@/components/admin/locations/LocationModal";
import { getAllLocations, deleteLocation } from "@/src/services/locationService";

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editLocation, setEditLocation] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await getAllLocations();
      setLocations(res.success ? res.locations : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLocations(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setDeletingId(id);
    await deleteLocation(id);
    await fetchLocations();
    setDeletingId(null);
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-semibold text-white">Tour Locations</h2>
          <p className="text-[12px] text-[#444] mt-0.5">
            {loading ? "Loading…" : `${locations.length} location${locations.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => { setEditLocation(null); setOpen(true); }}
          className="flex items-center gap-1.5 rounded-lg bg-[#ecb100] px-3 py-2 text-[13px] font-semibold text-black transition hover:bg-[#f6c94c] active:scale-95"
        >
          <Plus size={15} />
          Add Location
        </button>
      </div>

      {/* ── MOBILE: cards ── */}
      <div className="md:hidden space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-[#1c1c1c] bg-[#0f0f0f] p-3 flex gap-3">
              <div className="h-16 w-20 shrink-0 rounded-lg bg-[#1a1a1a]" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-1/2 rounded bg-[#1a1a1a]" />
                <div className="h-3 w-1/3 rounded bg-[#1a1a1a]" />
              </div>
            </div>
          ))
        ) : locations.length === 0 ? (
          <EmptyState />
        ) : (
          locations.map((loc) => (
            <div key={loc.id} className="rounded-xl border border-[#1c1c1c] bg-[#0f0f0f] p-3">
              <div className="flex gap-3">
                {/* Image */}
                {loc.imageUrl ? (
                  <img
                    src={loc.imageUrl}
                    alt={loc.name}
                    className="h-16 w-20 shrink-0 rounded-lg object-cover border border-[#1c1c1c]"
                  />
                ) : (
                  <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-[#222] text-[#333]">
                    <ImageOff size={16} />
                  </div>
                )}
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-semibold text-white truncate">{loc.name}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      loc.active ? "bg-green-500/10 text-green-400" : "bg-[#1a1a1a] text-[#555]"
                    }`}>
                      {loc.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-3 text-[11px]">
                    <span className={`flex items-center gap-1 ${loc.canPickup ? "text-green-400" : "text-[#444]"}`}>
                      {loc.canPickup ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      Pickup
                    </span>
                    <span className={`flex items-center gap-1 ${loc.canDrop ? "text-green-400" : "text-[#444]"}`}>
                      {loc.canDrop ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      Drop
                    </span>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="mt-3 flex gap-2 border-t border-[#161616] pt-3">
                <button
                  onClick={() => { setEditLocation(loc); setOpen(true); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#1c1c1c] bg-[#141414] py-2 text-[12px] text-[#ecb100] transition hover:border-[#ecb100]/30 active:scale-95"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(loc.id, loc.name)}
                  disabled={deletingId === loc.id}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#1c1c1c] bg-[#141414] py-2 text-[12px] text-red-500 transition hover:border-red-500/30 active:scale-95 disabled:opacity-40"
                >
                  <Trash2 size={12} />
                  {deletingId === loc.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP: table ── */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-[#1c1c1c] bg-[#0f0f0f]">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-[#1c1c1c]">
              {["Image", "Location", "Pickup", "Drop", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#3a3a3a] last:text-right">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-[#1c1c1c]">
                  <td colSpan={6} className="px-4 py-3">
                    <div className="h-9 w-full animate-pulse rounded bg-[#1a1a1a]" />
                  </td>
                </tr>
              ))
            ) : locations.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[13px] text-[#333]">
                  No locations yet. Add your first destination above.
                </td>
              </tr>
            ) : (
              locations.map((loc) => (
                <tr key={loc.id} className="border-t border-[#1c1c1c] transition hover:bg-[#ffffff04]">
                  {/* IMAGE */}
                  <td className="px-4 py-3">
                    {loc.imageUrl ? (
                      <img
                        src={loc.imageUrl}
                        alt={loc.name}
                        className="h-10 w-14 rounded-lg border border-[#1c1c1c] object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded-lg border border-dashed border-[#222] text-[#333]">
                        <ImageOff size={14} />
                      </div>
                    )}
                  </td>
                  {/* NAME */}
                  <td className="px-4 py-3 text-[13px] font-medium text-white">{loc.name}</td>
                  {/* PICKUP */}
                  <td className="px-4 py-3">
                    {loc.canPickup
                      ? <CheckCircle2 size={15} className="text-green-400" />
                      : <XCircle size={15} className="text-[#333]" />}
                  </td>
                  {/* DROP */}
                  <td className="px-4 py-3">
                    {loc.canDrop
                      ? <CheckCircle2 size={15} className="text-green-400" />
                      : <XCircle size={15} className="text-[#333]" />}
                  </td>
                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      loc.active ? "bg-green-500/10 text-green-400" : "bg-[#1a1a1a] text-[#555]"
                    }`}>
                      {loc.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {/* ACTIONS */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditLocation(loc); setOpen(true); }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a] text-[#ecb100] transition hover:bg-[#ecb100]/10"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(loc.id, loc.name)}
                        disabled={deletingId === loc.id}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a] text-red-500 transition hover:bg-red-500/10 disabled:opacity-40"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <LocationModal
        open={open}
        initialData={editLocation}
        onClose={() => setOpen(false)}
        onSuccess={fetchLocations}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <MapPin size={32} className="text-[#222] mb-3" />
      <p className="text-[14px] text-[#444]">No locations yet</p>
      <p className="text-[12px] text-[#333] mt-1">Add your first pickup or destination</p>
    </div>
  );
}