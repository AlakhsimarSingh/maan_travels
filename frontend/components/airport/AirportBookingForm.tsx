"use client";

import { useEffect, useState } from "react";

import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Car,
  Plane,
  Luggage,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";

import BookingSuccess from "../common/BookingSuccess";

import {
  API_URL,
  createAirportBooking,
} from "../../src/services/bookingService";

import { useBookingStatus } from "../../src/hooks/useBookingStatus";



type Vehicle = {
  id:string;
  name:string;
};



const airports = [
  "Amritsar Airport",
  "Chandigarh Airport",
  "Adampur Airport",
  "Delhi Airport",
  "Ludhiana Airport",
];



export default function AirportBookingForm(){


const [travelDate,setTravelDate]=
useState<Date>();


const [vehicles,setVehicles]=
useState<Vehicle[]>([]);



const [form,setForm]=useState({

pickup:"",
terminal:"",
time:"",
vehicle:"",
passengers:"",
name:"",
phone:"",
suitcases:"",
handbags:"",

});



const {
loading,
success,
bookingId,
start,
done,
reset

}=useBookingStatus();





useEffect(()=>{


const fetchVehicles=async()=>{


try{


const res =
await fetch(
`${API_URL}/api/vehicles`
);


const data =
await res.json();


setVehicles(
data.vehicles || []
);



}

catch(err){

console.error(
"Vehicle fetch failed",
err
);

}



};



fetchVehicles();


},[]);







const handleChange=(e:any)=>{


setForm({

...form,

[e.target.name]:
e.target.value

});


};








const clearForm=()=>{


setForm({

pickup:"",
terminal:"",
time:"",
vehicle:"",
passengers:"",
name:"",
phone:"",
suitcases:"",
handbags:"",

});


setTravelDate(undefined);


};








const handleSubmit=async()=>{


if(

!form.pickup ||
!form.terminal ||
!travelDate ||
!form.time ||
!form.vehicle ||
!form.passengers ||
!form.name ||
!form.phone ||
!form.suitcases ||
!form.handbags

){

alert(
"Please fill all fields before submitting"
);

return;

}



try{


start();



const res =
await createAirportBooking({

name:
form.name,

phone:
form.phone,

pickup:
form.pickup,

airport:
form.terminal,

travelDate:
travelDate.toISOString(),

pickupTime:
form.time,

vehicle:
form.vehicle,

passengers:
Number(form.passengers),

suitcases:
Number(form.suitcases),

handbags:
Number(form.handbags),

});



done(
(res as any)?.booking?.id
);



clearForm();



}

catch(err){


console.error(err);


reset();


}



};





const fieldClass=`

h-12

w-full

rounded-xl

border

border-[#252525]

bg-[#111]

text-white

placeholder:text-[#777]

outline-none

focus:border-[#ecb100]

`;







return (

<div

className="
grid
gap-5
md:grid-cols-2
"

>





{/* PICKUP */}

<Field

icon={
<MapPin
size={18}
className="text-[#ecb100]"
/>
}

name="pickup"

value={form.pickup}

onChange={handleChange}

placeholder="Pickup Address"

/>







{/* AIRPORT */}

<SelectField

icon={
<Plane
size={18}
className="text-[#ecb100]"
/>
}

value={form.terminal}

onChange={(value:string)=>
setForm({
...form,
terminal:value
})
}

options={airports}

placeholder="Select Airport"

/>







{/* DATE */}

<div className="relative">


<Popover>


<PopoverTrigger asChild>


<button

className={`
${fieldClass}

flex
items-center
gap-3
px-4
text-left

`}

>


<CalendarDays

size={18}

className="text-[#ecb100]"

/>


<span>

{

travelDate

?

format(
travelDate,
"dd MMM yyyy"
)

:

"Select Travel Date"

}

</span>


</button>


</PopoverTrigger>



<PopoverContent

className="
border-[#252525]
bg-[#141414]
p-0
"

>


<Calendar

mode="single"

selected={travelDate}

onSelect={setTravelDate}

/>


</PopoverContent>


</Popover>


</div>







{/* TIME */}

<div className="relative">


<Clock

size={18}

className="
absolute
left-4
top-1/2
-translate-y-1/2
text-white
z-10
"

/>


<input

type="time"

name="time"

value={form.time}

onChange={handleChange}

className={`
${fieldClass}
pl-12

[&::-webkit-calendar-picker-indicator]:invert

`}

/>


</div>







{/* VEHICLE */}

<SelectField

icon={
<Car
size={18}
className="text-[#ecb100]"
/>
}


value={form.vehicle}


onChange={(value:string)=>

setForm({
...form,
vehicle:value
})

}


options={
vehicles.map(
(v)=>v.name
)
}


placeholder="Select Vehicle"

/>









{/* PASSENGERS */}

<SelectField

icon={
<Users
size={18}
className="text-[#ecb100]"
/>
}


value={form.passengers}


onChange={(value:string)=>

setForm({
...form,
passengers:value
})

}


options={[
"1 Passenger",
"2-4 Passengers",
"5-7 Passengers",
"8+ Passengers"

]}


placeholder="Passengers"

/>









{/* NAME */}

<Field

icon={
<Users
size={18}
className="text-[#ecb100]"
/>
}


name="name"

value={form.name}

onChange={handleChange}

placeholder="Your Name"

/>








{/* PHONE */}

<Field

name="phone"

value={form.phone}

onChange={handleChange}

placeholder="Phone Number"

/>









{/* SUITCASES */}

<Field

icon={
<Luggage
size={18}
className="text-[#ecb100]"
/>
}


name="suitcases"

value={form.suitcases}

onChange={handleChange}

placeholder="Suitcases"

type="number"

/>









{/* HANDBAGS */}

<Field

icon={
<Luggage
size={18}
className="text-[#ecb100]"
/>
}


name="handbags"

value={form.handbags}

onChange={handleChange}

placeholder="Handbags"

type="number"

/>









<Button

onClick={handleSubmit}

disabled={loading}

className="
md:col-span-2

h-12

rounded-xl

bg-[#ecb100]

font-semibold

text-black

hover:bg-[#f6c94c]

"

>


{
loading

?

"Processing..."

:

"Request Airport Transfer"

}


</Button>






<BookingSuccess

open={success}

onClose={reset}

bookingId={bookingId}

/>





</div>


);

}









function Field({

icon,
...props

}:any){


return (

<div className="relative">


{
icon &&

<div

className="
absolute
left-4
top-1/2
-translate-y-1/2
z-10
"

>

{icon}

</div>

}



<input

{...props}

className={`

h-12

w-full

rounded-xl

border

border-[#252525]

bg-[#111]

text-white

placeholder:text-[#777]

outline-none

focus:border-[#ecb100]

${icon ? "pl-12":"px-4"}

`}

/>


</div>

);


}









function SelectField({

icon,
value,
onChange,
options,
placeholder

}:any){


return (

<div className="relative">


{
icon &&

<div

className="
absolute
left-4
top-1/2
-translate-y-1/2
z-10
"

>

{icon}

</div>

}



<select

value={value}

onChange={(e)=>
onChange(e.target.value)
}

className={`

h-12

w-full

rounded-xl

border

border-[#252525]

bg-[#111]

text-white

outline-none

focus:border-[#ecb100]

appearance-none

${icon ? "pl-12":"px-4"}

`}

>


<option value="">

{placeholder}

</option>



{

options.map(
(option:string)=>(

<option

key={option}

value={option}

>

{option}

</option>

)

)

}



</select>


</div>

);


}