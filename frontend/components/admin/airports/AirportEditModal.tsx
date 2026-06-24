"use client";

import { useEffect, useState } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";

import { API_URL } from "@/src/services/bookingService";
import { resolveImageUrl } from "@/src/lib/resolveImageUrl";

type Airport = {
  id: string;
  name: string;
  shortName: string;
  image: string | null;
  description: string | null;
  active: boolean;
};

export default function AirportEditModal({
  open,
  airport,
  onClose,
  onSuccess,
}: {
  open: boolean;
  airport: Airport | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !airport) return;

    setName(airport.name);
    setShortName(airport.shortName);
    setDescription(airport.description || "");
    setFile(null);
    setPreview(airport.image ? resolveImageUrl(airport.image, API_URL) : null);
    setError("");
  }, [open, airport]);

  if (!open || !airport) return null;

  const handleSubmit = async () => {
    setError("");

    if (!name.trim() || !shortName.trim()) {
      setError("Name and short name are required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", name.trim());
      data.append("shortName", shortName.trim());
      data.append("description", description);
      if (file) data.append("image", file);

      const res = await fetch(`${API_URL}/api/airports/${airport.id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      const resData = await res.json();

      if (!resData.success) {
        setError(resData.message || "Failed to update airport");
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update airport");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#252525] bg-[#111]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#252525] bg-[#111] px-6 py-4">
          <h2 className="text-lg font-bold text-white">Edit airport</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 transition hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-6">
          {/* NAME */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amritsar Airport"
              className="w-full rounded-lg border border-[#252525] bg-black p-2.5 text-white outline-none focus:border-[#ecb100]/60"
            />
          </div>

          {/* SHORT NAME */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Short name</label>
            <input
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              placeholder="e.g. Amritsar"
              className="w-full rounded-lg border border-[#252525] bg-black p-2.5 text-white outline-none focus:border-[#ecb100]/60"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="min-h-20 w-full rounded-lg border border-[#252525] bg-black p-2.5 text-white outline-none focus:border-[#ecb100]/60"
            />
          </div>

          {/* IMAGE PREVIEW + REPLACE */}
          <div>
            <p className="mb-2 text-sm text-white/70">Airport image</p>

            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-[#252525] p-4 text-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-40 w-full max-w-sm rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-40 w-full max-w-sm items-center justify-center rounded-lg bg-black/40 text-white/30">
                  <ImageIcon size={32} />
                </div>
              )}

              <label className="cursor-pointer rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-[#ecb100] transition hover:bg-white/10">
                {file ? "Change selected file" : "Replace image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setFile(f);
                      setPreview(URL.createObjectURL(f));
                    }
                  }}
                />
              </label>

              {file && (
                <p className="text-xs text-white/40">
                  New file selected — current photo will be replaced and removed from storage.
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-[#252525] bg-[#111] px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm text-white/70 transition hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-[#ecb100] px-5 py-2 text-sm font-medium text-black transition hover:bg-[#f6c94c] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Saving
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}