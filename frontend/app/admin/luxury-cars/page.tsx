"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, CarFront, Users, Briefcase } from "lucide-react";
import LuxuryCarModal from "@/components/admin/luxury-cars/LuxuryCarModal";
import { getAllLuxuryCars, deleteLuxuryCar } from "@/src/services/luxuryCarService";

export default function LuxuryCarsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editCar, setEditCar] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await getAllLuxuryCars();
      setCars(res?.success ? res.luxuryCars || [] : []);
    } catch (error) {
      console.error("Luxury cars fetch error:", error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" permanently?`)) return;
    setDeletingId(id);
    await deleteLuxuryCar(id);
    await fetchCars();
    setDeletingId(null);
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-semibold text-white">Luxury Cars</h2>
          <p className="text-[12px] text-[#444] mt-0.5">
            {loading ? "Loading…" : `${cars.length} vehicle${cars.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => { setEditCar(null); setOpen(true); }}
          className="flex items-center gap-1.5 rounded-lg bg-[#ecb100] px-3 py-2 text-[13px] font-semibold text-black transition hover:bg-[#f6c94c] active:scale-95"
        >
          <Plus size={15} />
          Add Car
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
        ) : cars.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {cars.map((car) => (
              <LuxuryCarCard
                key={car.id}
                car={car}
                deletingId={deletingId}
                onEdit={() => { setEditCar(car); setOpen(true); }}
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
              {["Vehicle", "Fleet Type", "Capacity", "Price", "Status", ""].map((h) => (
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
                  <td colSpan={6} className="px-4 py-3">
                    <div className="h-10 rounded-lg bg-[#1a1a1a] animate-pulse" />
                  </td>
                </tr>
              ))
            ) : cars.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[13px] text-[#333]">
                  No luxury cars added yet.
                </td>
              </tr>
            ) : (
              cars.map((car) => {
                const name = car.vehicle?.name || car.name;
                return (
                  <tr key={car.id} className="border-t border-[#1c1c1c] transition hover:bg-[#ffffff04]">
                    {/* VEHICLE */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-18 shrink-0 overflow-hidden rounded-lg border border-[#1c1c1c] bg-[#0d0d0d]">
                          <img
                            src={car.vehicle?.imageUrl || "/placeholder.jpg"}
                            alt={name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-white">{name}</p>
                          <p className="text-[11px] text-[#444] mt-0.5">{car.slug}</p>
                        </div>
                      </div>
                    </td>
                    {/* FLEET TYPE */}
                    <td className="px-4 py-3">
                      <FleetBadges car={car} />
                    </td>
                    {/* CAPACITY */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 text-[12px] text-[#555]">
                        <span className="flex items-center gap-1"><Users size={11} />{car.vehicle?.passengerCapacity ?? "-"} pax</span>
                        <span className="flex items-center gap-1"><Briefcase size={11} />{car.vehicle?.suitcaseCapacity ?? "-"} bags</span>
                      </div>
                    </td>
                    {/* PRICE */}
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#ecb100]">
                      ₹{Number(car.vehicle?.price || 0).toLocaleString("en-IN")}
                    </td>
                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        car.vehicle?.available
                          ? "bg-green-500/10 text-green-400"
                          : "bg-[#1a1a1a] text-[#555]"
                      }`}>
                        {car.vehicle?.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditCar(car); setOpen(true); }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a] text-[#ecb100] transition hover:bg-[#ecb100]/10"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(car.id, name)}
                          disabled={deletingId === car.id}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a] text-red-500 transition hover:bg-red-500/10 disabled:opacity-40"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <LuxuryCarModal
        open={open}
        initialData={editCar}
        onClose={() => setOpen(false)}
        onSuccess={fetchCars}
      />
    </div>
  );
}

// ── Mobile card ──────────────────────────────────────────────
function LuxuryCarCard({ car, deletingId, onEdit, onDelete }: {
  car: any;
  deletingId: string | null;
  onEdit: () => void;
  onDelete: (id: string, name: string) => void;
}) {
  const name = car.vehicle?.name || car.name;
  return (
    <div className="rounded-xl border border-[#1c1c1c] bg-[#0f0f0f] overflow-hidden">
      {/* Image */}
      <div className="relative h-40 w-full bg-[#0d0d0d]">
        <img
          src={car.vehicle?.imageUrl || "/placeholder.jpg"}
          alt={name}
          className="h-full w-full object-cover"
        />
        {/* Status pill over image */}
        <span className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${
          car.vehicle?.available
            ? "bg-green-500/20 text-green-400 backdrop-blur-sm"
            : "bg-black/60 text-[#555] backdrop-blur-sm"
        }`}>
          {car.vehicle?.available ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2.5">
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">{name}</p>
          <p className="text-[11px] text-[#444] mt-0.5">{car.slug}</p>
        </div>

        <div className="flex items-center justify-between">
          <FleetBadges car={car} />
          <span className="text-[13px] font-semibold text-[#ecb100]">
            ₹{Number(car.vehicle?.price || 0).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex gap-2 text-[11px] text-[#555] border-t border-[#161616] pt-2">
          <span className="flex items-center gap-1"><Users size={11} />{car.vehicle?.passengerCapacity ?? "-"} pax</span>
          <span className="flex items-center gap-1 ml-2"><Briefcase size={11} />{car.vehicle?.suitcaseCapacity ?? "-"} bags</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-[#161616] pt-2.5">
          <button
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#1c1c1c] bg-[#141414] py-2 text-[12px] text-[#ecb100] transition hover:border-[#ecb100]/30 active:scale-95"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(car.id, name)}
            disabled={deletingId === car.id}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#1c1c1c] bg-[#141414] py-2 text-[12px] text-red-500 transition hover:border-red-500/30 active:scale-95 disabled:opacity-40"
          >
            <Trash2 size={12} />
            {deletingId === car.id ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Shared primitives ────────────────────────────────────────
function FleetBadges({ car }: { car: any }) {
  const hasSelfDrive = car.vehicle?.isSelfDrive;
  const hasTaxi = car.vehicle?.isTaxiFleet;
  return (
    <div className="flex flex-wrap gap-1.5">
      {hasTaxi && <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] text-green-400">Taxi</span>}
      {hasSelfDrive && <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] text-blue-400">Self Drive</span>}
      {!hasTaxi && !hasSelfDrive && <span className="rounded-full bg-[#ecb100]/10 px-2 py-0.5 text-[11px] text-[#ecb100]">Luxury</span>}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <CarFront size={32} className="text-[#222] mb-3" />
      <p className="text-[14px] text-[#444]">No luxury cars yet</p>
      <p className="text-[12px] text-[#333] mt-1">Add your first premium vehicle</p>
    </div>
  );
}