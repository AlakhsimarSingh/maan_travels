"use client";

import CalculatorResult from "./CalculatorResult";

export default function FairResult({
  selectedVehicle,
  service,
  distance,
  days,
}: any) {
  if (!selectedVehicle) {
    return (
      <div className="text-center text-[#8a8a8a] mt-6">
        Select a vehicle to see pricing
      </div>
    );
  }

  const FUEL_PRICE = 103.26;

  // 🧠 Fuel cost calculation
  const calculateFuelCost = () => {
    const kmpl = selectedVehicle.kmpl || 12;

    const litersUsed = distance / kmpl;

    return litersUsed * FUEL_PRICE;
  };

  // 🛣️ Toll estimation (realistic model)
  const calculateTollCost = () => {
    // average India highway logic:
    const tollPer100km = 60; // conservative estimate

    return (distance / 100) * tollPer100km;
  };

  // 💰 Base fare logic
  const calculateBase = () => {
    if (service === "taxi") {
      return (
        selectedVehicle.base +
        distance * selectedVehicle.perKm
      );
    }

    return selectedVehicle.perDay * days;
  };

  const base = calculateBase();
  const fuel = calculateFuelCost();
  const toll = calculateTollCost();

  const total = Math.round(base + fuel + toll);

  return (
    <div className="space-y-3">
      <CalculatorResult
        amount={total}
        vehicleName={selectedVehicle.name}
        service={service}
        distance={distance}
        days={days}
      />

      {/* breakdown (optional but powerful for trust) */}
      <div className="mt-4 text-sm text-[#8a8a8a] space-y-1">
        <p>Base Fare: ₹{Math.round(base)}</p>
        <p>Fuel Cost: ₹{Math.round(fuel)}</p>
        <p>Toll Estimate: ₹{Math.round(toll)}</p>
      </div>
    </div>
  );
}