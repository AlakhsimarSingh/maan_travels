"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInView } from "@/src/hooks/useInView";
import ReviewCard from "@/components/feedback/ReviewCard";

type Testimonial = {
  id: string;
  comments: string;
  customerName: string;
  route?: string;
  travelDate?: string | null;
  satisfaction?: string | null;
  vehicleRating?: number | null;
  supportRating?: number | null;
  driverExperience?: string | null;
  recommend?: boolean | null;
};

const CARD_GAP = 16;
const AUTO_INTERVAL = 3500;

// On mobile: fixed 260px cards so adjacent ones peek.
// On desktop: 370px.
function getCardWidth() {
  if (typeof window === "undefined") return 370;
  return window.innerWidth < 640 ? 260 : 370;
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef({ dragging: false, startX: 0, scrollStart: 0 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [spacerWidth, setSpacerWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(370);
  const [isMobile, setIsMobile] = useState(false);

  const { ref: sectionRef, inView: sectionInView } = useInView();

  if (!testimonials.length) return null;
  const total = testimonials.length;
  const cardStep = cardWidth + CARD_GAP;

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const cw = getCardWidth();
    const mobile = window.innerWidth < 640;
    setCardWidth(cw);
    setIsMobile(mobile);
    setSpacerWidth(Math.max(0, (el.clientWidth - cw) / 2));
  }, []);

  const scrollToIndex = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * cardStep, behavior: "smooth" });
  }, [cardStep]);

  const pauseAuto = useCallback(() => {
    pausedRef.current = true;
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => { pausedRef.current = false; }, 4000);
  }, []);

  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(i, total - 1));
    setActiveIndex(clamped);
    scrollToIndex(clamped);
  }, [total, scrollToIndex]);

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % total;
        scrollToIndex(next);
        return next;
      });
    }, AUTO_INTERVAL);
  }, [total, scrollToIndex]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    startAuto();
    return () => {
      window.removeEventListener("resize", measure);
      if (autoRef.current) clearInterval(autoRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [measure, startAuto]);

  useEffect(() => {
    if (spacerWidth > 0) scrollToIndex(0);
  }, [spacerWidth, scrollToIndex]);

  const handleArrow = (dir: 1 | -1) => {
    pauseAuto();
    goTo(activeIndex + dir);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    pauseAuto();
    dragRef.current = { dragging: true, startX: e.pageX, scrollStart: trackRef.current?.scrollLeft || 0 };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.dragging || !trackRef.current) return;
    e.preventDefault();
    trackRef.current.scrollLeft = dragRef.current.scrollStart - (e.pageX - dragRef.current.startX);
  };
  const onMouseUp = () => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    const el = trackRef.current;
    if (!el) return;
    goTo(Math.max(0, Math.min(Math.round(el.scrollLeft / cardStep), total - 1)));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    pauseAuto();
    dragRef.current = { dragging: true, startX: e.touches[0].pageX, scrollStart: trackRef.current?.scrollLeft || 0 };
  };
  const onTouchEnd = () => {
    dragRef.current.dragging = false;
    const el = trackRef.current;
    if (!el) return;
    goTo(Math.max(0, Math.min(Math.round(el.scrollLeft / cardStep), total - 1)));
  };

  const canScrollLeft = activeIndex > 0;
  const canScrollRight = activeIndex < total - 1;

  return (
    <section ref={sectionRef} className="py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className={`mb-12 reveal ${sectionInView ? "reveal-visible" : ""}`}>
          <div className="text-center">
            <p className="mb-3 uppercase tracking-[0.3em] text-[#ecb100] text-xs sm:text-sm">Customer Reviews</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              What Our Customers Say
            </h2>
          </div>

          <div className="mt-6 hidden items-center justify-center gap-3 sm:flex">
            <button
              onClick={() => handleArrow(-1)}
              disabled={!canScrollLeft}
              aria-label="Previous reviews"
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
                canScrollLeft
                  ? "border-[#ecb100]/40 text-[#ecb100] hover:bg-[#ecb100]/10 hover:border-[#ecb100]"
                  : "border-[#252525] text-[#333] cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleArrow(1)}
              disabled={!canScrollRight}
              aria-label="Next reviews"
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
                canScrollRight
                  ? "border-[#ecb100]/40 text-[#ecb100] hover:bg-[#ecb100]/10 hover:border-[#ecb100]"
                  : "border-[#252525] text-[#333] cursor-not-allowed"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Track */}
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-[#0a0a0a] to-transparent sm:w-20" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-[#0a0a0a] to-transparent sm:w-20" />

          <div
            ref={trackRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="flex overflow-x-auto py-6 cursor-grab active:cursor-grabbing select-none
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ gap: CARD_GAP }}
          >
            <div className="flex-shrink-0" style={{ width: spacerWidth }} aria-hidden />

            {testimonials.map((item, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => { pauseAuto(); goTo(i); }}
                  style={{ width: cardWidth, flexShrink: 0 }}
                  className={`transition-all duration-500 ease-out origin-center ${
                    isActive ? "scale-100 opacity-100" : "scale-[0.88] opacity-40"
                  }`}
                >
                  <div className={`rounded-3xl transition-all duration-500 ${
                    isActive
                      ? "ring-2 ring-[#ecb100]/60 shadow-[0_0_32px_-4px_rgba(236,177,0,0.35)]"
                      : ""
                  }`}>
                    {/*
                      On mobile we shrink the card's content uniformly using
                      CSS zoom rather than transform:scale(). zoom affects
                      layout (both width AND height shrink together and the
                      parent sizes to fit), so the ring border above stays
                      flush against every edge. transform:scale() only
                      shrinks visually while the box keeps its pre-scale
                      layout size — that mismatch was what left a gap at
                      the bottom (height was never compensated, only width was).
                    */}
                    <div style={isMobile ? { zoom: 0.78 } : undefined}>
                      <ReviewCard review={item} index={0} clampComments />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex-shrink-0" style={{ width: spacerWidth }} aria-hidden />
          </div>
        </div>

      </div>
    </section>
  );
}