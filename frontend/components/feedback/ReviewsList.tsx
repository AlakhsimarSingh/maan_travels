import ReviewCard from "./ReviewCard";
import { API_URL } from "@/src/services/bookingService";

async function getReviews() {
  try {
    const res = await fetch(`${API_URL}/api/feedback?visible=true`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return data.feedbacks || [];
  } catch {
    return [];
  }
}

export default async function ReviewsList() {
  const reviews = await getReviews();

  if (reviews.length === 0) {
    return (
      <p className="text-[#8a8a8a]">
        No reviews yet. Be the first to share your experience!
      </p>
    );
  }

  const ratedReviews = reviews.filter((r: any) => r.vehicleRating);
  const avgRating = ratedReviews.length
    ? ratedReviews.reduce((sum: number, r: any) => sum + r.vehicleRating, 0) /
      ratedReviews.length
    : 0;

  const reviewLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Maan Travels",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
    },
  };

  return (
    <>
      {/* Review count summary */}
      <p className="mb-6 text-sm text-[#555]">
        {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        {avgRating > 0 && (
          <span className="ml-2 text-[#ecb100]">
            · {avgRating.toFixed(1)} / 5 avg
          </span>
        )}
      </p>

      <div className="space-y-5">
        {reviews.map((review: any, i: number) => (
          // On the feedback page we show full comment text (no clampComments)
          // Stagger delay capped at 300ms so late cards don't wait forever
          <ReviewCard
            key={review.id}
            review={review}
            index={Math.min(i, 4)}
          />
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewLd) }}
      />
    </>
  );
}