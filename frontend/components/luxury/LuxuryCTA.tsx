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

bg-[#141414]

p-10

md:p-16

"

>


<div

className="
absolute

inset-0

bg-gradient-to-r

from-[#ecb100]/10

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

text-[#8a8a8a]

"

>

Book luxury cars for weddings, corporate events,
airport transfers and VIP travel across Punjab.

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
border-[#252525]

text-white

hover:border-[#ecb100]

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