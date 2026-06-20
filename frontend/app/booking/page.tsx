import BookingHero from "@/components/booking/BookingHero";
import BookingForm from "@/components/booking/BookingForm";

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