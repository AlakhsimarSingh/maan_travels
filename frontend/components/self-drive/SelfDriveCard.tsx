"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Fuel, Users, Settings, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";

type Vehicle = {
  id: string;
  name: string;
  imageUrl?: string | null;
  category: string;
  description?: string | null;

  fuelType?: string | null;
  transmission?: string | null;
  seats?: number | null;
  modelYear?: number | null;

  price: number;
  rentalPerDay?: number | null;
};

export default function SelfDriveCard({
  vehicle,
  expanded,
  onToggle,
  onBook,
}: {
  vehicle: Vehicle;
  expanded: boolean;
  onToggle: () => void;
  onBook: () => void;
}) {
  const imgSrc = vehicle.imageUrl?.trim() || "/placeholder.jpg";
  const dailyRate = vehicle.rentalPerDay || vehicle.price;

  return (
    <motion.div
      layout
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="overflow-hidden rounded-3xl border border-[#252525] bg-[#141414] shadow-[0_0_40px_rgba(236,177,0,0.06)]"
    >
      {!expanded ? (
        <>
          {/* COLLAPSED CARD */}
          <div className="relative h-60">
            <Image src={imgSrc} alt={vehicle.name || "Vehicle"} fill className="object-cover" />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-[#ecb100] backdrop-blur-sm">
              ₹{dailyRate}/day
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">{vehicle.name}</h3>
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-[#8a8a8a]">
                {vehicle.category}
              </span>
            </div>

            <p className="mt-3 text-sm text-[#8a8a8a] line-clamp-2">
              {vehicle.description || "Well-maintained, fuel efficient, and ready to drive."}
            </p>

            <div className="mt-4 flex gap-3 text-xs text-[#8a8a8a]">
              {vehicle.fuelType && (
                <span className="flex items-center gap-1">
                  <Fuel size={14} /> {vehicle.fuelType}
                </span>
              )}
              {vehicle.transmission && (
                <span className="flex items-center gap-1">
                  <Settings size={14} /> {vehicle.transmission}
                </span>
              )}
              {vehicle.seats && (
                <span className="flex items-center gap-1">
                  <Users size={14} /> {vehicle.seats} seats
                </span>
              )}
            </div>

            <Button
              onClick={onToggle}
              className="mt-6 w-full bg-[#ecb100] text-black hover:bg-[#f6c94c]"
            >
              View Details
            </Button>
          </div>
        </>
      ) : (
        /* EXPANDED CARD */
        <motion.div layout className="grid lg:grid-cols-2">
          {/* IMAGE */}
          <div className="relative min-h-[420px]">
            <Image src={imgSrc} alt={vehicle.name || "Vehicle"} fill className="object-cover" />
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-center p-8">
            <h2 className="text-4xl font-bold text-white">{vehicle.name}</h2>

            <p className="mt-4 text-[#8a8a8a]">
              {vehicle.description || "Well-maintained, fuel efficient, and ready to drive."}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Info icon={<Fuel size={18} />} label="Fuel" value={vehicle.fuelType || "-"} />

              <Info
                icon={<Settings size={18} />}
                label="Transmission"
                value={vehicle.transmission || "-"}
              />

              <Info
                icon={<Users size={18} />}
                label="Seats"
                value={vehicle.seats ? `${vehicle.seats} People` : "-"}
              />

              <Info
                icon={<CalendarDays size={18} />}
                label="Model"
                value={vehicle.modelYear ? String(vehicle.modelYear) : "-"}
              />

              <Info
                icon={<CalendarDays size={18} />}
                label="Rental"
                value={`₹${dailyRate}/day`}
              />
            </div>

            <Button
              onClick={onBook}
              className="mt-8 w-full bg-[#ecb100] text-black hover:bg-[#f6c94c]"
            >
              Book Now
            </Button>

            <button
              onClick={onToggle}
              className="mt-4 text-sm text-[#8a8a8a] hover:text-white"
            >
              ← Back to vehicles
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#252525] bg-black/30 p-4">
      <div className="flex items-center gap-2 text-[#ecb100]">
        {icon}
        <span className="text-xs uppercase">{label}</span>
      </div>

      <p className="mt-2 font-medium text-white">{value}</p>
    </div>
  );
}