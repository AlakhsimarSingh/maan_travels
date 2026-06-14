import {
  Plane,
  ShieldCheck,
  Clock3,
  CarFront,
  Headphones,
  BadgeCheck,
} from "lucide-react";


const benefits = [
  {
    title: "Flight Monitoring",
    description:
      "We track flight timings and adjust pickups according to delays.",
    icon: Plane,
  },

  {
    title: "Professional Chauffeurs",
    description:
      "Experienced drivers focused on safety, comfort and punctuality.",
    icon: ShieldCheck,
  },

  {
    title: "24/7 Availability",
    description:
      "Airport transfers available anytime with dedicated support.",
    icon: Clock3,
  },

  {
    title: "Premium Vehicles",
    description:
      "Well-maintained cars designed for comfortable journeys.",
    icon: CarFront,
  },

  {
    title: "Customer Support",
    description:
      "Our team assists you before and during your journey.",
    icon: Headphones,
  },

  {
    title: "Reliable Service",
    description:
      "Trusted travel solutions across Punjab and North India.",
    icon: BadgeCheck,
  },
];


export default function AirportBenefits() {

return (

<section className="py-24">

<div className="mx-auto max-w-7xl px-6">


<div className="mb-14 text-center">


<p
className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
"
>
Why Choose Us
</p>


<h2
className="
mt-3
text-4xl
font-bold
text-white
"
>
A Better Airport Transfer Experience
</h2>


<p
className="
mx-auto
mt-4
max-w-2xl
text-[#8a8a8a]
"
>
Comfortable vehicles, professional chauffeurs and reliable service
for every airport journey.
</p>


</div>



<div
className="
grid
gap-8
md:grid-cols-2
lg:grid-cols-3
"
>


{
benefits.map((item)=>{

const Icon=item.icon;


return (

<div
key={item.title}
className="
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-8
transition-all
duration-300
hover:border-[#ecb100]
hover:-translate-y-1
"
>

<div
className="
mb-6
flex
h-14
w-14
items-center
justify-center
rounded-2xl
bg-[#1b1b1b]
text-[#ecb100]
"
>

<Icon size={28}/>

</div>


<h3
className="
mb-3
text-xl
font-semibold
text-white
"
>
{item.title}
</h3>


<p className="text-[#8a8a8a]">
{item.description}
</p>


</div>

)

})
}


</div>


</div>

</section>

);

}