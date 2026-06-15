"use client";

import { useState, useRef } from "react";

import { tempoUrbaniaVehicles } from "@/src/data/tempoUrbania";

import TempoUrbaniaCard from "./TempoUrbaniaCard";
import TempoUrbaniaBookingForm from "./TempoUrbaniaBookingForm";


export default function TempoUrbaniaFleet(){


const [selectedVehicle,setSelectedVehicle] =
useState<any>(null);


const bookingRef = useRef<HTMLDivElement>(null);



const selectVehicle = (vehicle:any)=>{

setSelectedVehicle(vehicle);


setTimeout(()=>{

bookingRef.current?.scrollIntoView({
behavior:"smooth",
block:"start"
});

},200);


};



return (

<section className="py-24">


<div className="mx-auto max-w-7xl px-6">



<div className="text-center mb-14">


<p className="
uppercase
tracking-[0.3em]
text-[#ecb100]
">
Tempo Traveller & Urbania
</p>


<h2 className="
mt-4
text-4xl
font-bold
text-white
">
Choose Your Travel Partner
</h2>


<p className="
mt-4
text-[#8a8a8a]
">
Premium AC travellers with professional chauffeurs.
</p>


</div>





<div className="
grid
gap-8
md:grid-cols-2
">


{
tempoUrbaniaVehicles.map(vehicle=>(


<div key={vehicle.id}>


<TempoUrbaniaCard

vehicle={vehicle}

expanded={
selectedVehicle?.id===vehicle.id
}

onBook={()=>selectVehicle(vehicle)}

/>


</div>


))

}


</div>





{
selectedVehicle &&

<div ref={bookingRef}>

<TempoUrbaniaBookingForm

vehicle={selectedVehicle}

onClose={()=>{
setSelectedVehicle(null)
}}

/>

</div>

}



</div>


</section>


)

}