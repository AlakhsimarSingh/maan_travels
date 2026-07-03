"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";

const services = [
  { label: "Luxury Cars", href: "/luxury-cars" },
  { label: "Self Drive Rentals", href: "/self-drive" },
  { label: "Book Your Cab", href: "/go-taxi" },
  { label: "Tempo / Urbania Travellers", href: "/tempo-traveller-urbania" },
  { label: "Airport Pick/Drop Service", href: "/airport-transfer" },
  { label: "Wedding Cars", href: "/wedding-cars" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = (path: string) => `
    group relative text-sm transition-colors duration-200
    ${pathname === path ? "text-[#ecb100]" : "text-[#c7c7c7] hover:text-[#ecb100]"}
  `;

  const underline = (path: string) => (
    <span
      className={`absolute -bottom-1.5 left-0 h-px bg-[#ecb100] transition-all duration-300 ${
        pathname === path ? "w-full" : "w-0 group-hover:w-full"
      }`}
    />
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[#252525] bg-[#0a0a0a]/95 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* LOGO */}
        <Link
          href="/"
          aria-label="Maan Travels — Home"
          className="flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.03]"
        >
          <Image
            src="/icon-emblem.png"
            alt=""
            width={218}
            height={197}
            priority
            className="h-11 w-auto object-contain sm:h-12"
          />

          <span className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-wide text-[#ecb100] sm:text-2xl">
              MAAN
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#c7c7c7] sm:text-[11px]">
              TOUR &amp; TRAVELS
            </span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/" className={linkClass("/")}>
            Home
            {underline("/")}
          </Link>

          <MegaMenu title="Services" items={services} />

          <Link href="/tour-packages" className={linkClass("/tour-packages")}>
            Tour Packages
            {underline("/tour-packages")}
          </Link>

          <Link href="/gallery" className={linkClass("/gallery")}>
            Gallery
            {underline("/gallery")}
          </Link>

          <Link href="/about" className={linkClass("/about")}>
            About
            {underline("/about")}
          </Link>

          <Link href="/feedback" className={linkClass("/feedback")}>
            Feedback
            {underline("/feedback")}
          </Link>

          <Link href="/contact" className={linkClass("/contact")}>
            Contact
            {underline("/contact")}
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden lg:block">
          <Link href="/booking">
            <Button
              aria-label="Book a ride with Maan Travels"
              className="bg-[#ecb100] text-black transition-all duration-200 hover:scale-[1.03] hover:bg-[#f6c94c] hover:shadow-[0_6px_20px_-6px_rgba(236,177,0,0.5)] active:scale-[0.98]"
            >
              Book Now
            </Button>
          </Link>
        </div>

        {/* MOBILE */}
        <MobileMenu />
      </div>
    </header>
  );
}