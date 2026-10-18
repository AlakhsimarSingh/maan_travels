import type { Metadata } from "next";

import SelfDriveHero from "@/components/self-drive/SelfDriveHero";
import SelfDriveFleet from "@/components/self-drive/SelfDriveFleet";
import { API_URL } from "@/src/services/bookingService";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maantravels.com";
const pageUrl = `${siteUrl}/self-drive`;

/* ---------------- SEO: DYNAMIC METADATA ---------------- */
export const metadata: Metadata = {
  title: "Self Drive Car Rental in Jalandhar & Punjab",
  description:
    "Rent premium self-drive SUVs, sedans and hatchbacks across Punjab with flexible daily packages. No driver, no hassle — just pick up the keys and go.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Self Drive Car Rental in Jalandhar & Punjab | Maan Travels",
    description:
      "Rent premium self-drive SUVs, sedans and hatchbacks across Punjab with flexible daily packages.",
    url: pageUrl,
    siteName: "Maan Travels",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Self Drive Car Rental in Jalandhar & Punjab | Maan Travels",
    description:
      "Rent premium self-drive SUVs, sedans and hatchbacks across Punjab with flexible daily packages.",
  },
};

async function getSelfDriveVehicles() {
  try {
    const res = await fetch(`${API_URL}/api/vehicles`, { next: { revalidate: 300 } });
    const data = await res.json();
    if (!data?.success) return [];
    return (data.vehicles || []).filter(
      (v: { isSelfDrive?: boolean; available?: boolean }) => v.isSelfDrive === true && v.available === true
    );
  } catch {
    return [];
  }
}

export default async function SelfDrivePage() {
  const vehicles = await getSelfDriveVehicles();

  /* ---------------- SEO: STRUCTURED DATA (JSON-LD) ---------------- */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Self Drive Car Rental",
    provider: {
      "@type": "TravelAgency",
      name: "Maan Travels",
      url: siteUrl,
    },
    areaServed: {
      "@type": "State",
      name: "Punjab",
    },
    url: pageUrl,
    description:
      "Self drive car rental service offering premium SUVs, sedans and hatchbacks for flexible daily rentals across Punjab.",
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Self Drive", item: pageUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <SelfDriveHero />
      <SelfDriveFleet vehicles={vehicles} />
    </>
  );
}