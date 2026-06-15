"use client";


import {
 CalendarDays,
 Car,
 MapPin,
 Phone,
 User,
 Users,
 Building2,
 Sparkles
} from "lucide-react";


import { Button } from "@/components/ui/button";

import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";





export default function WeddingBookingForm({

car

}:{

car:any;

}){


const [date,setDate]=useState<Date>();

const [showCalendar,setShowCalendar]=useState(false);



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

Wedding Car Booking

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

Royal wedding arrival experience with premium chauffeur service.

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

icon={<Building2 size={18}/>}

placeholder="Wedding Venue"

/>





{/* DATE PICKER */}


<div className="relative">


<div

className="
absolute
left-4
top-3.5
text-[#ecb100]
"

>

<CalendarDays size={18}/>

</div>




<button

type="button"

onClick={()=>setShowCalendar(!showCalendar)}

className="
w-full
rounded-xl
border
border-[#252525]
bg-black/40
py-3
pl-12
text-left
text-white
"

>


{
date
?
date.toDateString()
:
"Wedding Date"
}



</button>



{
showCalendar &&

<div

className="
absolute
z-50
mt-2
rounded-xl
border
border-[#252525]
bg-[#141414]
p-3
"

>


<Calendar

mode="single"

selected={date}

onSelect={(value)=>{

setDate(value);

setShowCalendar(false);

}}


/>


</div>

}



</div>






<Input

icon={<Users size={18}/>}

placeholder="Number of Guests"

/>





<Input

icon={<Car size={18}/>}

placeholder="Number of Cars Required"

/>




<Input

icon={<Sparkles size={18}/>}

placeholder="Decoration Requirements"

/>



</div>






<textarea

placeholder="
Special Requirements
(Entry decoration, flower setup, timing etc.)
"

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

Submit Wedding Booking Request

</Button>






</section>


)

}









function Input({

icon,

placeholder

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