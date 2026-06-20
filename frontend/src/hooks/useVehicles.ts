"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/src/services/bookingService";

export type Vehicle = {
  id: string;
  name: string;
  category?: string;
  isTaxiFleet?: boolean;
  passengerCapacity?: number | null;
  suitcaseCapacity?: number | null;
};

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/vehicles`);
        const data = await res.json();
        const taxiVehicles = (data.vehicles || []).filter((v: Vehicle) => v.isTaxiFleet);
        setVehicles(taxiVehicles);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { vehicles, loading };
}