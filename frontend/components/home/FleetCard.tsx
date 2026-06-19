"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type FleetCardProps = {
  name: string;
  image: string;
  description: string;
  capacity?: string;

  category?: string;
  price?: number;
};

export default function FleetCard({
  name,
  image,
  description,
  capacity,
  category,
  price,
}: FleetCardProps) {
  const router = useRouter();

  const handleNavigation = () => {
    const cat = (category || "").toLowerCase();
    console.log("CATEGORY:", category);
    if (cat.includes("mpv") || cat.includes("sedan") || cat.includes("suv")) {
      router.push("/go-taxi");
      return;
    }

    if (cat.includes("tempo") || cat.includes("urbania")) {
      router.push("/tempo-traveller-urbania");
      return;
    }

    if (cat.includes("self")) {
      router.push("/self-drive");
      return;
    }

    if (cat.includes("luxury")) {
      router.push("/luxury-cars");
      return;
    }

    router.push("/fleet");
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-[#252525]
        bg-[#141414]
        transition-all
        hover:border-[#ecb100]
        hover:shadow-[0_0_35px_rgba(236,177,0,0.18)]
      "
    >
      {/* IMAGE */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* BADGE */}
        <div className="absolute top-4 left-4 flex gap-2">
          {category && (
            <span className="rounded-full bg-[#ecb100]/10 px-3 py-1 text-xs text-[#ecb100] border border-[#ecb100]/30">
              {category}
            </span>
          )}

          {price && (
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs text-white border border-white/10">
              ₹{price}/day
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white">{name}</h3>

        <p className="mt-2 text-sm text-[#8a8a8a] line-clamp-2">
          {description}
        </p>

        {/* INFO ROW */}
        <div className="mt-4 flex flex-wrap gap-2">
          {capacity && (
            <span className="rounded-full border border-[#252525] bg-[#1b1b1b] px-3 py-1 text-xs text-[#ecb100]">
              {capacity}
            </span>
          )}

          {category && (
            <span className="rounded-full border border-[#252525] bg-[#1b1b1b] px-3 py-1 text-xs text-white">
              {category}
            </span>
          )}
        </div>

        {/* BUTTON */}
        <Button
          onClick={handleNavigation}
          className="
            mt-6
            w-full
            border
            border-[#ecb100]
            bg-transparent
            text-[#ecb100]
            hover:bg-[#ecb100]
            hover:text-black
            transition-all
          "
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
}