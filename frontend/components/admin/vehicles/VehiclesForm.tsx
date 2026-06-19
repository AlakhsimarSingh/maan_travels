"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import {
  createVehicle,
  updateVehicle,
} from "@/src/services/vehicleService";

import { uploadImage } from "@/src/lib/uploadImage";

export default function VehicleForm({
  vehicle,
  onClose,
  onSuccess,
}: {
  vehicle?: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    available: true,

    isTaxiFleet: true,
    isSelfDrive: false,

    fuelType: "",
    transmission: "",
    seats: "",
    modelYear: "",
    rentalPerDay: "",
    description: "",

    passengerCapacity: "",
    suitcaseCapacity: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSelfDrive = form.isSelfDrive;

  /* ---------------- LOAD EDIT ---------------- */
  useEffect(() => {
    if (!vehicle) return;

    setForm({
      name: vehicle.name || "",
      category: vehicle.category || "",
      price: vehicle.price?.toString() || "",
      available: vehicle.available ?? true,

      isTaxiFleet: vehicle.isTaxiFleet ?? true,
      isSelfDrive: vehicle.isSelfDrive ?? false,

      fuelType: vehicle.fuelType || "",
      transmission: vehicle.transmission || "",
      seats: vehicle.seats?.toString() || "",
      modelYear: vehicle.modelYear?.toString() || "",
      rentalPerDay: vehicle.rentalPerDay?.toString() || "",
      description: vehicle.description || "",

      passengerCapacity: vehicle.passengerCapacity?.toString() || "",
      suitcaseCapacity: vehicle.suitcaseCapacity?.toString() || "",
    });

    setPreview(vehicle.imageUrl || null);
  }, [vehicle]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!form.passengerCapacity || !form.suitcaseCapacity) {
        alert("Passenger and suitcase capacity are required");
        return;
      }

      let imageUrl = vehicle?.imageUrl || "";

      if (file) {
        imageUrl = await uploadImage(file);
      }

      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        available: form.available,
        imageUrl,

        isTaxiFleet: form.isTaxiFleet,
        isSelfDrive: form.isSelfDrive,

        fuelType: form.fuelType || null,
        transmission: form.transmission || null,
        seats: form.seats ? Number(form.seats) : null,
        modelYear: form.modelYear ? Number(form.modelYear) : null,
        rentalPerDay: form.rentalPerDay ? Number(form.rentalPerDay) : null,
        description: form.description || null,

        passengerCapacity: Number(form.passengerCapacity),
        suitcaseCapacity: Number(form.suitcaseCapacity),
      };

      if (vehicle) {
        await updateVehicle(vehicle.id, payload);
      } else {
        await createVehicle(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Vehicle save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      {/* MODAL */}
      <div className="w-[600px] max-h-[90vh] overflow-y-auto bg-[#141414] border border-[#252525] p-6 rounded-2xl relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl text-white mb-4">
          {vehicle ? "Edit Vehicle" : "Add Vehicle"}
        </h2>

        <div className="space-y-4">

          {/* NAME */}
          <input
            placeholder="Vehicle Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-3 bg-black border border-[#252525] rounded-xl text-white"
          />

          {/* CATEGORY */}
          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full p-3 bg-black border border-[#252525] rounded-xl text-white"
          >
            <option value="">Select Category</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="MPV">MPV</option>
            <option value="Tempo Traveller">Tempo Traveller</option>
            <option value="Urbania">Urbania</option>
            <option value="Luxury">Luxury</option>
          </select>

          {/* PRICE */}
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full p-3 bg-black border border-[#252525] rounded-xl text-white"
          />

          {/* FLEET FLAGS */}
          <div className="flex gap-6 text-white">

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isTaxiFleet}
                onChange={(e) =>
                  handleChange("isTaxiFleet", e.target.checked)
                }
              />
              Taxi Fleet
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isSelfDrive}
                onChange={(e) =>
                  handleChange("isSelfDrive", e.target.checked)
                }
              />
              Self Drive
            </label>

          </div>

          {/* CAPACITY (GLOBAL RULE) */}
          <div className="grid grid-cols-2 gap-3">

            <input
              placeholder="Passengers"
              type="number"
              value={form.passengerCapacity}
              onChange={(e) =>
                handleChange("passengerCapacity", e.target.value)
              }
              className="w-full p-3 bg-black border border-[#252525] rounded-xl text-white"
            />

            <input
              placeholder="Suitcases"
              type="number"
              value={form.suitcaseCapacity}
              onChange={(e) =>
                handleChange("suitcaseCapacity", e.target.value)
              }
              className="w-full p-3 bg-black border border-[#252525] rounded-xl text-white"
            />

          </div>

          {/* SELF DRIVE ONLY */}
          {isSelfDrive && (
            <div className="space-y-3 border border-[#252525] p-4 rounded-xl">

              <p className="text-[#ecb100] text-sm font-semibold">
                Self Drive Specs
              </p>

              <input
                placeholder="Fuel Type"
                value={form.fuelType}
                onChange={(e) => handleChange("fuelType", e.target.value)}
                className="w-full p-2 bg-black border border-[#252525] rounded text-white"
              />

              <input
                placeholder="Transmission"
                value={form.transmission}
                onChange={(e) => handleChange("transmission", e.target.value)}
                className="w-full p-2 bg-black border border-[#252525] rounded text-white"
              />

              <input
                placeholder="Seats"
                type="number"
                value={form.seats}
                onChange={(e) => handleChange("seats", e.target.value)}
                className="w-full p-2 bg-black border border-[#252525] rounded text-white"
              />

              <input
                placeholder="Model Year"
                type="number"
                value={form.modelYear}
                onChange={(e) => handleChange("modelYear", e.target.value)}
                className="w-full p-2 bg-black border border-[#252525] rounded text-white"
              />

              <input
                placeholder="Rental Per Day"
                type="number"
                value={form.rentalPerDay}
                onChange={(e) => handleChange("rentalPerDay", e.target.value)}
                className="w-full p-2 bg-black border border-[#252525] rounded text-white"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full p-2 bg-black border border-[#252525] rounded text-white"
              />

            </div>
          )}

          {/* IMAGE */}
          <input
            type="file"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              if (f) setPreview(URL.createObjectURL(f));
            }}
            className="w-full text-white"
          />

          {preview && (
            <img
              src={preview}
              className="h-40 w-full object-cover rounded-xl border border-[#252525]"
            />
          )}

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">

          <Button
            onClick={onClose}
            variant="outline"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            className="bg-[#ecb100] text-black"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Vehicle"}
          </Button>

        </div>

      </div>
    </div>
  );
}