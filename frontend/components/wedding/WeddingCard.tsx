"use client";


import Image from "next/image";
import Link from "next/link";

import {
 Crown,
 Car
} from "lucide-react";


import { Button } from "@/components/ui/button";



export default function WeddingCard({
 car
}:{
 car:any;
}){


return (

<div

className="
overflow-hidden
rounded-3xl
border
border-[#252525]
bg-[#141414]
shadow-[0_0_40px_rgba(236,177,0,0.06)]
"

>


<div

className="
relative
h-64
"

>


<Image

src={car.image}

alt={car.name}

fill

className="
object-cover
"

/>


<div

className="
absolute
inset-0
bg-gradient-to-t
from-black
via-transparent
"

/>


</div>





<div className="p-6">



<p

className="
text-sm
uppercase
tracking-[0.25em]
text-[#ecb100]
"

>

{car.category}

</p>


{/* ADD THIS */}
{car.price && (
  <p className="mt-2 text-sm text-[#ecb100] font-medium">
    Starting from ₹{car.price.toLocaleString("en-IN")}
  </p>
)}



<h3

className="
mt-3
text-2xl
font-bold
text-white
"

>

{car.name}

</h3>



<p

className="
mt-3
text-[#8a8a8a]
"

>

{car.description}

</p>






<div

className="
mt-5
space-y-2
"

>


{
car.features?.map((feature:string)=>(

<div

key={feature}

className="
flex
items-center
gap-2
text-sm
text-[#c7c7c7]
"

>

<Crown
size={14}
className="text-[#ecb100]"
/>

{feature}

</div>

))

}



</div>






<Button

asChild

className="
mt-6
w-full
bg-[#ecb100]
text-black
hover:bg-[#f6c94c]
"

>


<Link

href={`/wedding-booking/${car.slug}`}

>

<Car size={16}/>

Book Wedding Car

</Link>


</Button>





</div>


</div>


)

}