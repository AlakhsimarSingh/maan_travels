import FeedbackHero from "@/components/feedback/FeedbackHero";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import ReviewCard from "@/components/feedback/ReviewCard";

/* ❌ REMOVE STATIC ARRAY — REPLACED WITH API DATA */
export default async function FeedbackPage() {

  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/feedback?visible=true",
    {
      cache: "no-store",
    }
  );

  const data = await res.json();
  const reviews = data.feedbacks || [];

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

            <h2 className="mb-8 text-3xl font-bold text-white">
              Customer Experiences
            </h2>

            <div className="space-y-6">

              {reviews.length === 0 ? (
                <p className="text-[#8a8a8a]">
                  No reviews available yet.
                </p>
              ) : (
                reviews.map((review: any) => (
                  <ReviewCard
                    key={review.id}
                    name={review.customerName}
                    trip={review.route || "Trip Experience"}
                    rating={review.vehicleRating || 5}
                    message={review.comments || ""}
                  />
                ))
              )}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}