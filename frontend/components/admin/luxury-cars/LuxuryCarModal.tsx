"use client";

import { useEffect, useState } from "react";

import {
  createLuxuryCar,
  updateLuxuryCar,
} from "@/src/services/luxuryCarService";

import { uploadImage } from "@/src/lib/uploadImage";

import { Button } from "@/components/ui/button";

export default function LuxuryCarModal({
  open,
  onClose,
  onSuccess,
  initialData,
}: any) {

  const isEdit = !!initialData;

  const [form, setForm] = useState({
    name: "",
    price: "",
    slug: "",
    description: "",
    features: "",
    available: true,
    imageUrl: "",

    // ⚠️ NEW VEHICLE FLAGS (LOCKED FOR LUXURY)
    isTaxiFleet: false,
    isSelfDrive: false,

    passengerCapacity: "",
    suitcaseCapacity: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- SYNC INITIAL DATA ---------------- */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData?.vehicle?.name || initialData?.name || "",
        price: initialData?.vehicle?.price?.toString() || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        features: initialData?.features?.join(", ") || "",
        available: initialData?.vehicle?.available ?? true,
        imageUrl:
          initialData?.vehicle?.imageUrl ||
          initialData?.image ||
          "",

        // LOCKED VALUES
        isTaxiFleet: false,
        isSelfDrive: false,

        passengerCapacity: "",
        suitcaseCapacity: "",
      });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let imageUrl = form.imageUrl;

      if (file) {
        imageUrl = await uploadImage(file);
      }

      const payload = {
        name: form.name,
        price: Number(form.price),
        imageUrl,
        available: form.available,
        slug: form.slug,
        description: form.description,
        features: form.features
          .split(",")
          .map((f: string) => f.trim())
          .filter(Boolean),

        // 🚀 FORCE LUXURY RULES
        isTaxiFleet: false,
        isSelfDrive: false,

        passengerCapacity: null,
        suitcaseCapacity: null,
      };

      if (isEdit) {
        await updateLuxuryCar(initialData.id, payload);
      } else {
        await createLuxuryCar(payload);
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error("Luxury car save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="w-[550px] max-h-[90vh] overflow-y-auto bg-[#141414] border border-[#252525] rounded-2xl p-6">

        <h2 className="text-xl font-bold text-white mb-5">
          {isEdit ? "Edit Luxury Car" : "Add Luxury Car"}
        </h2>

        <div className="space-y-4">

          <input
            placeholder="Car Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full p-3 rounded-xl bg-black border border-[#252525] text-white"
          />

          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            className="w-full p-3 rounded-xl bg-black border border-[#252525] text-white"
          />

          <input
            placeholder="Slug"
            value={form.slug}
            onChange={(e) =>
              setForm({ ...form, slug: e.target.value })
            }
            className="w-full p-3 rounded-xl bg-black border border-[#252525] text-white"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full p-3 rounded-xl bg-black border border-[#252525] text-white"
          />

          <input
            placeholder="Features (comma separated)"
            value={form.features}
            onChange={(e) =>
              setForm({ ...form, features: e.target.value })
            }
            className="w-full p-3 rounded-xl bg-black border border-[#252525] text-white"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
            className="text-white"
          />

          <label className="flex gap-2 text-white text-sm">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) =>
                setForm({ ...form, available: e.target.checked })
              }
            />
            Available
          </label>

          {/* 🚫 LOCKED INFO (IMPORTANT UX CLARITY) */}
          <div className="text-xs text-[#8a8a8a]">
            Luxury cars are neither assigned to Taxi Fleet and nor can be self-drive vehicles.
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-[#ecb100] text-black"
          >
            {loading ? "Saving..." : "Save Luxury Car"}
          </Button>

        </div>

      </div>

    </div>
  );
}