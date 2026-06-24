const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
}

/* ---------------- ADMIN ----------------
   Every one of these hits an endpoint behind requireAdminDevice, which
   reads an httpOnly cookie. credentials: "include" is required on each
   one or the browser won't send that cookie and an approved admin
   device will get a confusing 401 anyway. */
export async function getAllVehicles() {
  const res = await fetch(`${API_URL}/api/vehicles/all`, {
    cache: "no-store",
    credentials: "include",
  });
  return handleResponse(res);
}

export async function createVehicle(payload: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/vehicles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateVehicle(id: string, payload: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/vehicles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function toggleVehicle(id: string) {
  const res = await fetch(`${API_URL}/api/vehicles/${id}/toggle`, {
    method: "PATCH",
    credentials: "include",
  });
  return handleResponse(res);
}

export async function deleteVehicle(id: string) {
  const res = await fetch(`${API_URL}/api/vehicles/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(res);
}

/* ---------------- PUBLIC ----------------
   Intentionally no credentials here — this hits the public, unauthenticated
   endpoint that regular visitors (with no admin device cookie at all) use. */
export async function getActiveVehicles() {
  const res = await fetch(`${API_URL}/api/vehicles`, { cache: "no-store" });
  return handleResponse(res);
}