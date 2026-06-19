"use client";

import {
  MapPin,
  Phone,
  User
} from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import BookingSuccess from "@/components/common/BookingSuccess";

import { createTourBooking } from "@/src/services/bookingService";

import { useBookingStatus } from "@/src/hooks/useBookingStatus";



export default function TourBookingCard({

pickup,

destination

}:{

pickup:string;

destination:string;

}){


const [form,setForm]=useState({

name:"",

phone:"",

pickupAddress:"",

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




const res = await createTourBooking({

name:form.name,

phone:form.phone,


pickupCity:pickup,


destination,


route:`${pickup} → ${destination}`,


pickupAddress:form.pickupAddress,


requirements:form.requirements


});





done(

(res as any)?.booking?.id

);





setForm({

name:"",

phone:"",

pickupAddress:"",

requirements:""

});





}

catch(error){


console.log(error);


reset();


}


};








return (


<div

className="
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-8
"

>


<p

className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
"

>

Book Your Tour

</p>





<h2

className="
mt-4
text-2xl
font-bold
text-white
"

>

{pickup}

<span className="mx-2 text-[#ecb100]">
→
</span>

{destination}

</h2>







<div

className="
mt-8
space-y-5
"

>





<Input

icon={<User size={18}/>}

placeholder="Full Name"

value={form.name}

onChange={

(e)=>

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

onChange={

(e)=>

updateField(
"phone",
e.target.value
)

}

/>








<Input

icon={<MapPin size={18}/>}

placeholder="Pickup Address"

value={form.pickupAddress}

onChange={

(e)=>

updateField(
"pickupAddress",
e.target.value
)

}

/>







</div>









<textarea


placeholder="Special Requirements"


value={form.requirements}


onChange={

(e)=>

updateField(
"requirements",
e.target.value
)

}


className="

mt-5

min-h-28

w-full

rounded-xl

border

border-[#252525]

bg-black/40

p-4

text-white

outline-none

focus:border-[#ecb100]

"


/>









<Button


disabled={loading}


onClick={submitBooking}


className="

mt-6

w-full

bg-[#ecb100]

text-black

hover:bg-[#f6c94c]

"


>


{

loading

?

"Processing..."

:

"Request Quote"

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

<div className="relative">


<div

className="
absolute
left-4
top-3
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

text-white

outline-none

focus:border-[#ecb100]

"


/>


</div>


);


}