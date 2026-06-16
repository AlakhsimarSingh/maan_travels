"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import BookingDatePicker from "./BookingDatePicker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function TaxiBookingForm() {


const [rideType,setRideType] =
useState<"taxi"|"local">("taxi");


const [tripMode,setTripMode] =
useState<"oneway"|"round">("oneway");



const [form,setForm] = useState({

name:"",
email:"",
phone:"",

date:"",

pickup:"",
drop:"",

vehicle:"",
persons:"",

requirements:""

});



const updateField = (
field:string,
value:string
)=>{

setForm(prev=>({

...prev,

[field]:value

}));

};




const submitBooking = async()=>{


try{


const response =
await fetch(

`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

name:form.name,

email:form.email,

phone:form.phone,


pickup:form.pickup,

drop:form.drop,


rideType,


rideMode:
rideType==="taxi"
?
tripMode
:
"local",


vehicle:form.vehicle,


distance:0,

days:1,


amount:0,


status:"pending"


})

}

);



const data =
await response.json();



if(data.success){

alert(
"Booking request submitted successfully!"
);


}else{

alert(
"Something went wrong"
);

}



}
catch(error){

console.log(error);

alert(
"Unable to submit booking"
);

}



};





return (

<div
className="
mx-auto
max-w-5xl
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-8
"
>


<h2
className="
mb-8
text-3xl
font-bold
text-white
"
>

Ride Details

</h2>





{/* RIDE OPTIONS */}

<div
className="
grid
gap-6
md:grid-cols-2
mb-6
"
>



<Select

value={rideType}

onValueChange={
(value)=>
setRideType(
value as "taxi"|"local"
)
}

>

<SelectTrigger
className="
bg-[#111]
border-[#252525]
text-white
"
>

<SelectValue placeholder="Select Ride Type"/>

</SelectTrigger>


<SelectContent>


<SelectItem value="taxi">

Taxi / Cab

</SelectItem>


<SelectItem value="local">

Local (Within City)

</SelectItem>


</SelectContent>


</Select>





{
rideType==="taxi" &&

(

<Select

value={tripMode}

onValueChange={
(value)=>
setTripMode(
value as "oneway"|"round"
)
}

>


<SelectTrigger
className="
bg-[#111]
border-[#252525]
text-white
"
>


<SelectValue placeholder="Trip Type"/>


</SelectTrigger>



<SelectContent>


<SelectItem value="oneway">

One Way

</SelectItem>


<SelectItem value="round">

Two Way / Round Trip

</SelectItem>


</SelectContent>


</Select>

)

}



</div>






{/* CUSTOMER DETAILS */}

<div
className="
grid
gap-6
md:grid-cols-2
"
>



<Input

placeholder="Full Name"

value={form.name}

onChange={
e=>
updateField(
"name",
e.target.value
)
}

/>




<Input

placeholder="Email Address"

value={form.email}

onChange={
e=>
updateField(
"email",
e.target.value
)
}

/>





<Input

placeholder="Mobile Number"

value={form.phone}

onChange={
e=>
updateField(
"phone",
e.target.value
)
}

/>





<BookingDatePicker />





<Input

placeholder="Pickup Location"

value={form.pickup}

onChange={
e=>
updateField(
"pickup",
e.target.value
)
}

/>





<Input

placeholder="Drop Location"

value={form.drop}

onChange={
e=>
updateField(
"drop",
e.target.value
)
}

/>






<Select

onValueChange={
value=>
updateField(
"vehicle",
value
)
}

>


<SelectTrigger
className="
bg-[#111]
border-[#252525]
text-white
"
>


<SelectValue placeholder="Select Vehicle"/>


</SelectTrigger>



<SelectContent>


<SelectItem value="sedan">

Luxury Sedan

</SelectItem>


<SelectItem value="suv">

SUV

</SelectItem>


<SelectItem value="innova">

Toyota Innova

</SelectItem>


<SelectItem value="tempo">

Tempo Traveller

</SelectItem>


<SelectItem value="urbania">

Urbania

</SelectItem>


</SelectContent>


</Select>







<Select

onValueChange={
value=>
updateField(
"persons",
value
)
}

>


<SelectTrigger
className="
bg-[#111]
border-[#252525]
text-white
"
>


<SelectValue placeholder="Number of Persons"/>


</SelectTrigger>



<SelectContent>


<SelectItem value="1">

1-3 Persons

</SelectItem>


<SelectItem value="2">

4-7 Persons

</SelectItem>


<SelectItem value="3">

8+ Persons

</SelectItem>


</SelectContent>


</Select>



</div>







<textarea

placeholder="Special Requirements"

value={form.requirements}

onChange={
e=>
updateField(
"requirements",
e.target.value
)
}

className="
mt-6
min-h-32
w-full
rounded-xl
border
border-[#252525]
bg-[#111]
p-4
text-white
outline-none
focus:border-[#ecb100]
"

/>







<Button

size="lg"

onClick={submitBooking}

className="
mt-8
w-full
bg-[#ecb100]
text-black
hover:bg-[#f6c94c]
"

>

Submit Booking Request

</Button>





</div>


);

}