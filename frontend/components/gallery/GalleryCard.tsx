"use client";

import { useInView } from "@/src/hooks/useInView";
import { resolveImageUrl } from "@/src/lib/resolveImageUrl";
import { API_URL } from "@/src/services/bookingService";

type Props = {
  image: string;
  description: string | null;
  category: string;
  index: number;
  onClick: () => void;
};

export default function GalleryCard({ image, description, category, index, onClick }: Props) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{ transitionDelay: inView ? `${Math.min(index % 6, 6) * 70}ms` : "0ms" }}
      className={`
        reveal ${inView ? "reveal-visible" : ""}
        group relative mb-6 cursor-pointer overflow-hidden rounded-2xl border border-[#252525]
      `}
    >
      <img
        src={resolveImageUrl(image, API_URL)}
        alt={description || category}
        className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#ecb100]">{category}</p>
          {description && <p className="mt-1 text-sm text-white">{description}</p>}
        </div>
      </div>
    </div>
  );
}