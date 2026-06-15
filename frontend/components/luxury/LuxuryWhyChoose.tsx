import {
  ShieldCheck,
  Crown,
  UserRound,
  Sparkles,
  Clock,
  MapPinned
} from "lucide-react";


const reasons = [
  {
    icon:<Crown size={26}/>,
    title:"Premium Luxury Fleet",
    description:
      "Choose from Mercedes Maybach, G-Wagon, Range Rover, Defender and other premium vehicles."
  },

  {
    icon:<UserRound size={26}/>,
    title:"Professional Chauffeurs",
    description:
      "Experienced and well-trained drivers ensuring a safe and comfortable journey."
  },

  {
    icon:<Sparkles size={26}/>,
    title:"Perfect For Special Events",
    description:
      "Luxury cars for weddings, corporate events, VIP movement and celebrations."
  },

  {
    icon:<Clock size={26}/>,
    title:"Flexible Rental Options",
    description:
      "Hourly, daily and customized luxury travel packages available."
  },

  {
    icon:<MapPinned size={26}/>,
    title:"Punjab Wide Service",
    description:
      "Premium car rental services available across Jalandhar, Amritsar, Ludhiana and nearby regions."
  },

  {
    icon:<ShieldCheck size={26}/>,
    title:"Reliable Experience",
    description:
      "Well-maintained vehicles with professional service standards."
  }
];



export default function LuxuryWhyChoose(){


return (

<section
className="
py-24
bg-[#0b0b0b]
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
Why Choose Us
</p>


<h2
className="
mt-4
text-4xl
font-bold
text-white
"
>
Luxury Travel Beyond Ordinary
</h2>


<p
className="
mt-5
mx-auto
max-w-2xl
text-[#8a8a8a]
"
>
Experience premium mobility with elegant vehicles,
professional service and unmatched comfort.
</p>


</div>





<div
className="
grid
gap-6
md:grid-cols-2
lg:grid-cols-3
"
>


{
reasons.map(item=>(

<div

key={item.title}

className="
rounded-3xl

border

border-[#252525]

bg-[#141414]

p-7

transition

duration-300

hover:border-[#ecb100]

"

>


<div

className="
text-[#ecb100]
"

>

{item.icon}

</div>



<h3

className="
mt-5
text-xl
font-semibold
text-white
"

>

{item.title}

</h3>



<p

className="
mt-3
text-sm
leading-relaxed
text-[#8a8a8a]
"

>

{item.description}

</p>


</div>


))

}


</div>


</div>


</section>

)

}