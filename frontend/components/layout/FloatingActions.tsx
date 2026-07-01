"use client";

import { useEffect, useState } from "react";
import { Phone, MessageCircle, ArrowUp, X } from "lucide-react";
import { siteConfig } from "@/src/config/site";

export default function FloatingActions() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    /*
      FIX 1 — mobile touch dead zone:
      The wrapper must be `w-fit` so it only occupies the space of its
      contents. Without this, the fixed div stretches to fill its containing
      block and the invisible (opacity-0) area intercepts all touch events
      on the bottom half of the screen even when pointer-events-none is set
      on the inner action list — because the outer wrapper itself still
      catches the events first.
    */
    <div className="fixed bottom-6 right-6 z-[70] flex w-fit flex-col items-end gap-4">

      {/* ACTION BUTTONS */}
      <div
        className={`
          flex flex-col items-end gap-3
          transition-all duration-500 ease-out
          ${open
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-5 pointer-events-none"
          }
        `}
      >
        {/* WhatsApp */}
        <a
          href="https://wa.me/918054404591"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="
            group flex items-center gap-3
            rounded-full border border-[#252525]
            bg-[#111]/95 backdrop-blur-xl
            px-5 py-3 text-sm text-[#c7c7c7]
            shadow-xl transition-all
            hover:border-[#ecb100] hover:text-[#ecb100]
          "
        >
          <MessageCircle size={18} className="text-[#ecb100]" aria-hidden="true" />
          WhatsApp
        </a>

        {/* Call */}
        <a
          href={`tel:${siteConfig.contact.phone}`}
          aria-label={`Call us at ${siteConfig.contact.phone}`}
          className="
            flex items-center gap-3
            rounded-full border border-[#252525]
            bg-[#111]/95 backdrop-blur-xl
            px-5 py-3 text-sm text-[#c7c7c7]
            shadow-xl transition-all
            hover:border-[#ecb100] hover:text-[#ecb100]
          "
        >
          <Phone size={18} className="text-[#ecb100]" aria-hidden="true" />
          Call Now
        </a>

        {/* Scroll to top */}
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          className="
            flex items-center gap-3
            rounded-full border border-[#252525]
            bg-[#111]/95 backdrop-blur-xl
            px-5 py-3 text-sm text-[#c7c7c7]
            shadow-xl transition-all
            hover:border-[#ecb100] hover:text-[#ecb100]
          "
        >
          <ArrowUp size={18} className="text-[#ecb100]" aria-hidden="true" />
          Top
        </button>
      </div>

      {/* MAIN TOGGLE BUTTON */}
      {/*
        FIX 2 — aria-label:
        Icon-only button (X or ☰) — the X SVG already has aria-hidden so
        the button had no accessible name at all. This was the element
        Lighthouse flagged as "Buttons must have discernible text".
      */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close quick actions" : "Open quick actions"}
        aria-expanded={open}
        className="
          relative flex h-14 w-14 items-center justify-center
          rounded-full bg-[#ecb100] text-black
          shadow-[0_0_35px_rgba(236,177,0,0.35)]
          transition-all duration-300
          hover:scale-105 hover:bg-[#f6c94c]
        "
      >
        {open ? (
          <X size={24} aria-hidden="true" />
        ) : (
          <>
            <span className="absolute inset-0 rounded-full animate-ping bg-[#ecb100]/30" />
            <span className="relative" aria-hidden="true">☰</span>
          </>
        )}
      </button>

    </div>
  );
}