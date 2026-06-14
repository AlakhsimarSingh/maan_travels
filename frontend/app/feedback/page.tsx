import FeedbackHero from "@/components/feedback/FeedbackHero";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import ReviewCard from "@/components/feedback/ReviewCard";


const reviews = [
  {
    name:"Rahul Sharma",
    trip:"Manali Tour",
    rating:5,
    message:
      "Excellent service with a very comfortable journey. The driver was professional and punctual."
  },

  {
    name:"Amit Singh",
    trip:"Airport Transfer",
    rating:5,
    message:
      "Premium experience. Clean vehicle and smooth pickup."
  },

  {
    name:"Neha Verma",
    trip:"Wedding Car Rental",
    rating:4,
    message:
      "Beautiful cars and great coordination."
  }
];


export default function FeedbackPage(){

return (

<main>

<FeedbackHero />


<section className="py-24">

<div
className="
mx-auto
grid
max-w-7xl
gap-14
px-6
lg:grid-cols-2
"
>

<FeedbackForm />


<div>

<h2
className="
mb-8
text-3xl
font-bold
text-white
"
>
Customer Experiences
</h2>


<div className="space-y-6">

{
reviews.map(review=>(
<ReviewCard
key={review.name}
{...review}
/>
))
}


</div>


</div>


</div>


</section>


</main>

);

}