import PageHero from "@/components/shared/PageHero";
import PackageCard from "@/components/packages/PackageCard";

import { tourPackages } from "@/src/data/packages";



export const metadata = {

title:
"Tour Packages | Maan Travels",

description:
"Explore Amritsar, Himachal and Kashmir tour packages with Maan Travels."

};



export default function PackagesPage(){


return (

<>


<PageHero

title="Tour Packages"

description="
Explore our carefully planned Punjab, Himachal and Kashmir holiday packages.
"

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



<div
className="
grid
gap-8
md:grid-cols-2
lg:grid-cols-3
"
>


{
tourPackages.map((pkg)=>(

<PackageCard

key={pkg.slug}

pkg={pkg}

/>

))
}



</div>


</div>


</section>



</>

);

}