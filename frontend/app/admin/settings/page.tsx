"use client";


import {
useEffect,
useState
} from "react";


import FingerprintJS from "@fingerprintjs/fingerprintjs";


import {
getAdminDevices,
registerAdminDevice,
toggleAdminDevice,
deleteAdminDevice
}
from "@/src/services/adminDeviceService";


import {Button} from "@/components/ui/button";





export default function AdminSettingsPage(){



const [devices,setDevices]=useState<any[]>([]);

const [loading,setLoading]=useState(true);

const [registering,setRegistering]=useState(false);






const fetchDevices=async()=>{


try{


setLoading(true);


const res =
await getAdminDevices();



if(res.success){

setDevices(
res.devices
);

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

fetchDevices();

},[]);









const registerDevice=async()=>{


try{


setRegistering(true);



const fp =
await FingerprintJS.load();



const result =
await fp.get();





const fingerprint =
result.visitorId;





const deviceName =
prompt(
"Enter device name",
"Owner Laptop"
);





if(!deviceName)
return;







const res =
await registerAdminDevice({

name:deviceName,

fingerprint,

userAgent:
navigator.userAgent

});






if(res.success){

alert(
"Device registered"
);


fetchDevices();

}


}

catch(error){

console.error(error);

}

finally{

setRegistering(false);

}


};








const handleToggle=async(id:string)=>{


await toggleAdminDevice(id);

fetchDevices();


};






const handleDelete=async(id:string)=>{


const ok =
confirm(
"Remove this device?"
);



if(!ok)
return;



await deleteAdminDevice(id);


fetchDevices();


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

Admin Settings

</h2>


<p
className="
text-[#8a8a8a]
mt-1
"
>

Manage authorized admin devices

</p>


</div>






<Button

className="
bg-[#ecb100]
text-black
"

disabled={registering}

onClick={registerDevice}

>

{
registering
?
"Registering..."
:
"Register Current Device"
}

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
Device
</th>


<th>
Browser
</th>


<th>
Status
</th>


<th>
Last Used
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

devices.map((device)=>(


<tr

key={device.id}

className="
border-t
border-[#252525]
hover:bg-[#1b1b1b]
"

>


<td className="p-4">


<div className="font-medium">

{device.name}

</div>


<div
className="
text-xs
text-[#777]
"
>

{device.fingerprint}

</div>


</td>





<td className="text-sm text-[#aaa]">

{
device.userAgent?.slice(0,40)
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
device.active
?
"bg-green-500/10 text-green-400"
:
"bg-red-500/10 text-red-400"

}

`}
>

{
device.active
?
"Allowed"
:
"Blocked"
}

</span>


</td>






<td className="text-[#aaa]">

{
device.lastUsed

?
new Date(
device.lastUsed
).toLocaleDateString()

:

"Never"

}

</td>







<td
className="
text-right
p-4
space-x-4
"
>


<button

onClick={()=>handleToggle(device.id)}

className="
text-[#ecb100]
"

>

{
device.active
?
"Disable"
:
"Enable"
}

</button>





<button

onClick={()=>handleDelete(device.id)}

className="
text-red-400
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






</div>

);


}