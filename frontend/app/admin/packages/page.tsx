import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default function PackagesPage() {
  return (
    <>
      <AdminPageHeader
        title="Packages"
        subtitle="Manage tours, pricing & itineraries"
        buttonText="Create Package"
      />

      <div className="rounded-2xl border border-[#252525] bg-[#141414] p-6">
        <p className="text-[#8a8a8a]">
          Package table will be connected to database later.
        </p>
      </div>
    </>
  );
}