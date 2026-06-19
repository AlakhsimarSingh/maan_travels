"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/feedback?visible=true"
        );

        const data = await res.json();
        setTestimonials(data.feedbacks || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}
        <div className="mb-16 text-center">

          <p className="mb-3 uppercase tracking-[0.3em] text-[#ecb100]">
            Customer Reviews
          </p>

          <h2 className="text-4xl font-bold text-white md:text-5xl">
            What Our Customers Say
          </h2>

        </div>

        {/* GRID */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-[#252525] bg-[#141414] p-8"
            >

              {/* STARS */}
              <div className="mb-5 flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-[#ecb100] text-[#ecb100]"
                  />
                ))}
              </div>

              {/* COMMENT */}
              <p className="text-[#c7c7c7]">
                "{item.comments}"
              </p>

              {/* USER */}
              <div className="mt-6">
                <h3 className="font-semibold text-white">
                  {item.customerName}
                </h3>

                <p className="text-sm text-[#8a8a8a]">
                  {item.route || "Customer"}
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}