export default function FeedbackHero(){

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
"url('/images/feedback-bg.jpg')"
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
Customer Feedback
</p>


<h1
className="
mt-4
text-5xl
font-bold
text-white
"
>
Your Experience Matters
</h1>


<p
className="
mt-5
text-[#c7c7c7]
max-w-2xl
"
>
Share your travel experience
and help us serve better.
</p>


</div>


</section>

);

}