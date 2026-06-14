"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Item = {
  label: string;
  href: string;
};

export default function MegaMenu({
  title,
  items,
}: {
  title: string;
  items: Item[];
}) {
  const [open, setOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setOpen(true);
  };


  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 180);
  };


  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* Trigger */}
      <button
        aria-expanded={open}
        className="
          flex
          items-center
          gap-1.5
          text-sm
          text-[#c7c7c7]
          transition
          duration-300
          hover:text-[#ecb100]
        "
      >
        {title}

        <ChevronDown
          size={15}
          className={`
            transition-transform
            duration-300
            ${
              open
                ? "rotate-180 text-[#ecb100]"
                : ""
            }
          `}
        />
      </button>


      {/* Hover bridge */}
      <div
        className="
          absolute
          left-0
          top-full
          h-4
          w-full
        "
      />


      {/* Dropdown */}
      <div
        className={`
          absolute
          left-0
          top-[calc(100%+12px)]
          z-50
          w-72

          transition-all
          duration-300
          ease-out

          ${
            open
              ? `
                visible
                translate-y-0
                opacity-100
              `
              : `
                invisible
                -translate-y-2
                opacity-0
              `
          }
        `}
      >

        <div
          className="
            overflow-hidden
            rounded-2xl

            border
            border-[#252525]

            bg-[#0d0d0d]/95
            backdrop-blur-xl

            shadow-[0_25px_80px_rgba(0,0,0,0.7)]
          "
        >

          <div className="p-3">

            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  group

                  flex
                  items-center
                  justify-between

                  rounded-xl

                  px-4
                  py-3

                  text-sm
                  text-[#c7c7c7]

                  transition-all
                  duration-300

                  hover:bg-[#171717]
                  hover:text-[#ecb100]
                "
              >

                <span>
                  {item.label}
                </span>


                <span
                  className="
                    translate-x-[-5px]
                    opacity-0

                    transition-all
                    duration-300

                    group-hover:translate-x-0
                    group-hover:opacity-100
                  "
                >
                  →
                </span>


              </Link>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}