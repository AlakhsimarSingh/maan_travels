import { notFound } from "next/navigation";

import type { Metadata } from "next";

import { categories } from "@/src/data/categories";

// Canonical home of each category — these pages duplicate them.
const CANONICAL_PATH: Record<string, string> = {
  "luxury-cars": "/luxury-cars",
  "tempo-traveller": "/tempo-traveller-urbania",
  "tour-packages": "/tour-packages",
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return categories.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) return {};

  return {
    title: `${category.name} in Jalandhar & Punjab`,
    description: `${category.description} in Jalandhar and across Punjab, Delhi, Haryana, Himachal Pradesh and Rajasthan — Maan Travels.`,
    alternates: { canonical: CANONICAL_PATH[slug] ?? `/category/${slug}` },
  };
}

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