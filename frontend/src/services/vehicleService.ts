const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

/* ---------------- DEVICE TOKEN ---------------- */
function getDeviceToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("device_token");
}

/* ---------------- SAFE FETCH ---------------- */
async function safeFetch(url: string, options: RequestInit = {}) {
  try {
    const deviceToken = getDeviceToken();

    const headers: any = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (deviceToken) {
      headers["x-device-token"] = deviceToken;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      throw new Error(data?.message || `Request failed: ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error("API Error:", url, err);
    throw err;
  }
}

/* ---------------- NORMALIZER (IMPORTANT FOR YOUR SCHEMA) ---------------- */
function normalizeVehiclePayload(data: any) {
  return {
    ...data,

    price: data.price ? Number(data.price) : 0,

    seats: data.seats ? Number(data.seats) : null,
    modelYear: data.modelYear ? Number(data.modelYear) : null,
    rentalPerDay: data.rentalPerDay ? Number(data.rentalPerDay) : null,

    passengerCapacity: data.passengerCapacity
      ? Number(data.passengerCapacity)
      : null,

    suitcaseCapacity: data.suitcaseCapacity
      ? Number(data.suitcaseCapacity)
      : null,

    fuelType: data.fuelType || null,
    transmission: data.transmission || null,
    description: data.description || null,

    imageUrl: data.imageUrl || null,
  };
}

/* ---------------- GET ALL (ADMIN) ---------------- */
export const getAllVehicles = async () => {
  return safeFetch(`${API_URL}/api/vehicles/all`);
};

/* ---------------- CREATE ---------------- */
export const createVehicle = async (data: any) => {
  return safeFetch(`${API_URL}/api/vehicles`, {
    method: "POST",
    body: JSON.stringify(normalizeVehiclePayload(data)),
  });
};

/* ---------------- UPDATE ---------------- */
export const updateVehicle = async (id: string, data: any) => {
  return safeFetch(`${API_URL}/api/vehicles/${id}`, {
    method: "PUT",
    body: JSON.stringify(normalizeVehiclePayload(data)),
  });
};

/* ---------------- DELETE ---------------- */
export const deleteVehicle = async (id: string) => {
  return safeFetch(`${API_URL}/api/vehicles/${id}`, {
    method: "DELETE",
  });
};

/* ---------------- TOGGLE ---------------- */
export const toggleVehicle = async (id: string) => {
  return safeFetch(`${API_URL}/api/vehicles/${id}/toggle`, {
    method: "PATCH",
  });
};