import StatsCard from "@/components/admin/StatsCard";

export default function DashboardPage() {
  return (
    <div>
      <h2 className="mb-8 text-3xl font-bold">
        Dashboard
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Packages"
          value="124"
        />

        <StatsCard
          title="Bookings"
          value="43"
        />

        <StatsCard
          title="Inquiries"
          value="67"
        />

        <StatsCard
          title="Feedback"
          value="21"
        />
      </div>
    </div>
  );
}