"use client";


import {
MapPin,
Phone,
User
} from "lucide-react";


import {Button} from "@/components/ui/button";


export default function TourBookingCard({
pickup,
destination
}:{
pickup:string;
destination:string;
}){


return (

<div

className="
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-8
"

>


<p
className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
"
>
Book Your Tour
</p>


<h2
className="
mt-4
text-2xl
font-bold
text-white
"
>

{pickup}

<span className="text-[#ecb100] mx-2">
→
</span>

{destination}

</h2>



<div className="
mt-8
space-y-5
">


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
placeholder="Pickup Address"
/>


</div>



<textarea

placeholder="Special Requirements"

className="
mt-5
min-h-28
w-full
rounded-xl
border
border-[#252525]
bg-black/40
p-4
text-white
"

/>



<Button

className="
mt-6
w-full
bg-[#ecb100]
text-black
hover:bg-[#f6c94c]
"

>

Request Quote

</Button>


</div>


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

<div className="relative">


<div
className="
absolute
left-4
top-3
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
text-white
"

/>


</div>

)

}