"use client";

import { CalendarDays } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

export default function FeedbackDatePicker({
  value,
  onChange,
}: {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}) {
  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#252525] bg-[#111] px-4 text-left text-white outline-none transition-colors hover:border-[#ecb100]"
          >
            <CalendarDays size={18} className="text-[#ecb100]" />
            <span className={value ? "text-white" : "text-[#777]"}>
              {value ? value.toLocaleDateString() : "When did you travel?"}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto border-[#252525] bg-[#141414] p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={(date) => date > new Date()}
            defaultMonth={value}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}