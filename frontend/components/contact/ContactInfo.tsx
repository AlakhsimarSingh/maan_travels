import { siteConfig } from "@/src/config/site";
import {
Phone,
Mail,
MapPin,
Clock,
} from "lucide-react";


export default function ContactInfo(){

return (

<div>

<h2
className="
text-3xl
font-bold
text-white
"
>
Get In Touch
</h2>


<p
className="
mt-4
text-[#8a8a8a]
"
>
Reach us for luxury travel,
corporate transport and tour packages.
</p>



<div className="mt-10 space-y-6">


<div
className="
flex
gap-4
"
>

<Phone
className="text-[#ecb100]"
/>

<div>
<h3 className="text-white">
Phone
</h3>

<p className="text-[#8a8a8a]">
+91 8054404591
</p>

</div>

</div>




<div className="flex gap-4">

<Mail
className="text-[#ecb100]"
/>

<div>
<h3 className="text-white">
Email
</h3>

<p className="text-[#8a8a8a]">
{siteConfig.contact.email}
</p>
</div>

</div>




<div className="flex gap-4">

<MapPin
className="text-[#ecb100]"
/>

<div>
<h3 className="text-white">
Office
</h3>

<p className="text-[#8a8a8a]">
{siteConfig.contact.address}
</p>
</div>

</div>




<div className="flex gap-4">

<Clock
className="text-[#ecb100]"
/>

<div>

<h3 className="text-white">
Support
</h3>

<p className="text-[#8a8a8a]">
24/7 Customer Assistance
</p>

</div>

</div>


</div>


</div>

);

}