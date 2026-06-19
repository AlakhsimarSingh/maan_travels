const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";


export const getLuxuryCarBySlug = async (
  slug:string
)=>{


const res =
await fetch(
`${API_URL}/api/luxury-cars/${slug}`,
{
cache:"no-store"
}
);


if(!res.ok){

return null;

}


return res.json();


};