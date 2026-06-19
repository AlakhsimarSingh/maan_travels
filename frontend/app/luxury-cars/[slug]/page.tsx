import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Crown, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

import { getLuxuryCarBySlug } from "@/src/services/luxuryCarPublicService";


type Props = {
params:{
slug:string;
};
};



export default async function LuxuryCarDetailsPage({
params
}:Props){

const { slug } = await params;
const car =
await getLuxuryCarBySlug(
slug
);



if(!car?.success){

notFound();

}


const luxuryCar =
car.car;



return (

<main className="pt-20 pb-24">



<section
className="
relative
h-[75vh]
overflow-hidden
"
>


<Image

src={luxuryCar.image}

alt={luxuryCar.name}

fill

priority

className="object-cover"

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
max-w-7xl
h-full
flex
items-end
px-6
pb-16
"
>


<div>


<p
className="
flex
items-center
gap-2
uppercase
tracking-[0.35em]
text-[#ecb100]
"
>

<Crown size={16}/>

Luxury Fleet

</p>



<h1
className="
mt-5
text-5xl
md:text-7xl
font-bold
text-white
"
>

{luxuryCar.name}

</h1>



<p
className="
mt-5
max-w-3xl
text-lg
text-[#c7c7c7]
"
>

{luxuryCar.description}

</p>


</div>


</div>


</section>





<section
className="
mx-auto
max-w-7xl
px-6
py-16
"
>


<div
className="
grid
gap-12
lg:grid-cols-3
"
>



<div className="lg:col-span-2">


<h2
className="
text-3xl
font-bold
text-white
"
>

Experience Premium Travel With {luxuryCar.name}

</h2>



<p
className="
mt-5
leading-relaxed
text-[#8a8a8a]
"
>

Maan Travels provides premium luxury car rental
services with professional chauffeur support.
Perfect for weddings, corporate travel,
airport transfers and special occasions.

</p>




<h3
className="
mt-12
text-2xl
font-bold
text-white
"
>

Features

</h3>



<div
className="
mt-6
grid
gap-4
md:grid-cols-2
"
>


{
luxuryCar.features.map(
(feature:string)=>(

<div
key={feature}
className="
flex
items-center
gap-3
rounded-xl
border
border-[#252525]
bg-[#141414]
p-4
text-[#c7c7c7]
"
>

<Check
size={18}
className="text-[#ecb100]"
/>


{feature}


</div>


))
}


</div>


</div>







<aside>


<div
className="
sticky
top-28
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-8
"
>


<p
className="
uppercase
tracking-[0.25em]
text-sm
text-[#ecb100]
"
>

Reserve Vehicle

</p>



<h3
className="
mt-4
text-2xl
font-bold
text-white
"
>

Book {luxuryCar.name}

</h3>



<Button
asChild
className="
mt-8
w-full
bg-[#ecb100]
text-black
"
>

<Link
href={`/luxury-booking/${luxuryCar.slug}`}
>

Book This Car

</Link>


</Button>


</div>


</aside>




</div>


</section>


</main>


)

}