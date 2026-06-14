"use client";


import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";


import BookingDatePicker 
from "@/components/booking/BookingDatePicker";


import StarRating 
from "./StarRating";



export default function FeedbackForm(){


const [vehicleRating,setVehicleRating]
=
useState(0);


const [supportRating,setSupportRating]
=
useState(0);



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


<h2
className="
mb-8
text-3xl
font-bold
text-white
"
>
Share Your Experience
</h2>



<div className="space-y-7">



{/* Customer Name */}

<div>

<label className="mb-2 block text-sm text-[#c7c7c7]">
Customer Name
</label>

<Input
placeholder="Enter your name"
/>

</div>




{/* Travel Date */}

<div>

<label className="mb-2 block text-sm text-[#c7c7c7]">
Date of Travel
</label>

<BookingDatePicker />

</div>





{/* Route */}

<div>

<label className="mb-2 block text-sm text-[#c7c7c7]">
Route / Trip Name
</label>


<Input
placeholder="Example: Delhi - Manali"
/>

</div>





{/* Satisfaction */}

<div>

<label className="mb-2 block text-sm text-[#c7c7c7]">
How satisfied were you with your overall travel experience?
</label>



<Select>

<SelectTrigger
className="
bg-[#111]
border-[#252525]
text-white
"
>

<SelectValue
placeholder="Select satisfaction"
/>

</SelectTrigger>


<SelectContent>


<SelectItem value="very-satisfied">
Very Satisfied
</SelectItem>


<SelectItem value="satisfied">
Satisfied
</SelectItem>


<SelectItem value="neutral">
Neutral
</SelectItem>


<SelectItem value="unsatisfied">
Unsatisfied
</SelectItem>


<SelectItem value="very-unsatisfied">
Very Unsatisfied
</SelectItem>


</SelectContent>


</Select>


</div>






{/* Vehicle Rating */}

<div>

<label
className="
mb-3
block
text-sm
text-[#c7c7c7]
"
>
How would you rate the comfort and cleanliness of the vehicle?
</label>


<StarRating
value={vehicleRating}
onChange={setVehicleRating}
/>


</div>







{/* Driver */}

<div>

<label className="mb-2 block text-sm text-[#c7c7c7]">
Was the driver punctual, polite, and professional?
</label>



<Select>


<SelectTrigger
className="
bg-[#111]
border-[#252525]
text-white
"
>

<SelectValue placeholder="Select response"/>

</SelectTrigger>


<SelectContent>

<SelectItem value="yes">
Yes
</SelectItem>


<SelectItem value="no">
No
</SelectItem>


<SelectItem value="somewhat">
Somewhat
</SelectItem>


</SelectContent>


</Select>


</div>







{/* Support Rating */}

<div>

<label
className="
mb-3
block
text-sm
text-[#c7c7c7]
"
>
How satisfied were you with the booking and support service?
</label>


<StarRating
value={supportRating}
onChange={setSupportRating}
/>


</div>







{/* Suggestions */}

<div>

<label
className="
mb-2
block
text-sm
text-[#c7c7c7]
"
>
Suggestions or Comments
</label>


<textarea

placeholder="Tell us how we can improve..."

className="
min-h-36
w-full
rounded-xl
border
border-[#252525]
bg-[#111]
p-4
text-white

focus:border-[#ecb100]
"
/>


</div>








{/* Recommendation */}

<div>

<label className="mb-2 block text-sm text-[#c7c7c7]">
Would you recommend us to others?
</label>



<Select>

<SelectTrigger
className="
bg-[#111]
border-[#252525]
text-white
"
>

<SelectValue placeholder="Select response"/>

</SelectTrigger>



<SelectContent>


<SelectItem value="yes">
Yes
</SelectItem>


<SelectItem value="no">
No
</SelectItem>


</SelectContent>


</Select>


</div>






<Button

size="lg"

className="
w-full
bg-[#ecb100]
text-black
hover:bg-[#f6c94c]
"

>
Submit Feedback
</Button>



</div>


</div>

);

}