"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown, Car } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function WeddingCard({
  car,
  highlighted,
}: {
  car: any;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`
        group overflow-hidden rounded-3xl border bg-[#141414]
        shadow-[0_0_40px_rgba(236,177,0,0.06)] transition-all duration-300
        ${highlighted ? "border-[#ecb100]/60 shadow-[0_0_40px_rgba(236,177,0,0.18)]" : "border-[#252525]"}
      `}
    >
      <div className="relative h-64 overflow-hidden">
        {car.image ? (
          <Image
            src={car.image}
            alt={car.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black">
            <Crown size={36} className="text-[#333]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {highlighted && (
          <span className="absolute right-4 top-4 rounded-full bg-[#ecb100] px-3 py-1 text-xs font-medium text-black">
            Featured
          </span>
        )}
      </div>

      <div className="p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[#ecb100]">
          {car.category}
        </p>

        {car.price && (
          <p className="mt-2 text-sm font-medium text-[#ecb100]/80">
            Starting from ₹{car.price.toLocaleString("en-IN")}
          </p>
        )}

        <h3 className="mt-3 text-2xl font-bold text-white">{car.name}</h3>

        <p className="mt-3 line-clamp-2 text-[#8a8a8a]">{car.description}</p>

        {car.features?.length > 0 && (
          <div className="mt-5 space-y-2">
            {car.features.slice(0, 3).map((feature: string) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-[#c7c7c7]">
                <Crown size={14} className="text-[#ecb100]" />
                {feature}
              </div>
            ))}
          </div>
        )}

        <Button
          asChild
          className="mt-6 w-full bg-[#ecb100] text-black transition-transform duration-200 hover:bg-[#f6c94c] active:scale-[0.98]"
        >
          <Link href={`/wedding-booking/${car.slug}`}>
            <Car size={16} />
            Book Wedding Car
          </Link>
        </Button>
      </div>
    </div>
  );
}