import {
  ShieldCheck,
  Users,
  Map,
  Car
} from "lucide-react";


const features = [

{
icon:<Car size={22}/>,
title:"Premium Tempo Traveller & Urbania Fleet",
text:
"Choose from luxury AC Tempo Traveller and Force Urbania vehicles designed for comfortable group travel."
},


{
icon:<Map size={22}/>,
title:"Punjab & Himachal Tour Specialists",
text:
"Perfect vehicles for Amritsar, Dalhousie, Dharamshala, Manali and Kashmir group journeys."
},


{
icon:<Users size={22}/>,
title:"Perfect For Every Group",
text:
"Ideal for family vacations, weddings, corporate tours, religious trips and airport transfers."
},


{
icon:<ShieldCheck size={22}/>,
title:"Professional Chauffeurs",
text:
"Experienced drivers ensure a safe, comfortable and premium travel experience."
}

];



export default function TempoUrbaniaSEO(){


return (

<section className="py-24">


<div className="mx-auto max-w-7xl px-6">



<div className="max-w-4xl">


<p className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
">

Tempo Traveller Rental Punjab

</p>



<h2 className="
mt-4
text-4xl
font-bold
text-white
">

Luxury Tempo Traveller & Force Urbania Rental Services

</h2>



<p className="
mt-6
leading-8
text-[#8a8a8a]
">

Maan Travels provides premium Tempo Traveller and Force Urbania rental services in Punjab for comfortable group transportation. Whether you are planning a family holiday, wedding event, corporate trip or a Himachal tour, our luxury AC travellers offer spacious interiors, professional chauffeurs and reliable service.

</p>



<p className="
mt-4
leading-8
text-[#8a8a8a]
">

Our fleet is suitable for destinations including Amritsar, Dalhousie, Dharamshala, Manali, Shimla and Kashmir. Travel together with your group while enjoying premium comfort and hassle-free journeys.

</p>


</div>





<div className="
mt-12
grid
gap-6
md:grid-cols-2
lg:grid-cols-4
">


{
features.map(item=>(


<div

key={item.title}

className="
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-6
"

>


<div className="
flex
h-12
w-12
items-center
justify-center
rounded-xl
bg-black
text-[#ecb100]
">

{item.icon}

</div>



<h3 className="
mt-5
font-semibold
text-white
">

{item.title}

</h3>



<p className="
mt-3
text-sm
leading-6
text-[#8a8a8a]
">

{item.text}

</p>



</div>


))

}



</div>




</div>


</section>


)

}