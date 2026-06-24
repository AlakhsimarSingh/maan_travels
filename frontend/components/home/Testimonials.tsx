import Reveal from "@/components/common/Reveal";
import ReviewCard from "@/components/feedback/ReviewCard";

type Testimonial = {
  id: string;
  comments: string;
  customerName: string;
  route?: string;
  travelDate?: string | null;
  satisfaction?: string | null;
  vehicleRating?: number | null;
  supportRating?: number | null;
  driverExperience?: string | null;
  recommend?: boolean | null;
};

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        <Reveal className="mb-16 text-center">
          <p className="mb-3 uppercase tracking-[0.3em] text-[#ecb100]">Customer Reviews</p>
          <h2 className="text-4xl font-bold text-white md:text-5xl">What Our Customers Say</h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <ReviewCard key={item.id} review={item} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}