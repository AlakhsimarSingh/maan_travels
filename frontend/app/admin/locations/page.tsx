"use client";


import { useEffect,useState } from "react";


import LocationModal from "@/components/admin/locations/LocationModal";


import {

getAllLocations,

deleteLocation

} from "@/src/services/locationService";



import { Button } from "@/components/ui/button";





export default function LocationsPage(){



const [locations,setLocations]=useState<any[]>([]);

const [loading,setLoading]=useState(true);

const [open,setOpen]=useState(false);

const [editLocation,setEditLocation]=useState<any>(null);






const fetchLocations=async()=>{


try{


setLoading(true);


const res =
await getAllLocations();



if(res.success){

setLocations(
res.locations
);

}

else{

setLocations([]);

}



}

catch(error){

console.error(error);

}

finally{

setLoading(false);

}


};






useEffect(()=>{

fetchLocations();

},[]);








const handleDelete=async(id:string)=>{


const ok =
confirm(
"Delete this location?"
);


if(!ok)
return;



await deleteLocation(id);


fetchLocations();


};









return (

<div className="space-y-6">





<div
className="
flex
justify-between
items-center
"
>


<div>


<h2
className="
text-3xl
font-bold
text-white
"
>

Tour Locations

</h2>


<p
className="
text-[#8a8a8a]
mt-1
"
>

Manage pickup and destination locations

</p>


</div>





<Button

className="
bg-[#ecb100]
text-black
"

onClick={()=>{

setEditLocation(null);

setOpen(true);

}}

>

Add Location

</Button>





</div>









<div
className="
rounded-2xl
border
border-[#252525]
bg-[#141414]
overflow-hidden
"
>


<table
className="
w-full
text-white
"
>


<thead
className="
bg-[#111]
text-[#8a8a8a]
"
>


<tr>


<th className="p-4 text-left">
Location
</th>


<th>
Pickup
</th>


<th>
Destination
</th>


<th>
Status
</th>


<th className="text-right p-4">
Actions
</th>


</tr>


</thead>







<tbody>


{

loading ?


<tr>

<td
colSpan={5}
className="p-6 text-center"
>

Loading...

</td>

</tr>



:


locations.map((loc)=>(



<tr

key={loc.id}

className="
border-t
border-[#252525]
hover:bg-[#1b1b1b]
"

>


<td className="p-4 font-medium">

{loc.name}

</td>





<td>

{
loc.canPickup
?
<span className="text-green-400">
YES
</span>
:
<span className="text-red-400">
NO
</span>
}

</td>





<td>

{
loc.canDrop
?
<span className="text-green-400">
YES
</span>
:
<span className="text-red-400">
NO
</span>
}

</td>






<td>

<span
className={`
px-3
py-1
rounded-full
text-xs

${
loc.active
?
"bg-green-500/10 text-green-400"
:
"bg-red-500/10 text-red-400"
}

`}
>

{
loc.active
?
"Active"
:
"Inactive"
}

</span>

</td>






<td
className="
text-right
p-4
space-x-4
"
>


<button

onClick={()=>{

setEditLocation(loc);

setOpen(true);

}}

className="
text-[#ecb100]
hover:underline
"

>

Edit

</button>





<button

onClick={()=>handleDelete(loc.id)}

className="
text-red-400
hover:text-red-500
"

>

Delete

</button>



</td>






</tr>


))


}




</tbody>


</table>


</div>









<LocationModal

open={open}

initialData={editLocation}

onClose={()=>setOpen(false)}

onSuccess={fetchLocations}

/>





</div>


);


}