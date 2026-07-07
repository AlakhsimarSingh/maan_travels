"use client";

import AirportCityPricingMatrix from "@/components/admin/AirportCityPricingMatrix";

export default function AirportPricingPage() {
  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Airport pricing</h1>
      <p className="text-sm text-white/60">
        Set pricing for each vehicle, on every city, for every airport — priced separately by direction.
      </p>

      <AirportCityPricingMatrix />
    </div>
  );
}