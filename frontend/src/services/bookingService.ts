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

  if (!res.ok) throw new Error("Request failed");

  return res.json();
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


/* ---------------- ADMIN BOOKINGS ---------------- */

export const getAllBookings = async () => {
  const res = await fetch(`${API_URL}/api/bookings`);
  return res.json();
};

export const getBookingById = async (id: string) => {
  const res = await fetch(`${API_URL}/api/bookings/${id}`);
  return res.json();
};

export const updateBookingStatus = async (id: string, status: string) => {
  const res = await fetch(`${API_URL}/api/bookings/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  return res.json();
};

export const deleteBooking = async (id: string) => {
  const res = await fetch(`${API_URL}/api/bookings/${id}`, {
    method: "DELETE",
  });

  return res.json();
};