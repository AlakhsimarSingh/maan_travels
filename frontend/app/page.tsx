import type { Metadata } from "next";

import Hero from "@/components/home/Hero";
import FleetSection from "@/components/home/FleetSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import TravelCostCalculator from "@/components/calculator/TravelCostCalculator";
import TrustMarquee from "@/components/home/TrustMarquee";
import RouteSection from "@/components/home/RouteSection";
import Reveal from "@/components/common/Reveal";

import { API_URL } from "@/src/services/bookingService";
import { siteUrl } from "@/src/lib/seo";
import { ALL_SERVED_CITIES } from "@/src/config/seoLocations";

export const metadata: Metadata = {
  // `absolute` so the layout's "| Maan Travels" template isn't appended twice.
  title: {
    absolute: "Maan Travels | Delhi to Jalandhar Taxi & Jalandhar to Delhi Cab",
  },
  description:
    "Book Delhi to Jalandhar taxi & Jalandhar to Delhi cab 24/7. Trusted Jalandhar taxi for one-way, round-trip, Delhi airport & outstation cabs across Punjab, Haryana, Himachal & Rajasthan.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Delhi to Jalandhar Taxi & Jalandhar to Delhi Cab | Maan Travels",
    description:
      "Jalandhar's trusted taxi service — Delhi ⇄ Jalandhar cabs, airport transfers and outstation taxis across Punjab, Delhi, Haryana, Himachal and Rajasthan. 24/7, 50+ vehicles, 15+ years.",
    url: "/",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
};

const HOMEPAGE_TESTIMONIAL_LIMIT = 12;
// RouteSection renders at most this many cards per category.
const ROUTES_PER_SECTION = 9;

type ApiVehicle = {
  id: string;
  name: string;
  category: string;
  imageUrl?: string | null;
  price?: number | null;
  description?: string | null;
  isSelfDrive?: boolean;
  isTaxiFleet?: boolean;
  passengerCapacity?: number | null;
  suitcaseCapacity?: number | null;
  rentalPerDay?: number | null;
};

type ApiRoute = {
  id: string;
  title: string;
  from: string;
  to: string;
  category: string;
  pricing?: { vehicleId: string; price: number }[];
};

async function getRoutes(): Promise<ApiRoute[]> {
  try {
    const res = await fetch(`${API_URL}/api/routes`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.routes || [];
  } catch {
    return [];
  }
}

async function getVehicles(): Promise<ApiVehicle[]> {
  try {
    const res = await fetch(`${API_URL}/api/vehicles`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.vehicles || [];
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    const res = await fetch(`${API_URL}/api/feedback?visible=true`, { next: { revalidate: 300 } });
    const data = await res.json();
    // The carousel only shows a few cards at a time; rendering every review
    // bloated the homepage HTML by ~470KB.
    return (data.feedbacks || []).slice(0, HOMEPAGE_TESTIMONIAL_LIMIT);
  } catch {
    return [];
  }
}

// Everything passed to client components is serialized into the page, so
// only send the fields the UI actually reads.
function pickVehicle(v: ApiVehicle) {
  return {
    id: v.id,
    name: v.name,
    category: v.category,
    imageUrl: v.imageUrl,
    price: v.price,
    description: v.description,
    isSelfDrive: v.isSelfDrive,
    isTaxiFleet: v.isTaxiFleet,
    passengerCapacity: v.passengerCapacity,
    suitcaseCapacity: v.suitcaseCapacity,
    rentalPerDay: v.rentalPerDay,
  };
}

function routesFor(routes: ApiRoute[], category: string) {
  return routes
    .filter((r) => r.category === category)
    .slice(0, ROUTES_PER_SECTION)
    .map((r) => ({
      id: r.id,
      title: r.title,
      from: r.from,
      to: r.to,
      category: r.category,
      pricing: (r.pricing || []).map((p) => ({ vehicleId: p.vehicleId, price: p.price })),
    }));
}

// Reading `searchParams` here would force a full server render on every
// request. The page is kept static (revalidated via the fetches above) and
// the fleet filter reads `?type=` on the client instead.
export default async function Home() {
  const [routes, apiVehicles, testimonials] = await Promise.all([
    getRoutes(),
    getVehicles(),
    getTestimonials(),
  ]);

  const vehicles = apiVehicles.map(pickVehicle);
  const taxiVehicles = vehicles.filter((v) => v.isTaxiFleet);

  const grouped = {
    destination: routesFor(routes, "destination"),
    one_way: routesFor(routes, "one_way"),
    local: routesFor(routes, "local"),
    airport: routesFor(routes, "airport"),
    tour: routesFor(routes, "tour"),
  };

  // Structured data: the taxi service itself (Delhi ⇄ Jalandhar first) plus
  // every popular route shown on the page with its real starting fare.
  const homeLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Maan Travels",
      alternateName: "Maan Tour And Travels Jalandhar",
      url: siteUrl,
      inLanguage: "en-IN",
    },
    {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      name: "Delhi to Jalandhar Taxi & Jalandhar to Delhi Cab",
      description:
        "One-way and round-trip taxi between Delhi and Jalandhar, Delhi airport pickup and drop, and outstation cabs from Jalandhar across Punjab, Delhi, Haryana, Himachal Pradesh and Rajasthan — available 24/7.",
      provider: { "@id": `${siteUrl}/#business` },
      url: siteUrl,
      areaServed: ALL_SERVED_CITIES.map((name) => ({ "@type": "City", name })),
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${siteUrl}/booking`,
        servicePhone: "+91 8054404591",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Popular taxi routes from Jalandhar",
      itemListElement: Object.values(grouped)
        .flat()
        .map((route, i) => {
          const prices = route.pricing.map((p) => p.price).filter((n) => n > 0);
          return {
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "TaxiService",
              name: `${route.from} to ${route.to} Taxi`,
              description: route.title,
              provider: { "@id": `${siteUrl}/#business` },
              ...(prices.length && {
                offers: {
                  "@type": "AggregateOffer",
                  priceCurrency: "INR",
                  lowPrice: Math.min(...prices),
                  highPrice: Math.max(...prices),
                },
              }),
            },
          };
        }),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeLd) }}
      />
      <Hero vehicles={taxiVehicles} />
      <TrustMarquee />

      <FleetSection vehicles={vehicles} />
      <WhyChooseUs />
      <section className="pt-12">
        <RouteSection title="Popular Airport Taxi Transfers" routes={grouped.airport} vehicles={taxiVehicles} type="airport" />
        <RouteSection title="Local Taxi Within Jalandhar & City" routes={grouped.local} vehicles={taxiVehicles} type="taxi" />
        <RouteSection title="Popular Taxi Tour Routes" routes={grouped.tour} vehicles={taxiVehicles} type="tour" />
        <RouteSection title="Popular Taxi Destinations from Jalandhar" routes={grouped.destination} vehicles={taxiVehicles} type="taxi" />
        <RouteSection title="Popular One Way Taxi Routes" routes={grouped.one_way} vehicles={taxiVehicles} type="taxi" />
      </section>
      <Testimonials testimonials={testimonials} />

      <section className="pt-10 pb-8">
        <Reveal>
          <TravelCostCalculator
            vehicles={taxiVehicles.map((v) => ({ ...v, price: v.price ?? 0 }))}
          />
        </Reveal>
      </section>

      <CTASection />
    </>
  );
}