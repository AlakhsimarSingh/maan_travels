import AirportHero from "@/components/airport/AirportHero";
import AirportBookingForm from "@/components/airport/AirportBookingForm";
import AirportBenefits from "@/components/airport/AirportBenefits";

export default function AirportTransferPage() {
  return (
    <>
      <AirportHero />

      <section className="py-20">
        <AirportBookingForm />
      </section>

      <AirportBenefits />
    </>
  );
}