import BookingForm from "@/components/booking/BookingForm";


export const metadata = {

title:
"Go Taxi Booking Punjab | Maan Travels",

description:
"Book reliable taxi services in Punjab with Maan Travels. Airport transfers, one way taxi, round trips and outstation cab services with professional drivers."

};



export default function GoTaxiPage(){


return (

<main className="pt-28 pb-24">


<section

className="
mx-auto
max-w-7xl
px-6
"

>


<div

className="
text-center
mb-14
"

>


<p

className="
uppercase
tracking-[0.3em]
text-sm
text-[#ecb100]
"

>

Go Taxi

</p>



<h1

className="
mt-4
text-5xl
font-bold
text-white
"

>

Book Your Taxi

</h1>



<p

className="
mt-5
max-w-2xl
mx-auto
text-[#8a8a8a]
"

>

Comfortable city rides, airport transfers and outstation taxi services across Punjab with professional chauffeurs.

</p>



</div>





<BookingForm />



</section>


</main>

)

}