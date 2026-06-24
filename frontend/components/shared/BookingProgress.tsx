"use client";

import { Check } from "lucide-react";

export type ProgressStep = {
  label: string;
  complete: boolean;
};

/**
 * Shared "premium" booking progress bar.
 * - Gold gradient fill with a moving shimmer sweep
 * - Glowing pulse dot riding the leading edge
 * - Step markers that pop in (scale-bounce) as each section completes
 * - Pure CSS — no animation library, respects prefers-reduced-motion
 *
 * Used by LuxuryBookingForm and TempoUrbaniaBookingForm. Keep both in sync
 * with this component rather than re-defining it locally.
 */
export default function BookingProgress({ steps }: { steps: ProgressStep[] }) {
  const completedCount = steps.filter((s) => s.complete).length;
  const percent = Math.round((completedCount / steps.length) * 100);
  const fillWidth = Math.max(percent, 4); // keep a sliver visible at 0%

  return (
    <div className="relative">
      <style>{`
        @keyframes mtShimmerSweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        @keyframes mtPulseGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(236,177,0,0.55), 0 0 10px 2px rgba(236,177,0,0.45);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(236,177,0,0), 0 0 18px 6px rgba(236,177,0,0.7);
          }
        }
        @keyframes mtStepPop {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.18); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mt-progress-anim { animation: none !important; }
        }
      `}</style>

      <div className="flex items-center justify-between text-xs text-[#8a8a8a]">
        <span className="uppercase tracking-[0.25em]">Booking Progress</span>
        <span
          key={percent}
          className="mt-progress-anim font-semibold text-[#ecb100]"
          style={{ animation: "mtStepPop 0.35s ease-out" }}
        >
          {percent}%
        </span>
      </div>

      <div className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full border border-[#252525] bg-black/50">
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-[#ecb100] via-[#f6c94c] to-[#ecb100] transition-[width] duration-700 ease-out"
          style={{ width: `${fillWidth}%` }}
        >
          <span
            className="mt-progress-anim absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{ animation: "mtShimmerSweep 2s ease-in-out infinite" }}
          />
        </div>

        {percent > 0 && (
          <span
            className="mt-progress-anim absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-[#ecb100] transition-[left] duration-700 ease-out"
            style={{
              left: `calc(${fillWidth}% - 7px)`,
              animation: "mtPulseGlow 1.6s ease-in-out infinite",
            }}
          />
        )}
      </div>

      <div
        className="mt-4 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0,1fr))` }}
      >
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-col items-center gap-2 text-center">
            <div
              key={`${step.label}-${step.complete}`}
              className={`mt-progress-anim flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors duration-500 ${
                step.complete
                  ? "border-[#ecb100] bg-[#ecb100] text-black"
                  : "border-[#333] bg-black/40 text-[#666]"
              }`}
              style={step.complete ? { animation: "mtStepPop 0.45s ease-out" } : undefined}
            >
              {step.complete ? <Check size={13} /> : i + 1}
            </div>
            <span
              className={`text-[11px] leading-tight transition-colors duration-500 ${
                step.complete ? "text-[#ecb100]" : "text-[#666]"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}