import { luxuryCars } from "@/src/data/luxuryCars";
import LuxuryCard from "./LuxuryCard";


export default function LuxuryFleet(){


return (

<section
className="
py-24
"
>


<div
className="
mx-auto
max-w-7xl
px-6
"
>


<div className="text-center mb-14">


<p
className="
uppercase
tracking-[0.3em]
text-[#ecb100]
"
>
Our Fleet
</p>


<h2
className="
mt-4
text-4xl
font-bold
text-white
"
>
Luxury Cars Available For Rental
</h2>


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
luxuryCars.map(car=>(

<LuxuryCard
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