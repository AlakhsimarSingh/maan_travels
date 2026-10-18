import type { Metadata } from "next";

import BookingHero from "@/components/booking/BookingHero";
import BookingForm from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Book a Taxi Online | Jalandhar, Delhi & Punjab Cabs",
  description:
    "Book a taxi online in minutes — Delhi to Jalandhar, Jalandhar to Delhi, Amritsar, Ludhiana, Chandigarh and outstation cabs across Punjab, Haryana, Himachal and Rajasthan. Pay later, 24/7 support.",
  alternates: { canonical: "/booking" },
};

export default function BookingPage() {
  return (
    <main className="bg-[#0a0a0a]">
      <BookingHero />

      <section className="py-16 sm:py-24">
        <BookingForm />
      </section>
    </main>
  );
}