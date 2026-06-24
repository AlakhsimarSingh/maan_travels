import { API_URL } from "./bookingService";

export async function getRoutes() {
  const res = await fetch(`${API_URL}/api/routes`,
    {
      credentials: "include",
    }
  );
  const data = await res.json();
  return data.routes || [];
}