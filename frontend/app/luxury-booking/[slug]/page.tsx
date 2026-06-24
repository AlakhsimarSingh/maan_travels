import { notFound } from "next/navigation";

import { LuxuryBookingForm } from "@/components/luxury/LuxuryBookingForm";

import Breadcrumbs from "@/components/shared/Breadcrumbs";

import { getLuxuryCarBySlug } from "@/src/services/luxuryCarPublicService";


import type { Metadata } from "next";

type MetaProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getLuxuryCarBySlug(slug);
  const name = res?.car?.name || "Luxury Car";

  return {
    title: `Book ${name} | Maan Travels`,
    description: `Reserve the ${name} with a professional chauffeur from Maan Travels.`,
    robots: { index: false, follow: true },
  };
}


export default async function LuxuryBookingPage({
  params
}: MetaProps) {

  const { slug } = await params;

  const res = await getLuxuryCarBySlug(slug);

  if (!res?.success || !res.car) {
    notFound();
  }

  const car = res.car;

  return (
    <main className="pt-28 pb-24">

      <section className="mx-auto max-w-7xl px-6">

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Luxury Cars", href: "/luxury-cars" },
            {
              label: car.name,
              href: `/luxury-cars/${car.slug}`
            },
            { label: "Booking" }
          ]}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-3">

          {/* SIDE PANEL */}
          <aside className="h-fit rounded-3xl border border-[#252525] bg-[#141414] p-8">

            <p className="uppercase tracking-[0.3em] text-sm text-[#ecb100]">
              Selected Vehicle
            </p>

            <h1 className="mt-4 text-3xl font-bold text-white">
              {car.name}
            </h1>

            <p className="mt-3 text-[#8a8a8a]">
              Luxury Chauffeur Service
            </p>

            <div className="mt-8 space-y-3">

              <div className="rounded-xl border border-[#252525] bg-black/30 p-4">
                <p className="text-xs text-[#8a8a8a] uppercase">Category</p>
                <p className="mt-1 text-white">{car.category}</p>
              </div>

              <div className="rounded-xl border border-[#252525] bg-black/30 p-4">
                <p className="text-xs text-[#8a8a8a] uppercase">Service</p>
                <p className="mt-1 text-white">
                  With Professional Chauffeur
                </p>
              </div>

            </div>

          </aside>

          {/* FORM */}
          <div className="lg:col-span-2">
            <LuxuryBookingForm car={car} />
          </div>

        </div>

      </section>

    </main>
  );
}