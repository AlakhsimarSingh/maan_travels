import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    location: "Delhi",
    type: "Corporate Travel",
    review:
      "Excellent service and very professional chauffeurs. The vehicle was premium and the entire journey was completely hassle-free.",
  },
  {
    name: "Simran Kaur",
    location: "Punjab",
    type: "Family Vacation",
    review:
      "We booked a Himachal trip with Maan Travels. The planning, driver experience and support were outstanding.",
  },
  {
    name: "Amit Verma",
    location: "Chandigarh",
    type: "Wedding Transportation",
    review:
      "The luxury cars made our wedding event memorable. Highly recommended for premium travel.",
  },
];

export default function Testimonials() {
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
            Customer Reviews
          </p>

          <h2
            className="
              text-4xl
              font-bold
              text-white
              md:text-5xl
            "
          >
            What Our Customers Say
          </h2>


          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-[#8a8a8a]
            "
          >
            Thousands of travelers trust us for
            comfortable and reliable journeys.
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

          {testimonials.map((item)=>(
            <div
              key={item.name}
              className="
                rounded-3xl
                border
                border-[#252525]
                bg-[#141414]
                p-8
                transition-all
                duration-300
                hover:border-[#ecb100]
                hover:shadow-[0_0_30px_rgba(236,177,0,0.12)]
              "
            >

              {/* Stars */}

              <div className="mb-5 flex gap-1">

                {[1,2,3,4,5].map((star)=>(
                  <Star
                    key={star}
                    size={18}
                    className="
                      fill-[#ecb100]
                      text-[#ecb100]
                    "
                  />
                ))}

              </div>


              {/* Review */}

              <p
                className="
                  leading-relaxed
                  text-[#c7c7c7]
                "
              >
                "{item.review}"
              </p>


              {/* User */}

              <div className="mt-8">

                <h3
                  className="
                    font-semibold
                    text-white
                  "
                >
                  {item.name}
                </h3>


                <p
                  className="
                    text-sm
                    text-[#8a8a8a]
                  "
                >
                  {item.type} • {item.location}
                </p>

              </div>


            </div>
          ))}

        </div>

      </div>

    </section>
  );
}