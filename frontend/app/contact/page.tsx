import type { Metadata } from "next";

import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maantravels.com";

export const metadata: Metadata = {
  title: "Contact Us | Book a Taxi in Jalandhar 24/7",
  description:
    "Call or WhatsApp Maan Travels, Jalandhar to book a taxi 24/7 — Delhi to Jalandhar cabs, airport transfers, outstation taxis and tour packages. Visit us at BMC Chowk, Jalandhar.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact Maan Travels | Taxi Service in Jalandhar",
    description:
      "Book a taxi in Jalandhar 24/7 — Delhi ⇄ Jalandhar cabs, airport transfers and outstation taxis across Punjab.",
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