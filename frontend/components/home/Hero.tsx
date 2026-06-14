import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CarFront,
  Clock3,
  Award,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden pt-20">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Gradient Overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-r
          from-black
          via-black/80
          to-transparent
        "
      />

      <div
        className="
          relative z-10
          mx-auto
          flex
          min-h-[calc(90vh-80px)]
          max-w-7xl
          items-center
          px-6
        "
      >
        <div className="grid w-full items-center gap-16 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <div>
            <p
              className="
                mb-5
                uppercase
                tracking-[0.4em]
                text-[#ecb100]
              "
            >
              Premium Chauffeur Service
            </p>

            <h1
              className="
                mb-6
                text-5xl
                font-bold
                leading-tight
                text-white
                md:text-7xl
              "
            >
              Luxury Travel
              <span className="block text-[#ecb100]">
                Across India
              </span>
            </h1>

            <p
              className="
                mb-10
                max-w-xl
                text-lg
                leading-relaxed
                text-[#c7c7c7]
              "
            >
              Premium chauffeur-driven cars, airport transfers,
              luxury tours, corporate travel, wedding transportation,
              and outstation journeys tailored for comfort and style.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="
                  bg-[#ecb100]
                  text-black
                  hover:bg-[#f6c94c]
                "
              >
                Book Ride
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="
                  border-[#ecb100]
                  text-[#ecb100]
                  hover:bg-[#ecb100]
                  hover:text-black
                "
                asChild
              >
                <Link href="/fleet">
                  Explore Fleet
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE TRUST CARD */}
          <div className="hidden lg:flex justify-end items-end">

            <div
              className="
                relative
                w-[350px]
                rounded-3xl
                border
                border-[#252525]
                bg-black/40
                backdrop-blur-xl
                p-9
                shadow-[0_0_50px_rgba(236,177,0,0.08)]
              "
            >

              {/* Accent line */}
              <div
                className="
                  absolute
                  left-0
                  top-8
                  h-16
                  w-1
                  bg-[#ecb100]
                  rounded-r-full
                "
              />

              <p
                className="
                  mb-8
                  text-xs
                  uppercase
                  tracking-[0.35em]
                  text-[#ecb100]
                "
              >
                Trusted Experience
              </p>


              <div className="space-y-7">
                {/* Vehicles */}
                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-5xl font-bold text-white">
                      50+
                    </h3>

                    <p className="text-[#8a8a8a]">
                      Luxury Vehicles
                    </p>
                  </div>

                  <CarFront
                    className="
                      h-10
                      w-10
                      text-[#ecb100]
                      opacity-80
                    "
                    strokeWidth={1.5}
                  />

                </div>


                <div className="h-px bg-[#252525]" />


                {/* Availability */}
                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-5xl font-bold text-white">
                      24/7
                    </h3>

                    <p className="text-[#8a8a8a]">
                      Chauffeur Availability
                    </p>
                  </div>

                  <Clock3
                    className="
                      h-10
                      w-10
                      text-[#ecb100]
                      opacity-80
                    "
                    strokeWidth={1.5}
                  />

                </div>


                <div className="h-px bg-[#252525]" />


                {/* Experience */}
                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-5xl font-bold text-white">
                      10+
                    </h3>

                    <p className="text-[#8a8a8a]">
                      Years Of Excellence
                    </p>
                  </div>

                  <Award
                    className="
                      h-10
                      w-10
                      text-[#ecb100]
                      opacity-80
                    "
                    strokeWidth={1.5}
                  />

                </div>


              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}