import { notFound } from "next/navigation";
import Image from "next/image";
import { API_URL } from "@/src/services/bookingService";
import WeddingBookingForm from "@/components/wedding/WeddingBookingForm";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getCar(slug: string) {
  const res = await fetch(`${API_URL}/api/luxury-cars/${slug}`, {
    next: { revalidate: 300 },
  });
  const data = await res.json();
  return data?.car || null;
}

export default async function WeddingBookingPage({ params }: Props) {
  const { slug } = await params;
  const car = await getCar(slug);

  if (!car) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maantravels.com";

  return (
    <main className="pt-28 pb-24">
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* CAR SUMMARY */}
          <aside className="h-fit overflow-hidden rounded-3xl border border-[#252525] bg-[#141414]">
            {car.image && (
              <div className="relative h-56 w-full">
                <Image
                  src={car.image}
                  alt={`${car.name} wedding car`}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              </div>
            )}

            <div className="p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-[#ecb100]">
                Selected Wedding Car
              </p>

              <h1 className="mt-4 text-3xl font-bold text-white">{car.name}</h1>

              <p className="mt-3 text-[#8a8a8a]">{car.category}</p>

              {car.price && (
                <p className="mt-3 text-sm font-medium text-[#ecb100]">
                  Starting from ₹{car.price.toLocaleString("en-IN")}
                </p>
              )}

              <div className="mt-8 space-y-3">
                <div className="rounded-xl border border-[#252525] bg-black/30 p-4">
                  <p className="text-xs uppercase text-[#8a8a8a]">Vehicle Type</p>
                  <p className="mt-1 text-white">Wedding Luxury Car</p>
                </div>

                <div className="rounded-xl border border-[#252525] bg-black/30 p-4">
                  <p className="text-xs uppercase text-[#8a8a8a]">Experience</p>
                  <p className="mt-1 text-white">Chauffeur Driven</p>
                </div>
              </div>
            </div>
          </aside>

          {/* FORM */}
          <div className="lg:col-span-2">
            <WeddingBookingForm car={car} />
          </div>
        </div>
      </section>

      {/* Per-vehicle structured data — helps this specific car rank for its own searches */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${car.name} Wedding Car Rental`,
            description:
              car.description ||
              `Book ${car.name} for weddings with premium chauffeur service in Punjab.`,
            image: car.image,
            brand: { "@type": "Brand", name: "Maan Travels" },
            offers: car.price
              ? {
                  "@type": "Offer",
                  priceCurrency: "INR",
                  price: car.price,
                  availability: "https://schema.org/InStock",
                  url: `${siteUrl}/wedding-booking/${slug}`,
                }
              : undefined,
          }),
        }}
      />
    </main>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const car = await getCar(slug);

  if (!car) return {};

  const description =
    car.description ||
    `Book ${car.name} for weddings with premium chauffeur service across Punjab.`;

  return {
    title: `${car.name} Wedding Car Rental | Maan Travels`,
    description,
    openGraph: {
      title: `${car.name} Wedding Car Rental | Maan Travels`,
      description,
      images: car.image ? [{ url: car.image }] : undefined,
    },
  };
}