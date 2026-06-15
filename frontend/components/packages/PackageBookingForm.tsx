"use client";

import {
  MapPin,
  Phone,
  User,
  Users,
  Car,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";


export default function PackageBookingForm({
  pkg,
}: {
  pkg: any;
}) {


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


{/* HEADER */}

<div>

<p
className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
"
>
Tour Booking
</p>


<h2
className="
mt-3
text-3xl
font-bold
text-white
"
>
Book {pkg.title}
</h2>


<p
className="
mt-2
text-[#8a8a8a]
"
>
{pkg.duration}

<span className="mx-2 text-[#ecb100]">
•
</span>

{pkg.location}

</p>


</div>





{/* FORM */}

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
placeholder="Pickup City"
/>



<div>

<DatePicker />

</div>



<Input
icon={<Users size={18}/>}
placeholder="Number of Travellers"
/>



<Input
icon={<Car size={18}/>}
placeholder="Vehicle Preference (Sedan/SUV/Tempo)"
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

Submit Tour Request

</Button>



</section>

)

}







function Input({
icon,
placeholder,
type="text"
}:{
icon:React.ReactNode;
placeholder:string;
type?:string;
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

type={type}

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