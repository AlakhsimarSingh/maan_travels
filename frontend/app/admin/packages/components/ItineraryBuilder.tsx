"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ItineraryBuilder() {
  const [days, setDays] = useState([{ title: "", desc: "" }]);

  const addDay = () => {
    setDays([...days, { title: "", desc: "" }]);
  };

  return (
    <div className="rounded-2xl border border-[#252525] bg-[#141414] p-6 space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">
          Itinerary
        </h3>

        <Button
          onClick={addDay}
          className="bg-[#ecb100] text-black hover:bg-[#f6c94c]"
        >
          + Add Day
        </Button>
      </div>

      {days.map((_, i) => (
        <div
          key={i}
          className="space-y-3 rounded-xl border border-[#252525] bg-[#111] p-4"
        >
          <input
            placeholder={`Day ${i + 1} Title`}
            className="w-full rounded-lg border border-[#252525] bg-[#0f0f0f] p-2 text-white"
          />

          <textarea
            placeholder="Day description"
            className="w-full rounded-lg border border-[#252525] bg-[#0f0f0f] p-2 text-white"
          />
        </div>
      ))}
    </div>
  );
}