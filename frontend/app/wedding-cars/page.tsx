import WeddingHero from "@/components/wedding/WeddingHero";
import WeddingFleet from "@/components/wedding/WeddingFleet";
import WeddingPackages from "@/components/wedding/WeddingPackages";
import WeddingFAQ from "@/components/wedding/WeddingFAQ";

export default function WeddingCarsPage(){

return (

<main className="pt-20">

<WeddingHero />

<div id="fleet">
<WeddingFleet />
</div>

<WeddingPackages />

<WeddingFAQ />

</main>

)

}