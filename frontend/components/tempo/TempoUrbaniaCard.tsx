"use client";

import Image from "next/image";
import { Users, Briefcase, Armchair, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TempoVehicle } from "@/src/lib/fetchTempoVehicles";

export default function TempoUrbaniaCard({
  vehicle,
  expanded,
  onBook,
}: {
  vehicle: TempoVehicle;
  expanded: boolean;
  onBook: () => void;
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border bg-[#141414] transition-all ${
        expanded ? "border-[#ecb100]" : "border-[#252525] hover:border-[#ecb100]/60"
      }`}
    >
      {/* IMAGE */}
      <div className="relative h-64">
        <Image
          src={vehicle.imageUrl || "/images/fallback.jpg"}
          alt={`${vehicle.name} — ${vehicle.category}`}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-[#ecb100] backdrop-blur-sm">
          ₹{vehicle.price}
        </div>

        <div className="absolute bottom-4 left-5">
          <p className="text-xs uppercase tracking-widest text-[#ecb100]">
            {vehicle.category}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-white">{vehicle.name}</h3>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {/* INFO GRID — fixed to use real schema fields instead of the
            nonexistent `seating` / `features` props that always
            rendered N/A / nothing */}
        <div className="grid grid-cols-3 gap-3">
          <InfoTile
            icon={<Users size={16} />}
            label="Seats"
            value={vehicle.passengerCapacity ? String(vehicle.passengerCapacity) : "—"}
          />

          <InfoTile
            icon={<Briefcase size={16} />}
            label="Luggage"
            value={vehicle.suitcaseCapacity ? `${vehicle.suitcaseCapacity} bags` : "—"}
          />

          <InfoTile icon={<Armchair size={16} />} label="Comfort" value="Luxury AC" />
        </div>

        {/* DESCRIPTION */}
        <p className="mt-5 text-sm leading-6 text-[#8a8a8a]">
          {vehicle.description ||
            "Premium air-conditioned traveller for comfortable group journeys, fitted out for long-distance comfort."}
        </p>

        {/* BUTTON */}
        <Button
          onClick={onBook}
          className="mt-6 flex w-full items-center justify-center gap-2 bg-[#ecb100] text-black hover:bg-[#f6c94c]"
        >
          Book {vehicle.name}
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#252525] bg-black/30 p-3 text-center">
      <div className="flex items-center justify-center text-[#ecb100]">{icon}</div>
      <p className="mt-1.5 text-[10px] uppercase tracking-wide text-[#666]">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-white">{value}</p>
    </div>
  );
}