"use client";

import { Star, ThumbsUp, Clock } from "lucide-react";
import Reveal from "@/components/common/Reveal";

type Review = {
  id: string;
  customerName: string;
  route?: string | null;
  travelDate?: string | null;
  satisfaction?: string | null;
  vehicleRating?: number | null;
  supportRating?: number | null;
  driverExperience?: string | null;
  comments?: string | null;
  recommend?: boolean | null;
};

function formatLabel(value?: string | null) {
  if (!value) return null;
  return value
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function driverLabel(value?: string | null) {
  switch (value) {
    case "yes":
      return "Professional driver";
    case "somewhat":
      return "Mostly professional driver";
    case "no":
      return "Driver fell short";
    default:
      return null;
  }
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ReviewCard({ review, index = 0 }: { review: Review; index?: number }) {
  const rating = review.vehicleRating || 0;

  return (
    <Reveal delay={index * 90}>
      <div className="group relative rounded-3xl border border-[#252525] bg-[#141414] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#ecb100]/40">

        <span className="pointer-events-none absolute right-6 top-4 select-none text-4xl font-serif leading-none text-[#ecb100]/20">
          "
        </span>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ecb100]/40 bg-[#ecb100]/5 text-sm font-semibold text-[#ecb100]">
              {initials(review.customerName || "?")}
            </div>

            <div>
              <h3 className="font-semibold text-white">{review.customerName}</h3>
              <p className="text-sm text-[#8a8a8a]">{review.route || "Travel Experience"}</p>
            </div>
          </div>

          {review.travelDate && (
            <span className="flex items-center gap-1 whitespace-nowrap text-xs text-[#666]">
              <Clock size={12} />
              {new Date(review.travelDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={16}
              className={s <= rating ? "fill-[#ecb100] text-[#ecb100]" : "text-[#333]"}
            />
          ))}
        </div>

        {review.comments && (
          <p className="mt-4 leading-relaxed text-[#c7c7c7]">{review.comments}</p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-dashed border-[#252525] pt-4">
          {formatLabel(review.satisfaction) && (
            <span className="rounded-full border border-[#252525] bg-black/30 px-3 py-1 text-xs text-[#c7c7c7]">
              {formatLabel(review.satisfaction)}
            </span>
          )}

          {driverLabel(review.driverExperience) && (
            <span
              className={`rounded-full border px-3 py-1 text-xs ${
                review.driverExperience === "no"
                  ? "border-red-500/30 bg-red-500/5 text-red-400"
                  : "border-[#252525] bg-black/30 text-[#c7c7c7]"
              }`}
            >
              {driverLabel(review.driverExperience)}
            </span>
          )}

          {!!review.supportRating && (
            <span className="rounded-full border border-[#252525] bg-black/30 px-3 py-1 text-xs text-[#c7c7c7]">
              Support {review.supportRating}/5
            </span>
          )}

          {review.recommend && (
            <span className="flex items-center gap-1 rounded-full border border-[#ecb100]/30 bg-[#ecb100]/5 px-3 py-1 text-xs text-[#ecb100]">
              <ThumbsUp size={11} />
              Recommends us
            </span>
          )}
        </div>

      </div>
    </Reveal>
  );
}