"use client";

import Image from "next/image";
import { useState } from "react";

import { airports } from "@/src/data/airports";

export default function AirportHero() {
  const [selectedAirport, setSelectedAirport] = useState(
    airports[0]
  );

  return (
    <section
      className="
        relative
        min-h-[80vh]
        overflow-hidden
        pt-32
      "
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={selectedAirport.image}
          alt={selectedAirport.name}
          fill
          priority
          className="
            object-cover
            transition-all
            duration-700
          "
        />

        <div className="absolute inset-0 bg-black/70" />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black
            via-black/70
            to-transparent
          "
        />
      </div>

      {/* Content */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[70vh]
          max-w-7xl
          items-center
          px-6
        "
      >
        <div className="max-w-3xl">
          <p
            className="
              mb-5
              uppercase
              tracking-[0.4em]
              text-[#ecb100]
            "
          >
            Airport Transfer
          </p>

          <h1
            className="
              text-5xl
              font-bold
              leading-tight
              text-white
              md:text-7xl
            "
          >
            Premium Airport Transfers

            <span className="block text-[#ecb100]">
              Across Punjab & North India
            </span>
          </h1>

          <p
            className="
              mt-6
              max-w-2xl
              text-lg
              leading-relaxed
              text-[#c7c7c7]
            "
          >
            {selectedAirport.description}
          </p>

          {/* Airport Selector */}
          <div className="mt-10">
            <p
              className="
                mb-4
                text-sm
                uppercase
                tracking-[0.2em]
                text-[#8a8a8a]
              "
            >
              Select Airport
            </p>

            <div className="flex flex-wrap gap-3">
              {airports.map((airport) => (
                <button
                  key={airport.id}
                  onClick={() =>
                    setSelectedAirport(airport)
                  }
                  className={`
                    rounded-full
                    border
                    px-5
                    py-3
                    text-sm
                    font-medium
                    transition-all
                    duration-300

                    ${
                      selectedAirport.id === airport.id
                        ? `
                          border-[#ecb100]
                          bg-[#ecb100]
                          text-black
                          shadow-[0_0_25px_rgba(236,177,0,0.25)]
                        `
                        : `
                          border-[#252525]
                          bg-black/40
                          text-white
                          hover:border-[#ecb100]
                          hover:text-[#ecb100]
                        `
                    }
                  `}
                >
                  {airport.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Line */}
          <div
            className="
              mt-10
              flex
              flex-wrap
              gap-6
              text-sm
              text-[#8a8a8a]
            "
          >
            <span>✓ 24/7 Availability</span>
            <span>✓ Professional Chauffeurs</span>
            <span>✓ On-Time Pickup</span>
          </div>
        </div>
      </div>
    </section>
  );
}