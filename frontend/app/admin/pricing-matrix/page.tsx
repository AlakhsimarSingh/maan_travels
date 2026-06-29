"use client";

import RoutePricingMatrix from "@/components/admin/RoutePricingMatrix";

export default function PricingMatrixPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#ecb100] mb-1">Admin</p>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Pricing Matrix</h1>
        <p className="mt-1 text-sm text-[#555]">
          Set fares for every vehicle on every route. Press Enter or tap ↵ to save.
        </p>
      </div>

      <RoutePricingMatrix />
    </div>
  );
}