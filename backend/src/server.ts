import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
dotenv.config();


import taxiRoutes from "./routes/taxi.routes";
import airportRoutes from "./routes/airport.routes";
import selfDriveRoutes from "./routes/selfdrive.routes";
import tourRoutes from "./routes/tour.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import bookingRoutes from "./routes/booking.routes";
import locationRoutes from "./routes/location.routes";
import luxuryRoutes from "./routes/luxury.routes";
import weddingRoutes from "./routes/wedding.routes";import tempoRoutes from "./routes/tempo.routes";
import feedbackRoutes from "./routes/feedback.routes";
import luxuryCarsRoutes from "./routes/luxuryCars.routes";
import adminDeviceRoutes from "./routes/adminDevice.routes";
import routeRoutes from "./routes/routes.routes";
import paymentRoutes from "./routes/payment.routes";
import statsRoutes from "./routes/stats.routes"
import airportsCatalogRoutes from "./routes/airports.routes";
import galleryRoutes from "./routes/gallery.routes";

import prisma from "./prisma";
import uploadRoutes from "./routes/upload.routes";
import pricingRoutes from "./routes/pricing.routes";


const app = express();


app.use(cors());

app.use(express.json());

app.use(
  "/api/taxi-bookings",
  taxiRoutes
);
app.use(
  "/api/airport-bookings",
  airportRoutes
);
app.use(
  "/api/selfdrive-bookings",
  selfDriveRoutes
);
app.use(
  "/api/tour-bookings",
  tourRoutes
);
app.use("/api/vehicles", 
  vehicleRoutes
);
app.use(
  "/api/wedding",
  weddingRoutes
);
app.use(
  "/api/bookings",
  bookingRoutes
);
app.use(
  "/api/locations",
  locationRoutes
);
app.use("/api/luxury", 
  luxuryRoutes
);
app.use("/api/tempo-bookings", 
  tempoRoutes
);
app.use("/api/feedback", 
  feedbackRoutes
);
app.use("/api/upload", 
  uploadRoutes
);
app.use(
  "/api/luxury-cars",
  luxuryCarsRoutes
);
app.use(
  "/api/admin-devices",
  adminDeviceRoutes
);
app.use("/api/routes", 
  routeRoutes
);
app.use("/api/stats",
  statsRoutes
);

app.use("/api/gallery", galleryRoutes);
app.use("/api/airports", airportsCatalogRoutes);
app.use("/api/pricing", pricingRoutes);
app.get("/",(req,res)=>{
  
  
  res.send(
"Maan Travels Backend Running"
);


});
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/payment", paymentRoutes);





// TEST DATABASE CONNECTION

app.get(
"/api/test",

async(req,res)=>{

try{


const count =
await prisma.booking.count();


res.json({

success:true,

bookings:count

});


}
catch(error){

console.error(error);


res.status(500).json({

success:false,

message:"Database error"

});


}


});






const PORT=5000;


app.listen(
PORT,
()=>{

console.log(
`Backend running on http://localhost:${PORT}`
);

}
);