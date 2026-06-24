"use client";

import Image from "next/image";
import { Car } from "lucide-react";

type Vehicle = {
  id: string;
  name: string;
  category: string;
  imageUrl?: string | null;
};

export default function VehicleSelector({
  vehicles,
  selected,
  setSelected,
}: {
  vehicles: Vehicle[];
  selected: string;
  setSelected: (id: string) => void;
}) {
  if (vehicles.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[#252525] py-8 text-center text-sm text-[#666]">
        No taxi vehicles available right now.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((v) => {
        const isSelected = selected === v.id;
        return (
          <button
            key={v.id}
            onClick={() => setSelected(v.id)}
            className={`
              group flex items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left
              transition-all duration-200
              ${
                isSelected
                  ? "border-[#ecb100] bg-[#ecb100]/10"
                  : "border-[#252525] bg-black/30 hover:border-[#ecb100]/40"
              }
            `}
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#1a1a1a]">
              {v.imageUrl ? (
                <Image
                  src={v.imageUrl}
                  alt={v.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#444]">
                  <Car size={20} />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-semibold text-white">{v.name}</h3>
              <p className="mt-0.5 text-xs text-[#8a8a8a]">{v.category}</p>
            </div>

            {isSelected && (
              <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-[#ecb100]" />
            )}
          </button>
        );
      })}
    </div>
  );
}