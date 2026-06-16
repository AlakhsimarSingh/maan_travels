"use client";


import {useEffect, useState} from "react";


import {
cities,
destinationData,
defaultTour
}
from "@/src/data/tours";


import DestinationHero
from "./DestinationHero";


import TourBookingCard
from "./TourBookingCard";



const heroDestinations = Object.keys(destinationData);



export default function TourPlanner(){



const [pickup,setPickup] =
useState("");



const [destination,setDestination] =
useState("");



const [slideIndex,setSlideIndex] =
useState(0);





useEffect(()=>{


if(destination)
return;



const interval =
setInterval(()=>{


setSlideIndex(
prev =>
(prev+1)%heroDestinations.length
);


},4000);



return ()=>clearInterval(interval);



},[destination]);






const activeDestination =

destination

?

destination

:

heroDestinations[slideIndex];




const data =

destinationData[activeDestination]

||

defaultTour;







return (

<main>


<DestinationHero

destination={
destination || ""
}

data={data}

/>





<section

className="
relative
-mt-24
z-20
pb-16
"

>


<div

className="
mx-auto
max-w-6xl
px-6
"

>


<div

className="
rounded-3xl
border
border-[#252525]
bg-[#111]/95
backdrop-blur-xl
p-6
shadow-2xl
"

>


<h2

className="
text-xl
font-semibold
text-white
"

>

Plan Your Journey

</h2>



<div

className="
mt-5
grid
gap-4
md:grid-cols-3
"

>



<select

value={pickup}

onChange={
e=>setPickup(e.target.value)
}

className="
rounded-xl
border
border-[#252525]
bg-black/50
p-4
text-white
outline-none
focus:border-[#ecb100]
"

>


<option value="">

Select Pickup City

</option>


{
cities.map(city=>(

<option
key={city}
value={city}
>

{city}

</option>

))
}


</select>







<select

value={destination}

onChange={
e=>setDestination(e.target.value)
}

className="
rounded-xl
border
border-[#252525]
bg-black/50
p-4
text-white
outline-none
focus:border-[#ecb100]
"

>


<option value="">

Select Destination

</option>



{
cities.map(city=>(

<option

key={city}

value={city}

>

{city}

</option>

))
}



</select>






<div

className="
flex
items-center
justify-center
rounded-xl
border
border-[#252525]
bg-black/30
px-4
text-[#c7c7c7]
"

>


{
pickup && destination

?

`${pickup} → ${destination}`

:

"Choose your route"

}


</div>



</div>



</div>


</div>


</section>






<section

className="
pb-24
"

>


<TourBookingCard

pickup={pickup}

destination={destination}

/>


</section>



</main>

)

}