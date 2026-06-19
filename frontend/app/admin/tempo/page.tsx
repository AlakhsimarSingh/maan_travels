"use client";

import { useEffect, useState } from "react";

import {
  Pencil,
  Trash2,
  Plus,
  BusFront,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import VehicleForm from "@/components/admin/vehicles/VehiclesForm";

import {
  getAllVehicles,
  deleteVehicle,
} from "@/src/services/vehicleService";

export default function TempoPage() {

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<any>(null);

  /* ---------------- FETCH ---------------- */
  const fetchVehicles = async () => {
    try {
      setLoading(true);

      const res = await getAllVehicles();

      if (res?.success) {

        // ✅ STRICT TEMPO RULE (safe + schema aligned)
        const tempoVehicles = (res.vehicles || []).filter((v: any) => {

          const isTempoCategory =
            v.category === "Tempo Traveller" ||
            v.category === "Urbania";

          // 🚫 must never include self-drive or taxi fleet vehicles
          const isValidFleet =
            v.isSelfDrive !== true &&
            v.isTaxiFleet !== true;

          return isTempoCategory && isValidFleet;
        });

        setVehicles(tempoVehicles);

      } else {
        setVehicles([]);
      }

    } catch (error) {
      console.error("Tempo vehicles error:", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: string) => {

    const confirmDelete = window.confirm(
      "Delete this traveller vehicle?"
    );

    if (!confirmDelete) return;

    try {
      await deleteVehicle(id);
      fetchVehicles();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">

          <div className="h-12 w-12 rounded-xl bg-[#ecb100]/10 flex items-center justify-center">
            <BusFront className="text-[#ecb100] h-6 w-6" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              Tempo / Urbania
            </h1>
            <p className="text-sm text-[#8a8a8a]">
              Manage traveller vehicles
            </p>
          </div>

        </div>

        <Button
          onClick={() => {
            setEditVehicle(null);
            setOpen(true);
          }}
          className="bg-[#ecb100] text-black font-semibold gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Traveller
        </Button>

      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-[#252525] bg-[#141414] overflow-hidden">

        <table className="w-full text-white">

          <thead className="bg-[#111] text-[#8a8a8a] text-xs uppercase">
            <tr>
              <th className="p-5 text-left">Vehicle</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th className="text-right p-5">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (

              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-[#252525]">
                  <td colSpan={5} className="p-5">
                    <div className="h-12 rounded-lg bg-[#1c1c1c] animate-pulse" />
                  </td>
                </tr>
              ))

            ) : vehicles.length === 0 ? (

              <tr>
                <td colSpan={5} className="p-10 text-center text-[#8a8a8a]">
                  No Tempo / Urbania vehicles found
                </td>
              </tr>

            ) : (

              vehicles.map((vehicle) => (

                <tr
                  key={vehicle.id}
                  className="border-t border-[#252525] hover:bg-[#1b1b1b] transition"
                >

                  {/* VEHICLE */}
                  <td className="p-5">
                    <div className="flex items-center gap-4">

                      <img
                        src={vehicle.imageUrl || "/placeholder.jpg"}
                        className="h-16 w-24 rounded-xl object-cover border border-[#252525]"
                      />

                      <div>
                        <p className="font-semibold text-white">
                          {vehicle.name}
                        </p>

                        <p className="text-xs text-[#8a8a8a]">
                          {vehicle.passengerCapacity
                            ? `${vehicle.passengerCapacity} Seats • ${vehicle.suitcaseCapacity || 0} Bags`
                            : "Traveller Vehicle"}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td>
                    <span className="px-3 py-1 rounded-full bg-[#ecb100]/10 text-[#ecb100] text-xs">
                      {vehicle.category}
                    </span>
                  </td>

                  {/* PRICE */}
                  <td>
                    ₹{Number(vehicle.price).toLocaleString("en-IN")}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        vehicle.available
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {vehicle.available ? "Available" : "Unavailable"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="text-right p-5">
                    <div className="flex justify-end gap-3">

                      <button
                        onClick={() => {
                          setEditVehicle(vehicle);
                          setOpen(true);
                        }}
                        className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center"
                      >
                        <Pencil className="h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="h-9 w-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center"
                      >
                        <Trash2 className="h-4" />
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
      {open && (
        <VehicleForm
          vehicle={editVehicle}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            fetchVehicles();
          }}
        />
      )}

    </div>
  );
}