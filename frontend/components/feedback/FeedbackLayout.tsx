"use client";

import { useRef, useEffect, useState } from "react";

export default function FeedbackLayout({
  form,
  reviews,
}: {
  form: React.ReactNode;
  reviews: React.ReactNode;
}) {
  const formRef = useRef<HTMLDivElement>(null);
  const [reviewsHeight, setReviewsHeight] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      if (formRef.current) {
        setReviewsHeight(formRef.current.offsetHeight);
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (formRef.current) ro.observe(formRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start">

      {/* Form — source of truth for height */}
      <div ref={formRef} className="w-full lg:w-1/2 lg:sticky lg:top-28">
        {form}
      </div>

      {/* Reviews — same height as form, scrolls inside */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Customer Experiences
        </h2>
        <div
          style={reviewsHeight ? { height: reviewsHeight - 52 } : undefined}
          className="
            overflow-y-auto
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {reviews}
        </div>
      </div>

    </div>
  );
}