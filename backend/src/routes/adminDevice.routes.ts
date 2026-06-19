import { Router } from "express";
import prisma from "../prisma";
import crypto from "crypto";


const router = Router();





/*
CREATE / REGISTER DEVICE
*/

router.post("/", async(req,res)=>{


try{


const {

name,

fingerprint,

userAgent

}=req.body;



if(
!name ||
!
fingerprint
){

return res.status(400).json({

success:false,

message:"Missing device information"

});

}





const existing =
await prisma.adminDevice.findUnique({

where:{
fingerprint
}

});





if(existing){


return res.json({

success:true,

device:existing,

message:"Device already registered"

});


}






const deviceToken =
crypto.randomBytes(32).toString("hex");






const device =
await prisma.adminDevice.create({

data:{


name,


fingerprint,


userAgent,


deviceToken


}

});





res.json({

success:true,

device

});



}

catch(error){


console.error(error);


res.status(500).json({

success:false,

message:"Failed to register device"

});


}


});










/*
GET ALL DEVICES
*/


router.get("/", async(req,res)=>{


try{


const devices =
await prisma.adminDevice.findMany({

orderBy:{
createdAt:"desc"
}

});



res.json({

success:true,

devices

});


}

catch(error){


console.error(error);


res.status(500).json({

success:false,

message:"Failed to fetch devices"

});


}



});









/*
ENABLE / DISABLE DEVICE
*/


router.patch("/:id/toggle", async(req,res)=>{


try{


const device =
await prisma.adminDevice.findUnique({

where:{
id:req.params.id
}

});



if(!device){

return res.status(404).json({

success:false,

message:"Device not found"

});

}






const updated =
await prisma.adminDevice.update({

where:{
id:req.params.id
},

data:{

active:
!device.active

}

});





res.json({

success:true,

device:updated

});



}

catch(error){


console.error(error);


res.status(500).json({

success:false,

message:"Failed to update device"

});


}


});










/*
DELETE DEVICE
*/


router.delete("/:id", async(req,res)=>{


try{


await prisma.adminDevice.delete({

where:{
id:req.params.id
}

});



res.json({

success:true,

message:"Device removed"

});


}

catch(error){


console.error(error);


res.status(500).json({

success:false,

message:"Failed to delete device"

});


}


});






export default router;