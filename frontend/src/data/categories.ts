import { Category } from "@/src/types/category";

export const categories: Category[] = [
  {
    id: "1",
    name: "Luxury Cars",
    slug: "luxury-cars",
    description: "Premium luxury vehicles",
    image: "/cars/audi.jpg",
    active: true,
  },

  {
    id: "2",
    name: "Tempo Traveller",
    slug: "tempo-traveller",
    description: "Group transportation",
    image: "/cars/traveller.jpg",
    active: true,
  },

  {
    id: "3",
    name: "Tour Packages",
    slug: "tour-packages",
    description: "Holiday packages",
    image: "/cars/tour.jpg",
    active: true,
  },
];