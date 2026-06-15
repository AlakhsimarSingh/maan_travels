"use client";

import { format } from "date-fns";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
Popover,
PopoverContent,
PopoverTrigger,
} from "@/components/ui/popover";


export default function DatePicker(){

const [date,setDate]=useState<Date>();

return (

<Popover>

<PopoverTrigger asChild>

<Button
variant="outline"
className="
w-full
justify-start
bg-black/40
border-[#252525]
text-white
"
>

<CalendarIcon className="mr-3 h-4 w-4 text-[#ecb100]"/>


{
date
?
format(date,"PPP")
:
"Select travel date"
}


</Button>

</PopoverTrigger>


<PopoverContent
className="
w-auto
p-0
"
>

<Calendar
mode="single"
selected={date}
onSelect={setDate}
/>


</PopoverContent>


</Popover>

)

}