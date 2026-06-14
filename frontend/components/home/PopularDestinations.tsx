import Image from "next/image";
import Link from "next/link";

const destinations = [
  {
    name: "Himachal Pradesh",
    image: "/destinations/himachal.jpg",
    tours: "25+ Packages",
    href: "/destinations/himachal",
  },
  {
    name: "Kashmir",
    image: "/destinations/kashmir.jpg",
    tours: "18+ Packages",
    href: "/destinations/kashmir",
  },
  {
    name: "Amritsar",
    image: "/destinations/amritsar.jpg",
    tours: "12+ Packages",
    href: "/destinations/amritsar",
  },
  {
    name: "Golden Triangle",
    image: "/destinations/golden-triangle.jpg",
    tours: "20+ Packages",
    href: "/destinations/golden-triangle",
  },
  {
    name: "Vaishno Devi",
    image: "/destinations/vaishno-devi.jpg",
    tours: "15+ Packages",
    href: "/destinations/vaishno-devi",
  },
  {
    name: "Manali",
    image: "/destinations/manali.jpg",
    tours: "22+ Packages",
    href: "/destinations/manali",
  },
];

export default function PopularDestinations() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 uppercase tracking-[0.3em] text-[#ecb100]">
            Explore India
          </p>

          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Popular Destinations
          </h2>

          <p className="mx-auto max-w-2xl text-[#8a8a8a]">
            Discover breathtaking destinations with premium
            transportation and customized travel experiences.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <Link
              key={destination.name}
              href={destination.href}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-[#252525]
              "
            >
              <div className="relative h-[420px]">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-110
                  "
                />

                {/* Overlay */}
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black
                    via-black/30
                    to-transparent
                  "
                />

                {/* Content */}
                <div
                  className="
                    absolute bottom-0 left-0
                    w-full p-8
                  "
                >
                  <p className="mb-2 text-sm text-[#ecb100]">
                    {destination.tours}
                  </p>

                  <h3 className="text-3xl font-bold text-white">
                    {destination.name}
                  </h3>

                  <div
                    className="
                      mt-4
                      text-sm
                      font-medium
                      text-[#ecb100]
                    "
                  >
                    Explore →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}