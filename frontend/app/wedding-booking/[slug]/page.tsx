import { notFound } from "next/navigation";
import { API_URL } from "@/src/services/bookingService";
import WeddingBookingForm from "@/components/wedding/WeddingBookingForm";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WeddingBookingPage({ params }: Props) {
  const { slug } = await params;

  // FETCH FROM BACKEND (REAL DB DATA)
  const res = await fetch(`${API_URL}/api/luxury-cars/${slug}`, {
    cache: "no-store",
  });

  const data = await res.json();

  const car = data?.car;

  if (!car) {
    notFound();
  }

  return (
    <main className="pt-28 pb-24">
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          
          {/* CAR SUMMARY */}
          <aside className="rounded-3xl border border-[#252525] bg-[#141414] p-8 h-fit">
            
            <p className="uppercase tracking-[0.3em] text-sm text-[#ecb100]">
              Selected Wedding Car
            </p>

            <h1 className="mt-4 text-3xl font-bold text-white">
              {car.name}
            </h1>

            <p className="mt-3 text-[#8a8a8a]">
              {car.category}
            </p>

            {/* PRICE */}
            {car.price && (
              <p className="mt-3 text-sm text-[#ecb100] font-medium">
                Starting from ₹{car.price.toLocaleString("en-IN")}
              </p>
            )}

            <div className="mt-8 space-y-3">
              
              <div className="rounded-xl border border-[#252525] bg-black/30 p-4">
                <p className="text-xs uppercase text-[#8a8a8a]">
                  Vehicle Type
                </p>
                <p className="mt-1 text-white">
                  Wedding Luxury Car
                </p>
              </div>

              <div className="rounded-xl border border-[#252525] bg-black/30 p-4">
                <p className="text-xs uppercase text-[#8a8a8a]">
                  Experience
                </p>
                <p className="mt-1 text-white">
                  Chauffeur Driven
                </p>
              </div>

            </div>

          </aside>

          {/* FORM */}
          <div className="lg:col-span-2">
            <WeddingBookingForm car={car} />
          </div>

        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const res = await fetch(`${API_URL}/api/luxury-cars/${slug}`, {
    cache: "no-store",
  });

  const data = await res.json();
  const car = data?.car;

  if (!car) {
    return {};
  }

  return {
    title: `${car.name} Wedding Car Rental | Maan Travels`,
    description: `Book ${car.name} for weddings with premium chauffeur service.`,
  };
}