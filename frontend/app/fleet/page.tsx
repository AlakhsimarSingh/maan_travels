import type { Metadata } from "next";

import FleetCard from "@/components/home/FleetCard";
import Reveal from "@/components/common/Reveal";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maantravels.com";

export const metadata: Metadata = {
  title: "Our Fleet | Sedans, SUVs, Tempo Travellers & Luxury Cars | Maan Travels",
  description:
    "Explore Maan Travels' complete fleet — comfortable sedans, premium SUVs, MPVs, tempo travellers and luxury chauffeur-driven cars available across Punjab and North India.",
  alternates: {
    canonical: `${siteUrl}/fleet`,
  },
  openGraph: {
    title: "Our Fleet | Maan Travels",
    description:
      "Comfortable sedans, premium SUVs and luxury vehicles for every journey, driven by professional chauffeurs.",
    type: "website",
    url: `${siteUrl}/fleet`,
  },
};

type Vehicle = {
  id: string;
  name: string;
  imageUrl?: string | null;
  category?: string | null;
  price?: number | null;
  passengerCapacity?: number | null;
  suitcaseCapacity?: number | null;
};

async function getVehicles(): Promise<Vehicle[]> {
  try {
    const res = await fetch(`${API_URL}/api/vehicles`, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return data?.success ? data.vehicles || [] : [];
  } catch (err) {
    console.error("Failed to fetch vehicles", err);
    return [];
  }
}

export default async function FleetPage() {
  const vehicles = await getVehicles();

  return (
    <main className="pt-32 pb-24">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-16 max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#ecb100]">
            Our Fleet
          </p>

          <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl">
            Premium Vehicles
            <span className="block text-[#ecb100]">For Every Journey</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#8a8a8a]">
            {vehicles.length > 0
              ? `Choose from ${vehicles.length}+ well-maintained vehicles — comfortable sedans, premium SUVs, tempo travellers and luxury cars, all driven by professional chauffeurs.`
              : "Comfortable sedans, premium SUVs and luxury vehicles driven by professional chauffeurs."}
          </p>
        </Reveal>

        {/* FLEET GRID */}
        {vehicles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle, i) => (
              <Reveal key={vehicle.id} delay={i * 60}>
                <FleetCard
                  name={vehicle.name}
                  image={vehicle.imageUrl || "/placeholder.jpg"}
                  description={vehicle.category || "Premium Vehicle"}
                  capacity={
                    vehicle.passengerCapacity
                      ? `${vehicle.passengerCapacity} passengers`
                      : undefined
                  }
                  category={vehicle.category || ""}
                  price={vehicle.price ?? undefined}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#252525] py-24 text-center text-[#8a8a8a]">
            No vehicles available right now. Please check back shortly.
          </div>
        )}
      </section>

      {/* Structured data — vehicle fleet listing helps surface individual
          vehicles in rich results and reinforces site-wide TravelAgency entity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Maan Travels Fleet",
            itemListElement: vehicles.map((v, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Car",
                name: v.name,
                vehicleConfiguration: v.category || undefined,
                image: v.imageUrl || undefined,
                offers: v.price
                  ? {
                      "@type": "Offer",
                      priceCurrency: "INR",
                      price: v.price,
                    }
                  : undefined,
              },
            })),
          }),
        }}
      />
    </main>
  );
}