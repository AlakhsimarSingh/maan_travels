const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

const TEMPO_CATEGORIES = ["Tempo Traveller", "Urbania"];

export type TempoVehicle = {
  id: string;
  name: string;
  category: string;
  imageUrl?: string | null;
  description?: string | null;
  price: number;
  passengerCapacity?: number | null;
  suitcaseCapacity?: number | null;
  isSelfDrive: boolean;
  isTaxiFleet: boolean;
  available: boolean;
};

/**
 * Server-only fetch — runs inside the Server Component (page.tsx), never
 * in the browser. Hits the PUBLIC /api/vehicles endpoint (no admin auth
 * needed, since this powers a page anyone can visit) and filters down to
 * valid Tempo/Urbania vehicles.
 *
 * Uses Next.js's fetch cache with a 60-second revalidate window — tempo
 * vehicles change rarely (an admin edits them occasionally), so repeat
 * page loads within that window are served from Next's cache instead of
 * hitting the database again. This is what actually makes the page fast:
 * the data is ready before the HTML is even sent to the browser, AND
 * most loads don't even need a fresh database round trip.
 */
export async function fetchTempoVehicles(): Promise<TempoVehicle[]> {
  try {
    const res = await fetch(`${API_URL}/api/vehicles`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!data?.success || !Array.isArray(data.vehicles)) return [];

    return data.vehicles.filter((v: TempoVehicle) => {
      const isTempoCategory = TEMPO_CATEGORIES.includes(v.category);
      const isValidFleet = v.isSelfDrive !== true && v.isTaxiFleet !== true;
      const hasCapacity =
        typeof v.passengerCapacity === "number" && v.passengerCapacity > 0;

      return isTempoCategory && isValidFleet && hasCapacity;
    });
  } catch (error) {
    console.error("fetchTempoVehicles error:", error);
    return [];
  }
}