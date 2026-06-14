export default function GalleryHero() {
  return (
    <section className="relative flex h-[45vh] items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/gallery-bg.jpg')" }}
      />

      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <p className="uppercase tracking-[0.3em] text-[#ecb100]">
          Our Gallery
        </p>

        <h1 className="mt-4 text-5xl font-bold text-white">
          Luxury Fleet & Travel Moments
        </h1>

        <p className="mt-5 max-w-2xl text-[#c7c7c7]">
          Explore our premium fleet, wedding cars, and unforgettable journeys.
        </p>
      </div>
    </section>
  );
}