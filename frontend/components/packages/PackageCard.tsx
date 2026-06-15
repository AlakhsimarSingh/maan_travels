import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";


type Props = {
  pkg: {
    slug: string;
    title: string;
    shortDescription: string;
    duration: string;
    location: string;
    image: string;
    highlights: string[];
  };
};



export default function PackageCard({
  pkg,
}: Props) {


return (

<div
className="
group
overflow-hidden
rounded-3xl
border
border-[#252525]
bg-[#141414]
transition-all
duration-300
hover:-translate-y-2
hover:shadow-[0_0_40px_rgba(236,177,0,0.12)]
"
>


{/* IMAGE */}

<div
className="
relative
h-64
"
>

<Image

src={pkg.image}

alt={pkg.title}

fill

className="
object-cover
transition-transform
duration-500
group-hover:scale-105
"

/>


<div
className="
absolute
inset-0
bg-gradient-to-t
from-black
via-black/20
to-transparent
"
/>


</div>




<div
className="
p-6
"
>


<h3
className="
text-2xl
font-bold
text-white
"
>

{pkg.title}

</h3>



<div
className="
mt-4
flex
flex-col
gap-2
text-sm
text-[#8a8a8a]
"
>


<div
className="
flex
items-center
gap-2
"
>

<CalendarDays
size={16}
className="text-[#ecb100]"
/>

{pkg.duration}

</div>



<div
className="
flex
items-center
gap-2
"
>

<MapPin
size={16}
className="text-[#ecb100]"
/>

{pkg.location}

</div>



</div>




<p
className="
mt-5
line-clamp-3
text-[#c7c7c7]
"
>

{pkg.shortDescription}

</p>




<div
className="
mt-5
flex
flex-wrap
gap-2
"
>

{
pkg.highlights
.slice(0,3)
.map((item)=>(

<span

key={item}

className="
rounded-full
border
border-[#252525]
bg-black/40
px-3
py-1
text-xs
text-[#c7c7c7]
"

>

{item}

</span>

))
}


</div>




<Link
href={`/packages/${pkg.slug}`}
>

<Button

className="
mt-8
w-full
bg-[#ecb100]
text-black
hover:bg-[#f6c94c]
"

>

View Details

</Button>


</Link>



</div>


</div>


);

}