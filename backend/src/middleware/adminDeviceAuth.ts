import {
Request,
Response,
NextFunction
} from "express";

import prisma from "../prisma";



export default async function adminDeviceAuth(
req:Request,
res:Response,
next:NextFunction
){


try{


const token =
req.headers[
"x-admin-device-token"
] as string;



if(!token){

return res.status(403).json({

success:false,

message:"Device token missing"

});

}




const device =
await prisma.adminDevice.findUnique({

where:{
deviceToken:token
}

});





if(
!device ||
!device.active
){

return res.status(403).json({

success:false,

message:"Device access denied"

});

}





await prisma.adminDevice.update({

where:{
id:device.id
},

data:{
lastUsed:new Date()
}

});




next();



}
catch(error){


console.error(error);


res.status(500).json({

success:false,

message:"Device verification failed"

});


}


}