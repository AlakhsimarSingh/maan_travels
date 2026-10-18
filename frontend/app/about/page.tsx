import type { Metadata } from "next";

import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutFounder from "@/components/about/AboutFounder";
import AboutWhy from "@/components/about/AboutWhy";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "About Us | Trusted Taxi Service in Jalandhar for 15+ Years",
  description:
    "Maan Travels is a Jalandhar-based taxi service running Delhi ⇄ Jalandhar cabs, airport transfers and tours across Punjab, Delhi, Haryana, Himachal Pradesh, Rajasthan and J&K for 15+ years.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Maan Travels",
    description:
      "Premium taxi travel experiences across North India, refined over 15+ years.",
    images: ["/images/about-luxury.jpg"],
  },
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutStory />
      <AboutFounder />
      <AboutWhy />
      <CTASection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: "Maan Travels",
            description:
              "Premium taxi travel service based in Jalandhar, serving Punjab, Himachal Pradesh, Jammu & Kashmir, Rajasthan and Delhi.",
            areaServed: ["Punjab", "Himachal Pradesh", "Jammu and Kashmir", "Rajasthan", "Delhi"],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Jalandhar",
              addressRegion: "Punjab",
              addressCountry: "IN",
            },
          }),
        }}
      />
    </main>
  );
}