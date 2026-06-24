"use client";

import { Check } from "lucide-react";

export default function StepProgress({
  steps,
  currentIndex,
}: {
  steps: string[];
  currentIndex: number;
}) {
  return (
    <div className="mb-8 rounded-2xl border border-[#252525] bg-black/40 px-6 pt-6 pb-5 sm:px-8">
      <div className="flex items-center">
        {steps.map((label, i) => {
          const isComplete = i < currentIndex;
          const isActive = i === currentIndex;

          return (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-500 ${
                    isComplete
                      ? "border-[#ecb100] bg-[#ecb100] text-black"
                      : isActive
                      ? "border-[#ecb100] bg-[#ecb100]/10 text-[#ecb100] scale-110 shadow-[0_0_0_4px_rgba(236,177,0,0.15)]"
                      : "border-[#2a2a2a] bg-black/30 text-[#555]"
                  }`}
                >
                  {isComplete ? <Check size={16} className="step-check-pop" /> : i + 1}
                </div>
                <span
                  className={`text-[11px] font-medium uppercase tracking-wide transition-colors duration-300 ${
                    isActive ? "text-[#ecb100]" : isComplete ? "text-white/70" : "text-[#555]"
                  }`}
                >
                  {label}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div className="mx-2 h-[2px] flex-1 overflow-hidden rounded-full bg-[#2a2a2a]">
                  <div
                    className="h-full bg-[#ecb100] transition-all duration-700 ease-out"
                    style={{ width: isComplete ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}