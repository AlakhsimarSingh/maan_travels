import { notFound } from "next/navigation";

import { weddingCars } from "@/src/data/weddingCars";

import WeddingBookingForm from "@/components/wedding/WeddingBookingForm";



type Props = {
  params: Promise<{
    slug:string;
  }>;
};




export default async function WeddingBookingPage({
  params
}:Props){


const {slug}=await params;



const car =
weddingCars.find(
item=>item.slug===slug
);



if(!car){

notFound();

}




return (

<main className="pt-28 pb-24">


<section

className="
mx-auto
max-w-7xl
px-6
"

>


<div

className="
grid
gap-10
lg:grid-cols-3
"

>



{/* CAR SUMMARY */}


<aside

className="
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-8
h-fit
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

Selected Wedding Car

</p>



<h1

className="
mt-4
text-3xl
font-bold
text-white
"

>

{car.name}

</h1>



<p

className="
mt-3
text-[#8a8a8a]
"

>

{car.category}

</p>




<div

className="
mt-8
space-y-3
"

>


<div

className="
rounded-xl
border
border-[#252525]
bg-black/30
p-4
"

>

<p className="text-xs uppercase text-[#8a8a8a]">
Vehicle Type
</p>


<p className="mt-1 text-white">
Wedding Luxury Car
</p>


</div>





<div

className="
rounded-xl
border
border-[#252525]
bg-black/30
p-4
"

>

<p className="text-xs uppercase text-[#8a8a8a]">
Experience
</p>


<p className="mt-1 text-white">
Chauffeur Driven
</p>


</div>



</div>



</aside>







{/* FORM */}


<div

className="
lg:col-span-2
"

>


<WeddingBookingForm

car={car}

/>


</div>




</div>


</section>


</main>


)

}






export async function generateMetadata({
params
}:Props){


const {slug}=await params;


const car =
weddingCars.find(
item=>item.slug===slug
);



if(!car){

return {};

}



return {

title:`${car.name} Wedding Car Rental | Maan Travels`,

description:
`Book ${car.name} for weddings with premium chauffeur service.`

};


}