"use client";

import RoutePricingMatrix from "@/components/admin/RoutePricingMatrix";

export default function PricingMatrixPage() {
  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Pricing Matrix</h1>
      <p className="text-sm text-white/60">
        Manage pricing for every vehicle on every route.
      </p>

      <RoutePricingMatrix />
    </div>
  );
}