import TempoUrbaniaFleet from "@/components/tempo/TempoUrbaniaFleet";
import TempoPackages from "@/components/tempo/TempoPackages";
import TempoUrbaniaSEO from "@/components/tempo/TempoUrbaniaSEO";
import TempoUrbaniaFAQ from "@/components/tempo/TempoUrbaniaFAQ";
import TempoUrbaniaHero from "@/components/tempo/TempoUrbaniaHero";

import { buildMetadata, buildBreadcrumbLd, siteUrl } from "@/src/lib/seo";
import { fetchTempoVehicles } from "@/src/lib/fetchTempoVehicles";

export const metadata = buildMetadata({
  title: "Tempo Traveller & Urbania Rental Punjab",
  description:
    "Book premium Tempo Traveller and Force Urbania rentals in Punjab for family trips, weddings, corporate tours and group travel with professional chauffeurs.",
  path: "/tempo-traveller-urbania",
});

const pageUrl = `${siteUrl}/tempo-traveller-urbania`;

export default async function Page() {
  // Fetched ONCE, on the server, before any HTML reaches the browser.
  // Hero and Fleet both receive the same data as a prop — no duplicate
  // client-side fetches, no waterfall, and search engines see the real
  // vehicle list immediately instead of an empty client-rendered shell.
  const vehicles = await fetchTempoVehicles();

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Tempo Traveller and Urbania Rental",
    provider: {
      "@type": "TravelAgency",
      name: "Maan Travels",
      url: siteUrl,
    },
    areaServed: { "@type": "State", name: "Punjab" },
    url: pageUrl,
    description:
      "Tempo Traveller and Force Urbania rental service for group travel, weddings, corporate tours and outstation trips across Punjab and Himachal Pradesh.",
  };

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Tempo Traveller & Urbania", path: "/tempo-traveller-urbania" },
  ]);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the difference between Tempo Traveller and Force Urbania?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tempo Traveller is a comfortable group vehicle, while Force Urbania offers a more premium experience with better interiors and advanced comfort features.",
        },
      },
      {
        "@type": "Question",
        name: "How many passengers can travel in a Tempo Traveller?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tempo Traveller options are available in different seating capacities including 9, 12, 16 and larger group configurations depending on your requirement.",
        },
      },
      {
        "@type": "Question",
        name: "Do you provide drivers with the vehicle?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all Tempo Traveller and Urbania rentals include professional chauffeurs for a safe and comfortable journey.",
        },
      },
    ],
  };

  return (
    <main className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <TempoUrbaniaHero vehicles={vehicles} />
      <TempoUrbaniaFleet vehicles={vehicles} />
      <TempoPackages />
      <TempoUrbaniaSEO />
      <TempoUrbaniaFAQ />
    </main>
  );
}