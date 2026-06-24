"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, MessageCircle } from "lucide-react";

import { siteConfig } from "@/src/config/site";

export default function ContactHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-[#252525] bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] pt-40 pb-24">
      {/* Ambient glow, consistent with the gold accent used elsewhere */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-[#ecb100]/10 blur-[120px]" />

      <div
        ref={ref}
        className={`relative mx-auto max-w-4xl px-6 text-center transition-all duration-700 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#ecb100]">
          We'd love to hear from you
        </p>

        <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl">
          Let's Plan Your
          <span className="block text-[#ecb100]">Next Journey</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#8a8a8a]">
          Whether it's a wedding car, an airport transfer or a full tour package —
          our team responds quickly and helps you plan it right.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
            className="group flex items-center gap-2 rounded-full bg-[#ecb100] px-6 py-3 text-sm font-medium text-black transition-all duration-200 hover:bg-[#f6c94c] hover:shadow-[0_8px_24px_-8px_rgba(236,177,0,0.4)] active:scale-95"
          >
            <Phone size={16} />
            {siteConfig.contact.phone}
          </a>

          <a
            href={`https://wa.me/${siteConfig.contact.phone.replace(/[^\d]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-[#ecb100]/40 px-6 py-3 text-sm text-[#ecb100] transition-all duration-200 hover:border-[#ecb100] hover:bg-[#ecb100]/5 active:scale-95"
          >
            <MessageCircle size={16} />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}