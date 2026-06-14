"use client";

import { CalendarDays, Clock, MapPin, Users, Car } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


import { format } from "date-fns";

const vehicles = [
  "Sedan",
  "SUV",
  "Innova Crysta",
  "Luxury Car",
  "Tempo Traveller",
];


export default function AirportBookingForm() {
const [travelDate, setTravelDate] = useState<Date>();

return (

<section>

<div
className="
mx-auto
max-w-5xl
px-6
"
>


<div
className="
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-8
shadow-[0_0_50px_rgba(236,177,0,0.08)]

md:p-10
"
>


<div className="mb-10">


<p
className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
"
>
Book Your Transfer
</p>


<h2
className="
mt-3
text-3xl
font-bold
text-white
"
>
Airport Pickup & Drop
</h2>


<p
className="
mt-3
text-[#8a8a8a]
"
>
Fill in your travel details and our team will contact you shortly.
</p>


</div>



<div
className="
grid
gap-6
md:grid-cols-2
"
>


{/* Pickup */}

<div>

<label className="mb-2 block text-sm text-[#c7c7c7]">
Pickup Location
</label>


<div className="relative">

<MapPin
className="
absolute
left-4
top-4
text-[#ecb100]
"
size={20}
/>


<input

placeholder="Enter pickup address"

className="
w-full
rounded-xl
border
border-[#252525]
bg-black/40
py-3
pl-12
pr-4
text-white

placeholder:text-[#666]

focus:border-[#ecb100]
outline-none
"

/>

</div>

</div>




{/* Drop */}

<div>

<label className="mb-2 block text-sm text-[#c7c7c7]">
Drop Location
</label>


<div className="relative">

<MapPin
className="
absolute
left-4
top-4
text-[#ecb100]
"
size={20}
/>


<input

placeholder="Airport / Destination"

className="
w-full
rounded-xl
border
border-[#252525]
bg-black/40
py-3
pl-12
pr-4
text-white

placeholder:text-[#666]

focus:border-[#ecb100]
outline-none
"

/>

</div>

</div>






{/* Date */}

<div>

<label className="mb-2 block text-sm text-[#c7c7c7]">
Travel Date
</label>


<Popover>

<PopoverTrigger asChild>

<button
className="
flex
w-full
items-center
gap-3
rounded-xl
border
border-[#252525]
bg-black/40
px-4
py-3
text-left
text-white
outline-none
transition
hover:border-[#ecb100]
"
>

<CalendarDays
size={20}
className="text-[#ecb100]"
/>


<span
className={
travelDate
? "text-white"
: "text-[#666]"
}
>

{
travelDate
? format(travelDate,"dd MMM yyyy")
: "Select travel date"
}

</span>


</button>

</PopoverTrigger>



<PopoverContent
className="
w-auto
border-[#252525]
bg-[#141414]
p-0
"
align="start"
>


<Calendar

mode="single"

selected={travelDate}

onSelect={setTravelDate}

disabled={(date)=>
date < new Date()
}

/>


</PopoverContent>


</Popover>


</div>
{/* Time */}

<div>

<label className="mb-2 block text-sm text-[#c7c7c7]">
Pickup Time
</label>


<div className="relative">


<Clock
className="
absolute
left-4
top-4
text-[#ecb100]
"
size={20}
/>


<input

type="time"

className="
w-full
rounded-xl
border
border-[#252525]
bg-black/40
py-3
pl-12
pr-4
text-white

focus:border-[#ecb100]
outline-none
"

/>


</div>

</div>







{/* Vehicle */}

<div>

<label className="mb-2 block text-sm text-[#c7c7c7]">
Select Vehicle
</label>


<div className="relative">


<Car
className="
absolute
left-4
top-4
text-[#ecb100]
"
size={20}
/>


<select

className="
w-full
appearance-none
rounded-xl
border
border-[#252525]
bg-black/40
py-3
pl-12
pr-4
text-white

focus:border-[#ecb100]
outline-none
"

>


<option>
Choose Vehicle
</option>


{
vehicles.map((vehicle)=>(

<option
key={vehicle}
>
{vehicle}
</option>

))
}


</select>


</div>

</div>







{/* Passengers */}

<div>

<label className="mb-2 block text-sm text-[#c7c7c7]">
Passengers
</label>


<div className="relative">


<Users
className="
absolute
left-4
top-4
text-[#ecb100]
"
size={20}
/>


<select

className="
w-full
rounded-xl
border
border-[#252525]
bg-black/40
py-3
pl-12
pr-4
text-white

focus:border-[#ecb100]
outline-none
"

>

<option>
1 Passenger
</option>

<option>
2 Passengers
</option>

<option>
4 Passengers
</option>

<option>
6+ Passengers
</option>


</select>


</div>

</div>



</div>





{/* Customer */}

<div
className="
mt-6
grid
gap-6
md:grid-cols-2
"
>


<input
placeholder="Your Name"

className="
rounded-xl
border
border-[#252525]
bg-black/40
px-4
py-3
text-white
outline-none
focus:border-[#ecb100]
"
/>



<input
placeholder="Phone Number"

className="
rounded-xl
border
border-[#252525]
bg-black/40
px-4
py-3
text-white
outline-none
focus:border-[#ecb100]
"
/>



</div>





<Button
className="
mt-8
w-full
bg-[#ecb100]
py-6
text-lg
font-semibold
text-black

hover:bg-[#f6c94c]
"
>

Request Airport Transfer

</Button>



</div>


</div>


</section>

);

}