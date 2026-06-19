"use client";

import {
  CalendarDays,
  Car,
  Clock,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import BookingSuccess from "@/components/common/BookingSuccess";

import { createLuxuryBooking } from "@/src/services/bookingService";

import { useBookingStatus } from "@/src/hooks/useBookingStatus";



export function LuxuryBookingForm({
  car
}:{
  car:any;
}){
console.log("Luxury car:",car);

const [eventDate,setEventDate]=
useState<Date>();


const [form,setForm]=useState({

name:"",

phone:"",

pickup:"",

destination:"",

hours:"",

eventType:"",

requirements:""

});




const {
loading,
success,
bookingId,
start,
done,
reset

}=useBookingStatus();







const updateField=(

field:string,

value:string

)=>{


setForm(prev=>({

...prev,

[field]:value

}));

};









const submitBooking=async()=>{


try{


start();




const res =
await createLuxuryBooking({

name:form.name,

phone:form.phone,


luxuryCarId:car.id,


pickup:form.pickup,


destination:form.destination,


eventDate:eventDate
?
eventDate.toISOString()
:
"",



hours:form.hours,


eventType:form.eventType,


requirements:form.requirements


});





const id =
(res as any)?.bookingId ||
(res as any)?.booking?.id;


done(id);






setForm({

name:"",

phone:"",

pickup:"",

destination:"",

hours:"",

eventType:"",

requirements:""

});


setEventDate(undefined);



}


catch(error){


console.log(error);


reset();


}


};







return (

<section

className="
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-8
shadow-[0_0_50px_rgba(236,177,0,0.08)]
"

>


<div>


<p

className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
"

>

Luxury Car Booking

</p>





<h2

className="
mt-3
text-3xl
font-bold
text-white
"

>

Book {car.name}

</h2>





<p

className="
mt-2
text-[#8a8a8a]
"

>

Premium chauffeur driven luxury experience

</p>


</div>









<div

className="
mt-10
grid
gap-6
md:grid-cols-2
"

>





<Input

icon={<User size={18}/>}

placeholder="Full Name"

value={form.name}

onChange={(e:any)=>
updateField(
"name",
e.target.value
)
}

/>






<Input

icon={<Phone size={18}/>}

placeholder="Phone Number"

value={form.phone}

onChange={(e:any)=>
updateField(
"phone",
e.target.value
)
}

/>






<Input

icon={<MapPin size={18}/>}

placeholder="Pickup Location"

value={form.pickup}

onChange={(e:any)=>
updateField(
"pickup",
e.target.value
)
}

/>






<Input

icon={<MapPin size={18}/>}

placeholder="Destination"

value={form.destination}

onChange={(e:any)=>
updateField(
"destination",
e.target.value
)
}

/>









{/* DATE */}


<div className="relative">


<div

className="
absolute
left-4
top-3.5
text-[#ecb100]
z-10
"

>

<CalendarDays size={18}/>

</div>





<Popover>

<PopoverTrigger asChild>


<button

className="
w-full
rounded-xl
border
border-[#252525]
bg-black/40
py-3
pl-12
pr-4
text-left
text-[#c7c7c7]
hover:border-[#ecb100]
transition
"

>


{

eventDate

?

eventDate.toLocaleDateString()

:

"Select Event Date"

}


</button>


</PopoverTrigger>





<PopoverContent

className="
w-auto
p-0
bg-[#141414]
border-[#252525]
"

align="start"

>


<Calendar

mode="single"

selected={eventDate}

onSelect={setEventDate}

className="
bg-[#141414]
text-white
"

/>


</PopoverContent>



</Popover>


</div>









<Input

icon={<Clock size={18}/>}

placeholder="Required Hours"

value={form.hours}

onChange={(e:any)=>
updateField(
"hours",
e.target.value
)
}

/>







<Input

icon={<Car size={18}/>}

placeholder="Event Type (Wedding, Corporate etc.)"

value={form.eventType}

onChange={(e:any)=>
updateField(
"eventType",
e.target.value
)
}

/>






</div>








<textarea


placeholder="Special Requirements"


value={form.requirements}


onChange={(e:any)=>
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
bg-black/40
p-4
text-white
placeholder:text-[#666]
outline-none
focus:border-[#ecb100]
"

/>









<Button

disabled={loading}


onClick={submitBooking}


className="
mt-8
w-full
bg-[#ecb100]
py-6
text-lg
text-black
hover:bg-[#f6c94c]
"

>


{

loading

?

"Processing..."

:

"Submit Luxury Booking Request"

}


</Button>







<BookingSuccess

open={success}

onClose={reset}

bookingId={bookingId}

/>






</section>


);

}









function Input({

icon,

placeholder,

value,

onChange

}:{

icon:React.ReactNode;

placeholder:string;

value:string;

onChange:(e:any)=>void;

}){


return (

<div

className="
relative
"

>


<div

className="
absolute
left-4
top-3.5
text-[#ecb100]
"

>

{icon}

</div>





<input


value={value}


onChange={onChange}


placeholder={placeholder}



className="
w-full
rounded-xl
border
border-[#252525]
bg-black/40
py-3
pl-12
pr-4
text-white
placeholder:text-[#666]
outline-none
focus:border-[#ecb100]
"

/>


</div>

)

}