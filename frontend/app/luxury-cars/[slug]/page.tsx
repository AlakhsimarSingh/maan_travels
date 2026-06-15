import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Crown, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

import { luxuryCars } from "@/src/data/luxuryCars";



type Props = {
  params: Promise<{
    slug:string;
  }>;
};




export default async function LuxuryCarDetailsPage({
  params
}:Props){


const {slug}=await params;



const car =
luxuryCars.find(
 item=>item.slug===slug
);



if(!car){
 notFound();
}





return (


<main
className="
pt-20
pb-24
"
>




{/* HERO */}


<section

className="
relative

h-[75vh]

overflow-hidden

"

>


<Image

src={car.image}

alt={`${car.name} luxury car rental Punjab`}

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

font-bold

text-white

md:text-7xl

"

>

{car.name}

</h1>





<p

className="
mt-5

max-w-3xl

text-lg

text-[#c7c7c7]

"

>

{car.description}

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




{/* DETAILS */}


<div

className="
lg:col-span-2
"

>


<h2

className="
text-3xl

font-bold

text-white

"

>

Experience Premium Travel With {car.name}

</h2>




<p

className="
mt-5

leading-relaxed

text-[#8a8a8a]

"

>

Maan Travels provides premium luxury car rental services
with professional chauffeur support. Whether you need a
luxury vehicle for weddings, corporate travel, airport
transfers or special occasions, our fleet ensures comfort,
style and reliability.

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
car.features.map(feature=>(


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

className="
text-[#ecb100]
"

/>


{feature}


</div>


))

}


</div>



</div>









{/* BOOKING CARD */}


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

Book {car.name}

</h3>





<p

className="
mt-3

text-[#8a8a8a]

"

>

Premium chauffeur driven luxury experience.

</p>





<Button

asChild

className="
mt-8

w-full

bg-[#ecb100]

text-black

hover:bg-[#f6c94c]

"

>


<Link

href={`/luxury-booking/${car.slug}`}

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









export async function generateStaticParams(){


return luxuryCars.map(car=>({

slug:car.slug

}));


}







export async function generateMetadata({
params
}:Props){


const {slug}=await params;



const car =
luxuryCars.find(
item=>item.slug===slug
);



if(!car){
return {};
}



return {

title:
`${car.name} Rental Punjab | Luxury Car Hire | Maan Travels`,

description:
`Book ${car.name} luxury car rental in Punjab with Maan Travels. Premium chauffeur driven service for weddings, VIP travel and special events.`

};


}