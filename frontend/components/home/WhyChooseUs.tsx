import { Clock3, ShieldCheck, CarFront, Headphones } from "lucide-react";
import Reveal from "@/components/common/Reveal";

const features = [
  { icon: Clock3, title: "24/7 Availability", description: "Round-the-clock booking and support for all your travel needs." },
  { icon: ShieldCheck, title: "Safe & Reliable", description: "Professional chauffeurs and well-maintained vehicles." },
  { icon: CarFront, title: "Premium Fleet", description: "Luxury cars, tempo travellers and coaches for every journey." },
  { icon: Headphones, title: "Dedicated Support", description: "Quick assistance before, during and after your trip." },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#111111] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-14 text-center">
          <p className="mb-3 uppercase tracking-[0.3em] text-[#ecb100]">Why Choose Us</p>
          <h2 className="text-4xl font-bold text-white md:text-5xl">Experience Luxury Travel Differently</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#8a8a8a]">
            Combining comfort, professionalism and reliability to deliver exceptional travel experiences.
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={i * 90}>
                <div className="group rounded-3xl border border-[#252525] bg-[#141414] p-8 h-full transition-all duration-300 hover:border-[#ecb100] hover:-translate-y-1">
                  <Icon className="mb-5 h-10 w-10 text-[#ecb100] transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-[#8a8a8a]">{feature.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}