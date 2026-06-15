"use client";


import {useState} from "react";
import {ChevronDown} from "lucide-react";


const faqs=[

{
q:"Which wedding cars are available?",
a:"We provide Mercedes Maybach, G-Wagon, Range Rover, Jaguar, Fortuner Legender and premium SUVs."
},

{
q:"Are wedding cars chauffeur driven?",
a:"Yes. All luxury wedding cars are provided with professional chauffeurs."
},

{
q:"Can I book cars for multiple wedding functions?",
a:"Yes. Cars can be arranged for engagement, wedding day, reception and photography sessions."
},

{
q:"Do you provide wedding car decoration?",
a:"Yes. Custom decoration options can be arranged according to your requirements."
}

];



export default function WeddingFAQ(){


const [open,setOpen]=useState<number|null>(null);



return (

<section className="py-24">


<div className="
mx-auto
max-w-4xl
px-6
">


<h2 className="
text-center
text-4xl
font-bold
text-white
">

Wedding Car Rental FAQs

</h2>




<div className="
mt-10
space-y-4
">


{
faqs.map((faq,index)=>(


<div

key={faq.q}

className="
rounded-2xl
border
border-[#252525]
bg-[#141414]
overflow-hidden
"

>


<button

onClick={()=>setOpen(
open===index?null:index
)}

className="
flex
w-full
justify-between
p-6
text-left
text-white
"

>

{faq.q}


<ChevronDown

className={`
transition
${open===index?"rotate-180 text-[#ecb100]":""}
`}

/>


</button>



{
open===index &&

<p className="
px-6
pb-6
text-[#8a8a8a]
leading-7
">

{faq.a}

</p>

}


</div>


))

}


</div>


</div>


</section>


)

}