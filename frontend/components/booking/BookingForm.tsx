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


export default function BookingForm(){

return (

<div
className="
mx-auto
max-w-5xl
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-8
"
>

<h2
className="
mb-8
text-3xl
font-bold
text-white
"
>
Ride Details
</h2>


<div
className="
grid
gap-6
md:grid-cols-2
"
>


<Input
placeholder="Full Name"
/>


<Input
placeholder="Email Address"
/>


<Input
placeholder="Mobile Number"
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
SUV
</SelectItem>

<SelectItem value="tempo">
Tempo Traveller
</SelectItem>

<SelectItem value="bus">
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
<SelectValue placeholder="Number of Persons"/>
</SelectTrigger>


<SelectContent>

<SelectItem value="1">
1-3 Persons
</SelectItem>

<SelectItem value="2">
4-7 Persons
</SelectItem>

<SelectItem value="3">
8+ Persons
</SelectItem>

</SelectContent>


</Select>


</div>



<textarea
placeholder="Special Requirements"
className="
mt-6
min-h-32
w-full
rounded-xl
border
border-[#252525]
bg-[#111]
p-4
text-white
outline-none

focus:border-[#ecb100]
"
/>



<Button
size="lg"
className="
mt-8
w-full
bg-[#ecb100]
text-black

hover:bg-[#f6c94c]
"
>
Submit Booking Request
</Button>



</div>

);

}