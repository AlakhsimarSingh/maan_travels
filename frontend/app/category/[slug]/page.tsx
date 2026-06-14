import { notFound } from "next/navigation";

import { categories } from "@/src/data/categories";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  const category = categories.find(
    (item) => item.slug === slug
  );

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-4 text-5xl font-bold text-white">
          {category.name}
        </h1>

        <p className="text-[#8a8a8a]">
          {category.description}
        </p>
      </div>
    </main>
  );
}