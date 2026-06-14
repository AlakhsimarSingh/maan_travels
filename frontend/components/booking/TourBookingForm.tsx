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


export default function TourBookingForm(){

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



<Select>

<SelectTrigger
className="
bg-[#111]
border-[#252525]
text-white
"
>

<SelectValue placeholder="Select Destination"/>

</SelectTrigger>


<SelectContent>

<SelectItem value="himachal">
Himachal Pradesh
</SelectItem>


<SelectItem value="kashmir">
Kashmir
</SelectItem>


<SelectItem value="golden">
Golden Triangle
</SelectItem>


<SelectItem value="pilgrimage">
Pilgrimage Tours
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

<SelectValue placeholder="Select Package"/>

</SelectTrigger>


<SelectContent>

<SelectItem value="manali">
Manali Tour
</SelectItem>


<SelectItem value="kashmir">
Kashmir Valley Tour
</SelectItem>


<SelectItem value="rajasthan">
Rajasthan Heritage Tour
</SelectItem>


</SelectContent>


</Select>




<Input
placeholder="Number of Travellers"
/>



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
Submit Tour Inquiry
</Button>


</div>

);

}