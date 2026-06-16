"use client";

import { useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import TaxiBookingForm from "@/components/booking/TaxiBookingForm";
import TourBookingForm from "@/components/booking/TourBookingForm";

export default function BookingForm() {
  const [rideMode, setRideMode] = useState<
    "oneway" | "round" | "local"
  >("oneway");

  return (
    <div
      className="
      mx-auto
      max-w-5xl
      rounded-3xl
      border
      border-[#252525]
      bg-[#141414]
      p-8
    "
    >
      <h2 className="mb-8 text-3xl font-bold text-white">
        Book Your Journey
      </h2>

      <Tabs defaultValue="taxi">

        <TabsList className="mb-8 bg-[#111]">

          <TabsTrigger value="taxi">
            Taxi / Cab
          </TabsTrigger>

          <TabsTrigger value="tour">
            Tour Package
          </TabsTrigger>

        </TabsList>

        {/* 🚖 TAXI TAB */}
        <TabsContent value="taxi">

          <div className="space-y-6">

            {/* 🔥 FIXED RIDE MODE SELECTOR */}
            <div className="flex gap-4 text-sm flex-wrap">

              <button
                onClick={() => setRideMode("oneway")}
                className={`
                  px-4 py-2 rounded-lg border
                  transition
                  ${
                    rideMode === "oneway"
                      ? "bg-[#ecb100] text-black border-[#ecb100]"
                      : "bg-[#111] text-white border-[#252525]"
                  }
                `}
              >
                One Way
              </button>

              <button
                onClick={() => setRideMode("round")}
                className={`
                  px-4 py-2 rounded-lg border
                  transition
                  ${
                    rideMode === "round"
                      ? "bg-[#ecb100] text-black border-[#ecb100]"
                      : "bg-[#111] text-white border-[#252525]"
                  }
                `}
              >
                Round Trip
              </button>

              <button
                onClick={() => setRideMode("local")}
                className={`
                  px-4 py-2 rounded-lg border
                  transition
                  ${
                    rideMode === "local"
                      ? "bg-[#ecb100] text-black border-[#ecb100]"
                      : "bg-[#111] text-white border-[#252525]"
                  }
                `}
              >
                Local Ride
              </button>

            </div>

            {/* PASS MODE TO FORM (optional for next step) */}
            <TaxiBookingForm rideMode={rideMode} />

          </div>

        </TabsContent>

        {/* 🧳 TOUR TAB */}
        <TabsContent value="tour">
          <TourBookingForm />
        </TabsContent>

      </Tabs>
    </div>
  );
}