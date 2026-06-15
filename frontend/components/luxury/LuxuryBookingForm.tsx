"use client";

import {
  CalendarDays,
  Car,
  Clock,
  MapPin,
  Phone,
  User,
  Users
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { useState } from "react";



export function LuxuryBookingForm({
  car
}:{
  car:any;
}){


const [eventDate,setEventDate] =
useState<Date>();



return (

<section

className="
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-8
shadow-[0_0_50px_rgba(236,177,0,0.08)]
"

>


<div>


<p

className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
"

>
Luxury Car Booking
</p>



<h2

className="
mt-3
text-3xl
font-bold
text-white
"

>
Book {car.name}
</h2>



<p

className="
mt-2
text-[#8a8a8a]
"

>
Premium chauffeur driven luxury experience
</p>


</div>






<div

className="
mt-10
grid
gap-6
md:grid-cols-2
"

>


<Input
icon={<User size={18}/>}
placeholder="Full Name"
/>



<Input
icon={<Phone size={18}/>}
placeholder="Phone Number"
/>



<Input
icon={<MapPin size={18}/>}
placeholder="Pickup Location"
/>



<Input
icon={<MapPin size={18}/>}
placeholder="Destination"
/>





{/* DATE PICKER */}

<div className="relative">


<div

className="
absolute
left-4
top-3.5
text-[#ecb100]
z-10
"

>
<CalendarDays size={18}/>
</div>



<Popover>

<PopoverTrigger asChild>


<button

className="
w-full
rounded-xl
border
border-[#252525]
bg-black/40
py-3
pl-12
pr-4
text-left
text-[#c7c7c7]

hover:border-[#ecb100]

transition

"

>


{
eventDate
?
eventDate.toLocaleDateString()
:
"Select Event Date"
}


</button>


</PopoverTrigger>



<PopoverContent

className="
w-auto
p-0
bg-[#141414]
border-[#252525]
"

align="start"

>


<Calendar

mode="single"

selected={eventDate}

onSelect={setEventDate}

className="
bg-[#141414]
text-white
"

/>


</PopoverContent>



</Popover>


</div>







<Input
icon={<Clock size={18}/>}
placeholder="Required Hours"
/>




<Input
icon={<Users size={18}/>}
placeholder="Number of People"
/>




<Input
icon={<Car size={18}/>}
placeholder="Event Type (Wedding, Corporate etc.)"
/>



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
bg-black/40
p-4
text-white
placeholder:text-[#666]
outline-none
focus:border-[#ecb100]
"

/>






<Button

className="
mt-8
w-full
bg-[#ecb100]
py-6
text-lg
text-black
hover:bg-[#f6c94c]
"

>

Submit Luxury Booking Request

</Button>




</section>


)

}









function Input({
icon,
placeholder,

}:{
icon:React.ReactNode;
placeholder:string;

}){


return (

<div

className="
relative
"

>


<div

className="
absolute
left-4
top-3.5
text-[#ecb100]
"

>

{icon}

</div>




<input


placeholder={placeholder}


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
outline-none
focus:border-[#ecb100]
"

 />



</div>

)

}