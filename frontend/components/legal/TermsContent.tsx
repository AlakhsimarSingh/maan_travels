"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Shield,
  FileText,
  CreditCard,
  RotateCcw,
  Lock,
  Phone,
  ChevronRight,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */
type Section = {
  id: string;
  icon: React.ReactNode;
  eyebrow: string;
  heading: string;
  content: React.ReactNode;
};

/* ─── Sections data ──────────────────────────────────────────── */
const SECTIONS: Section[] = [
  {
    id: "acceptance",
    icon: <FileText size={18} />,
    eyebrow: "01 — Agreement",
    heading: "Acceptance of Terms",
    content: (
      <>
        <p>
          By accessing our website at{" "}
          <a
            href="https://www.maantravels.com"
            className="text-[#ecb100] underline underline-offset-2"
          >
            www.maantravels.com
          </a>{" "}
          or placing a booking with Maan Travels, you confirm that you have
          read, understood, and agree to be bound by these Terms &amp;
          Conditions. If you do not agree, please refrain from using our
          services.
        </p>
        <p className="mt-3">
          These terms apply to all services offered by Maan Travels including
          outstation taxi bookings, airport transfers, self-drive rentals, tempo
          traveller hire, luxury car bookings, wedding cars, and tour packages
          across Punjab, Himachal Pradesh, Jammu &amp; Kashmir, Rajasthan, and
          Delhi NCR.
        </p>
      </>
    ),
  },
  {
    id: "bookings",
    icon: <CreditCard size={18} />,
    eyebrow: "02 — Reservations",
    heading: "Booking & Payment",
    content: (
      <ul className="space-y-3">
        {[
          "All bookings are subject to vehicle availability at the time of confirmation.",
          "A booking is confirmed only after you receive an explicit confirmation from our team via call, WhatsApp, or email.",
          "Prices displayed on the website are indicative. Final pricing is confirmed at the time of booking and may vary based on route, vehicle type, and season.",
          "Partial advance payments, where required, must be made via UPI to the account details provided at booking. Full payment is due before or at the start of the journey unless otherwise agreed.",
          "Payment screenshots must be shared with our team immediately after transfer to avoid delays in confirmation.",
          "We reserve the right to revise pricing for fuel surcharges, toll increases, or state-level tax changes with reasonable notice.",
        ].map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#ecb100]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "cancellation",
    icon: <RotateCcw size={18} />,
    eyebrow: "03 — Cancellations",
    heading: "Cancellation & Refund Policy",
    content: (
      <>
        <p className="mb-5">
          We understand plans change. Our cancellation policy is designed to be
          fair to both parties:
        </p>

        <div className="overflow-hidden rounded-xl border border-[#252525]">
          {[
            {
              window: "72+ hours before departure",
              refund: "Full refund of advance paid",
              color: "text-green-400",
            },
            {
              window: "24–72 hours before departure",
              refund: "50% of advance paid",
              color: "text-[#ecb100]",
            },
            {
              window: "Less than 24 hours",
              refund: "No refund on advance",
              color: "text-red-400",
            },
            {
              window: "No-show",
              refund: "Full charge applies",
              color: "text-red-400",
            },
          ].map((row, i) => (
            <div
              key={row.window}
              className={`flex items-center justify-between px-4 py-3.5 ${
                i !== 0 ? "border-t border-[#252525]" : ""
              } ${i % 2 === 0 ? "bg-[#0f0f0f]" : "bg-[#111]"}`}
            >
              <span className="text-sm text-white/70">{row.window}</span>
              <span className={`text-sm font-medium ${row.color}`}>
                {row.refund}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-white/40">
          Refunds, where applicable, are processed within 5–7 working days to
          the original payment source. Wedding, luxury, and multi-day tour
          bookings may have separate cancellation terms communicated at the time
          of booking.
        </p>
      </>
    ),
  },
  {
    id: "conduct",
    icon: <Shield size={18} />,
    eyebrow: "04 — Responsibilities",
    heading: "Service Conditions & Liability",
    content: (
      <ul className="space-y-3">
        {[
          "Maan Travels is not liable for delays caused by traffic, weather, road conditions, strikes, or acts of God beyond our reasonable control.",
          "Passengers are responsible for ensuring they are ready at the confirmed pickup location and time. Waiting charges may apply beyond a 30-minute grace period.",
          "Any damage caused to our vehicles by passengers will be charged to the booking party at cost.",
          "Our drivers are professionally trained and licensed. Requests that violate traffic laws or driver safety will be declined.",
          "Maan Travels reserves the right to substitute a booked vehicle with one of equal or higher category in cases of emergency or mechanical failure.",
          "Maximum liability in any claim against Maan Travels is limited to the amount paid for the specific booking in question.",
        ].map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#ecb100]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "privacy",
    icon: <Lock size={18} />,
    eyebrow: "05 — Privacy",
    heading: "Privacy Policy & Data Use",
    content: (
      <>
        <p className="mb-5">
          Your privacy matters to us. Here is exactly what we collect and why:
        </p>

        <div className="space-y-3">
          {[
            {
              title: "What we collect",
              body: "Name, phone number, email address, pickup/drop locations, and travel dates — provided by you at the time of booking or inquiry.",
            },
            {
              title: "Why we collect it",
              body: "To confirm and manage your booking, contact you about your journey, send receipts, and improve our services.",
            },
            {
              title: "What we don't do",
              body: "We do not sell, rent, or share your personal data with third parties for marketing purposes. Your data is never traded.",
            },
            {
              title: "Third-party services",
              body: "We use standard tools for payments (UPI), maps, and analytics. These services have their own privacy policies which we encourage you to review.",
            },
            {
              title: "Data retention",
              body: "Booking records are retained for up to 3 years for accounting and legal compliance purposes, then securely deleted.",
            },
            {
              title: "Your rights",
              body: "You may request access to, correction of, or deletion of your personal data at any time by contacting us at the details below.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[#252525] bg-[#0f0f0f] p-4"
            >
              <p className="mb-1 text-sm font-semibold text-[#ecb100]">
                {item.title}
              </p>
              <p className="text-sm text-white/50">{item.body}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "contact",
    icon: <Phone size={18} />,
    eyebrow: "06 — Reach Us",
    heading: "Questions & Grievances",
    content: (
      <>
        <p className="mb-5">
          If you have questions about these terms, wish to raise a grievance, or
          want to exercise your data rights, please reach out:
        </p>
        <div className="rounded-xl border border-[#ecb100]/20 bg-[#ecb100]/5 p-5 space-y-3">
          {[
            { label: "Business",           value: "Maan Tour & Travels" },
            { label: "Location",           value: "BMC Chowk, Jawahar Nagar, Jalandhar, Punjab 144001" },
            { label: "Phone / WhatsApp",   value: "+91 8054404591" },
            { label: "Email",              value: "maantravelcabs@gmail.com" },
            { label: "Hours",              value: "24 × 7, all days" },
          ].map((row) => (
            <div key={row.label} className="flex gap-3 text-sm">
              <span className="w-36 flex-shrink-0 text-white/35">{row.label}</span>
              {row.label === "Phone / WhatsApp" ? (
                <a
                  href="tel:+918054404591"
                  className="text-white transition-colors hover:text-[#ecb100]"
                >
                  {row.value}
                </a>
              ) : row.label === "Email" ? (
                <a
                  href="mailto:maantravelcabs@gmail.com"
                  className="text-white transition-colors hover:text-[#ecb100]"
                >
                  {row.value}
                </a>
              ) : (
                <span className="text-white">{row.value}</span>
              )}
            </div>
          ))}
        </div>
      </>
    ),
  },
];

/* ─── Sidebar nav item ───────────────────────────────────────── */
function NavItem({
  section,
  active,
  onClick,
}: {
  section: Section;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 ${
        active
          ? "bg-[#ecb100]/10 text-[#ecb100]"
          : "text-white/40 hover:bg-[#1a1a1a] hover:text-white/80"
      }`}
    >
      <span
        className={`flex-shrink-0 transition-colors ${
          active
            ? "text-[#ecb100]"
            : "text-white/30 group-hover:text-white/60"
        }`}
      >
        {section.icon}
      </span>
      <span className="truncate">{section.heading}</span>
      {active && (
        <ChevronRight
          size={14}
          className="ml-auto flex-shrink-0 text-[#ecb100]"
        />
      )}
    </button>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function TermsContent() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-24">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-[#181818]">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl"
          style={{ background: "#ecb100" }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center justify-center gap-2 text-xs text-white/30"
          >
            <Link href="/" className="transition-colors hover:text-[#ecb100]">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-white/60">Terms &amp; Privacy</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#ecb100]/25 bg-[#ecb100]/8 px-4 py-1.5 mb-5">
            <Shield size={13} className="text-[#ecb100]" />
            <span className="text-xs font-medium tracking-widest text-[#ecb100] uppercase">
              Legal
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Terms &amp;{" "}
            <span className="text-[#ecb100]">Privacy Policy</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/50">
            Everything you need to know about booking with us, how we handle
            your data, and what to expect from Maan Travels at every step of
            your journey.
          </p>

          <p className="mt-5 text-xs text-white/25">
            Last updated: June 2026 &nbsp;·&nbsp; Effective immediately
          </p>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 pt-12">
        <div className="flex gap-12 lg:gap-16">

          {/* Sticky sidebar — desktop only */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-28 space-y-1">
              <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25">
                Contents
              </p>
              {SECTIONS.map((s) => (
                <NavItem
                  key={s.id}
                  section={s}
                  active={activeId === s.id}
                  onClick={() => scrollTo(s.id)}
                />
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-16">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => { sectionRefs.current[section.id] = el; }}
                className="scroll-mt-28"
              >
                {/* Section header */}
                <div className="mb-6">
                  <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#ecb100]/60">
                    {section.eyebrow}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#ecb100]/25 bg-[#ecb100]/8 text-[#ecb100]">
                      {section.icon}
                    </div>
                    <h2 className="text-xl font-bold text-white sm:text-2xl">
                      {section.heading}
                    </h2>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="h-[2px] w-8 rounded-full bg-[#ecb100]" />
                    <span className="h-px flex-1 bg-[#1e1e1e]" />
                  </div>
                </div>

                {/* Section body */}
                <div className="text-sm leading-7 text-white/60">
                  {section.content}
                </div>
              </section>
            ))}

            {/* Bottom note */}
            <div className="rounded-2xl border border-[#252525] bg-[#111] p-6 text-center">
              <p className="text-sm text-white/40">
                These terms were last reviewed in June 2026. Maan Travels
                reserves the right to update them at any time. Continued use of
                our services after changes constitutes acceptance of the revised
                terms.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#ecb100] transition-opacity hover:opacity-80"
              >
                Have a question? Contact us
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}