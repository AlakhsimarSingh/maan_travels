"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  createVehicle,
  updateVehicle,
} from "@/src/services/vehicleService";

import { uploadImage } from "@/src/lib/uploadImage";
import { Button } from "@/components/ui/button";

type VehicleMode =
  | "general"
  | "luxury"
  | "tempo"
  | "selfdrive";

export default function VehicleModal({
  open,
  onClose,
  onSuccess,
  initialData,
  mode = "general",
}: any) {

  const isEdit = !!initialData;

  // ✅ FIX: correct mode logic
  const isSelfDrive = mode === "selfdrive";

  const categoryOptions: Record<VehicleMode, string[]> = {
    general: ["Sedan", "SUV", "MPV"],
    luxury: ["Luxury"],
    tempo: ["Tempo Traveller", "Urbania"],
    selfdrive: ["SUV", "Sedan", "Hatchback", "MPV"],
  };

  const allowedCategories = categoryOptions[mode];

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    available: true,

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

  /* ---------------- PREFILL ---------------- */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: initialData.category || "",
        price: initialData.price?.toString() || "",
        available: initialData.available ?? true,

        fuelType: initialData.fuelType || "",
        transmission: initialData.transmission || "",
        seats: initialData.seats?.toString() || "",
        modelYear: initialData.modelYear?.toString() || "",
        rentalPerDay: initialData.rentalPerDay?.toString() || "",
        description: initialData.description || "",

        passengerCapacity:
          initialData.passengerCapacity?.toString() || "",
        suitcaseCapacity:
          initialData.suitcaseCapacity?.toString() || "",
      });

      setPreview(initialData.imageUrl || null);
    } else {
      setForm({
        name: "",
        category: "",
        price: "",
        available: true,

        fuelType: "",
        transmission: "",
        seats: "",
        modelYear: "",
        rentalPerDay: "",
        description: "",

        passengerCapacity: "",
        suitcaseCapacity: "",
      });

      setPreview(null);
      setFile(null);
    }
  }, [initialData, open]);

  if (!open) return null;

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    try {
      if (!allowedCategories.includes(form.category)) {
        alert("Invalid category selected");
        return;
      }

      if (!form.passengerCapacity || !form.suitcaseCapacity) {
        alert("Passenger & suitcase capacity required");
        return;
      }

      setLoading(true);

      let imageUrl = initialData?.imageUrl || "";

      if (file) {
        imageUrl = await uploadImage(file);
      }

      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        available: form.available,
        imageUrl,

        // self drive
        fuelType: form.fuelType || null,
        transmission: form.transmission || null,
        seats: form.seats ? Number(form.seats) : null,
        modelYear: form.modelYear ? Number(form.modelYear) : null,
        rentalPerDay: form.rentalPerDay ? Number(form.rentalPerDay) : null,
        description: form.description || null,

        // common
        passengerCapacity: Number(form.passengerCapacity),
        suitcaseCapacity: Number(form.suitcaseCapacity),
      };

      if (isEdit) {
        await updateVehicle(initialData.id, payload);
      } else {
        await createVehicle(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="w-[520px] max-h-[90vh] overflow-y-auto bg-[#141414] border border-[#252525] p-6 rounded-2xl relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-red-400"
        >
          <X />
        </button>

        <h2 className="text-white text-xl font-bold mb-5">
          {isEdit ? "Edit Vehicle" : "Add Vehicle"}
        </h2>

        {/* NAME */}
        <input
          placeholder="Vehicle Name"
          className="w-full mb-3 p-3 bg-black border border-[#252525] rounded-lg text-white"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* CATEGORY */}
        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          className="w-full mb-3 p-3 bg-black border border-[#252525] rounded-lg text-white"
        >
          <option value="">Select Category</option>
          {allowedCategories.map((c: string) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* PRICE */}
        <input
          placeholder="Price"
          type="number"
          className="w-full mb-3 p-3 bg-black border border-[#252525] rounded-lg text-white"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        {/* ❗ ONLY SELF DRIVE MODE SHOWS THIS */}
        {isSelfDrive && (
          <div className="space-y-3 border border-[#252525] p-3 rounded-lg mb-3">

            <p className="text-[#ecb100] text-sm font-semibold">
              Self Drive Specs
            </p>

            <input placeholder="Fuel Type" className="w-full p-2 bg-black border border-[#252525] rounded text-white"
              value={form.fuelType}
              onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
            />

            <input placeholder="Transmission" className="w-full p-2 bg-black border border-[#252525] rounded text-white"
              value={form.transmission}
              onChange={(e) => setForm({ ...form, transmission: e.target.value })}
            />

          </div>
        )}

        {/* CAPACITY ALWAYS */}
        <input
          placeholder="Passengers"
          type="number"
          className="w-full mb-3 p-3 bg-black border border-[#252525] rounded-lg text-white"
          value={form.passengerCapacity}
          onChange={(e) =>
            setForm({ ...form, passengerCapacity: e.target.value })
          }
        />

        <input
          placeholder="Suitcases"
          type="number"
          className="w-full mb-3 p-3 bg-black border border-[#252525] rounded-lg text-white"
          value={form.suitcaseCapacity}
          onChange={(e) =>
            setForm({ ...form, suitcaseCapacity: e.target.value })
          }
        />

        {/* IMAGE */}
        <input
          type="file"
          className="w-full mb-3 text-white"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setFile(f);
              setPreview(URL.createObjectURL(f));
            }
          }}
        />

        {preview && (
          <img
            src={preview}
            className="h-40 w-full object-cover rounded-xl border border-[#252525]"
          />
        )}

        {/* SAVE */}
        <Button
          className="w-full bg-[#ecb100] text-black font-semibold mt-4"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Saving..." : "Save Vehicle"}
        </Button>
      </div>
    </div>
  );
}