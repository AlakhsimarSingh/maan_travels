import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-28">

      {/* Background */}
      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
        "
        style={{
          backgroundImage:
            "url('/images/cta-bg.jpg')",
        }}
      />

      {/* Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-black/75
        "
      />


      {/* Gold Glow */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-black
          via-black/70
          to-transparent
        "
      />


      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-6
        "
      >

        <div className="max-w-3xl">

          <p
            className="
              mb-5
              uppercase
              tracking-[0.35em]
              text-[#ecb100]
            "
          >
            Premium Travel Experience
          </p>


          <h2
            className="
              mb-6
              text-4xl
              font-bold
              leading-tight
              text-white
              md:text-6xl
            "
          >
            Ready For Your
            <span className="block text-[#ecb100]">
              Next Journey?
            </span>
          </h2>


          <p
            className="
              mb-10
              max-w-2xl
              text-lg
              text-[#c7c7c7]
            "
          >
            Book luxury chauffeur-driven cars,
            airport transfers and customized tours
            across India.
          </p>


          <div className="flex flex-wrap gap-5">


            <Button
              size="lg"
              className="
                bg-[#ecb100]
                px-8
                text-black
                hover:bg-[#f6c94c]
              "
              asChild
            >
              <Link href="/booking">
                Book Your Ride
              </Link>
            </Button>



            <Button
              size="lg"
              variant="outline"
              className="
                border-[#ecb100]
                px-8
                text-[#ecb100]

                hover:bg-[#ecb100]
                hover:text-black
              "
              asChild
            >
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>


          </div>

        </div>

      </div>

    </section>
  );
}