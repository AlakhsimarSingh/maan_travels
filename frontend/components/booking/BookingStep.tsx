"use client";

import { ChevronDown, Check } from "lucide-react";

export default function BookingStep({
  index,
  title,
  summary,
  isOpen,
  isDone,
  onToggle,
  children,
}: {
  index: number;
  title: string;
  summary?: string;
  isOpen: boolean;
  isDone: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border transition-colors duration-200 ${
        isOpen ? "border-[#ecb100]/50 bg-[#111]" : "border-[#252525] bg-[#111]"
      }`}
    >
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
            isDone
              ? "bg-[#ecb100] text-black"
              : isOpen
              ? "border border-[#ecb100] text-[#ecb100]"
              : "border border-[#3a3a3a] text-[#8a8a8a]"
          }`}
        >
          {isDone ? <Check size={13} /> : index}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-white">{title}</span>
          {summary && !isOpen && <span className="block truncate text-xs text-[#ecb100]">{summary}</span>}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[#8a8a8a] transition-transform duration-200 ${isOpen ? "rotate-180 text-[#ecb100]" : ""}`}
        />
      </button>

      <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-4 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}