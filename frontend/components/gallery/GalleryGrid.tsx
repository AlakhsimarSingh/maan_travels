"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryImages } from "@/src/data/gallery";
import ImageLightbox from "./ImageLightbox";

const categories = [
  "All",
  "Luxury Cars",
  "Tempo Traveller",
  "Wedding Cars",
  "Tours",
];

export default function GalleryGrid() {
  const [active, setActive] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filtered =
    active === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === active);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Tabs */}
        <div className="mb-10 flex flex-wrap gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`
                rounded-full px-5 py-2 text-sm transition
                ${
                  active === cat
                    ? "bg-[#ecb100] text-black"
                    : "border border-[#252525] text-[#c7c7c7] hover:text-white"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {filtered.map((img, i) => (
            <div
              key={i}
              className="mb-6 cursor-pointer overflow-hidden rounded-2xl border border-[#252525]"
              onClick={() => setSelectedImage(img.src)}
            >
              <Image
                src={img.src}
                alt="gallery"
                width={800}
                height={600}
                className="h-auto w-full object-cover transition duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <ImageLightbox
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  );
}