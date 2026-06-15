"use client";

import {
  Crown,
  Heart,
  Car,
  Camera
} from "lucide-react";


const packages=[

{
title:"Royal Groom Entry",
description:
"Make a memorable groom entry with luxury cars like Mercedes Maybach, G-Wagon and Range Rover.",
icon:Crown
},


{
title:"Bride Arrival Package",
description:
"Elegant chauffeur-driven luxury vehicles for a graceful bride arrival experience.",
icon:Heart
},


{
title:"Complete Wedding Convoy",
description:
"Luxury fleet arrangements for bride, groom, family and guests with multiple vehicles.",
icon:Car
},


{
title:"Wedding Photography Package",
description:
"Premium cars available for wedding shoots and cinematic photography.",
icon:Camera
}

];



export default function WeddingPackages(){


return (

<section className="py-24">


<div className="
mx-auto
max-w-7xl
px-6
">


<div className="text-center">


<p className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
">

Wedding Services

</p>


<h2 className="
mt-4
text-4xl
font-bold
text-white
">

Luxury Wedding Car Packages

</h2>


</div>




<div
className="
mt-12
grid
gap-8
md:grid-cols-2
lg:grid-cols-4
"
>


{
packages.map(item=>{


const Icon=item.icon;


return (


<div

key={item.title}

className="
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-8
transition
hover:border-[#ecb100]
"

>


<div

className="
flex
h-14
w-14
items-center
justify-center
rounded-2xl
border
border-[#ecb100]/30
bg-black/40
"

>


<Icon

size={30}

strokeWidth={1.5}

className="
text-[#ecb100]
"

/>


</div>





<h3 className="
mt-6
text-xl
font-bold
text-white
">

{item.title}

</h3>




<p className="
mt-3
text-sm
leading-6
text-[#8a8a8a]
">

{item.description}

</p>




</div>


)


})

}


</div>


</div>


</section>


)

}