import Image from "next/image";


export default function LuxuryHero(){

return (

<section
className="
relative
h-[85vh]
overflow-hidden
"
>


<Image

src="/images/luxury/hero.jpg"

alt="Luxury Car Rental Punjab"

fill

priority

className="
object-cover
"

/>


<div
className="
absolute
inset-0
bg-black/70
"
/>



<div
className="
relative
z-10
mx-auto
flex
h-full
max-w-7xl
items-center
px-6
"
>


<div>


<p
className="
uppercase
tracking-[0.4em]
text-[#ecb100]
"
>
Premium Mobility
</p>


<h1
className="
mt-5
max-w-4xl
text-5xl
font-bold
text-white
md:text-7xl
"
>
Luxury Car Rental
Experience in Punjab
</h1>


<p
className="
mt-6
max-w-2xl
text-lg
text-[#c7c7c7]
"
>
Arrive in style with our exclusive fleet of luxury cars including Mercedes Maybach, G-Wagon, Range Rover and premium SUVs.
</p>


</div>


</div>


</section>

)

}