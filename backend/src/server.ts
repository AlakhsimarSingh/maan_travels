import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";



const app = express();


const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Maan Travels Backend Running ");
});


// CREATE BOOKING
app.post("/api/bookings", async (req, res) => {

  try {

    const booking = await prisma.booking.create({

      data: req.body,

    });


    res.json({
      success:true,
      booking,
    });


  } catch(error){

    console.error(error);

    res.status(500).json({
      error:"Failed to create booking"
    });

  }

});



// GET BOOKINGS (ADMIN)
app.get("/api/bookings", async(req,res)=>{

  try{

    const bookings =
      await prisma.booking.findMany({

        orderBy:{
          createdAt:"desc"
        }

      });


    res.json(bookings);


  }catch(error){

    res.status(500).json({
      error:"Failed fetching bookings"
    });

  }

});


const PORT = 5000;


app.listen(PORT,()=>{

console.log(
`Backend running on http://localhost:${PORT}`
);

});