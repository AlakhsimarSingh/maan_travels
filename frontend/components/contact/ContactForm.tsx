"use client";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function ContactForm(){

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
mb-6
text-2xl
font-bold
text-white
"
>
Send Message
</h2>



<div className="space-y-5">


<Input
placeholder="Your Name"
/>


<Input
placeholder="Email Address"
/>


<Input
placeholder="Mobile Number"
/>


<Input
placeholder="Subject"
/>


<textarea
placeholder="Your Message"

className="
min-h-32
w-full
rounded-xl
border
border-[#252525]
bg-[#111]
p-4
text-white
"
/>



<Button
className="
w-full
bg-[#ecb100]
text-black
hover:bg-[#f6c94c]
"
>
Send Inquiry
</Button>



</div>


</div>

);

}