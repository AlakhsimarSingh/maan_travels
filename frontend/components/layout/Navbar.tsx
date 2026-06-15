"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";

import { tourPackages } from "@/src/data/packages";


const services = [
  {
    label: "Luxury Cars",
    href: "/luxury-cars",
  },
  {
    label: "Self Drive Rentals",
    href: "/self-drive",
  },
  {
    label: "Tempo/Urbania Travellers",
    href: "/tempo-traveller-urbania",
  },
  {
    label: "Airport Transfer",
    href: "/airport-transfer",
  },
  {
    label: "Wedding Cars",
    href: "/wedding-cars",
  },
];


export default function Navbar() {

  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();


  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };


    window.addEventListener(
      "scroll",
      handleScroll
    );


    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);



  const packageMenuItems = tourPackages.map(
    (pkg)=>({
      label: pkg.title,
      href: `/packages/${pkg.slug}`,
    })
  );



  const linkClass = (path:string) =>
    `
      text-sm
      transition-colors
      duration-200

      ${
        pathname === path
          ? "text-[#ecb100]"
          : "text-[#c7c7c7] hover:text-[#ecb100]"
      }
    `;



  return (

    <header
      className={`
        fixed
        top-0
        left-0
        right-0
        z-50

        transition-all
        duration-300

        ${
          scrolled
          ?
          `
          border-b
          border-[#252525]
          bg-[#0a0a0a]/95
          backdrop-blur-xl
          `
          :
          "bg-transparent"
        }
      `}
    >


      <div
        className="
          mx-auto
          flex
          h-20
          max-w-7xl
          items-center
          justify-between
          px-6
        "
      >


        {/* LOGO */}

        <Link
          href="/"
          aria-label="Maan Travels Home"
          className="
            text-2xl
            font-bold
            tracking-wide
            text-[#ecb100]
          "
        >
          MAAN TRAVELS
        </Link>



        {/* DESKTOP NAV */}

        <nav
          className="
            hidden
            items-center
            gap-8
            lg:flex
          "
        >


          <Link
            href="/"
            className={linkClass("/")}
            aria-current={
              pathname === "/"
              ?
              "page"
              :
              undefined
            }
          >
            Home
          </Link>



          <MegaMenu
            title="Services"
            items={services}
          />



          <MegaMenu
            title="Tour Packages"
            items={packageMenuItems}
          />



          <Link
            href="/gallery"
            className={linkClass("/gallery")}
            aria-current={
              pathname === "/gallery"
              ?
              "page"
              :
              undefined
            }
          >
            Gallery
          </Link>



          <Link
            href="/about"
            className={linkClass("/about")}
            aria-current={
              pathname === "/about"
              ?
              "page"
              :
              undefined
            }
          >
            About
          </Link>



          <Link
            href="/feedback"
            className={linkClass("/feedback")}
            aria-current={
              pathname === "/feedback"
              ?
              "page"
              :
              undefined
            }
          >
            Feedback
          </Link>



          <Link
            href="/contact"
            className={linkClass("/contact")}
            aria-current={
              pathname === "/contact"
              ?
              "page"
              :
              undefined
            }
          >
            Contact
          </Link>


        </nav>




        {/* CTA */}

        <div className="hidden lg:block">

          <Link href="/booking">

            <Button
              aria-label="Book a ride with Maan Travels"
              className="
                bg-[#ecb100]
                text-black
                hover:bg-[#f6c94c]
                transition
              "
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