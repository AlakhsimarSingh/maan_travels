"use client";

import { useEffect, useState } from "react";
import { getRoutes } from "@/src/services/routeService";

export function useRoutes() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRoutes();
        setRoutes(data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { routes, loading };
}