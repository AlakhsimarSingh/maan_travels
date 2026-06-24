"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Users, ArrowUpRight } from "lucide-react";

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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="
        group overflow-hidden rounded-3xl border border-[#252525]
        bg-[#141414] transition-colors duration-300
        hover:border-[#ecb100] hover:shadow-[0_0_35px_rgba(236,177,0,0.18)]
      "
    >
      {/* IMAGE */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {category && (
            <span className="rounded-full border border-[#ecb100]/30 bg-[#ecb100]/10 px-3 py-1 text-xs text-[#ecb100] backdrop-blur-sm">
              {category}
            </span>
          )}

          {price && (
            <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
              ₹{price.toLocaleString("en-IN")}/day
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white">{name}</h3>

        <p className="mt-2 line-clamp-2 text-sm text-[#8a8a8a]">{description}</p>

        {capacity && (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-[#ecb100]/80">
            <Users size={13} />
            {capacity}
          </div>
        )}

        <Button
          onClick={handleNavigation}
          className="
            group/btn mt-6 w-full border border-[#ecb100] bg-transparent
            text-[#ecb100] transition-all duration-200
            hover:bg-[#ecb100] hover:text-black active:scale-[0.98]
          "
        >
          <span className="flex items-center justify-center gap-1.5">
            View Details
            <ArrowUpRight
              size={15}
              className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
            />
          </span>
        </Button>
      </div>
    </motion.div>
  );
}