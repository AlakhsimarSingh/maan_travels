export default function ContactHero(){

return (

<section
className="
relative
flex
h-[45vh]
items-center
"
>


<div
className="
absolute
inset-0
bg-cover
bg-center
"
style={{
backgroundImage:
"url('/images/contact-bg.jpg')"
}}
/>


<div
className="
absolute
inset-0
bg-black/75
"
/>



<div
className="
relative
z-10
mx-auto
max-w-7xl
px-6
"
>

<p
className="
uppercase
tracking-[0.3em]
text-[#ecb100]
"
>
Contact Us
</p>


<h1
className="
mt-4
text-5xl
font-bold
text-white
"
>
Let's Plan Your Journey
</h1>


<p
className="
mt-5
max-w-2xl
text-lg
text-[#c7c7c7]
"
>
Have questions about bookings,
packages or luxury vehicles?
Our travel experts are here to help.
</p>


</div>


</section>

);

}