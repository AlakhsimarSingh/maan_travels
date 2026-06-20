"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface BookingDatePickerProps {
  placeholder?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export default function BookingDatePicker({
  placeholder = "Select Date",
  value,
  onChange,
}: BookingDatePickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date);
    setOpen(false); // ← close popover after picking
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="
            h-12 w-full justify-start rounded-xl
            border border-[#252525] bg-[#111]
            text-left font-normal text-white
            hover:bg-[#111]
          "
        >
          <CalendarDays size={18} className="mr-3 text-[#ecb100]" />
          <span className={value ? "text-white" : "text-[#777]"}>
            {value ? format(value, "dd MMM yyyy") : placeholder}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto border-[#252525] bg-[#141414] p-0"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value}       // ← reflects current selection
          onSelect={handleSelect}
          disabled={(date) => date < new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}