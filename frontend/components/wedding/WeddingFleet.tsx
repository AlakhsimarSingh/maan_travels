import WeddingCard from "./WeddingCard";

import { weddingCars } from "@/src/data/weddingCars";


export default function WeddingFleet(){


return (

<section className="py-24">


<div className="mx-auto max-w-7xl px-6">


<div className="text-center mb-14">


<p
className="
uppercase
tracking-[0.3em]
text-[#ecb100]
"
>
Wedding Fleet
</p>



<h2
className="
mt-4
text-4xl
font-bold
text-white
"
>
Luxury Cars For Your Special Day
</h2>



<p
className="
mt-4
text-[#8a8a8a]
"
>
Choose from our premium wedding cars for groom entry, bride arrival and family transportation.
</p>



</div>




<div

className="
grid
gap-8
md:grid-cols-2
lg:grid-cols-3
"

>


{
weddingCars.map(car=>(

<WeddingCard

key={car.id}

car={car}

/>

))

}



</div>



</div>


</section>


)

}