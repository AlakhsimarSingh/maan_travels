"use client";

import { useEffect, useState } from "react";

import {
  getAllVehicles,
  toggleVehicle,
  deleteVehicle,
} from "@/src/services/vehicleService";

import VehicleForm from "@/components/admin/vehicles/VehiclesForm";
import { Button } from "@/components/ui/button";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<any>(null);

  const fetchData = async () => {
    try {
      const res = await getAllVehicles();
      setVehicles(res.vehicles || []);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Vehicles Management
          </h2>
          <p className="text-[#8a8a8a] text-sm mt-1">
            Manage self-drive, taxi fleet & premium vehicles
          </p>
        </div>

        <Button
          className="bg-[#ecb100] text-black font-semibold"
          onClick={() => {
            setEditVehicle(null);
            setOpen(true);
          }}
        >
          + Add Vehicle
        </Button>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-[#252525] overflow-hidden bg-[#141414]">

        <table className="w-full text-left text-white">

          {/* HEADER */}
          <thead className="bg-black/60 text-sm text-[#8a8a8a]">
            <tr>
              <th className="p-4">Vehicle</th>
              <th>Category</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Price</th>
              <th>Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>

            {vehicles.map((v: any) => (
              <tr
                key={v.id}
                className="border-t border-[#252525] hover:bg-black/30 transition"
              >

                {/* NAME */}
                <td className="p-4 font-medium">
                  <div className="flex flex-col">
                    <span>{v.name}</span>

                    {/* TYPE BADGES */}
                    <div className="flex gap-2 mt-1">

                      {v.isSelfDrive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                          Self Drive
                        </span>
                      )}

                      {v.isTaxiFleet && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                          Taxi Fleet
                        </span>
                      )}

                    </div>

                  </div>
                </td>

                {/* CATEGORY */}
                <td className="text-[#c7c7c7]">
                  {v.category}
                </td>

                {/* TYPE */}
                <td className="text-sm text-[#8a8a8a]">
                  {v.isSelfDrive ? "Rental" : "Chauffeur"}
                </td>

                {/* CAPACITY */}
                <td className="text-sm text-[#c7c7c7]">
                  <div>
                    👤 {v.passengerCapacity || "-"} passengers
                  </div>
                  <div>
                    🧳 {v.suitcaseCapacity || "-"} bags
                  </div>
                </td>

                {/* PRICE */}
                <td className="text-[#ecb100] font-semibold">
                  ₹{v.price}
                </td>

                {/* STATUS */}
                <td>
                  <button
                    onClick={async () => {
                      await toggleVehicle(v.id);
                      fetchData();
                    }}
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold transition
                      ${
                        v.available
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    `}
                  >
                    {v.available ? "Active" : "Inactive"}
                  </button>
                </td>

                {/* ACTIONS */}
                <td className="text-right p-4 space-x-4">

                  <button
                    onClick={() => {
                      setEditVehicle(v);
                      setOpen(true);
                    }}
                    className="text-[#ecb100] hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={async () => {
                      const ok = confirm(
                        "Delete this vehicle permanently?"
                      );
                      if (!ok) return;

                      await deleteVehicle(v.id);
                      fetchData();
                    }}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

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
            fetchData();
          }}
        />
      )}

    </div>
  );
}