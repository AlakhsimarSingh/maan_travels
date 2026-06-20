import Image from "next/image";
import Reveal from "@/components/common/Reveal";

export default function AboutFounder() {
  return (
    <section className="py-20 border-t border-[#252525]">
      <div className="max-w-5xl mx-auto px-6">

        <Reveal>
          <h2 className="text-center uppercase tracking-[0.3em] text-[#ecb100] text-sm mb-10">
            From Our Founder
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center rounded-3xl border border-[#252525] bg-[#111] p-8 md:p-10">

            <div className="relative mx-auto md:mx-0">
              <div className="absolute -inset-2 rounded-full bg-[#ecb100]/10 blur-xl" />
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-[#ecb100]/40">
                <Image
                  src="/images/owner.jpg"
                  alt="Founder of Maan Travels"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <div>
              <p className="text-4xl text-[#ecb100] leading-none font-serif">"</p>
              <p className="mt-2 text-[#c7c7c7] text-lg leading-relaxed italic">
                We started Maan Travels with one simple belief — every journey
                should feel as good as the destination. That promise still
                guides every ride we plan today.
              </p>

              <div className="mt-6">
                <p className="text-white font-semibold">Founder Name</p>
                <p className="text-sm text-[#8a8a8a]">Founder & CEO, Maan Travels</p>
              </div>
            </div>

          </div>
        </Reveal>

      </div>
    </section>
  );
}