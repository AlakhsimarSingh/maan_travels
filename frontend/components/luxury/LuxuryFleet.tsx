"use client";


import {
useEffect,
useState
} from "react";


import LuxuryCard from "./LuxuryCard";


import {
getAllLuxuryCars
}
from "@/src/services/luxuryCarService";




export default function LuxuryFleet(){


const [cars,setCars]=useState<any[]>([]);

const [loading,setLoading]=useState(true);





useEffect(()=>{


const fetchCars=async()=>{


try{


const res =
await getAllLuxuryCars();



if(res.success){

setCars(
res.luxuryCars
);

}


}
catch(error){

console.error(
"Luxury cars fetch error:",
error
);

}
finally{

setLoading(false);

}


};


fetchCars();


},[]);







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



<div
className="
text-center
mb-14
"
>


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
loading ?


Array.from({length:3}).map((_,i)=>(

<div

key={i}

className="
h-72
rounded-2xl
bg-[#1a1a1a]
animate-pulse
"

/>

))


:


cars.length>0 ?


cars.map(car=>(

<LuxuryCard

key={car.id}

car={car}

/>

))


:


<p
className="
text-[#8a8a8a]
col-span-full
text-center
"
>

No luxury cars available currently.

</p>


}



</div>






</div>


</section>

);


}