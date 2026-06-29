"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAllVehicles,
  toggleVehicle,
  deleteVehicle,
} from "@/src/services/vehicleService";
import VehicleModal from "@/components/admin/vehicles/VehicleModal";
import { Plus, Pencil, Trash2, Search, Users, Briefcase, Car } from "lucide-react";

type FleetFilter = "all" | "taxi" | "selfdrive" | "both";

const FLEET_FILTERS: { key: FleetFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "taxi", label: "Taxi" },
  { key: "selfdrive", label: "Self Drive" },
  { key: "both", label: "Both" },
];

const EXCLUDED_CATEGORIES = ["Luxury", "Tempo Traveller", "Urbania"];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [fleetFilter, setFleetFilter] = useState<FleetFilter>("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllVehicles();
      const allVehicles = res.vehicles || [];
      setVehicles(
        allVehicles.filter((v: any) => !EXCLUDED_CATEGORIES.includes(v.category))
      );
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch = v.name?.toLowerCase().includes(search.toLowerCase());
      const matchesFleet =
        fleetFilter === "all" ||
        (fleetFilter === "taxi" && v.isTaxiFleet && !v.isSelfDrive) ||
        (fleetFilter === "selfdrive" && v.isSelfDrive && !v.isTaxiFleet) ||
        (fleetFilter === "both" && v.isTaxiFleet && v.isSelfDrive);
      return matchesSearch && matchesFleet;
    });
  }, [vehicles, search, fleetFilter]);

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    await toggleVehicle(id);
    await fetchData();
    setTogglingId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" permanently?`)) return;
    setDeletingId(id);
    await deleteVehicle(id);
    await fetchData();
    setDeletingId(null);
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-semibold text-white">Vehicles</h2>
          <p className="text-[12px] text-[#444] mt-0.5">
            {loading ? "Loading…" : `${filteredVehicles.length} of ${vehicles.length} vehicles`}
          </p>
        </div>
        <button
          onClick={() => { setEditVehicle(null); setOpen(true); }}
          className="flex items-center gap-1.5 rounded-lg bg-[#ecb100] px-3 py-2 text-[13px] font-semibold text-black transition hover:bg-[#f6c94c] active:scale-95"
        >
          <Plus size={15} />
          Add Vehicle
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input
            placeholder="Search vehicles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] py-2 pl-8 pr-3 text-[13px] text-white outline-none placeholder:text-[#333] focus:border-[#ecb100]/50"
          />
        </div>
        <div className="flex gap-1.5">
          {FLEET_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFleetFilter(f.key)}
              className={`rounded-lg px-3 py-2 text-[12px] font-medium transition ${
                fleetFilter === f.key
                  ? "bg-[#ecb100] text-black"
                  : "bg-[#0f0f0f] border border-[#1c1c1c] text-[#555] hover:text-[#aaa]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MOBILE: card grid ── */}
      <div className="md:hidden">
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-[#1c1c1c] bg-[#0f0f0f] p-4 space-y-3">
                <div className="h-32 w-full rounded-lg bg-[#1a1a1a]" />
                <div className="h-4 w-2/3 rounded bg-[#1a1a1a]" />
                <div className="h-3 w-1/2 rounded bg-[#1a1a1a]" />
              </div>
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredVehicles.map((v) => (
              <VehicleCard
                key={v.id}
                v={v}
                togglingId={togglingId}
                deletingId={deletingId}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={() => { setEditVehicle(v); setOpen(true); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── DESKTOP: table ── */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-[#1c1c1c] bg-[#0f0f0f]">
        <table className="w-full text-left text-white">
          <thead>
            <tr className="border-b border-[#1c1c1c]">
              {["Vehicle", "Category", "Fleet", "Capacity", "Price", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#3a3a3a]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-[#1c1c1c]">
                  <td colSpan={7} className="px-4 py-3">
                    <div className="h-5 w-full animate-pulse rounded bg-[#1a1a1a]" />
                  </td>
                </tr>
              ))
            ) : filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-[13px] text-[#333]">
                  No vehicles match your filters.
                </td>
              </tr>
            ) : (
              filteredVehicles.map((v) => (
                <tr key={v.id} className="border-t border-[#1c1c1c] transition hover:bg-[#ffffff04]">
                  {/* NAME */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {v.imageUrl ? (
                        <img src={v.imageUrl} alt={v.name} className="h-9 w-14 rounded-md object-cover shrink-0" />
                      ) : (
                        <div className="flex h-9 w-14 shrink-0 items-center justify-center rounded-md bg-[#1a1a1a]">
                          <Car size={16} className="text-[#333]" />
                        </div>
                      )}
                      <span className="text-[13px] font-medium">{v.name}</span>
                    </div>
                  </td>
                  {/* CATEGORY */}
                  <td className="px-4 py-3 text-[13px] text-[#666]">{v.category}</td>
                  {/* FLEET */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {v.isTaxiFleet && <FleetBadge type="taxi" />}
                      {v.isSelfDrive && <FleetBadge type="selfdrive" />}
                      {!v.isTaxiFleet && !v.isSelfDrive && (
                        <span className="rounded-full bg-[#1a1a1a] px-2 py-0.5 text-[11px] text-[#444]">Unassigned</span>
                      )}
                    </div>
                  </td>
                  {/* CAPACITY */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5 text-[12px] text-[#555]">
                      <span className="flex items-center gap-1"><Users size={11} />{v.passengerCapacity ?? "-"} pax</span>
                      <span className="flex items-center gap-1"><Briefcase size={11} />{v.suitcaseCapacity ?? "-"} bags</span>
                    </div>
                  </td>
                  {/* PRICE */}
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-semibold text-[#ecb100]">₹{v.price}</span>
                    {v.isSelfDrive && v.rentalPerDay && (
                      <div className="text-[11px] text-[#444]">₹{v.rentalPerDay}/day</div>
                    )}
                  </td>
                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(v.id)}
                      disabled={togglingId === v.id}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition disabled:opacity-50 ${
                        v.available
                          ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                          : "bg-[#1a1a1a] text-[#555] hover:bg-[#222]"
                      }`}
                    >
                      {togglingId === v.id ? "…" : v.available ? "Active" : "Inactive"}
                    </button>
                  </td>
                  {/* ACTIONS */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => { setEditVehicle(v); setOpen(true); }}
                        className="flex items-center gap-1 text-[12px] text-[#ecb100] hover:underline"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v.id, v.name)}
                        disabled={deletingId === v.id}
                        className="flex items-center gap-1 text-[12px] text-red-500 hover:underline disabled:opacity-40"
                      >
                        <Trash2 size={12} />
                        {deletingId === v.id ? "…" : "Delete"}
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
      <VehicleModal
        open={open}
        initialData={editVehicle}
        onClose={() => setOpen(false)}
        onSuccess={() => { setOpen(false); fetchData(); }}
      />
    </div>
  );
}

// ── Mobile card ──────────────────────────────────────────────
function VehicleCard({
  v, togglingId, deletingId, onToggle, onDelete, onEdit,
}: {
  v: any;
  togglingId: string | null;
  deletingId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#1c1c1c] bg-[#0f0f0f] overflow-hidden">
      {/* Image */}
      {v.imageUrl ? (
        <img src={v.imageUrl} alt={v.name} className="h-36 w-full object-cover" />
      ) : (
        <div className="flex h-36 w-full items-center justify-center bg-[#0d0d0d]">
          <Car size={32} className="text-[#222]" />
        </div>
      )}

      {/* Body */}
      <div className="p-3 space-y-2.5">
        {/* Name + status */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[14px] font-semibold text-white leading-tight">{v.name}</p>
            <p className="text-[11px] text-[#444] mt-0.5">{v.category}</p>
          </div>
          <button
            onClick={() => onToggle(v.id)}
            disabled={togglingId === v.id}
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition disabled:opacity-50 ${
              v.available
                ? "bg-green-500/10 text-green-400"
                : "bg-[#1a1a1a] text-[#555]"
            }`}
          >
            {togglingId === v.id ? "…" : v.available ? "Active" : "Inactive"}
          </button>
        </div>

        {/* Fleet badges */}
        <div className="flex flex-wrap gap-1.5">
          {v.isTaxiFleet && <FleetBadge type="taxi" />}
          {v.isSelfDrive && <FleetBadge type="selfdrive" />}
          {!v.isTaxiFleet && !v.isSelfDrive && (
            <span className="rounded-full bg-[#1a1a1a] px-2 py-0.5 text-[11px] text-[#444]">Unassigned</span>
          )}
        </div>

        {/* Capacity + price */}
        <div className="flex items-center justify-between border-t border-[#161616] pt-2.5">
          <div className="flex gap-3 text-[11px] text-[#555]">
            <span className="flex items-center gap-1"><Users size={11} />{v.passengerCapacity ?? "-"}</span>
            <span className="flex items-center gap-1"><Briefcase size={11} />{v.suitcaseCapacity ?? "-"}</span>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-semibold text-[#ecb100]">₹{v.price}</p>
            {v.isSelfDrive && v.rentalPerDay && (
              <p className="text-[10px] text-[#444]">₹{v.rentalPerDay}/day</p>
            )}
          </div>
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

// ── Shared primitives ────────────────────────────────────────
function FleetBadge({ type }: { type: "taxi" | "selfdrive" }) {
  return type === "taxi" ? (
    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] text-green-400">Taxi</span>
  ) : (
    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] text-blue-400">Self Drive</span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Car size={32} className="text-[#222] mb-3" />
      <p className="text-[14px] text-[#444]">No vehicles found</p>
      <p className="text-[12px] text-[#333] mt-1">Try adjusting your filters</p>
    </div>
  );
}