import type { Metadata } from "next";

import FleetCard, { type FleetCardViewContext } from "@/components/home/FleetCard";
import FleetFilter from "@/components/home/FleetFilter";
import Reveal from "@/components/common/Reveal";

import {
  countByFilterType,
  filterVehicles,
  parseFleetFilterParam,
  type FleetFilterType,
} from "@/src/lib/vehicleCategory";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maantravels.com";

type Vehicle = {
  id: string;
  name: string;
  imageUrl?: string | null;
  category?: string | null;
  price?: number | null;
  description?: string | null;
  isSelfDrive?: boolean;
  isTaxiFleet?: boolean;
  passengerCapacity?: number | null;
  suitcaseCapacity?: number | null;
  rentalPerDay?: number | null;
};

type SearchParams = { type?: string };

const FILTER_SEO: Record <
  FleetFilterType,
  { title: string; description: string; heading: string; eyebrow: string }
> = {
  all: {
    title: "Our Fleet | Sedans, SUVs, Tempo Travellers & Luxury Cars | Maan Travels",
    description:
      "Explore Maan Travels' complete fleet — comfortable sedans, premium SUVs, MPVs, tempo travellers and luxury chauffeur-driven cars available across Punjab and North India.",
    heading: "Premium Vehicles",
    eyebrow: "Our Fleet",
  },
  luxury: {
    title: "Luxury Chauffeur Cars | Maan Travels",
    description:
      "Browse Maan Travels' luxury fleet — premium chauffeur-driven cars for weddings, events and special occasions across Punjab and North India.",
    heading: "Luxury Cars",
    eyebrow: "Luxury Fleet",
  },
  "self-drive": {
    title: "Self Drive Car Rentals | Maan Travels",
    description:
      "Rent a self-drive car from Maan Travels — well-maintained vehicles available by the day across Punjab, with flexible pickup and return.",
    heading: "Self Drive Rentals",
    eyebrow: "Self Drive",
  },
  taxi: {
    title: "Taxi Fleet | Sedans, SUVs & MPVs | Maan Travels",
    description:
      "Maan Travels' chauffeur-driven taxi fleet — sedans, SUVs and MPVs for outstation trips, airport transfers and local travel across Punjab.",
    heading: "Taxi Fleet",
    eyebrow: "Taxi Fleet",
  },
};

function resolveViewContext(
  activeFilter: FleetFilterType,
  vehicle: Vehicle
): FleetCardViewContext {
  if (activeFilter !== "all") return activeFilter;
  if ((vehicle.category || "").toLowerCase().includes("luxury")) return "luxury";
  if (vehicle.isSelfDrive) return "self-drive";
  return "taxi";
}

function resolvePrice(viewContext: FleetCardViewContext, vehicle: Vehicle) {
  if (viewContext === "self-drive") return vehicle.rentalPerDay ?? undefined;
  return vehicle.price ?? undefined;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const resolved = await searchParams;
  const filter = parseFleetFilterParam(resolved.type);
  const seo = FILTER_SEO[filter];
  const canonicalUrl = filter === "all" ? `${siteUrl}/fleet` : `${siteUrl}/fleet?type=${filter}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      url: canonicalUrl,
    },
  };
}

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

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [vehicles, resolvedSearchParams] = await Promise.all([
    getVehicles(),
    searchParams,
  ]);

  const activeFilter = parseFleetFilterParam(resolvedSearchParams.type);
  const counts = countByFilterType(vehicles);
  const filtered = filterVehicles(vehicles, activeFilter);
  const seo = FILTER_SEO[activeFilter];

  return (
    <main className="pt-32 pb-24">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#ecb100]">
            {seo.eyebrow}
          </p>

          <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl">
            {seo.heading}
            {activeFilter === "all" && (
              <span className="block text-[#ecb100]">For Every Journey</span>
            )}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#8a8a8a]">
            {filtered.length > 0
              ? `Choose from ${filtered.length}+ well-maintained vehicles${
                  activeFilter === "all"
                    ? " — comfortable sedans, premium SUVs, tempo travellers and luxury cars, all driven by professional chauffeurs."
                    : "."
                }`
              : "Comfortable sedans, premium SUVs and luxury vehicles driven by professional chauffeurs."}
          </p>
        </Reveal>

        <Reveal className="mb-14" delay={60}>
          <FleetFilter />
        </Reveal>

        {/* FLEET GRID */}
        {filtered.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((vehicle, i) => {
              const viewContext = resolveViewContext(activeFilter, vehicle);
              return (
                <Reveal key={vehicle.id} delay={i * 30}>
                  <FleetCard
                    name={vehicle.name}
                    image={vehicle.imageUrl || "/placeholder.jpg"}
                    description={vehicle.description || ""}
                    category={vehicle.category || ""}
                    price={resolvePrice(viewContext, vehicle)}
                    isSelfDrive={vehicle.isSelfDrive ?? false}
                    isTaxiFleet={vehicle.isTaxiFleet ?? true}
                    passengerCapacity={vehicle.passengerCapacity ?? undefined}
                    viewContext={viewContext}
                  />
                </Reveal>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#252525] py-24 text-center text-[#8a8a8a]">
            {vehicles.length > 0
              ? "No vehicles match this filter right now."
              : "No vehicles available right now. Please check back shortly."}
          </div>
        )}
      </section>

      {/* Structured data — reflects only the currently filtered set, so
          it never advertises vehicles that aren't actually visible on
          this view, and prices reflect the same per-context resolution
          shown on the cards (e.g. Innova Crysta's price differs between
          the Self Drive and Taxi Fleet views). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name:
              activeFilter === "all"
                ? "Maan Travels Fleet"
                : `Maan Travels Fleet — ${seo.heading}`,
            itemListElement: filtered.map((v, i) => {
              const viewContext = resolveViewContext(activeFilter, v);
              const resolvedPrice = resolvePrice(viewContext, v);
              return {
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Car",
                  name: v.name,
                  vehicleConfiguration: v.category || undefined,
                  image: v.imageUrl || undefined,
                  offers: resolvedPrice
                    ? {
                        "@type": "Offer",
                        priceCurrency: "INR",
                        price: resolvedPrice,
                      }
                    : undefined,
                },
              };
            }),
          }),
        }}
      />
    </main>
  );
}