"use client";

import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons/SocialIcons";
import { siteConfig } from "@/src/config/site";

const GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/1PBSVxj7rkpvLNZw8";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.0!2d75.5869641!3d31.3175908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a5b00464043bf%3A0xb15c8a12362f55f4!2sMaan%20Tour%20%26%20Travels%20Jalandhar!5e0!3m2!1sen!2sin!4v1700000000000";

const items = [
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: MapPin,
    label: "Office",
    value: siteConfig.contact.address,
    href: GOOGLE_MAPS_URL,
    external: true,
  },
  {
    icon: Clock,
    label: "Support",
    value: "24/7 Customer Assistance",
  },
];

const socialLinks = [
  { icon: InstagramIcon, label: "Instagram", href: siteConfig.social.instagram },
  { icon: FacebookIcon, label: "Facebook", href: siteConfig.social.facebook },
];

export default function ContactInfo() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white">Get In Touch</h2>

      <p className="mt-4 text-[#8a8a8a]">
        Reach us for luxury travel, corporate transport and tour packages.
      </p>

      <div className="mt-10 space-y-5">
        {items.map((item) => {
          const Icon = item.icon;
          const content = (
            <div className="group flex gap-4 rounded-2xl border border-transparent p-3 transition-all duration-200 hover:border-[#252525] hover:bg-[#141414]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#ecb100]/30 bg-[#ecb100]/5 text-[#ecb100] transition-colors duration-200 group-hover:bg-[#ecb100]/10">
                <Icon size={18} />
              </div>

              <div>
                <h3 className="flex items-center gap-1 text-white">
                  {item.label}
                  {item.external && (
                    <ArrowUpRight
                      size={13}
                      className="text-[#666] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#ecb100]"
                    />
                  )}
                </h3>
                <p className="mt-0.5 text-[#8a8a8a]">{item.value}</p>
              </div>
            </div>
          );

          return item.href ? (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
            >
              {content}
            </a>
          ) : (
            <div key={item.label}>{content}</div>
          );
        })}
      </div>

      {/* SOCIAL LINKS */}
      <div className="mt-8">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#8a8a8a]">Follow Us</p>

        <div className="flex gap-3">
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
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ecb100]/30 bg-[#ecb100]/5 text-[#ecb100] transition-colors duration-200 hover:bg-[#ecb100]/10 hover:border-[#ecb100]/50"
              >
                <Icon size={18} />
              </a>
            ) : (
              <button
                key={social.label}
                type="button"
                disabled
                title={`${social.label} page coming soon`}
                aria-label={`${social.label} page coming soon`}
                className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl border border-[#252525] bg-[#141414] text-[#555]"
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>

      {/* EMBEDDED MAP */}
      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-8 block overflow-hidden rounded-2xl border border-[#252525] transition-colors duration-300 hover:border-[#ecb100]/50"
      >
        <div className="relative h-56 w-full overflow-hidden">
          <iframe
            src={MAP_EMBED_SRC}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(1) invert(0.92) contrast(0.85)" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Maan Travels office location on Google Maps"
            className="pointer-events-none transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
            <MapPin size={12} className="text-[#ecb100]" />
            Open in Google Maps
          </div>
        </div>
      </a>
    </div>
  );
}