"use client";

import { useState } from "react";

import AirportHero from "@/components/airport/AirportHero";
import AirportBookingForm from "@/components/airport/AirportBookingForm";
import AirportBenefits from "@/components/airport/AirportBenefits";

import { useAirports, Airport } from "@/src/hooks/useAirports";

export default function AirportTransferPage() {
  const { airports } = useAirports();
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

  return (
    <>
      <AirportHero
        airports={airports}
        selectedAirport={selectedAirport}
        onSelectAirport={setSelectedAirport}
      />

      <section className="py-20">
        <AirportBookingForm airport={selectedAirport} />
      </section>

      <AirportBenefits />
    </>
  );
}