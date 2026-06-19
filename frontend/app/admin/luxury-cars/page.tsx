"use client";

import { useEffect, useState } from "react";

import {
  Pencil,
  Trash2,
  Plus,
  CarFront,
} from "lucide-react";

import LuxuryCarModal from "@/components/admin/luxury-cars/LuxuryCarModal";

import { Button } from "@/components/ui/button";

import {
  getAllLuxuryCars,
  deleteLuxuryCar,
} from "@/src/services/luxuryCarService";

export default function LuxuryCarsPage() {

  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editCar, setEditCar] = useState<any>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);

      const res = await getAllLuxuryCars();

      if (res?.success) {
        setCars(res.luxuryCars || []);
      } else {
        setCars([]);
      }

    } catch (error) {
      console.error("Luxury cars fetch error:", error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this luxury car permanently?");
    if (!ok) return;

    await deleteLuxuryCar(id);
    fetchCars();
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="h-11 w-11 rounded-xl bg-[#ecb100]/10 flex items-center justify-center">
            <CarFront className="h-5 w-5 text-[#ecb100]" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white">
              Luxury Cars
            </h2>

            <p className="text-sm text-[#8a8a8a] mt-1">
              Manage premium fleet vehicles
            </p>
          </div>

        </div>

        <Button
          className="bg-[#ecb100] hover:bg-[#d9a500] text-black font-semibold flex gap-2"
          onClick={() => {
            setEditCar(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Luxury Car
        </Button>

      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-[#252525] bg-[#141414] overflow-hidden">

        <table className="w-full text-white">

          <thead className="bg-[#101010] text-[#8a8a8a] text-xs uppercase tracking-wider">

            <tr>
              <th className="p-5 text-left">Vehicle</th>
              <th className="text-left">Fleet Type</th>
              <th className="text-left">Capacity</th>
              <th className="text-left">Price</th>
              <th className="text-left">Status</th>
              <th className="text-right p-5">Actions</th>
            </tr>

          </thead>

          <tbody>

            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-[#252525]">
                  <td colSpan={6} className="p-5">
                    <div className="h-10 rounded-lg bg-[#1b1b1b] animate-pulse" />
                  </td>
                </tr>
              ))
            ) : cars.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-[#8a8a8a]">
                  No luxury cars added yet.
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr
                  key={car.id}
                  className="border-t border-[#252525] hover:bg-[#1b1b1b] transition"
                >

                  {/* VEHICLE */}
                  <td className="p-5">
                    <div className="flex items-center gap-4">

                      <div className="h-16 w-24 rounded-xl overflow-hidden bg-black border border-[#252525]">
                        <img
                          src={
                            car.vehicle?.imageUrl ||
                            "/placeholder.jpg"
                          }
                          alt={car.vehicle?.name || car.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          {car.vehicle?.name || car.name}
                        </p>

                        <p className="text-xs text-[#8a8a8a] mt-1">
                          {car.slug}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* FLEET TYPE (NEW) */}
                  <td>
                    <div className="flex gap-2 flex-wrap">

                      {car.vehicle?.isSelfDrive && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                          Self Drive
                        </span>
                      )}

                      {car.vehicle?.isTaxiFleet && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                          Taxi Fleet
                        </span>
                      )}

                      {!car.vehicle?.isSelfDrive && !car.vehicle?.isTaxiFleet && (
                        <span className="text-xs px-2 py-1 rounded-full bg-[#ecb100]/10 text-[#ecb100]">
                          Luxury
                        </span>
                      )}

                    </div>
                  </td>

                  {/* CAPACITY (NEW OPTIONAL VIEW) */}
                  <td className="text-sm text-[#c7c7c7]">
                    <div>👤 {car.vehicle?.passengerCapacity ?? "-"}</div>
                    <div>🧳 {car.vehicle?.suitcaseCapacity ?? "-"}</div>
                  </td>

                  {/* PRICE */}
                  <td className="font-medium">
                    ₹{Number(car.vehicle?.price || 0).toLocaleString("en-IN")}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      car.vehicle?.available
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}>
                      {car.vehicle?.available ? "Available" : "Unavailable"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="text-right p-5">
                    <div className="flex justify-end gap-3">

                      <button
                        onClick={() => {
                          setEditCar(car);
                          setOpen(true);
                        }}
                        className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(car.id)}
                        className="h-9 w-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
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
      <LuxuryCarModal
        open={open}
        initialData={editCar}
        onClose={() => setOpen(false)}
        onSuccess={fetchCars}
      />

    </div>
  );
}