"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import {
  createLocation,
  updateLocation,
  uploadLocationImage,
} from "@/src/services/locationService";

import { Button } from "@/components/ui/button";

export default function LocationModal({
  open,
  onClose,
  onSuccess,
  initialData,
}: any) {
  const isEdit = !!initialData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
    canPickup: false,
    canDrop: false,
    active: true,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        imageUrl: initialData.imageUrl || "",
        canPickup: initialData.canPickup ?? false,
        canDrop: initialData.canDrop ?? false,
        active: initialData.active ?? true,
      });
    } else {
      setForm({
        name: "",
        imageUrl: "",
        canPickup: false,
        canDrop: false,
        active: true,
      });
    }
    setError("");
  }, [initialData, open]);

  if (!open) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const res = await uploadLocationImage(file);

      if (res.success && res.url) {
        setForm((prev) => ({ ...prev, imageUrl: res.url }));
      } else {
        setError(res.message || "Image upload failed");
      }
    } catch (err) {
      console.error(err);
      setError("Image upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Location name is required");
      return;
    }

    if (!form.canPickup && !form.canDrop) {
      setError("Select pickup or destination availability");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const res = isEdit
        ? await updateLocation(initialData.id, form)
        : await createLocation(form);

      if (!res.success) {
        setError(res.message || "Something went wrong");
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-[#252525] bg-[#141414] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "Edit Location" : "Add Tour Location"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#8a8a8a] transition hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="mb-5">
          <label className="mb-2 block text-xs uppercase tracking-wide text-[#8a8a8a]">
            Destination image
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="
              group relative flex h-40 w-full cursor-pointer items-center justify-center
              overflow-hidden rounded-2xl border border-dashed border-[#333]
              bg-black/40 transition hover:border-[#ecb100]/50
            "
          >
            {form.imageUrl ? (
              <>
                <img
                  src={form.imageUrl}
                  alt={form.name || "Location"}
                  className="h-full w-full object-cover transition group-hover:opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <span className="rounded-full bg-black/70 px-3 py-1.5 text-xs text-white">
                    Change image
                  </span>
                </div>
              </>
            ) : uploading ? (
              <div className="flex flex-col items-center gap-2 text-[#8a8a8a]">
                <Loader2 size={22} className="animate-spin text-[#ecb100]" />
                <span className="text-xs">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#8a8a8a]">
                <ImagePlus size={22} />
                <span className="text-xs">Click to upload an image</span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* NAME */}
        <input
          placeholder="Location name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="
            mb-4 w-full rounded-xl border border-[#252525] bg-black p-3
            text-white outline-none transition focus:border-[#ecb100]
          "
        />

        {/* TOGGLES */}
        <div className="mb-5 space-y-3">
          <ToggleRow
            label="Available as pickup"
            checked={form.canPickup}
            onChange={(v) => setForm({ ...form, canPickup: v })}
          />
          <ToggleRow
            label="Available as destination"
            checked={form.canDrop}
            onChange={(v) => setForm({ ...form, canDrop: v })}
          />
          <ToggleRow
            label="Active"
            checked={form.active}
            onChange={(v) => setForm({ ...form, active: v })}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/5 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={saving || uploading}
            className="bg-[#ecb100] text-black hover:bg-[#f6c94c]"
            onClick={handleSubmit}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#252525] bg-black/30 px-4 py-3 text-sm text-white transition hover:border-[#3a3a3a]">
      {label}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-[#ecb100]" : "bg-[#333]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}