import Reveal from "@/components/common/Reveal";

export default function AboutStory() {
  return (
    <section className="py-20 border-t border-[#252525]">
      <div className="max-w-5xl mx-auto px-6 space-y-6 text-[#c7c7c7] leading-relaxed">

        <Reveal>
          <p>
            Maan Travels is a premium taxi service based in
            Jalandhar, delivering refined mobility solutions across North India
            and beyond. With over 15+ years of experience, we specialize in
            crafting seamless, comfortable, and reliable travel experiences for
            individuals, families, and corporate clients.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <p>
            We operate across major destinations including Himachal Pradesh,
            Jammu & Kashmir, Punjab (including Chandigarh), Haryana, Uttar Pradesh, Uttarakhand, Maharas
            Rajasthan, and Delhi, offering thoughtfully curated journeys
            designed for comfort, safety, and peace of mind.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <p>
            Our fleet is driven by professionally trained chauffeurs who
            prioritize punctuality, discretion, and passenger safety. Every
            journey is guided by a commitment to service excellence, ensuring
            travel becomes an experience in itself.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <p>
            From airport transfers and intercity travel to luxury sightseeing
            tours and pilgrimage routes, we provide end-to-end mobility
            solutions tailored to your needs. We offer a versatile fleet
            including hatchbacks, premium sedans, SUVs, luxury vehicles, and
            tempo travellers — ensuring the right travel experience for every
            journey.
          </p>
        </Reveal>

        <Reveal delay={320}>
          <p className="text-white font-medium text-lg pt-2">
            At Maan Travels, travel is not just movement — it is experience,
            comfort, and trust combined.
          </p>
        </Reveal>

      </div>
    </section>
  );
}