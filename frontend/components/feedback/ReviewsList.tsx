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
        No reviews available yet. Be the first to share your experience!
      </p>
    );
  }

  const ratedReviews = reviews.filter((r: any) => r.vehicleRating);
  const avgRating = ratedReviews.length
    ? ratedReviews.reduce((sum: number, r: any) => sum + r.vehicleRating, 0) / ratedReviews.length
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
      <div className="space-y-6">
        {reviews.map((review: any, i: number) => (
          <ReviewCard key={review.id} review={review} index={i} />
        ))}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewLd) }} />
    </>
  );
}