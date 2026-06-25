"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const services = [
  { label: "Luxury Cars", href: "/luxury-cars" },
  { label: "Self Drive Rentals", href: "/self-drive" },
  { label: "Go Taxi", href: "/go-taxi" },
  { label: "Tempo / Urbania", href: "/tempo-traveller-urbania" },
  { label: "Airport Transfer", href: "/airport-transfer" },
  { label: "Wedding Cars", href: "/wedding-cars" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Tour Packages", href: "/tour-packages" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Feedback", href: "/feedback" },
  { label: "Contact", href: "/contact" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  // Remember the scroll position from the moment the menu opens, so we
  // can restore it exactly on close instead of letting the browser pick.
  const scrollYRef = useRef(0);

  // Lock body scroll when menu is open.
  //
  // On Android Chrome, just setting `overflow: hidden` on body while the
  // page is scrolled down can trigger a scroll-anchoring jump right as
  // the fixed drawer is first painted — and since the drawer also uses
  // `overflow-y-auto`, that bad first layout pass can leave its content
  // clipped until something (e.g. scrolling) forces a reflow. Locking
  // the body with `position: fixed` instead of relying on `overflow`
  // alone avoids that jump, because the page no longer needs to move at
  // all — we're freezing it in place rather than asking the browser to
  // suppress scrolling on a page that's still positioned mid-scroll.
  useEffect(() => {
    if (open) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollYRef.current);
      setServicesOpen(false);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#252525] text-white transition hover:border-[#ecb100]/50"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* OVERLAY — always in DOM, toggled via opacity/pointer-events for SEO */}
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[99] h-dvh bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* DRAWER — slides in from the right, always in DOM.
          h-dvh (not h-full/100%) so Android Chrome's dynamic toolbar
          collapsing/expanding as you scroll doesn't leave this laid out
          against a stale viewport height. */}
      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        className={`
          fixed right-0 top-0 z-[100] h-dvh w-80 max-w-[90vw]
          overflow-y-auto border-l border-[#252525] bg-[#0a0a0a]
          transition-transform duration-300 ease-out lg:hidden
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#252525] p-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-xl font-bold text-[#ecb100]"
          >
            MAAN TRAVELS
          </Link>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#252525] text-white transition hover:border-[#ecb100]/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAV LINKS */}
        <ul className="flex flex-col p-4" role="list">
          {/* Home */}
          <NavItem href="/" label="Home" active={pathname === "/"} onClick={() => setOpen(false)} />

          {/* Services accordion */}
          <li>
            <button
              onClick={() => setServicesOpen((prev) => !prev)}
              aria-expanded={servicesOpen}
              aria-controls="services-submenu"
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-base font-medium transition-colors ${
                services.some((s) => pathname === s.href)
                  ? "text-[#ecb100]"
                  : "text-white hover:text-[#ecb100]"
              }`}
            >
              Services
              <ChevronDown
                size={17}
                className={`transition-transform duration-200 ${servicesOpen ? "rotate-180 text-[#ecb100]" : "text-[#666]"}`}
              />
            </button>

            {/* Services submenu — always in DOM, toggled via grid trick */}
            <ul
              id="services-submenu"
              role="list"
              className={`grid overflow-hidden transition-all duration-300 ease-out ${
                servicesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <li className="overflow-hidden">
                <ul className="mb-2 ml-4 space-y-1 border-l border-[#252525] pl-3" role="list">
                  {services.map((s) => (
                    <li key={s.href}>
                      <Link
                        href={s.href}
                        onClick={() => setOpen(false)}
                        className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                          pathname === s.href
                            ? "text-[#ecb100]"
                            : "text-[#c7c7c7] hover:text-[#ecb100]"
                        }`}
                      >
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </li>

          {/* Remaining nav links */}
          {navLinks.slice(1).map((link) => (
            <NavItem
              key={link.href}
              href={link.href}
              label={link.label}
              active={pathname === link.href}
              onClick={() => setOpen(false)}
            />
          ))}
        </ul>

        {/* BOTTOM CTA */}
        <div className="border-t border-[#252525] p-5">
          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="block w-full rounded-xl bg-[#ecb100] py-3.5 text-center font-semibold text-black transition hover:bg-[#f6c94c] active:scale-[0.98]"
          >
            Book Now
          </Link>

          <div className="mt-4 space-y-2 text-sm">
            <a
              href="tel:+918054404591"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#252525] py-3 text-[#8a8a8a] transition hover:border-[#ecb100]/40 hover:text-white"
            >
              +91 80544 04591
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

function NavItem({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`block rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
          active ? "text-[#ecb100]" : "text-white hover:text-[#ecb100]"
        }`}
      >
        {label}
      </Link>
    </li>
  );
}