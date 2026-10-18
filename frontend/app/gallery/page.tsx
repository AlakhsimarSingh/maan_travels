import type { Metadata } from "next";

import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryGrid from "@/components/gallery/GalleryGrid";

import { API_URL } from "@/src/services/bookingService";
import type { GalleryImage } from "@/src/hooks/useGallery";

// Fetched on the server (cached, revalidated every 5 min) so the images are
// in the initial HTML instead of loading after the page hydrates.
export const metadata: Metadata = {
  title: "Gallery | Taxis, Luxury & Wedding Cars in Jalandhar",
  description:
    "Photos of the Maan Travels fleet in Jalandhar — taxis, luxury cars, wedding cars, Tempo Travellers and tours across Punjab and North India.",
  alternates: { canonical: "/gallery" },
};

async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const res = await fetch(`${API_URL}/api/gallery`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.images || [];
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <main>
      <GalleryHero />
      <GalleryGrid images={images} />
    </main>
  );
}
