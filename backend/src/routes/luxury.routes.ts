import {Router} from "express";
import prisma from "../prisma";


const router = Router();



router.post("/", async(req,res)=>{


try{


const {


name,
phone,

luxuryCarId,

pickup,

destination,

eventDate,

hours,

eventType,

requirements


}=req.body;





const customer =
await prisma.customer.create({

data:{

name,

phone

}

});







const booking =
await prisma.booking.create({

data:{


customerId:customer.id,


serviceType:"LUXURY",



luxury:{


create:{


luxuryCarId,


pickup,


destination,


eventDate:new Date(eventDate),


hours,


eventType,


requirements


}


}


},


include:{


customer:true,

luxury:true


}


});






res.json({

success:true,

bookingId: booking.id,

booking

});



}

catch(error){


console.log(error);


res.status(500).json({

success:false,

message:"Luxury booking failed"

});


}


});




export default router;