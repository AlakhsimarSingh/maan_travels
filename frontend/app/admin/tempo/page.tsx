"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, BusFront, Users, Briefcase } from "lucide-react";
import TempoModal from "@/components/admin/tempo/TempoModal";
import { getTempoUrbaniaVehiclesAdmin } from "@/src/services/tempoUrbaniaService";
import { deleteVehicle } from "@/src/services/vehicleService";

export default function TempoPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const tempoVehicles = await getTempoUrbaniaVehiclesAdmin();
      setVehicles(tempoVehicles);
    } catch (error) {
      console.error("Tempo vehicles error:", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeletingId(id);
    try {
      await deleteVehicle(id);
      await fetchVehicles();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[17px] font-semibold text-white">Tempo / Urbania</h1>
          <p className="text-[12px] text-[#444] mt-0.5">
            {loading ? "Loading…" : `${vehicles.length} vehicle${vehicles.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => { setEditVehicle(null); setOpen(true); }}
          className="flex items-center gap-1.5 rounded-lg bg-[#ecb100] px-3 py-2 text-[13px] font-semibold text-black transition hover:bg-[#f6c94c] active:scale-95"
        >
          <Plus size={15} />
          Add Traveller
        </button>
      </div>

      {/* ── MOBILE: card grid ── */}
      <div className="md:hidden">
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-[#1c1c1c] bg-[#0f0f0f] overflow-hidden">
                <div className="h-40 w-full bg-[#1a1a1a]" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-[#1a1a1a]" />
                  <div className="h-3 w-1/3 rounded bg-[#1a1a1a]" />
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {vehicles.map((v) => (
              <TempoCard
                key={v.id}
                v={v}
                deletingId={deletingId}
                onEdit={() => { setEditVehicle(v); setOpen(true); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── DESKTOP: table ── */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-[#1c1c1c] bg-[#0f0f0f]">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-[#1c1c1c]">
              {["Vehicle", "Category", "Price", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#3a3a3a] last:text-right">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-[#1c1c1c]">
                  <td colSpan={5} className="px-4 py-3">
                    <div className="h-10 rounded-lg bg-[#1a1a1a] animate-pulse" />
                  </td>
                </tr>
              ))
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-[13px] text-[#333]">
                  No Tempo / Urbania vehicles found.
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className="border-t border-[#1c1c1c] transition hover:bg-[#ffffff04]">
                  {/* VEHICLE */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-18 shrink-0 overflow-hidden rounded-lg border border-[#1c1c1c] bg-[#0d0d0d]">
                        <img
                          src={v.imageUrl || "/placeholder.jpg"}
                          alt={v.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white">{v.name}</p>
                        <div className="flex gap-2 mt-0.5 text-[11px] text-[#444]">
                          {v.passengerCapacity && (
                            <span className="flex items-center gap-1"><Users size={10} />{v.passengerCapacity}</span>
                          )}
                          {v.suitcaseCapacity != null && (
                            <span className="flex items-center gap-1"><Briefcase size={10} />{v.suitcaseCapacity}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* CATEGORY */}
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#ecb100]/10 px-2.5 py-1 text-[11px] text-[#ecb100]">
                      {v.category}
                    </span>
                  </td>
                  {/* PRICE */}
                  <td className="px-4 py-3 text-[13px] font-semibold text-[#ecb100]">
                    ₹{Number(v.price).toLocaleString("en-IN")}
                  </td>
                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      v.available
                        ? "bg-green-500/10 text-green-400"
                        : "bg-[#1a1a1a] text-[#555]"
                    }`}>
                      {v.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  {/* ACTIONS */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditVehicle(v); setOpen(true); }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a] text-[#ecb100] transition hover:bg-[#ecb100]/10"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id, v.name)}
                        disabled={deletingId === v.id}
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

      {/* MODAL */}
      <TempoModal
        open={open}
        initialData={editVehicle}
        onClose={() => setOpen(false)}
        onSuccess={() => { setOpen(false); fetchVehicles(); }}
      />
    </div>
  );
}

// ── Mobile card ──────────────────────────────────────────────
function TempoCard({ v, deletingId, onEdit, onDelete }: {
  v: any;
  deletingId: string | null;
  onEdit: () => void;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <div className="rounded-xl border border-[#1c1c1c] bg-[#0f0f0f] overflow-hidden">
      {/* Image */}
      <div className="relative h-40 w-full bg-[#0d0d0d]">
        <img
          src={v.imageUrl || "/placeholder.jpg"}
          alt={v.name}
          className="h-full w-full object-cover"
        />
        <span className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${
          v.available
            ? "bg-green-500/20 text-green-400"
            : "bg-black/60 text-[#555]"
        }`}>
          {v.available ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[14px] font-semibold text-white leading-tight">{v.name}</p>
            <span className="mt-1 inline-block rounded-full bg-[#ecb100]/10 px-2 py-0.5 text-[10px] text-[#ecb100]">
              {v.category}
            </span>
          </div>
          <p className="text-[14px] font-semibold text-[#ecb100] shrink-0">
            ₹{Number(v.price).toLocaleString("en-IN")}
          </p>
        </div>

        {(v.passengerCapacity || v.suitcaseCapacity != null) && (
          <div className="flex gap-3 text-[11px] text-[#555] border-t border-[#161616] pt-2">
            {v.passengerCapacity && (
              <span className="flex items-center gap-1"><Users size={11} />{v.passengerCapacity} seats</span>
            )}
            {v.suitcaseCapacity != null && (
              <span className="flex items-center gap-1"><Briefcase size={11} />{v.suitcaseCapacity} bags</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 border-t border-[#161616] pt-2.5">
          <button
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#1c1c1c] bg-[#141414] py-2 text-[12px] text-[#ecb100] transition hover:border-[#ecb100]/30 active:scale-95"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(v.id, v.name)}
            disabled={deletingId === v.id}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#1c1c1c] bg-[#141414] py-2 text-[12px] text-red-500 transition hover:border-red-500/30 active:scale-95 disabled:opacity-40"
          >
            <Trash2 size={12} />
            {deletingId === v.id ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <BusFront size={32} className="text-[#222] mb-3" />
      <p className="text-[14px] text-[#444]">No Tempo / Urbania vehicles</p>
      <p className="text-[12px] text-[#333] mt-1">Add your first traveller vehicle</p>
    </div>
  );
}