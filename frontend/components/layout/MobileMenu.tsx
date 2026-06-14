// components/layout/MobileMenu.tsx

"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden"
      >
        <Menu className="h-6 w-6 text-white" />
      </button>

      {open && (
        <div
          className="
            fixed inset-0 z-[100]
            bg-black/90
            backdrop-blur
          "
        >
          <div className="flex items-center justify-between p-6">
            <h2 className="text-xl font-bold text-[#ecb100]">
              MAAN TRAVELS
            </h2>

            <button onClick={() => setOpen(false)}>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <nav className="flex flex-col px-6">
            {[
              ["Home", "/"],
              ["Fleet", "/fleet"],
              ["Packages", "/packages"],
              ["Gallery", "/gallery"],
              ["About", "/about"],
              ["Feedback", "/feedback"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="
                  border-b border-[#252525]
                  py-4
                  text-lg
                  text-white
                "
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}