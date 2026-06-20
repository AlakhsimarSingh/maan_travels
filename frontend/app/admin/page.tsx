"use client";

import StatsCard from "@/components/admin/StatsCard";
import { useStats } from "@/src/hooks/useStats";

export default function DashboardPage() {
  const { stats, loading, error } = useStats();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Dashboard</h2>

        {!loading && (
          <span className="flex items-center gap-2 text-xs text-[#8a8a8a]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ecb100] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ecb100]" />
            </span>
            Live
          </span>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error} — showing last known values.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Vehicles"
          value={stats?.totalVehicles ?? 0}
          loading={loading}
        />

        <StatsCard
          title="Total Bookings"
          value={stats?.totalBookings ?? 0}
          loading={loading}
        />

        <StatsCard
          title="Pending Bookings"
          value={stats?.pendingBookings ?? 0}
          loading={loading}
        />

        <StatsCard
          title="Feedback"
          value={stats?.totalFeedback ?? 0}
          loading={loading}
        />

        <StatsCard
          title="Confirmed Bookings"
          value={stats?.confirmedBookings ?? 0}
          loading={loading}
        />

        <StatsCard
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
          loading={loading}
        />
      </div>
    </div>
  );
}