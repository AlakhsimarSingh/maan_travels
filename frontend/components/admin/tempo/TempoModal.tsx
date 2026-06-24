"use client";

import { useEffect, useState } from "react";
import { X, BusFront, Image as ImageIcon, Loader2 } from "lucide-react";

import { createVehicle, updateVehicle } from "@/src/services/vehicleService";
import { uploadImage } from "@/src/lib/uploadImage";
import { Button } from "@/components/ui/button";

const TEMPO_CATEGORIES = ["Tempo Traveller", "Urbania"] as const;

type TempoFormState = {
  name: string;
  category: string;
  price: string;
  available: boolean;
  description: string;
  passengerCapacity: string;
  suitcaseCapacity: string;
};

const EMPTY_FORM: TempoFormState = {
  name: "",
  category: "",
  price: "",
  available: true,
  description: "",
  passengerCapacity: "",
  suitcaseCapacity: "",
};

export default function TempoModal({
  open,
  onClose,
  onSuccess,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}) {
  const isEdit = !!initialData;

  const [form, setForm] = useState<TempoFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: initialData.category || "",
        price: initialData.price?.toString() || "",
        available: initialData.available ?? true,
        description: initialData.description || "",
        passengerCapacity: initialData.passengerCapacity?.toString() || "",
        suitcaseCapacity: initialData.suitcaseCapacity?.toString() || "",
      });
      setPreview(initialData.imageUrl || null);
    } else {
      setForm(EMPTY_FORM);
      setPreview(null);
      setFile(null);
    }

    setErrors({});
  }, [initialData, open]);

  if (!open) return null;

  const setField = <K extends keyof TempoFormState>(key: K, value: TempoFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (!form.name.trim()) next.name = "Vehicle name is required";
    if (!form.category) next.category = "Select Tempo Traveller or Urbania";
    if (!form.price || Number(form.price) <= 0) next.price = "Enter a price greater than 0";

    if (!form.passengerCapacity || Number(form.passengerCapacity) <= 0) {
      next.passengerCapacity = "Required";
    }
    if (!form.suitcaseCapacity || Number(form.suitcaseCapacity) < 0) {
      next.suitcaseCapacity = "Required";
    }

    if (!isEdit && !file) next.image = "Upload a vehicle image";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      let imageUrl = initialData?.imageUrl || "";
      if (file) {
        imageUrl = await uploadImage(file);
      }

      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        available: form.available,
        imageUrl,
        description: form.description || null,

        passengerCapacity: Number(form.passengerCapacity),
        suitcaseCapacity: Number(form.suitcaseCapacity),

        // Tempo / Urbania vehicles are never part of the taxi fleet
        // or self-drive fleet — they're a category of their own.
        isTaxiFleet: false,
        isSelfDrive: false,
      };

      if (isEdit) {
        await updateVehicle(initialData.id, payload);
      } else {
        await createVehicle(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Tempo vehicle save error:", err);
      setErrors((prev) => ({ ...prev, submit: "Something went wrong. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overlay-enter"
      onClick={onClose}
    >
      <div
        className="modal-enter relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#252525] bg-[#141414]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#252525] bg-[#141414] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ecb100]/10 text-[#ecb100]">
              <BusFront size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEdit ? "Edit Traveller" : "Add Traveller"}
              </h2>
              <p className="text-xs text-[#8a8a8a]">Tempo Traveller / Urbania</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#8a8a8a] transition hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-6">
          <Field label="Vehicle name" error={errors.name}>
            <input
              placeholder="e.g. Force Urbania Deluxe"
              className={inputClass(!!errors.name)}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </Field>

          <Field label="Category" error={errors.category}>
            <select
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              className={inputClass(!!errors.category)}
            >
              <option value="">Select category</option>
              {TEMPO_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Price (₹)" error={errors.price}>
              <input
                placeholder="0"
                type="number"
                min={0}
                className={inputClass(!!errors.price)}
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
              />
            </Field>

            <Field label="Passengers" error={errors.passengerCapacity}>
              <input
                placeholder="e.g. 17"
                type="number"
                min={0}
                className={inputClass(!!errors.passengerCapacity)}
                value={form.passengerCapacity}
                onChange={(e) => setField("passengerCapacity", e.target.value)}
              />
            </Field>

            <Field label="Suitcases" error={errors.suitcaseCapacity}>
              <input
                placeholder="e.g. 10"
                type="number"
                min={0}
                className={inputClass(!!errors.suitcaseCapacity)}
                value={form.suitcaseCapacity}
                onChange={(e) => setField("suitcaseCapacity", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Description" optional>
            <textarea
              placeholder="Short description shown on the booking page"
              className={`${inputClass(false)} min-h-20 resize-none`}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </Field>

          <Field label="Available for booking">
            <label className="flex h-[46px] items-center gap-3 rounded-lg border border-[#252525] bg-black px-3">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setField("available", e.target.checked)}
                className="h-4 w-4 accent-[#ecb100]"
              />
              <span className="text-sm text-[#c7c7c7]">
                {form.available ? "Visible to customers" : "Hidden from customers"}
              </span>
            </label>
          </Field>

          {/* IMAGE */}
          <Field label="Vehicle image" error={errors.image}>
            <div
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition ${
                errors.image ? "border-red-500/60" : "border-[#252525]"
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Vehicle preview"
                  className="h-36 w-full max-w-sm rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-36 w-full max-w-sm items-center justify-center rounded-lg bg-black/40 text-[#555]">
                  <ImageIcon size={28} />
                </div>
              )}

              <label className="cursor-pointer rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-[#ecb100] transition hover:bg-white/10">
                {preview ? "Change image" : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setFile(f);
                      setPreview(URL.createObjectURL(f));
                      setErrors((prev) => ({ ...prev, image: "" }));
                    }
                  }}
                />
              </label>
            </div>
          </Field>

          {errors.submit && <p className="text-xs text-red-400">{errors.submit}</p>}
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-[#252525] bg-[#141414] px-6 py-4">
          <Button
            variant="ghost"
            className="text-[#c7c7c7] hover:text-white"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            className="min-w-32 bg-[#ecb100] font-semibold text-black hover:bg-[#f6c94c]"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Saving
              </span>
            ) : isEdit ? (
              "Save changes"
            ) : (
              "Add traveller"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-black px-3 py-2.5 text-white outline-none transition focus:border-[#ecb100]/60 ${
    hasError ? "border-red-500/60" : "border-[#252525]"
  }`;
}

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-[#8a8a8a]">
        <span>{label}</span>
        {optional && <span className="text-[#555]">Optional</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}