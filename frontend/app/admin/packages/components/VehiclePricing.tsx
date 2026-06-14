"use client";

const vehicles = [
  "Sedan",
  "SUV",
  "Innova Crysta",
  "Tempo Traveller",
  "Luxury Bus",
];

export default function VehiclePricing() {
  return (
    <div className="rounded-2xl border border-[#252525] bg-[#141414] p-6 space-y-5">
      <h3 className="text-xl font-semibold text-white">
        Vehicle Pricing
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {vehicles.map((v) => (
          <div
            key={v}
            className="rounded-xl border border-[#252525] bg-[#111] p-4"
          >
            <p className="text-white mb-3">{v}</p>

            <input
              placeholder="Price (₹)"
              className="w-full rounded-lg border border-[#252525] bg-[#0f0f0f] p-2 text-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
}