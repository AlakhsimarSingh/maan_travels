const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";



/* ---------------- GET ALL ---------------- */

export const getAllLocations = async () => {

  const res = await fetch(
    `${API_URL}/api/locations/all`
  );

  return res.json();

};





/* ---------------- CREATE ---------------- */

export const createLocation = async (
  data:any
)=>{

  const res = await fetch(
    `${API_URL}/api/locations`,
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







/* ---------------- UPDATE ---------------- */

export const updateLocation = async(
  id:string,
  data:any
)=>{


const res = await fetch(

`${API_URL}/api/locations/${id}`,

{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

}

);


return res.json();


};









/* ---------------- DELETE ---------------- */


export const deleteLocation = async(
id:string
)=>{


const res = await fetch(

`${API_URL}/api/locations/${id}`,

{

method:"DELETE"

}

);


return res.json();


};