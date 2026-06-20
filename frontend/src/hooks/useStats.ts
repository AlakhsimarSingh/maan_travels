"use client";

import { useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const POLL_INTERVAL = 12000; // 12s

export type DashboardStats = {
  totalVehicles: number;
  totalBookings: number;
  totalFeedback: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
};

export function useStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStats = async (isFirstLoad = false) => {
    try {
      if (isFirstLoad) setLoading(true);

      const res = await fetch(`${API_URL}/api/stats`);
      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
        setError(null);
      } else {
        setError(data.message || "Failed to load stats");
      }
    } catch (err) {
      console.error("Stats fetch failed", err);
      setError("Unable to reach server");
    } finally {
      if (isFirstLoad) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(true);

    intervalRef.current = setInterval(() => fetchStats(false), POLL_INTERVAL);

    // Pause polling when tab is hidden, resume when visible — avoids
    // hammering the server with requests from backgrounded tabs.
    const handleVisibility = () => {
      if (document.hidden) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        fetchStats(false);
        intervalRef.current = setInterval(() => fetchStats(false), POLL_INTERVAL);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return { stats, loading, error, refetch: () => fetchStats(false) };
}