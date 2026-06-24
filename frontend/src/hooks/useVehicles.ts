"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/src/services/bookingService";

export type Vehicle = {
  id: string;
  name: string;
  category: string;
  imageUrl?: string | null;
  description?: string | null;

  isTaxiFleet: boolean;
  isSelfDrive: boolean;

  fuelType?: string | null;
  transmission?: string | null;
  seats?: number | null;
  modelYear?: number | null;
  rentalPerDay?: number | null;

  passengerCapacity?: number | null;
  suitcaseCapacity?: number | null;

  price: number;
  available: boolean;
};

type FleetFilter = "taxi" | "selfDrive" | "all";

export function useVehicles(fleet: FleetFilter = "taxi") {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/vehicles`);
        const data = await res.json();
        const all: Vehicle[] = data.vehicles || [];

        const filtered =
          fleet === "all"
            ? all
            : fleet === "taxi"
            ? all.filter((v) => v.isTaxiFleet)
            : all.filter((v) => v.isSelfDrive);

        if (isMounted) setVehicles(filtered);
      } catch (err) {
        console.error("useVehicles fetch error:", err);
        if (isMounted) setVehicles([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [fleet]);

  return { vehicles, loading };
}