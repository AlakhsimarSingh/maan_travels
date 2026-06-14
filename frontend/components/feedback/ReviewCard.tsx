type ReviewProps = {

name:string;

trip:string;

rating:number;

message:string;

};


export default function ReviewCard({
name,
trip,
rating,
message
}:ReviewProps){


return (

<div
className="
rounded-3xl
border
border-[#252525]
bg-[#141414]
p-6
"
>


<div
className="
flex
justify-between
"
>

<div>

<h3
className="
font-semibold
text-white
"
>
{name}
</h3>


<p
className="
text-sm
text-[#8a8a8a]
"
>
{trip}
</p>


</div>



<div
className="
text-[#ecb100]
"
>

{"★".repeat(rating)}

</div>


</div>



<p
className="
mt-5
text-[#c7c7c7]
"
>
{message}
</p>



</div>

);

}