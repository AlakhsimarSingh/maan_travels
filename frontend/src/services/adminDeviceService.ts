const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

async function handleResponse(res: Response) {
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response, fall through to generic error
  }

  // Note: we deliberately don't throw on non-2xx here for most device
  // endpoints, since callers need to inspect status-specific fields like
  // `code` ("DEVICE_PENDING", "INVITE_REQUIRED", etc.) to drive the UI,
  // not just get a generic thrown Error.
  return { ...data, httpStatus: res.status };
}

/* ---------------- REGISTER / RE-VERIFY THIS DEVICE ---------------- */
export const registerAdminDevice = async (data: {
  name: string;
  fingerprint: string;
  userAgent?: string;
  inviteCode?: string;
}) => {
  const res = await fetch(`${API_URL}/api/admin-devices/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // required so the response Set-Cookie is honored
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

/* ---------------- POLL PENDING DEVICE STATUS ---------------- */
export const checkDeviceStatus = async (fingerprint: string) => {
  const res = await fetch(
    `${API_URL}/api/admin-devices/status/${encodeURIComponent(fingerprint)}`,
    { credentials: "include" }
  );

  return handleResponse(res);
};

/* ---------------- WHO AM I ---------------- */
export const getCurrentDevice = async () => {
  const res = await fetch(`${API_URL}/api/admin-devices/me`, {
    credentials: "include",
  });

  return handleResponse(res);
};

/* ---------------- CREATE AN INVITE (from a trusted device) ---------------- */
export const createDeviceInvite = async () => {
  const res = await fetch(`${API_URL}/api/admin-devices/invites`, {
    method: "POST",
    credentials: "include",
  });

  return handleResponse(res);
};

/* ---------------- LIST INVITES CREATED BY THIS DEVICE ---------------- */
export const getDeviceInvites = async () => {
  const res = await fetch(`${API_URL}/api/admin-devices/invites`, {
    credentials: "include",
  });

  return handleResponse(res);
};

/* ---------------- LIST ALL DEVICES ---------------- */
export const getAdminDevices = async () => {
  const res = await fetch(`${API_URL}/api/admin-devices`, {
    credentials: "include",
  });

  return handleResponse(res);
};

/* ---------------- APPROVE A PENDING DEVICE ---------------- */
export const approveAdminDevice = async (id: string) => {
  const res = await fetch(`${API_URL}/api/admin-devices/${id}/approve`, {
    method: "PATCH",
    credentials: "include",
  });

  return handleResponse(res);
};

/* ---------------- REVOKE A DEVICE ---------------- */
export const revokeAdminDevice = async (id: string) => {
  const res = await fetch(`${API_URL}/api/admin-devices/${id}/revoke`, {
    method: "PATCH",
    credentials: "include",
  });

  return handleResponse(res);
};

/* ---------------- DELETE A DEVICE ---------------- */
export const deleteAdminDevice = async (id: string) => {
  const res = await fetch(`${API_URL}/api/admin-devices/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(res);
};

/* ---------------- LOGOUT THIS DEVICE ---------------- */
export const logoutAdminDevice = async () => {
  const res = await fetch(`${API_URL}/api/admin-devices/logout`, {
    method: "POST",
    credentials: "include",
  });

  return handleResponse(res);
};