"use client";


import {
  MapPinned,
  Clock,
  Route,
  Sparkles
} from "lucide-react";



const packages = [

{
 title:"Local City Rental",

 subtitle:"Amritsar Local Travel",

 icon:<Clock size={22}/>,

 details:[
  "8 Hours / 80 KM Package",
  "Airport Transfers",
  "Hotel Pickup & Drop",
  "Professional Chauffeur"
 ]

},



{
 title:"Outstation Tours",

 subtitle:"Punjab & Himachal Trips",

 icon:<Route size={22}/>,

 details:[
  "Multi Day Packages",
  "Comfortable Long Distance Travel",
  "Flexible Itinerary",
  "Experienced Drivers"
 ]

},



{
 title:"Wedding & Events",

 subtitle:"Premium Guest Transport",

 icon:<Sparkles size={22}/>,

 details:[
  "Luxury Urbania Fleet",
  "Bride & Groom Transport",
  "Guest Movement",
  "Event Coordination"
 ]

},



{
 title:"Popular Routes",

 subtitle:"Tourist Destinations",

 icon:<MapPinned size={22}/>,

 details:[
  "Amritsar → Dharamshala",
  "Amritsar → Dalhousie",
  "Amritsar → Manali",
  "Punjab → Kashmir"
 ]

}

];




export default function TempoPackages(){



return (

<section className="py-24">


<div className="mx-auto max-w-7xl px-6">





<div className="text-center mb-14">


<p

className="
uppercase
tracking-[0.3em]
text-[#ecb100]
"

>

Travel Solutions

</p>



<h2

className="
mt-4
text-4xl
font-bold
text-white
"

>

Perfect Vehicle For Every Journey

</h2>



<p

className="
mt-4
text-[#8a8a8a]
"

>

From local travel to luxury outstation tours, choose the right traveller package.

</p>



</div>









<div

className="
grid
gap-8
md:grid-cols-2
lg:grid-cols-4
"

>



{

packages.map((item)=>(


<div

key={item.title}

className="
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-6
transition
hover:border-[#ecb100]
"

>


<div

className="
flex
h-12
w-12
items-center
justify-center
rounded-xl
bg-black
text-[#ecb100]
"

>

{item.icon}

</div>





<h3

className="
mt-6
text-xl
font-bold
text-white
"

>

{item.title}

</h3>





<p

className="
mt-2
text-sm
text-[#8a8a8a]
"

>

{item.subtitle}

</p>







<ul

className="
mt-5
space-y-3
"

>


{

item.details.map(detail=>(


<li

key={detail}

className="
text-sm
text-[#c7c7c7]
flex
gap-2
"

>

<span className="text-[#ecb100]">
✓
</span>


{detail}


</li>


))

}


</ul>





</div>


))

}


</div>



</div>


</section>


)

}