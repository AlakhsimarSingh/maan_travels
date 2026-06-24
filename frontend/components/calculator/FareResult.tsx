"use client";

import CalculatorResult from "./CalculatorResult";
import { getMileageProfile, fuelPrices } from "@/src/data/mileage";
import { estimateToll } from "@/src/data/toll";

type Vehicle = {
  id: string;
  name: string;
  category: string;
  price: number;
};

export default function FareResult({
  selectedVehicle,
  distance,
  tripType,
}: {
  selectedVehicle?: Vehicle;
  distance: number | null;
  tripType: "oneway" | "round";
}) {
  if (!selectedVehicle) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-[#252525] py-8 text-center text-[#666]">
        Select a vehicle to see your fare estimate.
      </div>
    );
  }

  if (!distance) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-[#252525] py-8 text-center text-[#666]">
        Enter a route above and tap "Get Distance" to see your fare estimate.
      </div>
    );
  }

  const mileage = getMileageProfile(selectedVehicle.category);
  const fuelPricePerUnit = fuelPrices[mileage.fuelType];

  const fuelCost = (distance / mileage.kmpl) * fuelPricePerUnit;
  const tollCost = estimateToll(distance, selectedVehicle.category);

  // Base fare: per-km rate derived from the vehicle's listed price as a
  // per-day rate baseline, scaled to a reasonable per-km figure
  const perKmRate = selectedVehicle.price ? selectedVehicle.price / 250 : 12;
  const baseFare = Math.max(selectedVehicle.price * 0.3, distance * perKmRate);

  const driverAllowance = tripType === "round" ? 400 : 0;

  const subtotal = baseFare + fuelCost + tollCost + driverAllowance;

  // Show a range rather than a single number — ±12% spread
  const low = Math.round((subtotal * 0.88) / 10) * 10;
  const high = Math.round((subtotal * 1.12) / 10) * 10;

  return (
    <div className="space-y-4">
      <CalculatorResult
        low={low}
        high={high}
        vehicleName={selectedVehicle.name}
        distance={distance}
        tripType={tripType}
      />

      <div className="grid gap-2 text-sm text-[#8a8a8a] sm:grid-cols-2">
        <BreakdownRow label="Base fare" value={baseFare} />
        <BreakdownRow label={`Fuel (${mileage.kmpl} km/l, ₹${fuelPricePerUnit}/L)`} value={fuelCost} />
        <BreakdownRow label="Estimated toll" value={tollCost} />
        {driverAllowance > 0 && <BreakdownRow label="Driver allowance" value={driverAllowance} />}
      </div>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2">
      <span>{label}</span>
      <span className="text-white">₹{Math.round(value).toLocaleString("en-IN")}</span>
    </div>
  );
}