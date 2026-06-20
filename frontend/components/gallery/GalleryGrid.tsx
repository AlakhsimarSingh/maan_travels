"use client";

import { useState } from "react";
import { useGallery } from "@/src/hooks/useGallery";
import GalleryCard from "./GalleryCard";
import ImageLightbox from "./ImageLightbox";

const categories = ["All", "Luxury Cars", "Tempo Traveller", "Wedding Cars", "Tours"];

export default function GalleryGrid() {
  const { images, loading } = useGallery();
  const [active, setActive] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filtered = active === "All" ? images : images.filter((img) => img.category === active);

  if (loading) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 text-center text-white/40">Loading gallery...</div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-wrap gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`
                rounded-full px-5 py-2 text-sm transition-all duration-200
                ${active === cat
                  ? "bg-[#ecb100] text-black"
                  : "border border-[#252525] text-[#c7c7c7] hover:border-[#ecb100]/40 hover:text-white"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-white/40 py-20">No images in this category yet.</p>
        ) : (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {filtered.map((img, i) => (
              <GalleryCard
                key={img.id}
                index={i}
                image={img.image}
                description={img.description}
                category={img.category}
                onClick={() => setSelectedIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedIndex !== null && (
        <ImageLightbox
          images={filtered}
          index={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onIndexChange={setSelectedIndex}
        />
      )}
    </section>
  );
}