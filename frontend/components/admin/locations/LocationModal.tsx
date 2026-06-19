"use client";


import { useEffect, useState } from "react";

import {
 createLocation,
 updateLocation
} from "@/src/services/locationService";


import { Button } from "@/components/ui/button";



export default function LocationModal({

open,

onClose,

onSuccess,

initialData

}:any){



const isEdit = !!initialData;



const [form,setForm] = useState({

name:"",

canPickup:false,

canDrop:false,

active:true

});




useEffect(()=>{


if(initialData){


setForm({

name:
initialData.name || "",


canPickup:
initialData.canPickup ?? false,


canDrop:
initialData.canDrop ?? false,


active:
initialData.active ?? true


});


}

else{


setForm({

name:"",

canPickup:false,

canDrop:false,

active:true

});


}


},[initialData,open]);






if(!open)
return null;






const handleSubmit = async()=>{


if(!form.name.trim()){

alert("Location name required");

return;

}



if(
!form.canPickup &&
!form.canDrop
){

alert(
"Select pickup or destination"
);

return;

}




if(isEdit){


await updateLocation(

initialData.id,

form

);


}

else{


await createLocation(form);


}



onSuccess();

onClose();


};







return (

<div
className="
fixed
inset-0
bg-black/70
flex
items-center
justify-center
z-50
"
>


<div
className="
w-[450px]
bg-[#141414]
border
border-[#252525]
rounded-2xl
p-6
"
>



<h2
className="
text-white
text-xl
font-bold
mb-5
"
>

{
isEdit
?
"Edit Location"
:
"Add Tour Location"
}

</h2>






<input

placeholder="Location Name"

value={form.name}

onChange={(e)=>

setForm({

...form,

name:e.target.value

})

}

className="
w-full
mb-4
p-3
rounded-xl
bg-black
border
border-[#252525]
text-white
"

/>







<div
className="
space-y-3
mb-5
"
>


<label
className="
flex
items-center
gap-3
text-white
"
>


<input

type="checkbox"

checked={form.canPickup}

onChange={(e)=>

setForm({

...form,

canPickup:e.target.checked

})

}

/>


Available as Pickup


</label>







<label
className="
flex
items-center
gap-3
text-white
"
>


<input

type="checkbox"

checked={form.canDrop}

onChange={(e)=>

setForm({

...form,

canDrop:e.target.checked

})

}

/>


Available as Destination


</label>







<label
className="
flex
items-center
gap-3
text-white
"
>


<input

type="checkbox"

checked={form.active}

onChange={(e)=>

setForm({

...form,

active:e.target.checked

})

}

/>


Active


</label>



</div>









<div
className="
flex
justify-end
gap-3
"
>


<Button

variant="outline"

onClick={onClose}

>

Cancel

</Button>





<Button

className="
bg-[#ecb100]
text-black
"

onClick={handleSubmit}

>

Save

</Button>



</div>







</div>


</div>


);


}