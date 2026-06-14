"use client";

import { useState } from "react";
import { Star } from "lucide-react";


type StarRatingProps = {
  value:number;
  onChange:(value:number)=>void;
};


export default function StarRating({
  value,
  onChange
}:StarRatingProps){


return (

<div className="flex gap-2">

{
[1,2,3,4,5].map((star)=>(

<button
key={star}
type="button"
onClick={()=>onChange(star)}
>

<Star
className={`
h-7
w-7
transition

${
star <= value
?
"fill-[#ecb100] text-[#ecb100]"
:
"text-[#555]"
}

hover:text-[#ecb100]
`}
/>

</button>

))
}

</div>

);

}