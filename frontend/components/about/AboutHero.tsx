import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div>
          <p className="uppercase tracking-[0.3em] text-[#ecb100] text-sm">
            About Maan Travels
          </p>

          <h1 className="mt-4 text-5xl font-bold text-white md:text-6xl">
            Travel, Refined to Perfection
          </h1>

          <p className="mt-6 text-[#c7c7c7] text-lg">
            Premium chauffeur-driven experiences across North India,
            designed for comfort, safety, and timeless elegance.
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <div className="absolute -inset-4 bg-[#ecb100]/10 blur-2xl rounded-3xl" />

          <div className="relative rounded-3xl overflow-hidden border border-[#252525]">
            <Image
              src="/images/about-luxury.jpg"
              alt="Luxury chauffeur travel"
              width={800}
              height={600}
              className="object-cover w-full h-[420px]"
            />
          </div>
        </div>

      </div>
    </section>
  );
}