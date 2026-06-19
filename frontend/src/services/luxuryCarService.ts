const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";



/* ---------------- GET ALL (ADMIN) ---------------- */

export const getAllLuxuryCars = async () => {

  const res = await fetch(
    `${API_URL}/api/luxury-cars/all`
  );

  if(!res.ok){

throw new Error(
"Failed to fetch luxury cars"
);

}

  return res.json();

};




/* ---------------- CREATE ---------------- */

export const createLuxuryCar = async (
  data:any
)=>{

  const res = await fetch(
    `${API_URL}/api/luxury-cars`,
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify(data),
    }
  );


  return res.json();

};




/* ---------------- UPDATE ---------------- */

export const updateLuxuryCar = async(
  id:string,
  data:any
)=>{


 const res = await fetch(
   `${API_URL}/api/luxury-cars/${id}`,
   {
    method:"PUT",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify(data),
   }
 );


 return res.json();

};





/* ---------------- DELETE ---------------- */

export const deleteLuxuryCar = async(
 id:string
)=>{

 const res = await fetch(
   `${API_URL}/api/luxury-cars/${id}`,
   {
    method:"DELETE",
   }
 );


 return res.json();

};