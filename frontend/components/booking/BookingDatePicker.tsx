"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";


export default function BookingDatePicker() {

  const [date,setDate] = useState<Date>();


  return (

    <Popover>

      <PopoverTrigger asChild>

        <Button
          variant="outline"
          className="
            w-full
            justify-start
            border-[#252525]
            bg-[#111]
            text-left
            text-[#c7c7c7]

            hover:bg-[#171717]
            hover:text-white
          "
        >

          <CalendarIcon
            className="
              mr-3
              h-5
              w-5
              text-[#ecb100]
            "
          />

          {
            date
            ?
            format(date,"PPP")
            :
            "Select Pickup Date"
          }


        </Button>

      </PopoverTrigger>



      <PopoverContent
        className="
          w-auto
          border-[#252525]
          bg-[#141414]
          p-0
        "
      >

        <Calendar

          mode="single"

          selected={date}

          onSelect={setDate}

          className="
            rounded-xl
            bg-[#141414]
            text-white
          "

        />


      </PopoverContent>


    </Popover>

  );
}