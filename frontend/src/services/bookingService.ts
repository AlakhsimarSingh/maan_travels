const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

export { API_URL };


/* ---------------- TYPES ---------------- */

type TaxiBooking = {
  name: string;
  email?: string;
  phone: string;
  rideMode: "oneway" | "round" | "local";
  pickup: string;
  drop?: string;
  vehicleId: string;
  distance?: number;
  travelDate?: string;
};


type AirportBooking = {
  name: string;
  phone: string;
  pickup: string;
  airport: string;
  travelDate: string | Date; // FIX
  pickupTime: string;
  vehicleId: string; // 🔥 CHANGE (was vehicle name)
  passengers: number;
  suitcases?: number;
  handbags?: number;
};


type TourBooking = {
  name: string;
  email?: string;
  phone: string;

  route: string; 

  pickupCity: string;
  destination: string;

  pickupAddress: string;

  startDate?: string;

  requirements?: string;
};


type SelfDriveBooking = {
  name: string;
  phone: string;

  vehicleId: string;

  pickupDate: string;
  returnDate: string;

  license: string;

  requirements?: string;
};



type LuxuryBooking = {
  name:string;
  phone:string;

  luxuryCarId:string;

  pickup:string;
  destination:string;

  eventDate:string;

  hours:string;

  eventType:string;

  requirements?:string;
};



type WeddingBooking = {
  name:string;

  phone:string;

  luxuryCarId:string;

  pickup:string;

  venue:string;

  weddingDate:string;

  guests:number;

  carsRequired:number;

  decoration:string;

  requirements?:string;
};

type TempoBooking = {
  name: string;
  phone: string;
  vehicleId: string;
  pickup: string;
  destination: string;
  travelDate: string;
  passengers: string;
  suitcases?: string; // was missing — backend accepts this but the form never sent it
  tripType: string;
  requirements?: string;
};

type Feedback = {
  customerName: string;
  travelDate?: string;
  route?: string;

  satisfaction: string;

  vehicleRating: number;
  supportRating: number;

  driverExperience: string;

  comments?: string;

  recommend: string | boolean;
};


/* ---------------- COMMON POST ---------------- */

async function post<T>(url: string, data: any): Promise<T> {
  const cleanData = {
    ...data,
    travelDate:
      data.travelDate instanceof Date
        ? data.travelDate.toISOString()
        : data.travelDate,
  };

  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cleanData),
  });

  // Surface the backend's actual error message (e.g. "Missing required
  // fields: vehicleId") instead of a generic "Request failed" — the
  // backend routes now return specific, useful messages and callers
  // should be able to show those to the user.
  let parsed: any = null;
  try {
    parsed = await res.json();
  } catch {
    // non-JSON response, fall through
  }

  if (!res.ok) {
    throw new Error(parsed?.message || "Request failed");
  }

  return parsed as T;
}


export const createTempoBooking = (data: TempoBooking) =>
  post("/api/tempo-bookings", data);

/* ---------------- TAXI ---------------- */


export const createTaxiBooking =
(data:TaxiBooking)=>

post(
"/api/taxi-bookings",
data
);




/* ---------------- AIRPORT ---------------- */


export const createAirportBooking =
(data:AirportBooking)=>

    post(
        "/api/airport-bookings",
        data
    );
    
export const createFeedback = (data: Feedback) =>
    post("/api/feedback", data);
    
    
    
/* ---------------- TOUR ---------------- */


export const createTourBooking =
(data:TourBooking)=>

post(
"/api/tour-bookings",
data
);




/* ---------------- SELF DRIVE ---------------- */


export const createSelfDriveBooking =
(data:SelfDriveBooking)=>

post(
"/api/selfdrive-bookings",
data
);





/* ---------------- LUXURY ---------------- */


export const createLuxuryBooking =
(data:LuxuryBooking)=>

post(
"/api/luxury",
data
);





/* ---------------- WEDDING ---------------- */


export const createWeddingBooking =
(data:WeddingBooking)=>

post(
"/api/wedding",
data
);


/* ---------------- ADMIN BOOKINGS ----------------
   These all hit endpoints behind requireAdminDevice, which reads an
   httpOnly cookie. credentials: "include" is required on every one of
   these or the browser won't send that cookie and an otherwise-approved
   admin device will get a confusing 401. */

export const getAllBookings = async () => {
  const res = await fetch(`${API_URL}/api/bookings`, {
    credentials: "include",
  });
  return res.json();
};

export const getBookingById = async (id: string) => {
  // Intentionally public — this is the customer's own booking
  // confirmation page, not an admin action, so no credentials needed.
  const res = await fetch(`${API_URL}/api/bookings/${id}`);
  return res.json();
};

export const updateBookingStatus = async (id: string, status: string) => {
  const res = await fetch(`${API_URL}/api/bookings/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  return res.json();
};

export const deleteBooking = async (id: string) => {
  const res = await fetch(`${API_URL}/api/bookings/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return res.json();
};