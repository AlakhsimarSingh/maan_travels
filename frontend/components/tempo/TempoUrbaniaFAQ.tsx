"use client";


import {
Accordion,
AccordionContent,
AccordionItem,
AccordionTrigger,
} from "@/components/ui/accordion";



const faqs=[


{
q:"What is the difference between Tempo Traveller and Force Urbania?",
a:
"Tempo Traveller is a comfortable group vehicle, while Force Urbania offers a more premium luxury experience with better interiors, advanced comfort features and a higher-end travel feel."
},


{
q:"How many passengers can travel in a Tempo Traveller?",
a:
"Tempo Traveller options are available in different seating capacities including 9, 12, 16 and larger group configurations depending on your requirement."
},


{
q:"Can I book Tempo Traveller for Himachal tours?",
a:
"Yes. Our Tempo Traveller and Urbania vehicles are ideal for Dalhousie, Dharamshala, Manali, Shimla and Kashmir trips."
},


{
q:"Do you provide drivers with the vehicle?",
a:
"Yes. All Tempo Traveller and Urbania rentals include professional chauffeurs for a safe and comfortable journey."
},


{
q:"Can Tempo Traveller be booked for weddings and corporate events?",
a:
"Yes. Our fleet is suitable for wedding guest transportation, corporate outings, events and group movements."
}


];




export default function TempoUrbaniaFAQ(){



return (

<section className="py-24">


<div className="
mx-auto
max-w-4xl
px-6
">


<p className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
text-center
">

Frequently Asked Questions

</p>



<h2 className="
mt-4
text-center
text-4xl
font-bold
text-white
">

Tempo Traveller & Urbania Rental FAQs

</h2>





<Accordion

type="single"

collapsible

className="mt-10"

>


{
faqs.map((faq,index)=>(


<AccordionItem

key={index}

value={`item-${index}`}

className="
border-[#252525]
"

>


<AccordionTrigger

className="
text-white
text-left
"

>

{faq.q}

</AccordionTrigger>



<AccordionContent

className="
text-[#8a8a8a]
leading-7
"

>

{faq.a}

</AccordionContent>



</AccordionItem>


))

}



</Accordion>



</div>


</section>


)

}