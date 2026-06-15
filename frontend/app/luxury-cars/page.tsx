import LuxuryHero from "@/components/luxury/LuxuryHero";
import LuxuryFleet from "@/components/luxury/LuxuryFleet";
import LuxuryWhyChoose from "@/components/luxury/LuxuryWhyChoose";
import LuxuryCTA from "@/components/luxury/LuxuryCTA";


export const metadata = {

title:
"Luxury Car Rental in Punjab | Mercedes Maybach, G-Wagon, Range Rover | Maan Travels",

description:
"Book luxury cars in Punjab with Maan Travels. Premium Mercedes Maybach, G-Wagon, Range Rover, Defender, Jaguar and Fortuner Legender rental services for weddings, corporate events and VIP travel.",


keywords:[
"luxury car rental Punjab",
"Mercedes Maybach rental Punjab",
"G Wagon rental",
"Range Rover rental",
"wedding luxury cars Punjab",
"VIP car rental"
]

};



export default function LuxuryCarsPage(){

return (

<main>

<LuxuryHero/>

<LuxuryFleet/>

<LuxuryWhyChoose/>

<LuxuryCTA/>

</main>

)

}