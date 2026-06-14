import SelfDriveFleet from "@/components/self-drive/SelfDriveFleet";


export default function SelfDrivePage(){

return (

<>
<section className="pt-32 pb-10 text-center">

<p className="uppercase tracking-[0.3em] text-[#ecb100]">
Maan Travels
</p>

<h1 className="mt-4 text-5xl font-bold text-white">
Self Drive Car Rentals
</h1>

<p className="mt-6 text-[#c7c7c7]">
Rent premium SUVs and cars with flexible packages.
</p>

</section>


<SelfDriveFleet />

</>

)

}