"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Which wedding cars are available?",
    a: "We provide Mercedes Maybach, G-Wagon, Range Rover, Jaguar, Fortuner Legender and premium SUVs.",
  },
  {
    q: "Are wedding cars chauffeur driven?",
    a: "Yes. All luxury wedding cars are provided with professional chauffeurs.",
  },
  {
    q: "Can I book cars for multiple wedding functions?",
    a: "Yes. Cars can be arranged for engagement, wedding day, reception and photography sessions.",
  },
  {
    q: "Do you provide wedding car decoration?",
    a: "Yes. Custom decoration options can be arranged according to your requirements.",
  },
];

export default function WeddingFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24" ref={sectionRef}>
      <div className="mx-auto max-w-4xl px-6">
        <h2 className={`text-center text-4xl font-bold text-white reveal ${visible ? "reveal-visible" : ""}`}>
          Wedding Car Rental FAQs
        </h2>

        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.q}
              style={{ transitionDelay: `${index * 80}ms` }}
              className={`overflow-hidden rounded-2xl border border-[#252525] bg-[#141414] transition-colors duration-300 reveal ${
                visible ? "reveal-visible" : ""
              } ${open === index ? "border-[#ecb100]/40" : ""}`}
            >
              <button
                onClick={() => setOpen(open === index ? null : index)}
                className="flex w-full justify-between p-6 text-left text-white"
              >
                {faq.q}
                <ChevronDown
                  className={`shrink-0 transition-transform duration-300 ${
                    open === index ? "rotate-180 text-[#ecb100]" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-out ${
                  open === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 leading-7 text-[#8a8a8a]">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
    </section>
  );
}