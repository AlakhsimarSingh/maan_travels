"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { API_URL } from "@/src/services/bookingService";
import { resolveImageUrl } from "@/src/lib/resolveImageUrl";
import GalleryEditModal from "@/components/admin/gallery/GalleryEditModal";

type GalleryImage = {
  id: string;
  image: string;
  description: string | null;
  category: string;
  active: boolean;
};

const categories = ["Luxury Cars", "Tempo Traveller", "Wedding Cars", "Tours"];

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ description: "", category: categories[0] });
  const [file, setFile] = useState<File | null>(null);

  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/gallery/all`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      setError("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const upload = async () => {
    setError("");

    if (!file) {
      setError("Please choose an image");
      return;
    }

    try {
      const data = new FormData();
      data.append("image", file);
      data.append("description", form.description);
      data.append("category", form.category);

      const res = await fetch(`${API_URL}/api/gallery`, { method: "POST", body: data, credentials: "include" });
      const resData = await res.json();

      if (!resData.success) {
        setError(resData.message || "Failed to upload image");
        return;
      }

      setForm({ description: "", category: categories[0] });
      setFile(null);
      fetchImages();
    } catch {
      setError("Failed to upload image");
    }
  };

  const toggleActive = async (img: GalleryImage) => {
    try {
      const data = new FormData();
      data.append("active", String(!img.active));
      const res = await fetch(`${API_URL}/api/gallery/${img.id}`, { method: "PUT", body: data, credentials: "include" });
      const resData = await res.json();
      if (resData.success) fetchImages();
    } catch {
      setError("Failed to update image");
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/gallery/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to delete image");
        return;
      }
      fetchImages();
    } catch {
      setError("Failed to delete image");
    }
  };

  const openEdit = (img: GalleryImage) => {
    setEditingImage(img);
    setEditOpen(true);
  };

  if (loading) {
    return <div className="p-6 text-white">Loading gallery...</div>;
  }

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Gallery management</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#111] border border-[#252525] p-5 rounded-2xl grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <p className="text-sm text-white/70 mb-2">Image</p>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
        </div>

        <select
          className="p-2.5 bg-black border border-[#252525] rounded-lg outline-none focus:border-[#ecb100]/60"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          className="p-2.5 bg-black border border-[#252525] rounded-lg outline-none focus:border-[#ecb100]/60"
          placeholder="Short description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button
          onClick={upload}
          className="md:col-span-2 bg-[#ecb100] text-black p-2.5 rounded-lg font-medium hover:bg-[#f6c94c] transition"
        >
          Upload image
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img) => (
          <div key={img.id} className="rounded-xl border border-[#252525] bg-[#111] overflow-hidden">
            <img src={resolveImageUrl(img.image, API_URL)} alt={img.description || img.category} className="h-40 w-full object-cover" />

            <div className="p-3 space-y-1">
              <p className="text-xs text-[#ecb100] uppercase tracking-wide">{img.category}</p>
              <p className="text-sm text-white/80 truncate">{img.description || "No description"}</p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEdit(img)}
                    className="flex items-center gap-1 text-xs text-white/60 hover:text-white"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>

                  <button onClick={() => toggleActive(img)} className="text-xs text-white/60 hover:text-white">
                    {img.active ? "Hide" : "Show"}
                  </button>
                </div>

                <button onClick={() => deleteImage(img.id)} className="text-xs text-red-400 hover:text-red-300">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <GalleryEditModal
        open={editOpen}
        image={editingImage}
        categories={categories}
        onClose={() => setEditOpen(false)}
        onSuccess={fetchImages}
      />
    </div>
  );
}