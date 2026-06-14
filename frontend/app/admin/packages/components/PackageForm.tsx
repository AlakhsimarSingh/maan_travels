"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import VehiclePricing from "./VehiclePricing";
import ItineraryBuilder from "./ItineraryBuilder";
import ImageUploader from "./ImageUploader";

export default function PackageForm() {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");

  return (
    <div className="space-y-10">
      {/* BASIC INFO */}
      <div className="rounded-2xl border border-[#252525] bg-[#141414] p-6 space-y-5">
        <h3 className="text-xl font-semibold text-white">
          Basic Information
        </h3>

        <Input
          placeholder="Package Title (e.g. Manali Deluxe Tour)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          placeholder="Destination (e.g. Himachal Pradesh)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      {/* VEHICLE PRICING */}
      <VehiclePricing />

      {/* ITINERARY */}
      <ItineraryBuilder />

      {/* IMAGES */}
      <ImageUploader />

      {/* SUBMIT */}
      <Button className="w-full bg-[#ecb100] text-black hover:bg-[#f6c94c]">
        Save Package
      </Button>
    </div>
  );
}