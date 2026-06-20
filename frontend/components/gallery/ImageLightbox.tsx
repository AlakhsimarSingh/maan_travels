"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "@/src/services/bookingService";

type GalleryImage = {
  id: string;
  image: string;
  description: string | null;
  category: string;
};

type Props = {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export default function ImageLightbox({ images, index, onClose, onIndexChange }: Props) {
  const current = images[index];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onIndexChange]);

  if (!current) return null;

  return (
    <div
      onClick={onClose}
      className="overlay-enter fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#1c1c1c] border border-[#2a2a2a] text-white/70 transition-colors hover:text-white hover:border-[#ecb100]/50"
      >
        <X size={20} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onIndexChange((index - 1 + images.length) % images.length); }}
        aria-label="Previous"
        className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#1c1c1c] border border-[#2a2a2a] text-white/70 transition-colors hover:text-white hover:border-[#ecb100]/50"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onIndexChange((index + 1) % images.length); }}
        aria-label="Next"
        className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#1c1c1c] border border-[#2a2a2a] text-white/70 transition-colors hover:text-white hover:border-[#ecb100]/50"
      >
        <ChevronRight size={20} />
      </button>

      <div onClick={(e) => e.stopPropagation()} className="modal-enter flex max-h-[85vh] max-w-5xl flex-col items-center">
        <img
          key={current.id}
          src={`${API_URL}${current.image}`}
          alt={current.description || current.category}
          className="max-h-[75vh] w-auto rounded-xl object-contain"
        />

        <div className="mt-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#ecb100]">{current.category}</p>
          {current.description && <p className="mt-1 text-sm text-white/80">{current.description}</p>}
        </div>
      </div>
    </div>
  );
}