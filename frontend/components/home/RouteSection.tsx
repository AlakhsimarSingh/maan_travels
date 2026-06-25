"use client";

import RouteCard from "./RouteCard";
import { useBookingModal } from "@/src/store/bookingModalStore";

type Vehicle = { id: string; name: string };

type Props = {
  title: string;
  routes: any[];
  vehicles: Vehicle[];
  type: "taxi" | "airport" | "tour";
};

const typeConfig: Record<
  "taxi" | "airport" | "tour",
  { label: string }
> = {
  taxi:    { label: "Outstation" },
  airport: { label: "Transfers"  },
  tour:    { label: "Curated"    },
};

export default function RouteSection({ title, routes, vehicles, type }: Props) {
  const { openModal } = useBookingModal();
  const config = typeConfig[type];

  const displayRoutes = routes.slice(0, 9);
  if (!displayRoutes.length) return null;

  return (
    <section className="mb-16">
      {/* ── Section header ──
          Pill badge matches RouteCard's category tag. The rule under the
          heading reuses the gold-dot/route-line motif from the cards, and
          gets a soft animated glow behind it — that's the one signature
          flourish for this header, kept small and contained rather than
          a big blurred blob behind the whole title. */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-[11px] font-medium tracking-wide text-[#ecb100] border border-[#ecb100]/35 rounded-full px-3 py-1">
            {config.label}
          </span>
        </div>

        <h2 className="text-[26px] sm:text-3xl font-semibold tracking-tight leading-tight text-white">
          {title}
        </h2>

        <div className="relative mt-3 max-w-[140px]">
          {/* animated glow halo, sits behind the dot/line */}
          <span
            aria-hidden
            className="absolute -inset-y-2 -inset-x-2 rounded-full bg-[#ecb100]/30 blur-md animate-pulse"
          />
          <div className="relative flex items-center gap-2">
            <span className="relative w-[6px] h-[6px] rounded-full bg-[#ecb100] flex-shrink-0">
              <span className="route-dot-pulse" />
            </span>
            <span className="route-line" />
            <span className="w-[6px] h-[6px] rounded-full border-[1.5px] border-[#ecb100]/60 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* ── Cards grid ── */}
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
                airport: type === "airport" ? route.to : undefined,
                rideMode: "oneway",
                routeId: route.id,
                vehicleId,
                price,
                // Pickup/drop are fixed by this route card — the booking
                // form should display them as read-only, not as editable
                // selects, and should ask for the exact pickup address
                // instead.
                locked: true,
              })
            }
          />
        ))}
      </div>
    </section>
  );
}