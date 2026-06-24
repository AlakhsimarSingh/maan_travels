const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

/* ---------------- GET ALL (ADMIN) ----------------
   Admin-only — if location.routes.ts protects this with
   requireAdminDevice (as every other admin list/write route in this
   backend does), this call needs the cookie sent or it'll 401 even for
   an approved admin device. */
export const getAllLocations = async () => {
  const res = await fetch(`${API_URL}/api/locations/all`, {
    credentials: "include",
  });
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

/* ---------------- CREATE (ADMIN) ---------------- */
export const createLocation = async (data: any) => {
  const res = await fetch(`${API_URL}/api/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
};

/* ---------------- UPDATE (ADMIN) ---------------- */
export const updateLocation = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/api/locations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
};

/* ---------------- DELETE (ADMIN) ---------------- */
export const deleteLocation = async (id: string) => {
  const res = await fetch(`${API_URL}/api/locations/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return res.json();
};

/* ---------------- UPLOAD LOCATION IMAGE (ADMIN) ---------------- */
// Uses the existing /api/upload route (Supabase-backed) shared across the app
export const uploadLocationImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return res.json(); // { success, url }
};