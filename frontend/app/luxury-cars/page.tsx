import type { Metadata } from "next";

import LuxuryHero from "@/components/luxury/LuxuryHero";
import LuxuryFleet from "@/components/luxury/LuxuryFleet";
import LuxuryWhyChoose from "@/components/luxury/LuxuryWhyChoose";
import LuxuryCTA from "@/components/luxury/LuxuryCTA";

import { getPublicLuxuryCars } from "@/src/services/luxuryCarService";
import { buildMetadata, buildBreadcrumbLd } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Luxury Car Rental in Punjab | Mercedes Maybach, G-Wagon, Range Rover",
  description:
    "Book luxury cars in Punjab with Maan Travels. Premium Mercedes Maybach, G-Wagon, Range Rover, Defender, Jaguar and Fortuner Legender rental services for weddings, corporate events and VIP travel.",
  path: "/luxury-cars",
});

const breadcrumbLd = buildBreadcrumbLd([
  { name: "Home", path: "/" },
  { name: "Luxury Cars", path: "/luxury-cars" },
]);

export default async function LuxuryCarsPage() {
  const res = await getPublicLuxuryCars();
  const cars = res?.success ? res.luxuryCars : [];

  return (
    <main>
      <LuxuryHero cars={cars} />
      <LuxuryFleet cars={cars} />
      <LuxuryWhyChoose />
      <LuxuryCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </main>
  );
}