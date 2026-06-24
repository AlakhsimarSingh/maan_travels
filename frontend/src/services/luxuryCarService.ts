const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

async function handleResponse(res: Response, fallbackMessage: string) {
  let data: any = null;

  try {
    data = await res.json();
  } catch {
    // Response wasn't JSON — fall through to the generic error below.
  }

  if (!res.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
};


export const getPublicLuxuryCars = async () => {
  const res = await fetch(`${API_URL}/api/luxury-cars`);
  // No credentials: "include" — this is a public endpoint
  return handleResponse(res, "Failed to fetch luxury cars");
};
/* ---------------- GET ALL (ADMIN) ----------------
   Every function in this file hits an endpoint behind requireAdminDevice,
   which reads an httpOnly cookie. credentials: "include" is required on
   each one or the browser won't send that cookie and an approved admin
   device will get a confusing 401 anyway. */
export const getAllLuxuryCars = async () => {
  const res = await fetch(`${API_URL}/api/luxury-cars/all`, {
    credentials: "include",
  });
  return handleResponse(res, "Failed to fetch luxury cars");
};

/* ---------------- CREATE ---------------- */
export const createLuxuryCar = async (data: any) => {
  const res = await fetch(`${API_URL}/api/luxury-cars`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse(res, "Failed to create luxury car");
};

/* ---------------- UPDATE ---------------- */
export const updateLuxuryCar = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/api/luxury-cars/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse(res, "Failed to update luxury car");
};

/* ---------------- DELETE ---------------- */
export const deleteLuxuryCar = async (id: string) => {
  const res = await fetch(`${API_URL}/api/luxury-cars/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(res, "Failed to delete luxury car");
};