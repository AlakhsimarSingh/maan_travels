import type { Metadata } from "next";

import WeddingPackages from "@/components/wedding/WeddingPackages";
import WeddingFAQ from "@/components/wedding/WeddingFAQ";
import WeddingExperience from "@/components/wedding/WeddingExperience";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

export const metadata: Metadata = {
  title: "Luxury Wedding Car Rental Punjab | Maan Travels",
  description:
    "Book Mercedes Maybach, G-Wagon, Range Rover, Jaguar and premium chauffeur-driven wedding cars across Punjab. Royal groom entry, bride arrival and wedding convoy packages.",
  openGraph: {
    title: "Luxury Wedding Car Rental Punjab | Maan Travels",
    description:
      "Premium chauffeur-driven wedding cars for groom entry, bride arrival and wedding convoys across Punjab.",
    type: "website",
  },
};

async function getCars() {
  try {
    const res = await fetch(`${API_URL}/api/luxury-cars`, {
      // Revalidate periodically rather than no-store — fleet doesn't change
      // every second, so this keeps SSR fast while staying fresh.
      next: { revalidate: 300 },
    });

    const data = await res.json();
    return data?.success ? data.luxuryCars || [] : [];
  } catch (err) {
    console.error("Failed to fetch luxury cars", err);
    return [];
  }
}

export default async function WeddingCarsPage() {
  const cars = await getCars();

  return (
    <main className="pt-20">
      <div id="fleet">
        <WeddingExperience cars={cars} />
      </div>

      <WeddingPackages />

      <WeddingFAQ />

      {/* Structured data for the fleet collection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Luxury Wedding Car Fleet",
            itemListElement: cars.map((car: any, i: number) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://www.maantravels.com/wedding-booking/${car.slug}`,
              name: car.name,
            })),
          }),
        }}
      />
    </main>
  );
}