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

const CARD_WIDTH = 370;
const CARD_GAP = 24;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const AUTO_INTERVAL = 3500;

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [spacerWidth, setSpacerWidth] = useState(0);

  const { ref: sectionRef, inView: sectionInView } = useInView();

  if (!testimonials.length) return null;
  const total = testimonials.length;

  // Compute spacer from visible container width so card 0 starts centred
  const measureSpacer = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setSpacerWidth(Math.max(0, (el.clientWidth - CARD_WIDTH) / 2));
  }, []);

  // Scroll so card `i` is visually centred in the track
  const scrollToIndex = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    // With the leading spacer in place, card i's left edge sits at:
    //   spacer + i * CARD_STEP
    // We want it centred, so scroll to:
    //   spacer + i * CARD_STEP - (containerWidth - CARD_WIDTH) / 2
    // But spacer === (containerWidth - CARD_WIDTH) / 2, so they cancel:
    //   i * CARD_STEP
    el.scrollTo({ left: i * CARD_STEP, behavior: "smooth" });
  }, []);

  const pauseAuto = () => {
    pausedRef.current = true;
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 4000);
  };

  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(i, total - 1));
    setActiveIndex(clamped);
    scrollToIndex(clamped);
  }, [total, scrollToIndex]);

  // Auto-advance
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
    measureSpacer();
    window.addEventListener("resize", measureSpacer);
    startAuto();
    return () => {
      window.removeEventListener("resize", measureSpacer);
      if (autoRef.current) clearInterval(autoRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [measureSpacer, startAuto]);

  // Scroll card 0 into centre on first render once spacer is known
  useEffect(() => {
    if (spacerWidth > 0) scrollToIndex(0);
  }, [spacerWidth, scrollToIndex]);

  const handleArrow = (dir: 1 | -1) => {
    pauseAuto();
    goTo(activeIndex + dir);
  };

  // Drag to scroll — updates activeIndex on release
  const dragRef = useRef({ dragging: false, startX: 0, scrollStart: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    pauseAuto();
    dragRef.current = {
      dragging: true,
      startX: e.pageX,
      scrollStart: trackRef.current?.scrollLeft || 0,
    };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.dragging || !trackRef.current) return;
    e.preventDefault();
    trackRef.current.scrollLeft = dragRef.current.scrollStart - (e.pageX - dragRef.current.startX);
  };
  const onMouseUp = () => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    // Snap to nearest card
    const el = trackRef.current;
    if (!el) return;
    const nearest = Math.round(el.scrollLeft / CARD_STEP);
    goTo(Math.max(0, Math.min(nearest, total - 1)));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    pauseAuto();
    dragRef.current = {
      dragging: true,
      startX: e.touches[0].pageX,
      scrollStart: trackRef.current?.scrollLeft || 0,
    };
  };
  const onTouchEnd = () => {
    dragRef.current.dragging = false;
    const el = trackRef.current;
    if (!el) return;
    const nearest = Math.round(el.scrollLeft / CARD_STEP);
    goTo(Math.max(0, Math.min(nearest, total - 1)));
  };

  const canScrollLeft = activeIndex > 0;
  const canScrollRight = activeIndex < total - 1;

  return (
    <section ref={sectionRef} className="py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className={`mb-12 flex items-end justify-between reveal ${sectionInView ? "reveal-visible" : ""}`}>
          <div>
            <p className="mb-3 uppercase tracking-[0.3em] text-[#ecb100]">Customer Reviews</p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              What Our <span className="text-[#ecb100]">Customers</span> Say
            </h2>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
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
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent" />

          <div
            ref={trackRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="flex gap-6 overflow-x-auto py-6 cursor-grab active:cursor-grabbing select-none
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Leading spacer — equal to (containerWidth - cardWidth) / 2
                so card[0] sits exactly in the centre when scrollLeft=0 */}
            <div className="flex-shrink-0" style={{ width: spacerWidth }} aria-hidden />

            {testimonials.map((item, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => { pauseAuto(); goTo(i); }}
                  style={{ width: CARD_WIDTH, flexShrink: 0 }}
                  className={`transition-all duration-500 ease-out ${
                    isActive ? "scale-100 opacity-100" : "scale-[0.88] opacity-40"
                  }`}
                >
                  <div className={`rounded-3xl transition-all duration-500 ${
                    isActive
                      ? "ring-2 ring-[#ecb100]/60 shadow-[0_0_32px_-4px_rgba(236,177,0,0.35)]"
                      : ""
                  }`}>
                    <ReviewCard review={item} index={0} clampComments />
                  </div>
                </div>
              );
            })}

            {/* Trailing spacer */}
            <div className="flex-shrink-0" style={{ width: spacerWidth }} aria-hidden />
          </div>
        </div>

        {/* Dots */}
        {total > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to review ${i + 1}`}
                onClick={() => { pauseAuto(); goTo(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-6 h-2 bg-[#ecb100]"
                    : "w-2 h-2 bg-[#333] hover:bg-[#555]"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}