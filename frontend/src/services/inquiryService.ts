const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

type InquiryPayload = {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
};

/* ---------------- CREATE (PUBLIC) ---------------- */
export const createInquiry = async (data: InquiryPayload) => {
  const res = await fetch(`${API_URL}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Request failed");

  return res.json();
};

/* ---------------- GET ALL (ADMIN) ---------------- */
export const getAllInquiries = async () => {
  const res = await fetch(`${API_URL}/api/inquiries`, {
    credentials: "include",
  });
  return res.json();
};

/* ---------------- UPDATE STATUS (ADMIN) ---------------- */
export const updateInquiryStatus = async (id: string, status: string) => {
  const res = await fetch(`${API_URL}/api/inquiries/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    credentials: "include",
  });

  return res.json();
};

/* ---------------- DELETE (ADMIN) ---------------- */
export const deleteInquiry = async (id: string) => {
  const res = await fetch(`${API_URL}/api/inquiries/${id}`, {
    credentials: "include",
    method: "DELETE",
  });

  return res.json();
};