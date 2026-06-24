import { Suspense } from "react";
import type { Metadata } from "next";

import FeedbackHero from "@/components/feedback/FeedbackHero";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import ReviewsList from "@/components/feedback/ReviewsList";
import ReviewsListSkeleton from "@/components/feedback/ReviewsListSkeleton";

import { buildMetadata, buildBreadcrumbLd } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Customer Reviews & Feedback | Maan Travels",
  description:
    "Read genuine reviews from Maan Travels customers about our chauffeur-driven cars, airport transfers and tours across Punjab and North India — or share your own experience.",
  path: "/feedback",
});

const breadcrumbLd = buildBreadcrumbLd([
  { name: "Home", path: "/" },
  { name: "Feedback", path: "/feedback" },
]);

export default function FeedbackPage() {
  return (
    <main>
      <FeedbackHero />

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2">
          <FeedbackForm />

          <div>
            <h2 className="mb-8 text-3xl font-bold text-white">Customer Experiences</h2>

            <Suspense fallback={<ReviewsListSkeleton />}>
              <ReviewsList />
            </Suspense>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </main>
  );
}