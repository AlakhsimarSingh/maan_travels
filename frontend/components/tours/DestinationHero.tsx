"use client";


import Image from "next/image";



export default function DestinationHero({
destination,
data
}:{
destination:string;
data:any;
}){



return (

<section

className="
relative
h-[65vh]
overflow-hidden
"

>


<Image

src={data.image}

alt={
destination
?
`${destination} tour package`
:
"Punjab tour packages"
}

fill

priority

className="
object-cover
transition-all
duration-700
"

/>



<div

className="
absolute
inset-0
bg-black/65
"

/>





<div

className="
relative
z-10
flex
h-full
items-end
mx-auto
max-w-7xl
px-6
pb-28
"

>


<div>


<p

className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
"

>

Premium Travel Experiences

</p>





<h1

className="
mt-5
text-5xl
font-bold
text-white
md:text-6xl
"

>


{

destination

?

`${destination} Tour Package`

:

"Explore Incredible Destinations"

}



</h1>





<p

className="
mt-5
max-w-2xl
text-lg
text-[#c7c7c7]
"

>


{

data.description

}



</p>



</div>



</div>



</section>


)

}