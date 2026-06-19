import { Router } from "express";
import prisma from "../prisma";
import adminDeviceAuth from "../middleware/adminDeviceAuth";

const router = Router();





/*
PUBLIC
GET PICKUP LOCATIONS
*/

router.get("/pickup", async(req,res)=>{


try{


const locations =
await prisma.tourLocation.findMany({

where:{

active:true,

canPickup:true

},

orderBy:{
name:"asc"
}

});


res.json({

success:true,

locations

});


}

catch(error){

console.error(error);

res.status(500).json({

success:false,

message:"Failed to fetch pickup locations"

});

}


});








/*
PUBLIC
GET DROP LOCATIONS
*/


router.get("/drop", async(req,res)=>{


try{


const locations =
await prisma.tourLocation.findMany({

where:{

active:true,

canDrop:true

},

orderBy:{
name:"asc"
}

});


res.json({

success:true,

locations

});


}

catch(error){

console.error(error);


res.status(500).json({

success:false,

message:"Failed to fetch drop locations"

});


}


});









/*
ADMIN
GET ALL
*/


router.get("/all", async(req,res)=>{


try{


const locations =
await prisma.tourLocation.findMany({

orderBy:{
createdAt:"desc"
}

});


res.json({

success:true,

locations

});


}

catch(error){

console.error(error);


res.status(500).json({

success:false,

message:"Failed to fetch locations"

});


}


});










/*
ADMIN
CREATE
*/


router.post("/", async(req,res)=>{


try{


const {

name,

canPickup,

canDrop

}=req.body;



const location =
await prisma.tourLocation.create({

data:{


name,


canPickup:
canPickup ?? false,


canDrop:
canDrop ?? false


}


});



res.json({

success:true,

location

});


}

catch(error){


console.error(error);


res.status(500).json({

success:false,

message:"Failed to create location"

});


}


});









/*
ADMIN
UPDATE
*/


router.put("/:id", async(req,res)=>{


try{


const {

name,

canPickup,

canDrop,

active

}=req.body;



const location =
await prisma.tourLocation.update({

where:{
id:req.params.id
},

data:{


name,


canPickup,


canDrop,


active


}


});



res.json({

success:true,

location

});


}

catch(error){


console.error(error);


res.status(500).json({

success:false,

message:"Failed to update location"

});


}


});









/*
ADMIN
DELETE
*/


router.delete("/:id", async(req,res)=>{


try{


await prisma.tourLocation.delete({

where:{
id:req.params.id
}

});


res.json({

success:true,

message:"Location deleted"

});


}

catch(error){


console.error(error);


res.status(500).json({

success:false,

message:"Failed to delete location"

});


}


});





export default router;