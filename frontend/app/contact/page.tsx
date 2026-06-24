import type { Metadata } from "next";

import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maantravels.com";

export const metadata: Metadata = {
  title: "Contact Us | Maan Travels Jalandhar",
  description:
    "Get in touch with Maan Travels for luxury car rentals, airport transfers, tour packages and corporate travel across Punjab. Call, email or visit our Jalandhar office.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact Us | Maan Travels",
    description:
      "Reach Maan Travels for luxury travel, corporate transport and tour packages across Punjab.",
    type: "website",
    url: `${siteUrl}/contact`,
  },
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Maan Travels",
            url: `${siteUrl}/contact`,
            about: {
              "@type": "TravelAgency",
              name: "Maan Tour And Travels",
              telephone: "+91 8054404591",
              email: "maantravelcabs@gmail.com",
            },
          }),
        }}
      />
    </main>
  );
}