"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getAllVehicles,
  toggleVehicle,
  deleteVehicle,
} from "@/src/services/vehicleService";

import VehicleModal from "@/components/admin/vehicles/VehicleModal";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

type FleetFilter = "all" | "taxi" | "selfdrive" | "both";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [fleetFilter, setFleetFilter] = useState<FleetFilter>("all");

  const EXCLUDED_CATEGORIES = ["Luxury", "Tempo Traveller", "Urbania"];

const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllVehicles();
      const allVehicles = res.vehicles || [];

      // Luxury cars and Tempo/Urbania travellers are managed on their
      // own dedicated admin pages — keep them out of this general list.
      const scoped = allVehicles.filter(
        (v: any) => !EXCLUDED_CATEGORIES.includes(v.category)
      );

      setVehicles(scoped);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Vehicles Management</h2>
          <p className="mt-1 text-sm text-[#8a8a8a]">
            Manage self-drive, taxi fleet & premium vehicles
          </p>
        </div>

        <Button
          className="bg-[#ecb100] font-semibold text-black hover:bg-[#f6c94c]"
          onClick={() => {
            setEditVehicle(null);
            setOpen(true);
          }}
        >
          <Plus size={18} className="mr-1" />
          Add Vehicle
        </Button>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#252525] bg-[#141414] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-[#ecb100]/60"
          />
        </div>

        <div className="flex gap-2">
          {(
            [
              { key: "all", label: "All" },
              { key: "taxi", label: "Taxi only" },
              { key: "selfdrive", label: "Self drive only" },
              { key: "both", label: "Both fleets" },
            ] as { key: FleetFilter; label: string }[]
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFleetFilter(f.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                fleetFilter === f.key
                  ? "bg-[#ecb100] text-black"
                  : "bg-[#141414] text-[#8a8a8a] hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#252525] bg-[#141414]">
        <table className="w-full text-left text-white">
          <thead className="bg-black/60 text-sm text-[#8a8a8a]">
            <tr>
              <th className="p-4">Vehicle</th>
              <th>Category</th>
              <th>Fleet</th>
              <th>Capacity</th>
              <th>Price</th>
              <th>Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-[#252525]">
                  <td colSpan={7} className="p-4">
                    <div className="h-6 w-full animate-pulse rounded bg-white/5" />
                  </td>
                </tr>
              ))
            ) : filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-[#8a8a8a]">
                  No vehicles match your filters.
                </td>
              </tr>
            ) : (
              filteredVehicles.map((v: any) => (
                <tr
                  key={v.id}
                  className="border-t border-[#252525] transition hover:bg-black/30"
                >
                  {/* NAME */}
                  <td className="flex items-center gap-3 p-4 font-medium">
                    {v.imageUrl && (
                      <img
                        src={v.imageUrl}
                        alt={v.name}
                        className="h-10 w-14 rounded-md object-cover"
                      />
                    )}
                    <span>{v.name}</span>
                  </td>

                  {/* CATEGORY */}
                  <td className="text-[#c7c7c7]">{v.category}</td>

                  {/* FLEET BADGES */}
                  <td>
                    <div className="flex gap-2">
                      {v.isSelfDrive && (
                        <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
                          Self Drive
                        </span>
                      )}
                      {v.isTaxiFleet && (
                        <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                          Taxi Fleet
                        </span>
                      )}
                      {!v.isSelfDrive && !v.isTaxiFleet && (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-[#8a8a8a]">
                          Unassigned
                        </span>
                      )}
                    </div>
                  </td>

                  {/* CAPACITY */}
                  <td className="text-sm text-[#c7c7c7]">
                    <div>👤 {v.passengerCapacity || "-"} passengers</div>
                    <div>🧳 {v.suitcaseCapacity || "-"} bags</div>
                  </td>

                  {/* PRICE */}
                  <td className="font-semibold text-[#ecb100]">
                    ₹{v.price}
                    {v.isSelfDrive && v.rentalPerDay ? (
                      <div className="text-xs font-normal text-[#8a8a8a]">
                        ₹{v.rentalPerDay}/day rental
                      </div>
                    ) : null}
                  </td>

                  {/* STATUS */}
                  <td>
                    <button
                      onClick={async () => {
                        await toggleVehicle(v.id);
                        fetchData();
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        v.available
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {v.available ? "Active" : "Inactive"}
                    </button>
                  </td>

                  {/* ACTIONS */}
                  <td className="space-x-3 p-4 text-right">
                    <button
                      onClick={() => {
                        setEditVehicle(v);
                        setOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-[#ecb100] hover:underline"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      onClick={async () => {
                        const ok = confirm("Delete this vehicle permanently?");
                        if (!ok) return;

                        await deleteVehicle(v.id);
                        fetchData();
                      }}
                      className="inline-flex items-center gap-1 text-red-400 hover:underline"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
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
        onSuccess={() => {
          setOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}