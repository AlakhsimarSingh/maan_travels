import { ShieldCheck, Clock, MapPin, Car } from "lucide-react";
import Reveal from "@/components/common/Reveal";

const features = [
  {
    icon: ShieldCheck,
    title: "Safe & Reliable Travel",
    desc: "Every ride is backed by trained chauffeurs and verified vehicles.",
  },
  {
    icon: Clock,
    title: "On-Time Commitment",
    desc: "Punctual pickups and smooth scheduling across all routes.",
  },
  {
    icon: Car,
    title: "Premium Fleet",
    desc: "From economy to luxury, choose vehicles that match your journey.",
  },
  {
    icon: MapPin,
    title: "Pan-India Coverage",
    desc: "Extensive routes across North India and major tourist destinations.",
  },
];

export default function AboutWhy() {
  return (
    <section className="py-20 border-t border-[#252525]">
      <div className="max-w-7xl mx-auto px-6">

        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Choose Us
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, i) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.title} delay={i * 90}>
                <div
                  className="
                    group p-6 rounded-2xl h-full
                    bg-[#141414]
                    border border-[#252525]
                    hover:border-[#ecb100]
                    hover:-translate-y-1
                    transition-all duration-300
                  "
                >
                  <Icon className="text-[#ecb100] mb-4 transition-transform duration-300 group-hover:scale-110" />

                  <h3 className="text-white font-semibold mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#8a8a8a]">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}