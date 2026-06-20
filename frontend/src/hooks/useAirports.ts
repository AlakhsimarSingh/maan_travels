"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/src/services/bookingService";

export type AirportPricing = { vehicleId: string; price: number };

export type Airport = {
  id: string;
  name: string;
  shortName: string;
  image: string | null;
  description: string | null;
  pricing: AirportPricing[];
};

export function useAirports() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/airports`);
        const data = await res.json();
        setAirports(data.airports || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { airports, loading };
}