export default function BookingHero() {
  return (
    <section
      className="
        relative
        flex
        h-[50vh]
        items-center
      "
    >

      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
        "
        style={{
          backgroundImage:
            "url('/images/booking-bg.jpg')",
        }}
      />

      <div
        className="
          absolute
          inset-0
          bg-black/75
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

        <p
          className="
            uppercase
            tracking-[0.3em]
            text-[#ecb100]
          "
        >
          Reserve Your Journey
        </p>


        <h1
          className="
            mt-4
            text-5xl
            font-bold
            text-white
          "
        >
          Book Your Luxury Ride
        </h1>


        <p
          className="
            mt-5
            max-w-2xl
            text-lg
            text-[#c7c7c7]
          "
        >
          Premium chauffeur services,
          airport transfers and customized
          tours across India.
        </p>

      </div>

    </section>
  );
}