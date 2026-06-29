"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import {
  createLocation,
  updateLocation,
  uploadLocationImage,
} from "@/src/services/locationService";

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
      setForm({ name: "", imageUrl: "", canPickup: false, canDrop: false, active: true });
    }
    setError("");
  }, [initialData, open]);

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file"); return; }
    try {
      setUploading(true);
      setError("");
      const res = await uploadLocationImage(file);
      if (res.success && res.url) setForm((prev) => ({ ...prev, imageUrl: res.url }));
      else setError(res.message || "Image upload failed");
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError("Location name is required"); return; }
    if (!form.canPickup && !form.canDrop) { setError("Select at least pickup or drop availability"); return; }
    try {
      setSaving(true);
      setError("");
      const res = isEdit
        ? await updateLocation(initialData.id, form)
        : await createLocation(form);
      if (!res.success) { setError(res.message || "Something went wrong"); return; }
      onSuccess();
      onClose();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* ── MOBILE: slide-up sheet, pb-20 clears bottom nav ── */}
      <div className="md:hidden">
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl border-t border-[#1c1c1c] bg-[#0d0d0d]" style={{ maxHeight: "90dvh" }}>
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="h-1 w-10 rounded-full bg-[#2a2a2a]" />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1c1c1c] px-5 py-3 shrink-0">
            <p className="text-[15px] font-semibold text-white">
              {isEdit ? "Edit Location" : "Add Tour Location"}
            </p>
            <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1a1a] text-[#666]">
              <X size={14} />
            </button>
          </div>
          {/* Scrollable body — pb-24 clears bottom nav */}
          <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 space-y-4">
            <ModalBody
              form={form}
              setForm={setForm}
              uploading={uploading}
              saving={saving}
              error={error}
              fileInputRef={fileInputRef}
              handleFileSelect={handleFileSelect}
              handleSubmit={handleSubmit}
              onClose={onClose}
              isEdit={isEdit}
            />
          </div>
        </div>
      </div>

      {/* ── DESKTOP: centered dialog ── */}
      <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 flex flex-col w-full max-w-md max-h-[88vh] rounded-2xl border border-[#1c1c1c] bg-[#0d0d0d] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1c1c1c] px-6 py-4 shrink-0">
            <p className="text-[15px] font-semibold text-white">
              {isEdit ? "Edit Location" : "Add Tour Location"}
            </p>
            <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1a1a] text-[#666] transition hover:text-white">
              <X size={14} />
            </button>
          </div>
          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <ModalBody
              form={form}
              setForm={setForm}
              uploading={uploading}
              saving={saving}
              error={error}
              fileInputRef={fileInputRef}
              handleFileSelect={handleFileSelect}
              handleSubmit={handleSubmit}
              onClose={onClose}
              isEdit={isEdit}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// ── Shared form body ─────────────────────────────────────────
function ModalBody({
  form, setForm, uploading, saving, error,
  fileInputRef, handleFileSelect, handleSubmit, onClose, isEdit,
}: {
  form: any;
  setForm: any;
  uploading: boolean;
  saving: boolean;
  error: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  onClose: () => void;
  isEdit: boolean;
}) {
  return (
    <>
      {/* IMAGE UPLOAD */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#3a3a3a]">
          Destination Image
        </p>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#222] bg-[#0a0a0a] transition hover:border-[#ecb100]/40"
        >
          {form.imageUrl ? (
            <>
              <img src={form.imageUrl} alt={form.name || "Location"} className="h-full w-full object-cover transition group-hover:opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                <span className="rounded-full bg-black/70 px-3 py-1.5 text-[12px] text-white">Change image</span>
              </div>
            </>
          ) : uploading ? (
            <div className="flex flex-col items-center gap-2 text-[#555]">
              <Loader2 size={20} className="animate-spin text-[#ecb100]" />
              <span className="text-[12px]">Uploading…</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#444]">
              <ImagePlus size={20} />
              <span className="text-[12px]">Click to upload image</span>
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </div>

      {/* NAME */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#3a3a3a]">
          Location Name
        </p>
        <input
          placeholder="e.g. Amritsar"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-[#1c1c1c] bg-[#0a0a0a] px-3 py-2.5 text-[13px] text-white outline-none placeholder:text-[#333] transition focus:border-[#ecb100]/50"
        />
      </div>

      {/* TOGGLES */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#3a3a3a]">
          Availability
        </p>
        <div className="space-y-2">
          <ToggleRow label="Available as pickup" checked={form.canPickup} onChange={(v) => setForm({ ...form, canPickup: v })} />
          <ToggleRow label="Available as destination (drop)" checked={form.canDrop} onChange={(v) => setForm({ ...form, canDrop: v })} />
          <ToggleRow label="Active" checked={form.active} onChange={(v) => setForm({ ...form, active: v })} />
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-[12px] text-red-400">
          {error}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-[#1c1c1c] bg-[#141414] py-2.5 text-[13px] text-[#666] transition hover:text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving || uploading}
          className="flex-1 rounded-lg bg-[#ecb100] py-2.5 text-[13px] font-semibold text-black transition hover:bg-[#f6c94c] disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Location"}
        </button>
      </div>
    </>
  );
}

function ToggleRow({ label, checked, onChange }: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[#1c1c1c] bg-[#0a0a0a] px-4 py-3 text-[13px] text-white transition hover:border-[#222]">
      {label}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-[#ecb100]" : "bg-[#222]"}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}