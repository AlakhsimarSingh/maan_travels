import { Router } from "express";

import prisma from "../prisma";


const router = Router();



router.post(
"/",

async(req,res)=>{


try{


const {

name,
email,
phone,

rideMode,

pickup,
drop,

vehicle,

distance,

travelDate


}=req.body;




const customer =
await prisma.customer.create({

data:{

name,

email,

phone

}

});





const booking =
await prisma.booking.create({


	data:{

	customer: { connect: { id: customer.id } },


	serviceType:"TAXI",


taxi:{


create:{


rideMode,

pickup,

drop,

vehicle,

distance,

travelDate:
travelDate
?
new Date(travelDate)
:
null


}


}


},


include:{


taxi:true,

customer:true


}



});




res.json({

success:true,

booking

});


}

catch(error){


console.error(error);


res.status(500).json({

success:false,

message:"Taxi booking failed"

});


}


});


export default router;