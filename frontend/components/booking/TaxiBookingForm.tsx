"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import BookingDatePicker from "./BookingDatePicker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function TaxiBookingForm(){

return (

<div className="grid gap-6 md:grid-cols-2">


<Input
placeholder="Full Name"
/>


<Input
placeholder="Mobile Number"
/>


<Input
placeholder="Email Address"
/>


<BookingDatePicker />


<Input
placeholder="Pickup Location"
/>


<Input
placeholder="Drop Location"
/>



<Select>

<SelectTrigger
className="
bg-[#111]
border-[#252525]
text-white
"
>
<SelectValue placeholder="Select Vehicle"/>
</SelectTrigger>


<SelectContent>

<SelectItem value="sedan">
Luxury Sedan
</SelectItem>


<SelectItem value="suv">
Premium SUV
</SelectItem>


<SelectItem value="tempo">
Tempo Traveller
</SelectItem>


<SelectItem value="coach">
Luxury Coach
</SelectItem>


</SelectContent>

</Select>



<Select>

<SelectTrigger
className="
bg-[#111]
border-[#252525]
text-white
"
>

<SelectValue placeholder="Passengers"/>

</SelectTrigger>


<SelectContent>

<SelectItem value="1-3">
1-3 Persons
</SelectItem>


<SelectItem value="4-7">
4-7 Persons
</SelectItem>


<SelectItem value="8+">
8+ Persons
</SelectItem>


</SelectContent>


</Select>


<textarea
placeholder="Special Requirements"
className="
md:col-span-2
min-h-32
rounded-xl
border
border-[#252525]
bg-[#111]
p-4
text-white
"
/>


<Button
className="
md:col-span-2
bg-[#ecb100]
text-black
hover:bg-[#f6c94c]
"
size="lg"
>
Submit Taxi Booking
</Button>


</div>

);

}