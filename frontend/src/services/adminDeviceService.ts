const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";



export const getAdminDevices = async()=>{


const res = await fetch(
`${API_URL}/api/admin-devices`
);


return res.json();


};






export const registerAdminDevice = async(
data:any
)=>{


const res = await fetch(

`${API_URL}/api/admin-devices`,

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

}

);


return res.json();


};







export const toggleAdminDevice = async(
id:string
)=>{


const res = await fetch(

`${API_URL}/api/admin-devices/${id}/toggle`,

{

method:"PATCH"

}

);


return res.json();


};






export const deleteAdminDevice = async(
id:string
)=>{


const res = await fetch(

`${API_URL}/api/admin-devices/${id}`,

{

method:"DELETE"

}

);


return res.json();


};