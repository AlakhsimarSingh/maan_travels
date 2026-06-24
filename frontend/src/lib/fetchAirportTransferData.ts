const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

export type AirportPricing = { vehicleId: string; price: number };

export type Airport = {
  id: string;
  name: string;
  shortName: string;
  image: string | null;
  description: string | null;
  pricing: AirportPricing[];
};

export type AirportVehicle = {
  id: string;
  name: string;
  category: string;
  passengerCapacity?: number | null;
  suitcaseCapacity?: number | null;
  isTaxiFleet: boolean;
};

export type AirportTransferData = {
  airports: Airport[];
  vehicles: AirportVehicle[];
};

// A safe, always-defined fallback. Every caller of fetchAirportTransferData
// should still treat its return value as the source of truth, but this
// constant exists so any code path that DOES need a default has one
// consistent shape to fall back to, instead of risking `undefined`.
export const EMPTY_AIRPORT_TRANSFER_DATA: AirportTransferData = {
  airports: [],
  vehicles: [],
};

async function safeFetchJson(path: string): Promise<any> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`safeFetchJson(${path}) error:`, error);
    return null;
  }
}

/**
 * Server-only fetch — runs inside the Server Component (page.tsx), never
 * in the browser. Fetches airports AND taxi-fleet vehicles IN PARALLEL on
 * the server, before any HTML reaches the browser. This replaces what
 * used to be two separate client-side hooks (useAirports + useVehicles
 * inside the form) firing independently after the JS bundle loaded.
 *
 * ALWAYS returns the full { airports, vehicles } shape — never undefined,
 * never a partial object — even if one or both underlying requests fail.
 * This is deliberate: a component destructuring this return value should
 * never need to guard against the top-level object itself being missing.
 */
export async function fetchAirportTransferData(): Promise<AirportTransferData> {
  const [airportsData, vehiclesData] = await Promise.all([
    safeFetchJson("/api/airports"),
    safeFetchJson("/api/vehicles"),
  ]);

  const airports: Airport[] =
    airportsData?.success && Array.isArray(airportsData.airports)
      ? airportsData.airports
      : [];

  const allVehicles: AirportVehicle[] =
    vehiclesData?.success && Array.isArray(vehiclesData.vehicles)
      ? vehiclesData.vehicles
      : [];

  // Airport transfers use chauffeur-driven taxi fleet vehicles, matching
  // the same default the old client-side useVehicles() hook used.
  const vehicles = allVehicles.filter((v) => v.isTaxiFleet === true);

  return { airports, vehicles };
}