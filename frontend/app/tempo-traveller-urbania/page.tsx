import Image from "next/image";

import TempoUrbaniaFleet 
from "@/components/tempo/TempoUrbaniaFleet";
import TempoPackages 
from "@/components/tempo/TempoPackages";
import TempoUrbaniaSEO 
from "@/components/tempo/TempoUrbaniaSEO";

import TempoUrbaniaFAQ 
from "@/components/tempo/TempoUrbaniaFAQ";
export const metadata = {

title:
"Tempo Traveller & Urbania Rental Punjab | Maan Travels",

description:
"Book premium Tempo Traveller and Force Urbania rentals in Punjab for family trips, weddings, corporate tours and group travel with professional chauffeurs."

};



export default function Page(){


return (

<main className="pt-20">


<section

className="
relative
h-[70vh]
overflow-hidden
"

>


<Image

src="/images/tempo/hero.jpg"

alt="Tempo Traveller and Urbania Rental"

fill

priority

className="object-cover"

/>


<div className="
absolute
inset-0
bg-black/70
"/>



<div className="
relative
z-10
flex
h-full
items-end
mx-auto
max-w-7xl
px-6
pb-20
">


<div>


<p className="
uppercase
tracking-[0.3em]
text-[#ecb100]
">
Premium Group Transportation
</p>


<h1 className="
mt-5
text-5xl
font-bold
text-white
md:text-6xl
">

Tempo Traveller & Force Urbania Rental in Punjab

</h1>


<p className="
mt-5
max-w-2xl
text-lg
text-[#c7c7c7]
">

Hire luxury AC Tempo Traveller and Force Urbania vehicles in Punjab for family tours, weddings, corporate travel, airport transfers and Himachal group journeys with professional chauffeurs.

</p>


</div>


</div>


</section>



<TempoUrbaniaFleet />

<TempoPackages />

<TempoUrbaniaSEO />

<TempoUrbaniaFAQ />


</main>

)

}