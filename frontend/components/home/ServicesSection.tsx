import Link from "next/link";
import {
  Car,
  Plane,
  Bus,
  Crown,
  HeartHandshake,
  Map,
} from "lucide-react";

const services = [
  {
    title: "Luxury Car Rental",
    description:
      "Premium sedans and SUVs for business, leisure and VIP travel.",
    icon: Crown,
    href: "/luxury-cars",
  },
  {
    title: "Airport Transfers",
    description:
      "Reliable pickup and drop services with professional chauffeurs.",
    icon: Plane,
    href: "/airport-transfer",
  },
  {
    title: "Tempo Traveller",
    description:
      "Comfortable group transportation for tours and family trips.",
    icon: Bus,
    href: "/tempo-traveller-urbania",
  },
  {
    title: "Wedding Cars",
    description:
      "Elegant luxury vehicles for weddings and special occasions.",
    icon: HeartHandshake,
    href: "/wedding-cars",
  },
  {
    title: "Tour Packages",
    description:
      "Customized tours across Himachal, Kashmir and India.",
    icon: Map,
    href: "/packages",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 uppercase tracking-[0.3em] text-[#ecb100]">
            Our Services
          </p>

          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Premium Travel Solutions
          </h2>

          <p className="mx-auto max-w-2xl text-[#8a8a8a]">
            Whether you need airport transfers, luxury vehicles,
            wedding transportation or complete tour packages,
            we provide tailored travel experiences.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.title}
                href={service.href}
                className="
                  group
                  rounded-3xl
                  border
                  border-[#252525]
                  bg-[#141414]
                  p-8
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#ecb100]
                  hover:shadow-[0_0_30px_rgba(236,177,0,0.12)]
                "
              >
                <div
                  className="
                    mb-6
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#1b1b1b]
                    text-[#ecb100]
                  "
                >
                  <Icon size={28} />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-white">
                  {service.title}
                </h3>

                <p className="mb-4 text-[#8a8a8a]">
                  {service.description}
                </p>

                <span
                  className="
                    text-sm
                    font-medium
                    text-[#ecb100]
                  "
                >
                  Learn More →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}