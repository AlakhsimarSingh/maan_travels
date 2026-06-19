"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/src/services/bookingService";

export function useRoutePricing(routeId?: string, vehicleId?: string) {
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (!routeId || !vehicleId) return;

    const fetchPrice = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/pricing?routeId=${routeId}&vehicleId=${vehicleId}`
        );

        const data = await res.json();
        setPrice(data.price || 0);
      } catch (e) {
        console.log(e);
      }
    };

    fetchPrice();
  }, [routeId, vehicleId]);

  return price;
}