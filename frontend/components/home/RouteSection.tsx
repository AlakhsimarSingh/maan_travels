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
  { accent: string; label: string }
> = {
  taxi:    { accent: "#ecb100", label: "Outstation" },
  airport: { accent: "#ecb100", label: "Transfers"  },
  tour:    { accent: "#ecb100", label: "Curated"    },
};

export default function RouteSection({ title, routes, vehicles, type }: Props) {
  const { openModal } = useBookingModal();
  const config = typeConfig[type];

  const displayRoutes = routes.slice(0, 9);
  if (!displayRoutes.length) return null;

  // Split title into first word + rest so we can accent the first word
  const [firstWord, ...rest] = title.split(" ");

  return (
    <section className="mb-16">
      {/* ── Section header ── */}
      <div className="relative mb-8">
        {/* Subtle ambient glow behind the heading */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-4 left-0 h-16 w-48 rounded-full opacity-20 blur-2xl"
          style={{ background: config.accent }}
        />

        <div className="relative flex flex-col gap-2">
          {/* Eyebrow label */}
          <div className="flex items-center gap-2">
            <span
              className="h-px w-6"
              style={{ background: config.accent }}
            />
            <span
              className="text-[11px] font-medium tracking-[0.2em] uppercase"
              style={{ color: config.accent }}
            >
              {config.label}
            </span>
          </div>

          {/* Main title — first word in gold, rest in white */}
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight"
                style={{ color: config.accent }}>
              {firstWord}
            </h2>
            {rest.length > 0 && (
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-white">
                {rest.join(" ")}
              </h2>
            )}
            {/* Route count badge */}
            <span className="ml-1 text-[11px] font-medium text-black rounded-full px-2.5 py-0.5"
                  style={{ background: config.accent }}>
              {displayRoutes.length}
            </span>
          </div>

          {/* Decorative underline */}
          <div className="flex items-center gap-2 mt-1">
            <span
              className="h-[2px] w-12 rounded-full"
              style={{ background: config.accent }}
            />
            <span className="h-px flex-1 bg-[#252525]" />
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