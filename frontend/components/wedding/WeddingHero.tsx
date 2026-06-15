import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";


export default function WeddingHero(){

return (

<section
className="
relative
h-[75vh]
overflow-hidden
"
>


<Image

src="/images/wedding/hero.jpg"

alt="Luxury Wedding Cars Rental Punjab"

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
items-end
px-6
pb-20
"

>


<div className="max-w-3xl">


<p

className="
uppercase
tracking-[0.35em]
text-sm
text-[#ecb100]
"

>

Royal Wedding Transport

</p>





<h1

className="
mt-5
text-5xl
font-bold
leading-tight
text-white
md:text-6xl
"

>

Luxury Wedding Car Rental Punjab

</h1>






<p

className="
mt-6
text-lg
leading-8
text-[#c7c7c7]
"

>

Create a grand wedding entrance with premium luxury cars including Mercedes Maybach, G-Wagon, Range Rover, Jaguar and chauffeur-driven wedding vehicles across Punjab.

</p>







<div

className="
mt-8
flex
flex-wrap
gap-4
"

>


<Button

asChild

className="
bg-[#ecb100]
text-black
hover:bg-[#f6c94c]
px-8
py-6
"

>

<Link href="#fleet">

View Wedding Cars

</Link>

</Button>





<Button

asChild

variant="outline"

className="
border-[#ecb100]
text-[#ecb100]
hover:bg-[#ecb100]
hover:text-black
px-8
py-6
"

>

<Link href="/contact">

Get Quote

</Link>

</Button>



</div>




</div>



</div>



</section>


)

}