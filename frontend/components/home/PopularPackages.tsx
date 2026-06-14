import Image from "next/image";
import Link from "next/link";

const packages = [
  {
    title: "Manali Luxury Escape",
    location: "Himachal Pradesh",
    duration: "5 Days / 4 Nights",
    price: "₹25,999",
    image: "/packages/manali.jpg",
    highlights: [
      "Luxury Cab",
      "Hotel Stay",
      "Local Sightseeing",
    ],
    href: "/packages/manali-luxury",
  },
  {
    title: "Kashmir Paradise Tour",
    location: "Kashmir",
    duration: "6 Days / 5 Nights",
    price: "₹34,999",
    image: "/packages/kashmir.jpg",
    highlights: [
      "Private Chauffeur",
      "Houseboat Stay",
      "Sightseeing",
    ],
    href: "/packages/kashmir-paradise",
  },
  {
    title: "Golden Triangle Tour",
    location: "Delhi - Agra - Jaipur",
    duration: "5 Days / 4 Nights",
    price: "₹29,999",
    image: "/packages/golden-triangle.jpg",
    highlights: [
      "Luxury Vehicle",
      "Monument Visits",
      "Premium Hotels",
    ],
    href: "/packages/golden-triangle",
  },
];

export default function PopularPackages() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="mb-16 text-center">

          <p
            className="
              mb-3
              uppercase
              tracking-[0.3em]
              text-[#ecb100]
            "
          >
            Featured Tours
          </p>

          <h2
            className="
              text-4xl
              font-bold
              text-white
              md:text-5xl
            "
          >
            Popular Tour Packages
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-[#8a8a8a]
            "
          >
            Experience India's most beautiful destinations
            with premium vehicles and customized itineraries.
          </p>

        </div>


        {/* Cards */}

        <div
          className="
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          "
        >

          {packages.map((pkg)=>(
            <div
              key={pkg.title}
              className="
                group
                overflow-hidden
                rounded-3xl
                border
                border-[#252525]
                bg-[#141414]
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-[#ecb100]
                hover:shadow-[0_0_35px_rgba(236,177,0,0.15)]
              "
            >

              <div className="relative h-64">

                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="
                    object-cover
                    transition
                    duration-700
                    group-hover:scale-110
                  "
                />


                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black
                    to-transparent
                  "
                />

              </div>


              <div className="p-6">

                <p className="text-sm text-[#ecb100]">
                  {pkg.location}
                </p>


                <h3
                  className="
                    mt-2
                    text-2xl
                    font-bold
                    text-white
                  "
                >
                  {pkg.title}
                </h3>


                <p
                  className="
                    mt-2
                    text-[#8a8a8a]
                  "
                >
                  {pkg.duration}
                </p>


                <div className="mt-5">

                  <p className="text-sm text-[#8a8a8a]">
                    Starting From
                  </p>

                  <p
                    className="
                      text-2xl
                      font-bold
                      text-[#ecb100]
                    "
                  >
                    {pkg.price}
                  </p>

                </div>


                <ul
                  className="
                    mt-5
                    space-y-2
                    text-sm
                    text-[#c7c7c7]
                  "
                >
                  {pkg.highlights.map(item=>(
                    <li key={item}>
                      ✓ {item}
                    </li>
                  ))}
                </ul>


                <Link
                  href={pkg.href}
                  className="
                    mt-6
                    block
                    rounded-xl
                    border
                    border-[#ecb100]
                    py-3
                    text-center
                    text-[#ecb100]

                    transition

                    hover:bg-[#ecb100]
                    hover:text-black
                  "
                >
                  View Package
                </Link>


              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}