"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";

import { Button } from "@/components/ui/button";


type LuxuryCar = {
  id:number;
  name:string;
  slug:string;
  image:string;
  category:string;
  description:string;
  features:string[];
};



export default function LuxuryCard({
  car
}:{
  car:LuxuryCar;
}){


return (

<div

className="
group
overflow-hidden

rounded-3xl

border
border-[#252525]

bg-[#141414]

transition-all
duration-500

hover:-translate-y-2

hover:border-[#ecb100]

shadow-[0_0_40px_rgba(236,177,0,0.05)]
"

>


{/* IMAGE */}


<div
className="
relative
h-72
overflow-hidden
"
>


<Image

src={car.image}

alt={`${car.name} luxury car rental Punjab`}

fill

className="
object-cover

transition-transform
duration-700

group-hover:scale-110
"

/>



<div

className="
absolute
inset-0

bg-gradient-to-t
from-black
via-black/20
to-transparent
"

 />



<div

className="
absolute
bottom-5
left-5

flex
items-center
gap-2

rounded-full

border
border-[#ecb100]/30

bg-black/50

px-4
py-2

text-xs

uppercase

tracking-wider

text-[#ecb100]

backdrop-blur-md
"

>

<Crown size={14}/>

Premium Fleet

</div>



</div>







{/* CONTENT */}


<div
className="
p-6
"
>



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

line-clamp-3

text-sm

leading-relaxed

text-[#8a8a8a]
"

>

{car.description}

</p>






{/* FEATURES */}

<div

className="
mt-5

flex

flex-wrap

gap-2
"

>

{

car.features.map(feature=>(

<span

key={feature}

className="
rounded-full

border

border-[#252525]

bg-black/30

px-3

py-1

text-xs

text-[#c7c7c7]
"

>

{feature}

</span>


))

}


</div>







<Button

asChild

className="
mt-7

w-full

bg-[#ecb100]

text-black

hover:bg-[#f6c94c]

"

>


<Link

href={`/luxury-cars/${car.slug}`}

>

View Details

<ArrowRight

size={16}

className="
ml-2
transition-transform
group-hover:translate-x-1
"

/>

</Link>


</Button>




</div>



</div>


)

}