import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";


export default function ContactPage(){

return (

<main>

<ContactHero />

<section className="py-24">

<div
className="
mx-auto
grid
max-w-7xl
gap-12
px-6
lg:grid-cols-2
"
>

<ContactInfo />

<ContactForm />

</div>

</section>


</main>

);

}