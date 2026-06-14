"use client";

import { useEffect, useState } from "react";
import { Phone, MessageCircle, ArrowUp, X } from "lucide-react";
import { siteConfig } from "@/src/config/site";

export default function FloatingActions() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[70] flex flex-col items-end gap-4">

      {/* ACTION BUTTONS */}
      <div
        className={`
          flex flex-col items-end gap-3
          transition-all duration-500 ease-out
          ${
            open
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
          className="
            group
            flex items-center gap-3
            rounded-full
            border border-[#252525]
            bg-[#111]/95
            backdrop-blur-xl
            px-5 py-3
            text-sm
            text-[#c7c7c7]
            shadow-xl
            transition-all
            hover:border-[#ecb100]
            hover:text-[#ecb100]
          "
        >
          <MessageCircle
            size={18}
            className="text-[#ecb100]"
          />
          WhatsApp
        </a>


        {/* Call */}
        <a
          href={`tel:${siteConfig.contact.phone}`}
          className="
            flex items-center gap-3
            rounded-full
            border border-[#252525]
            bg-[#111]/95
            backdrop-blur-xl
            px-5 py-3
            text-sm
            text-[#c7c7c7]
            shadow-xl
            transition-all
            hover:border-[#ecb100]
            hover:text-[#ecb100]
          "
        >
          <Phone
            size={18}
            className="text-[#ecb100]"
          />
          Call Now
        </a>


        {/* Scroll Top */}
        <button
          onClick={scrollToTop}
          className="
            flex items-center gap-3
            rounded-full
            border border-[#252525]
            bg-[#111]/95
            backdrop-blur-xl
            px-5 py-3
            text-sm
            text-[#c7c7c7]
            shadow-xl
            transition-all
            hover:border-[#ecb100]
            hover:text-[#ecb100]
          "
        >
          <ArrowUp
            size={18}
            className="text-[#ecb100]"
          />
          Top
        </button>

      </div>


      {/* MAIN BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="
          relative
          flex
          h-14
          w-14
          items-center
          justify-center

          rounded-full

          bg-[#ecb100]
          text-black

          shadow-[0_0_35px_rgba(236,177,0,0.35)]

          transition-all
          duration-300

          hover:scale-105
          hover:bg-[#f6c94c]
        "
      >
        {open ? (
          <X size={24} />
        ) : (
          <>
            <span className="
              absolute
              inset-0
              rounded-full
              animate-ping
              bg-[#ecb100]/30
            "/>

            <span className="relative">
              ☰
            </span>
          </>
        )}
      </button>

    </div>
  );
}