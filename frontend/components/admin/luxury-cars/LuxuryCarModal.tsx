"use client";

import { useEffect, useState } from "react";
import { X, Sparkles, Image as ImageIcon, Loader2 } from "lucide-react";

import { createLuxuryCar, updateLuxuryCar } from "@/src/services/luxuryCarService";
import { uploadImage } from "@/src/lib/uploadImage";
import { Button } from "@/components/ui/button";

type LuxuryFormState = {
  name: string;
  price: string;
  slug: string;
  description: string;
  features: string;
  available: boolean;
};

const EMPTY_FORM: LuxuryFormState = {
  name: "",
  price: "",
  slug: "",
  description: "",
  features: "",
  available: true,
};

/* Turns "Rolls Royce Phantom" into "rolls-royce-phantom" */
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function LuxuryCarModal({
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

  const [form, setForm] = useState<LuxuryFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- PREFILL ---------------- */
  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        name: initialData?.vehicle?.name || initialData?.name || "",
        price: initialData?.vehicle?.price?.toString() || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        features: Array.isArray(initialData?.features)
          ? initialData.features.join(", ")
          : "",
        available: initialData?.vehicle?.available ?? true,
      });

      setPreview(initialData?.vehicle?.imageUrl || initialData?.image || null);
      setSlugTouched(true); // existing slug shouldn't auto-regenerate on edit
    } else {
      setForm(EMPTY_FORM);
      setPreview(null);
      setFile(null);
      setSlugTouched(false);
    }

    setErrors({});
  }, [initialData, open]);

  // Auto-generate the slug from the name until the user edits it manually.
  useEffect(() => {
    if (!slugTouched) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name, slugTouched]);

  if (!open) return null;

  const setField = <K extends keyof LuxuryFormState>(key: K, value: LuxuryFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (!form.name.trim()) next.name = "Car name is required";

    if (!form.price || Number(form.price) <= 0) {
      next.price = "Enter a price greater than 0";
    }

    const cleanSlug = slugify(form.slug);
    if (!cleanSlug) {
      next.slug = "Slug is required";
    } else if (cleanSlug !== form.slug) {
      next.slug = "Use only lowercase letters, numbers and hyphens";
    }

    if (!form.description.trim()) next.description = "Add a short description";

    if (!isEdit && !file) next.image = "Upload a car image";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      let imageUrl = initialData?.vehicle?.imageUrl || initialData?.image || "";
      if (file) {
        imageUrl = await uploadImage(file);
      }

      // Matches the backend contract exactly — isTaxiFleet, isSelfDrive,
      // and capacity fields are intentionally NOT sent. The server always
      // forces those to false/null for Luxury cars, so sending them here
      // would just be misleading dead weight in the payload.
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        imageUrl,
        available: form.available,
        slug: form.slug.trim(),
        description: form.description.trim(),
        features: form.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      };

      if (isEdit) {
        await updateLuxuryCar(initialData.id, payload);
      } else {
        await createLuxuryCar(payload);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Luxury car save error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error?.message || "Something went wrong. Please try again.",
      }));
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
        className="modal-enter relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#252525] bg-[#141414]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#252525] bg-[#141414] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ecb100]/10 text-[#ecb100]">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEdit ? "Edit Luxury Car" : "Add Luxury Car"}
              </h2>
              <p className="text-xs text-[#8a8a8a]">
                Never part of the taxi fleet or self drive
              </p>
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
          <Field label="Car name" error={errors.name}>
            <input
              placeholder="e.g. Rolls Royce Phantom"
              className={inputClass(!!errors.name)}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
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

            <Field
              label="Slug"
              error={errors.slug}
              hint={!errors.slug ? "Used in the car's URL" : undefined}
            >
              <input
                placeholder="rolls-royce-phantom"
                className={inputClass(!!errors.slug)}
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setField("slug", e.target.value);
                }}
              />
            </Field>
          </div>

          <Field label="Description" error={errors.description}>
            <textarea
              placeholder="Short description shown on the booking page"
              className={`${inputClass(!!errors.description)} min-h-24 resize-none`}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </Field>

          <Field label="Features" hint="Comma separated, e.g. Chauffeur, Bluetooth, Sunroof">
            <input
              placeholder="Chauffeur, Bluetooth, Sunroof"
              className={inputClass(false)}
              value={form.features}
              onChange={(e) => setField("features", e.target.value)}
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
          <Field label="Car image" error={errors.image}>
            <div
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition ${
                errors.image ? "border-red-500/60" : "border-[#252525]"
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Luxury car preview"
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
          </Field>

          {/* RULE NOTICE */}
          <div className="rounded-lg border border-[#252525] bg-black/30 px-4 py-3 text-xs text-[#8a8a8a]">
            Luxury cars are never part of the Taxi Fleet or Self Drive fleet — this is enforced
            automatically and can't be changed here.
          </div>

          {errors.submit && (
            <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errors.submit}
            </p>
          )}
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
            disabled={loading}
            onClick={handleSubmit}
            className="min-w-32 bg-[#ecb100] font-semibold text-black hover:bg-[#f6c94c]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Saving
              </span>
            ) : isEdit ? (
              "Save changes"
            ) : (
              "Add luxury car"
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
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[#8a8a8a]">{label}</label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-[#555]">{hint}</p>
      ) : null}
    </div>
  );
}