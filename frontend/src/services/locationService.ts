const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

/* ---------------- GET ALL (ADMIN) ---------------- */
export const getAllLocations = async () => {
  const res = await fetch(`${API_URL}/api/locations/all`);
  return res.json();
};

/* ---------------- GET ACTIVE (PUBLIC — used by hero slideshow) ---------------- */
export const getActiveLocations = async () => {
  const res = await fetch(`${API_URL}/api/locations/active`);
  return res.json();
};

/* ---------------- GET PICKUP LOCATIONS (PUBLIC) ---------------- */
export const getPickupLocations = async () => {
  const res = await fetch(`${API_URL}/api/locations/pickup`);
  return res.json();
};

/* ---------------- GET DROP LOCATIONS (PUBLIC) ---------------- */
export const getDropLocations = async () => {
  const res = await fetch(`${API_URL}/api/locations/drop`);
  return res.json();
};

/* ---------------- CREATE ---------------- */
export const createLocation = async (data: any) => {
  const res = await fetch(`${API_URL}/api/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

/* ---------------- UPDATE ---------------- */
export const updateLocation = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/api/locations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

/* ---------------- DELETE ---------------- */
export const deleteLocation = async (id: string) => {
  const res = await fetch(`${API_URL}/api/locations/${id}`, {
    method: "DELETE",
  });

  return res.json();
};

/* ---------------- UPLOAD LOCATION IMAGE ---------------- */
// Uses the existing /api/upload route (Supabase-backed) shared across the app
export const uploadLocationImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  return res.json(); // { success, url }
};