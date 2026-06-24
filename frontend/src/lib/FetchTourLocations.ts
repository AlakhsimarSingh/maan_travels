const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

export type TourLocation = {
  id: string;
  name: string;
  imageUrl?: string | null;
  canPickup: boolean;
  canDrop: boolean;
};

export type TourLocationsData = {
  heroLocations: TourLocation[];
  pickupLocations: TourLocation[];
  dropLocations: TourLocation[];
};

async function fetchLocations(path: string): Promise<TourLocation[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      // Locations are admin-managed and change rarely — cache for a
      // minute so repeat visits don't all hit the database fresh.
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data?.success && Array.isArray(data.locations) ? data.locations : [];
  } catch (error) {
    console.error(`fetchLocations(${path}) error:`, error);
    return [];
  }
}

/**
 * Server-only fetch — runs inside the Server Component (page.tsx), never
 * in the browser. Fetches all three location lists IN PARALLEL on the
 * server, before any HTML reaches the browser, replacing what used to be
 * three sequential client-side round trips after the JS bundle loaded.
 */
export async function fetchTourLocations(): Promise<TourLocationsData> {
  const [heroLocations, pickupLocations, dropLocations] = await Promise.all([
    fetchLocations("/api/locations/active"),
    fetchLocations("/api/locations/pickup"),
    fetchLocations("/api/locations/drop"),
  ]);

  return { heroLocations, pickupLocations, dropLocations };
}