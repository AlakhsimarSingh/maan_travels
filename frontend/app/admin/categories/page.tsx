import AdminPageHeader from "@/components/admin/AdminPageHeader";

const categories = [
  {
    name: "Luxury Cars",
    slug: "luxury-cars",
    status: "Active",
  },
  {
    name: "Tempo Traveller",
    slug: "tempo-traveller",
    status: "Active",
  },
  {
    name: "Wedding Cars",
    slug: "wedding-cars",
    status: "Inactive",
  },
];

export default function CategoriesPage() {
  return (
    <>
      <AdminPageHeader
        title="Categories"
        subtitle="Manage service categories & hierarchy"
        buttonText="Add Category"
      />

      <div className="rounded-2xl border border-[#252525] bg-[#141414] overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-[#252525]">
            <tr className="text-[#8a8a8a] text-sm">
              <th className="p-4">Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.slug}
                className="border-b border-[#1b1b1b] hover:bg-[#1b1b1b] transition"
              >
                <td className="p-4 text-white font-medium">
                  {cat.name}
                </td>

                <td className="text-[#8a8a8a]">
                  {cat.slug}
                </td>

                <td>
                  <span
                    className={`
                      text-xs px-3 py-1 rounded-full
                      ${
                        cat.status === "Active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }
                    `}
                  >
                    {cat.status}
                  </span>
                </td>

                <td className="text-right p-4">
                  <button className="text-[#ecb100] hover:underline">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}