"use client";


import {
Tabs,
TabsContent,
TabsList,
TabsTrigger,
} from "@/components/ui/tabs";


import TaxiBookingForm from "@/components/booking/TaxiBookingForm";
import TourBookingForm from "@/components/booking/TourBookingForm";


export default function BookingForm(){

return (

<div
className="
mx-auto
max-w-5xl
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-8
"
>


<h2
className="
mb-8
text-3xl
font-bold
text-white
"
>
Book Your Journey
</h2>



<Tabs
defaultValue="taxi"
>


<TabsList
className="
mb-8
bg-[#111]
"
>

<TabsTrigger
value="taxi"
>
Taxi / Cab
</TabsTrigger>


<TabsTrigger
value="tour"
>
Tour Package
</TabsTrigger>


</TabsList>




<TabsContent value="taxi">

<TaxiBookingForm />

</TabsContent>



<TabsContent value="tour">

<TourBookingForm />

</TabsContent>



</Tabs>


</div>

);

}