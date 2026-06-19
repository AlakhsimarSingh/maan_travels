"use client";

import RouteCard from "./RouteCard";
import { useBookingModal } from "@/src/store/bookingModalStore";
import { useVehicles } from "@/src/hooks/useVehicles";

type Props = {
  title: string;
  routes: any[];
  type: "taxi" | "airport" | "tour";
};

export default function RouteSection({ title, routes, type }: Props) {
  const { openModal } = useBookingModal();
  const { vehicles } = useVehicles();

  const displayRoutes = routes.slice(0, 9);

  if (!displayRoutes.length) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="h-px flex-1 bg-[#252525]" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {displayRoutes.map((route, i) => (
          <RouteCard
            key={route.id}
            index={i}
            title={route.title}
            from={route.from}
            to={route.to}
            category={route.category}
            pricing={route.pricing || []}
            vehicles={vehicles}
            onBook={(vehicleId, price) =>
              openModal(type, {
                pickup: route.from,
                drop: route.to,
                rideMode: "oneway",
                routeId: route.id,
                vehicleId,
                price,
              })
            }
          />
        ))}
      </div>
    </section>
  );
}