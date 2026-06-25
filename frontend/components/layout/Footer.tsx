"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/src/config/site";
import { InstagramIcon, FacebookIcon } from "@/components/icons/SocialIcons";

const services = [
  { label: "Luxury Cars", href: "/luxury-cars" },
  { label: "Self Drive Rentals", href: "/self-drive" },
  { label: "Go Taxi", href: "/go-taxi" },
  { label: "Tempo / Urbania Travellers", href: "/tempo-traveller-urbania" },
  { label: "Airport Transfer", href: "/airport-transfer" },
  { label: "Wedding Cars", href: "/wedding-cars" },
];

const socialLinks = [
  { icon: InstagramIcon, label: "Instagram", href: siteConfig.social.instagram },
  { icon: FacebookIcon, label: "Facebook", href: siteConfig.social.facebook },
];

const GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/1PBSVxj7rkpvLNZw8";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.0!2d75.5869641!3d31.3175908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a5b00464043bf%3A0xb15c8a12362f55f4!2sMaan%20Tour%20%26%20Travels%20Jalandhar!5e0!3m2!1sen!2sin!4v1700000000000";

type FooterCar = {
  id: string;
  name: string;
  slug: string;
};

export default function Footer({ cars = [] }: { cars?: FooterCar[] }) {
  const sectionRef = useRef<HTMLElement>(null);
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
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={sectionRef} className="border-t border-[#252525] bg-[#050505]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className={`grid gap-10 md:grid-cols-2 lg:grid-cols-5 reveal ${visible ? "reveal-visible" : ""}`}>
          {/* BRAND */}
          <div className="lg:col-span-1">
            <Link href="/" aria-label="Maan Travels — Home" className="inline-block">
              <Image
                src="/logo.png"
                alt="Maan Tour and Travels"
                width={325}
                height={285}
                className="h-28 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 text-sm leading-6 text-[#8a8a8a]">{siteConfig.description}</p>

            <div className="mt-5 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const hasLink = Boolean(social.href);

                return hasLink ? (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    aria-label={`Visit Maan Travels on ${social.label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#252525] text-[#8a8a8a] transition-colors duration-200 hover:border-[#ecb100]/50 hover:text-[#ecb100]"
                  >
                    <Icon size={16} />
                  </a>
                ) : (
                  <button
                    key={social.label}
                    type="button"
                    disabled
                    title={`${social.label} page coming soon`}
                    aria-label={`${social.label} page coming soon`}
                    className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border border-[#1c1c1c] text-[#444]"
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* SERVICES */}
          <FooterColumn title="Services">
            {services.map((item) => (
              <FooterLink key={item.label} href={item.href} label={item.label} />
            ))}
          </FooterColumn>

          {/* LUXURY CARS — replaces the old static Tour Packages column */}
          <FooterColumn title="Luxury Cars">
            {cars.length > 0 ? (
              cars.slice(0, 4).map((car) => (
                <FooterLink
                  key={car.id}
                  href={`/wedding-booking/${car.slug}`}
                  label={car.name}
                />
              ))
            ) : (
              <li className="text-sm text-[#555]">
                <Link href="/luxury-cars" className="hover:text-[#ecb100]">
                  View all luxury cars
                </Link>
              </li>
            )}
          </FooterColumn>

          {/* CONTACT */}
          <FooterColumn title="Contact">
            <li>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                className="group flex items-start gap-2 text-[#8a8a8a] transition-colors duration-200 hover:text-[#ecb100]"
              >
                <Phone size={15} className="mt-0.5 shrink-0 text-[#ecb100]" />
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="group flex items-start gap-2 text-[#8a8a8a] transition-colors duration-200 hover:text-[#ecb100]"
              >
                <Mail size={15} className="mt-0.5 shrink-0 text-[#ecb100]" />
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2 text-[#8a8a8a] transition-colors duration-200 hover:text-[#ecb100]"
              >
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#ecb100]" />
                <span>
                  {siteConfig.contact.address}
                  <ArrowUpRight
                    size={12}
                    className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </a>
            </li>
          </FooterColumn>

          {/* MAP EMBED */}
          <div className="lg:col-span-1">
            <h4 className="mb-4 font-semibold text-white">Find Us</h4>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl border border-[#252525] transition-colors duration-300 hover:border-[#ecb100]/50"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <iframe
                  src={MAP_EMBED_SRC}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(1) invert(0.92) contrast(0.85)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Maan Travels location on Google Maps"
                  className="pointer-events-none transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </a>
            <p className="mt-2 text-xs text-[#666]">Tap to open in Google Maps</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#252525] pt-6 text-sm text-[#8a8a8a] sm:flex-row">
          <p>© {new Date().getFullYear()} Maan Travels. All Rights Reserved.</p>
          <p className="text-xs text-[#555]">Jalandhar, Punjab · India</p>
        </div>
      </div>

      {/* LocalBusiness structured data — real geo coordinates resolved from the Maps listing.
          This is the single, authoritative TravelAgency block for the whole site. It renders
          once via the footer, present on every page. Don't duplicate this in layout.tsx or
          elsewhere — keep all business schema fields consolidated here. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: "Maan Tour And Travels",
            url: "https://www.maantravels.com",
            logo: "https://www.maantravels.com/icon-512.png",
            image: "https://www.maantravels.com/og-image.jpg",
            telephone: siteConfig.contact.phone,
            email: siteConfig.contact.email,
            areaServed: ["Punjab", "Himachal Pradesh", "Jammu and Kashmir", "Rajasthan", "Delhi"],
            sameAs: [siteConfig.social.instagram, siteConfig.social.facebook].filter(Boolean),
            address: {
              "@type": "PostalAddress",
              streetAddress: "8H9P+2QP, BMC Chowk, Jawahar Nagar",
              addressLocality: "Jalandhar",
              addressRegion: "Punjab",
              postalCode: "144001",
              addressCountry: "IN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 31.3175908,
              longitude: 75.5869641,
            },
            hasMap: GOOGLE_MAPS_URL,
          }),
        }}
      />
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 font-semibold text-white">{title}</h4>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group relative inline-block text-[#8a8a8a] transition-colors duration-200 hover:text-[#ecb100]"
      >
        {label}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#ecb100] transition-all duration-300 group-hover:w-full" />
      </Link>
    </li>
  );
}