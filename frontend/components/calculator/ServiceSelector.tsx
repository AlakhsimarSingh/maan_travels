"use client";


const services=[

{
id:"taxi",
name:"Taxi / Cab"
},

{
id:"group",
name:"Tempo Traveller / Urbania"
},

{
id:"luxury",
name:"Luxury Cars"
}


];



export default function ServiceSelector({
selected,
setSelected
}:{
selected:string;
setSelected:(value:string)=>void;
}){


return (

<div className="
grid
gap-4
md:grid-cols-3
">


{
services.map(service=>(


<button

key={service.id}

onClick={()=>setSelected(service.id)}

className={`
rounded-2xl
border
p-5
transition

${
selected===service.id

?
"border-[#ecb100] bg-[#ecb100]/10"

:

"border-[#252525] bg-[#141414]"
}

`}

>


<p className="
text-white
font-semibold
">

{service.name}

</p>


</button>


))

}


</div>

)

}