"use client";

import Image from "next/image";
import { Users, Check, Armchair } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TempoUrbaniaCard({
  vehicle,
  expanded,
  onBook,
}: {
  vehicle: any;
  expanded: boolean;
  onBook: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#252525] bg-[#141414] transition-all hover:border-[#ecb100]">

      {/* IMAGE */}
      <div className="relative h-72">
        <Image
          src={vehicle.imageUrl || "/images/fallback.jpg"}
          alt={vehicle.name || "Tempo Urbania"}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="p-7">

        {/* CATEGORY */}
        <p className="uppercase tracking-widest text-sm text-[#ecb100]">
          {vehicle.category}
        </p>

        {/* NAME */}
        <h3 className="mt-3 text-3xl font-bold text-white">
          {vehicle.name}
        </h3>

        {/* INFO GRID */}
        <div className="mt-5 grid grid-cols-2 gap-4">

          {/* SEATS */}
          <div className="rounded-xl border border-[#252525] p-4">
            <Users size={18} className="text-[#ecb100]" />

            <p className="mt-2 text-sm text-[#8a8a8a]">Seats</p>

            <p className="text-white">
              {vehicle.seating || "N/A"}
            </p>
          </div>

          {/* COMFORT */}
          <div className="rounded-xl border border-[#252525] p-4">
            <Armchair size={18} className="text-[#ecb100]" />

            <p className="mt-2 text-sm text-[#8a8a8a]">Comfort</p>

            <p className="text-white">Luxury AC</p>
          </div>

        </div>

        {/* DESCRIPTION */}
        <p className="mt-6 text-[#8a8a8a]">
          {vehicle.description || "Premium AC traveller for comfortable group journeys."}
        </p>

        {/* FEATURES */}
        <div className="mt-6 space-y-3">
          {(vehicle.features || []).map((feature: string) => (
            <div
              key={feature}
              className="flex gap-2 items-center text-[#c7c7c7] text-sm"
            >
              <Check size={16} className="text-[#ecb100]" />
              {feature}
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <Button
          onClick={onBook}
          className="mt-8 w-full bg-[#ecb100] text-black hover:bg-[#f6c94c]"
        >
          Book {vehicle.name}
        </Button>

      </div>
    </div>
  );
}