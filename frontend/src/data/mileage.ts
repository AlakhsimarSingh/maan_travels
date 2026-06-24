// Average real-world fuel efficiency (km/l) by vehicle category, for diesel/petrol
// taxi-segment vehicles common in North India. This is intentionally NOT pulled
// from the app's own Vehicle DB (which doesn't track mileage) — it's an
// independent reference so estimates don't depend on data entry quality.
//
// Sources: manufacturer ARAI test-cycle figures, adjusted down ~15-20% to
// reflect real-world city/highway mixed driving rather than lab conditions.

export type FuelType = "petrol" | "diesel" | "cng" | "electric";

type MileageProfile = {
  kmpl: number; // km per liter (or km per kg for CNG, used as a proxy)
  fuelType: FuelType;
};

export const mileageByCategory: Record<string, MileageProfile> = {
  sedan: { kmpl: 16, fuelType: "petrol" },
  suv: { kmpl: 12, fuelType: "diesel" },
  mpv: { kmpl: 13, fuelType: "diesel" },
  luxury: { kmpl: 9, fuelType: "petrol" },
  tempo: { kmpl: 8, fuelType: "diesel" },
  urbania: { kmpl: 8, fuelType: "diesel" },
  "self drive": { kmpl: 17, fuelType: "petrol" },
};

const DEFAULT_PROFILE: MileageProfile = { kmpl: 13, fuelType: "diesel" };

export function getMileageProfile(category?: string | null): MileageProfile {
  if (!category) return DEFAULT_PROFILE;

  const key = category.toLowerCase().trim();

  const match = Object.keys(mileageByCategory).find((k) => key.includes(k));

  return match ? mileageByCategory[match] : DEFAULT_PROFILE;
}

// Approximate current fuel prices in Punjab (₹/liter or ₹/kg for CNG).
// These drift with market rates — update periodically rather than fetching
// live, since no reliable free fuel-price API exists for India.
export const fuelPrices: Record<FuelType, number> = {
  petrol: 104.5,
  diesel: 95.5,
  cng: 78,
  electric: 9, // ₹/unit equivalent, rough EV running cost proxy
};