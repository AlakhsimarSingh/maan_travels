import { notFound } from "next/navigation";

import { tourPackages } from "@/src/data/packages";

import PageHero from "@/components/shared/PageHero";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

import PackageBookingForm from "@/components/packages/PackageBookingForm";



type Props = {

params: Promise<{
slug:string;
}>;

};



export async function generateMetadata({
params,
}:Props){


const {slug}=await params;


const pkg =
tourPackages.find(
(item)=>item.slug===slug
);



if(!pkg)
return {};



return {

title:`${pkg.title} | Maan Travels`,

description:
pkg.shortDescription,

};

}





export default async function PackagePage({
params,
}:Props){


const {slug}=await params;



const pkg =
tourPackages.find(
(item)=>item.slug===slug
);



if(!pkg)
notFound();



return (

<>


<PageHero

title={pkg.title}

description={pkg.shortDescription}

/>




<section
className="
py-20
"
>


<div
className="
mx-auto
max-w-7xl
px-6
"
>



<Breadcrumbs

items={[
{
label:"Home",
href:"/"
},

{
label:"Packages",
href:"/packages"
},

{
label:pkg.title
}

]}

/>





<div
className="
grid
gap-12
lg:grid-cols-3
"
>



{/* MAIN CONTENT */}

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
Overview
</h2>



<p
className="
mt-4
text-[#c7c7c7]
leading-relaxed
"
>

{pkg.shortDescription}

</p>





<h2
className="
mt-12
text-3xl
font-bold
text-white
"
>
Highlights
</h2>




<div
className="
mt-6
flex
flex-wrap
gap-3
"
>

{
pkg.highlights.map((item)=>(

<span
key={item}
className="
rounded-full
border
border-[#252525]
bg-black/30
px-4
py-2
text-sm
text-[#c7c7c7]
"
>

{item}

</span>

))
}


</div>






<h2
className="
mt-14
text-3xl
font-bold
text-white
"
>
Itinerary
</h2>





<div
className="
mt-8
space-y-8
"
>


{
pkg.itinerary.map((day)=>(


<div

key={day.day}

className="
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-6
"

>


<h3
className="
text-xl
font-bold
text-[#ecb100]
"
>

{day.day}

</h3>


<h4
className="
mt-2
text-xl
font-semibold
text-white
"
>

{day.title}

</h4>


<p
className="
mt-3
text-[#8a8a8a]
"
>

{day.description}

</p>



<ul
className="
mt-5
space-y-2
text-[#c7c7c7]
"
>

{
day.places.map((place)=>(

<li key={place}>
→ {place}
</li>

))
}

</ul>



</div>


))
}



</div>



</div>





{/* SIDEBAR */}

<aside>


<div
className="
sticky
top-28
rounded-3xl
border
border-[#252525]
bg-[#141414]
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
Pricing
</h3>



<div
className="
mt-6
space-y-4
"
>

{
pkg.pricing.map((price)=>(

<div

key={price.vehicle}

className="
flex
justify-between
text-sm
"

>


<span className="text-[#c7c7c7]">
{price.vehicle}
</span>


<span
className="
font-semibold
text-[#ecb100]
"
>
₹{price.price.toLocaleString()}
</span>


</div>


))
}


</div>


<button

onClick={()=>{

document
.getElementById("booking")
?.scrollIntoView({
behavior:"smooth"
});

}}

className="
mt-8
w-full
rounded-xl
bg-[#ecb100]
py-3
font-semibold
text-black
hover:bg-[#f6c94c]
"

>

Book This Tour

</button>


</div>


</aside>



</div>





<div id="booking">

<PackageBookingForm

pkg={pkg}

onClose={()=>{}}

/>

</div>




</div>

</section>



</>

);

}