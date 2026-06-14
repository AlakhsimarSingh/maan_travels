import BookingHero from "@/components/booking/BookingHero";
import BookingForm from "@/components/booking/BookingForm";

export default function BookingPage() {
  return (
    <main>
      <BookingHero />

      <section className="py-20">
        <BookingForm />
      </section>
    </main>
  );
}