"use client";

import Image from "next/image";
import { X } from "lucide-react";

export default function ImageLightbox({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  if (!src) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute right-6 top-6 text-white"
      >
        <X size={32} />
      </button>

      <div className="relative h-[80vh] w-[90vw]">
        <Image src={src} alt="gallery" fill className="object-contain" />
      </div>
    </div>
  );
}