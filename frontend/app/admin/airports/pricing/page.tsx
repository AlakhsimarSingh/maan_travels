"use client";

import AirportPricingMatrix from "@/components/admin/AirportPricingMatrix";


export default function AirportPricingPage() {
  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Airport pricing</h1>
      <p className="text-sm text-white/60">Set pricing for each vehicle on every airport route.</p>
      <AirportPricingMatrix />
    </div>
  );
}