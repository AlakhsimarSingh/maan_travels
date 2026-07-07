"use client";

import { useState } from "react";

import AirportHero from "./AirportHero";
import AirportBookingForm from "./AirportBookingForm";
import StepProgress from "./StepProgress";
import { Airport, AirportVehicle, AirportCity } from "@/src/lib/fetchAirportTransferData";

const STEPS = ["Airport", "Vehicle", "Trip Details", "Payment"];

// Defensive defaults on the destructure itself — even though page.tsx
// should always pass real arrays, a missing/undefined prop here falls
// back to an empty array instead of throwing, the same class of bug that
// broke the tour-packages page when a prop arrived unexpectedly absent.
export default function AirportTransferClient({
  airports = [],
  vehicles = [],
  cities = [],
}: {
  airports?: Airport[];
  vehicles?: AirportVehicle[];
  cities?: AirportCity[];
}) {
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

  // The form reports which of ITS internal steps (vehicle / details /
  // payment) it's currently on — the form keeps owning that state
  // internally (it's complex: direction + city + 10+ fields, capacity
  // checks, payment picker), this wrapper just needs to know enough to
  // drive the progress bar.
  const [formStep, setFormStep] = useState(0); // 0 = vehicle, 1 = details, 2 = payment

  // Overall step is derived: airport selection always counts as step 0
  // regardless of where the form internally is, until an airport exists.
  const overallStep = !selectedAirport ? 0 : 1 + formStep;

  return (
    <>
      <AirportHero
        airports={airports}
        selectedAirport={selectedAirport}
        onSelectAirport={setSelectedAirport}
      />

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <StepProgress steps={STEPS} currentIndex={overallStep} />
        </div>

        <AirportBookingForm
          airport={selectedAirport}
          vehicles={vehicles}
          cities={cities}
          onStepChange={setFormStep}
        />
      </section>
    </>
  );
}