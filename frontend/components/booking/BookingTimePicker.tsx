"use client";

import { useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BookingTimePickerProps {
  placeholder?: string;
  value?: string; // "HH:mm" 24-hour format
  onChange?: (time: string) => void;
}

export function formatTime12h(time: string): string {
  const [hStr, mStr] = time.split(":");
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${mStr} ${period}`;
}

const GROUPS: { label: string; range: [number, number] }[] = [
  { label: "Morning", range: [5, 12] },
  { label: "Afternoon", range: [12, 17] },
  { label: "Evening", range: [17, 21] },
  { label: "Night", range: [21, 29] }, // wraps past midnight (00:00–04:30)
];

function buildSlots(): string[] {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

export default function BookingTimePicker({
  placeholder = "Select Time",
  value,
  onChange,
}: BookingTimePickerProps) {
  const [open, setOpen] = useState(false);
  const slots = useMemo(buildSlots, []);

  const handlePick = (time: string) => {
    onChange?.(time);
    setOpen(false);
  };

  const groupedSlots = useMemo(() => {
    return GROUPS.map((g) => ({
      label: g.label,
      times: slots.filter((t) => {
        const h = parseInt(t.split(":")[0], 10);
        const hourAdjusted = h < 5 ? h + 24 : h; // bucket 00:00–04:30 under "Night"
        return hourAdjusted >= g.range[0] && hourAdjusted < g.range[1];
      }),
    }));
  }, [slots]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-12 w-full justify-start rounded-xl border border-[#252525] bg-[#111] px-3 text-left font-normal text-white hover:bg-[#111] sm:px-4"
        >
          <Clock size={18} className="mr-2 shrink-0 text-[#ecb100] sm:mr-3" />
          <span className={`truncate text-sm sm:text-base ${value ? "text-white" : "text-[#777]"}`}>
            {value ? formatTime12h(value) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 border-[#252525] bg-[#141414] p-0" align="start">
        <div className="max-h-72 overflow-y-auto p-2">
          {groupedSlots.map((group) => (
            <div key={group.label} className="mb-2 last:mb-0">
              <p className="px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-[#ecb100]/70">
                {group.label}
              </p>
              <div className="grid grid-cols-3 gap-1">
                {group.times.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handlePick(t)}
                    className={`rounded-lg px-2 py-1.5 text-xs transition-colors ${
                      value === t
                        ? "bg-[#ecb100] font-medium text-black"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {formatTime12h(t)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#252525] p-3">
          <label className="mb-1 block text-[10px] uppercase tracking-widest text-[#555]">
            Or enter exact time
          </label>
          <input
            type="time"
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#252525] bg-[#0f0f0f] px-3 text-sm text-white outline-none focus:border-[#ecb100]/60 [color-scheme:dark]"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}