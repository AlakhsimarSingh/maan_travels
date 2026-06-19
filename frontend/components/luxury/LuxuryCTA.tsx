import Link from "next/link";

import { Button } from "@/components/ui/button";


export default function LuxuryCTA(){


return (

<section

className="
py-24
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
relative
overflow-hidden
rounded-3xl
border
border-[#252525]
bg-[#1a1a1a]
p-10
md:p-16
"

>



<div

className="
absolute
inset-0
bg-gradient-to-br
from-white/[0.04]
via-transparent
to-transparent
"

/>






<div

className="
relative
z-10
"

>


<p

className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
"

>

Premium Reservations

</p>






<h2

className="
mt-5
max-w-3xl
text-4xl
font-bold
text-white
md:text-5xl
"

>

Arrive In Style With Maan Travels Luxury Fleet

</h2>







<p

className="
mt-5
max-w-2xl
text-[#9a9a9a]
leading-7
"

>

Book luxury cars for weddings, corporate events,
airport transfers and VIP travel across Punjab with
professional chauffeurs and premium vehicles.

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
"

>

<Link href="/contact">

Contact Us

</Link>


</Button>








<Button

asChild

variant="outline"

className="
border-[#3a3a3a]
bg-transparent
text-white
hover:border-[#ecb100]
hover:text-[#ecb100]
"

>

<Link href="/luxury-cars">

Explore Fleet

</Link>


</Button>




</div>



</div>


</div>


</div>


</section>

)

}