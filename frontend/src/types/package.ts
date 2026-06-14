export interface PackageDay {
  day: number;
  title: string;
  description: string;
}

export interface VehiclePricing {
  vehicle: string;
  price: number;
}

export interface TourPackage {
  id: string;

  title: string;

  slug: string;

  destination: string;

  duration: string;

  featuredImage: string;

  gallery: string[];

  description: string;

  inclusions: string[];

  exclusions: string[];

  itinerary: PackageDay[];

  pricing: VehiclePricing[];

  metaTitle: string;

  metaDescription: string;

  metaKeywords: string;
}