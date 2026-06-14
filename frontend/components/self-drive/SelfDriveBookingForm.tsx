"use client";

import {
  CalendarDays,
  Car,
  MapPin,
  Phone,
  User,
  Fuel,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";


type Vehicle = {
  id: number;
  name: string;
  image: string;
  category: string;
  model: string;
  description: string;
  fuel: string;
  transmission: string;
  seats: number;
  price: number;
};



export default function SelfDriveBookingForm({
  vehicle,
  onClose,
}: {
  vehicle: Vehicle;
  onClose: () => void;
}) {


return (

<section
className="
mt-16
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-8
shadow-[0_0_50px_rgba(236,177,0,0.08)]
"
>


{/* HEADER */}

<div className="flex justify-between items-start">


<div>


<p
className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
"
>
Self Drive Booking
</p>



<h2
className="
mt-3
text-3xl
font-bold
text-white
"
>
Book {vehicle.name}
</h2>



<p
className="
mt-2
text-[#8a8a8a]
"
>

₹{vehicle.price}/day

<span className="mx-2 text-[#ecb100]">
•
</span>

{vehicle.fuel}

<span className="mx-2 text-[#ecb100]">
•
</span>

{vehicle.transmission}

</p>


</div>




<button
onClick={onClose}
className="
text-[#8a8a8a]
hover:text-white
text-xl
"
>
✕
</button>


</div>





{/* VEHICLE SUMMARY */}

<div
className="
mt-8
grid
gap-4
sm:grid-cols-3
"
>


<Summary
icon={<Car size={18}/>}
label="Vehicle"
value={vehicle.name}
/>


<Summary
icon={<Fuel size={18}/>}
label="Fuel"
value={vehicle.fuel}
/>


<Summary
icon={<Settings size={18}/>}
label="Gear"
value={vehicle.transmission}
/>


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
name="name"
/>



<Input
icon={<Phone size={18}/>}
placeholder="Phone Number"
name="phone"
type="tel"
/>



<Input
icon={<MapPin size={18}/>}
placeholder="Pickup Location"
name="pickup"
/>




<Input
icon={<CalendarDays size={18}/>}
placeholder="Pickup Date"
name="pickupDate"
type="date"
/>




<Input
icon={<CalendarDays size={18}/>}
placeholder="Return Date"
name="returnDate"
type="date"
/>





<Input
icon={<Car size={18}/>}
placeholder="Driving License Number"
name="license"
/>



</div>





<textarea

name="requirements"

placeholder="
Additional requirements or message
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




<p
className="
mt-4
text-sm
text-[#8a8a8a]
"
>
Our team will verify availability and contact you shortly.
</p>





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

Confirm Booking Request

</Button>




</section>

)

}







function Input({
icon,
placeholder,
name,
type="text"

}:{
icon:React.ReactNode;
placeholder:string;
name:string;
type?:string;
}){


return (

<div className="relative">


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

name={name}

type={type}

placeholder={placeholder}

required

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






function Summary({
icon,
label,
value,
}:{
icon:React.ReactNode;
label:string;
value:string;
}){


return (

<div
className="
rounded-xl
border
border-[#252525]
bg-black/30
p-4
"
>


<div
className="
flex
items-center
gap-2
text-[#ecb100]
text-sm
"
>

{icon}

<span>
{label}
</span>

</div>



<p
className="
mt-2
text-white
font-medium
"
>
{value}
</p>


</div>

)

}