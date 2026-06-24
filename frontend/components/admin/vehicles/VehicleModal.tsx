"use client";

import { useEffect, useState } from "react";
import { X, Car, Gauge, Image as ImageIcon, Loader2 } from "lucide-react";

import {
  createVehicle,
  updateVehicle,
} from "@/src/services/vehicleService";

import { uploadImage } from "@/src/lib/uploadImage";
import { Button } from "@/components/ui/button";

/* ---------------------------------------------------------
   This modal only manages vehicles for the general Taxi Fleet /
   Self Drive page. Luxury cars and Tempo/Urbania travellers are
   their own vehicle categories with dedicated admin pages and
   modals (LuxuryCarModal, TempoModal) — they are never created
   or edited here, so their categories don't appear in this list.
--------------------------------------------------------- */
const FLEET_CATEGORY_OPTIONS = {
  taxi: ["Sedan", "SUV", "MPV"],
  selfDrive: ["Sedan", "SUV", "Hatchback", "MPV"],
} as const;

function getCategoryOptions(isTaxiFleet: boolean, isSelfDrive: boolean): string[] {
  const sets: string[][] = [];

  if (isTaxiFleet) sets.push(FLEET_CATEGORY_OPTIONS.taxi);
  if (isSelfDrive) sets.push(FLEET_CATEGORY_OPTIONS.selfDrive);

  if (sets.length === 0) {
    // Neither fleet picked yet — show everything so the field isn't dead.
    return Array.from(
      new Set([
        ...FLEET_CATEGORY_OPTIONS.taxi,
        ...FLEET_CATEGORY_OPTIONS.selfDrive,
      ])
    );
  }

  return Array.from(new Set(sets.flat()));
}

type VehicleFormState = {
  name: string;
  category: string;
  price: string;
  available: boolean;

  isTaxiFleet: boolean;
  isSelfDrive: boolean;

  fuelType: string;
  transmission: string;
  seats: string;
  modelYear: string;
  rentalPerDay: string;
  description: string;

  passengerCapacity: string;
  suitcaseCapacity: string;
};

const EMPTY_FORM: VehicleFormState = {
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
};

export default function VehicleModal({
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

  const [form, setForm] = useState<VehicleFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categoryOptions = getCategoryOptions(form.isTaxiFleet, form.isSelfDrive);

  /* ---------------- PREFILL ---------------- */
  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: initialData.category || "",
        price: initialData.price?.toString() || "",
        available: initialData.available ?? true,

        isTaxiFleet: initialData.isTaxiFleet ?? true,
        isSelfDrive: initialData.isSelfDrive ?? false,

        fuelType: initialData.fuelType || "",
        transmission: initialData.transmission || "",
        seats: initialData.seats?.toString() || "",
        modelYear: initialData.modelYear?.toString() || "",
        rentalPerDay: initialData.rentalPerDay?.toString() || "",
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

  // If the chosen category falls out of scope after toggling fleets, clear it.
  useEffect(() => {
    if (form.category && !categoryOptions.includes(form.category)) {
      setForm((prev) => ({ ...prev, category: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.isTaxiFleet, form.isSelfDrive]);

  if (!open) return null;

  const setField = <K extends keyof VehicleFormState>(key: K, value: VehicleFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (!form.name.trim()) next.name = "Vehicle name is required";
    if (!form.category) next.category = "Select a category";
    if (!form.price || Number(form.price) <= 0) next.price = "Enter a price greater than 0";

    if (!form.isTaxiFleet && !form.isSelfDrive) {
      next.fleet = "Select at least one fleet";
    }

    if (!form.passengerCapacity || Number(form.passengerCapacity) <= 0) {
      next.passengerCapacity = "Required";
    }
    if (!form.suitcaseCapacity || Number(form.suitcaseCapacity) < 0) {
      next.suitcaseCapacity = "Required";
    }

    if (form.isSelfDrive) {
      if (!form.fuelType) next.fuelType = "Required for self drive";
      if (!form.transmission) next.transmission = "Required for self drive";
      if (!form.rentalPerDay || Number(form.rentalPerDay) <= 0) {
        next.rentalPerDay = "Required for self drive";
      }
    }

    if (!isEdit && !file) next.image = "Upload a vehicle image";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
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

        isTaxiFleet: form.isTaxiFleet,
        isSelfDrive: form.isSelfDrive,

        fuelType: form.isSelfDrive ? form.fuelType || null : null,
        transmission: form.isSelfDrive ? form.transmission || null : null,
        seats: form.isSelfDrive && form.seats ? Number(form.seats) : null,
        modelYear: form.isSelfDrive && form.modelYear ? Number(form.modelYear) : null,
        rentalPerDay: form.isSelfDrive && form.rentalPerDay ? Number(form.rentalPerDay) : null,
        description: form.description || null,

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
        className="modal-enter relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#252525] bg-[#141414]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#252525] bg-[#141414] px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEdit ? "Edit Vehicle" : "Add Vehicle"}
            </h2>
            <p className="mt-0.5 text-sm text-[#8a8a8a]">
              A vehicle can belong to the taxi fleet, self drive, or both.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#8a8a8a] transition hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8 px-6 py-6">
          {/* FLEET ASSIGNMENT */}
          <FormSection icon={<Car size={16} />} title="Fleet assignment">
            <div className="grid gap-3 sm:grid-cols-2">
              <FleetToggle
                label="Taxi Fleet"
                description="Chauffeur-driven bookings"
                checked={form.isTaxiFleet}
                onChange={(v) => setField("isTaxiFleet", v)}
              />
              <FleetToggle
                label="Self Drive"
                description="Customer drives the vehicle"
                checked={form.isSelfDrive}
                onChange={(v) => setField("isSelfDrive", v)}
              />
            </div>
            {errors.fleet && <FieldError message={errors.fleet} />}
          </FormSection>

          {/* BASIC DETAILS */}
          <FormSection icon={<Gauge size={16} />} title="Basic details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Vehicle name" error={errors.name}>
                <input
                  placeholder="e.g. Toyota Innova Crysta"
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
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label={form.isSelfDrive && !form.isTaxiFleet ? "Price per day (₹)" : "Price (₹)"}
                error={errors.price}
              >
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
                  placeholder="e.g. 6"
                  type="number"
                  min={0}
                  className={inputClass(!!errors.passengerCapacity)}
                  value={form.passengerCapacity}
                  onChange={(e) => setField("passengerCapacity", e.target.value)}
                />
              </Field>

              <Field label="Suitcases" error={errors.suitcaseCapacity}>
                <input
                  placeholder="e.g. 3"
                  type="number"
                  min={0}
                  className={inputClass(!!errors.suitcaseCapacity)}
                  value={form.suitcaseCapacity}
                  onChange={(e) => setField("suitcaseCapacity", e.target.value)}
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
            </div>

            <Field label="Description" optional>
              <textarea
                placeholder="Short description shown on the booking page"
                className={`${inputClass(false)} min-h-20 resize-none`}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </Field>
          </FormSection>

          {/* SELF DRIVE SPECS */}
          {form.isSelfDrive && (
            <FormSection icon={<Gauge size={16} />} title="Self drive specs">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Fuel type" error={errors.fuelType}>
                  <select
                    value={form.fuelType}
                    onChange={(e) => setField("fuelType", e.target.value)}
                    className={inputClass(!!errors.fuelType)}
                  >
                    <option value="">Select fuel type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="CNG">CNG</option>
                  </select>
                </Field>

                <Field label="Transmission" error={errors.transmission}>
                  <select
                    value={form.transmission}
                    onChange={(e) => setField("transmission", e.target.value)}
                    className={inputClass(!!errors.transmission)}
                  >
                    <option value="">Select transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </Field>

                <Field label="Seats" optional>
                  <input
                    placeholder="e.g. 5"
                    type="number"
                    min={0}
                    className={inputClass(false)}
                    value={form.seats}
                    onChange={(e) => setField("seats", e.target.value)}
                  />
                </Field>

                <Field label="Model year" optional>
                  <input
                    placeholder="e.g. 2025"
                    type="number"
                    min={1990}
                    className={inputClass(false)}
                    value={form.modelYear}
                    onChange={(e) => setField("modelYear", e.target.value)}
                  />
                </Field>

                <Field label="Rental per day (₹)" error={errors.rentalPerDay}>
                  <input
                    placeholder="e.g. 3500"
                    type="number"
                    min={0}
                    className={inputClass(!!errors.rentalPerDay)}
                    value={form.rentalPerDay}
                    onChange={(e) => setField("rentalPerDay", e.target.value)}
                  />
                </Field>
              </div>
            </FormSection>
          )}

          {/* IMAGE */}
          <FormSection icon={<ImageIcon size={16} />} title="Vehicle image">
            <div
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition ${
                errors.image ? "border-red-500/60" : "border-[#252525]"
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Vehicle preview"
                  className="h-40 w-full max-w-sm rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-40 w-full max-w-sm items-center justify-center rounded-lg bg-black/40 text-[#555]">
                  <ImageIcon size={32} />
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
            {errors.image && <FieldError message={errors.image} />}
          </FormSection>

          {errors.submit && <FieldError message={errors.submit} />}
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
              "Add vehicle"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-black px-3 py-2.5 text-white outline-none transition focus:border-[#ecb100]/60 ${
    hasError ? "border-red-500/60" : "border-[#252525]"
  }`;
}

function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#ecb100]">
        {icon}
        {title}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
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
      {error && <FieldError message={error} />}
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="mt-1 text-xs text-red-400">{message}</p>;
}

function FleetToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
        checked
          ? "border-[#ecb100]/60 bg-[#ecb100]/10"
          : "border-[#252525] bg-black/30 hover:border-[#3a3a3a]"
      }`}
    >
      <div>
        <p className={`font-medium ${checked ? "text-[#ecb100]" : "text-white"}`}>{label}</p>
        <p className="mt-0.5 text-xs text-[#8a8a8a]">{description}</p>
      </div>

      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          checked ? "border-[#ecb100] bg-[#ecb100]" : "border-[#3a3a3a]"
        }`}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-black" />}
      </span>
    </button>
  );
}