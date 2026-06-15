"use client";

export default function VehicleSelector({
  vehicles,
  selected,
  setSelected,
}: {
  vehicles: any[];
  selected: string;
  setSelected: (id: string) => void;
}) {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {vehicles.map((vehicle) => (
        <button
          key={vehicle.id}
          onClick={() => setSelected(vehicle.id)}
          className={`
            rounded-2xl border p-5 text-left transition
            ${
              selected === vehicle.id
                ? "border-[#ecb100] bg-[#ecb100]/10"
                : "border-[#252525] bg-black/30"
            }
          `}
        >
          <h3 className="font-semibold text-white">
            {vehicle.name}
          </h3>
        </button>
      ))}
    </div>
  );
}