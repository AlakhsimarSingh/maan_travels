export type TourPackage = {
  slug: string;
  title: string;
  shortDescription: string;
  duration: string;
  location: string;
  image: string;

  highlights: string[];

  itinerary: {
    day: string;
    title: string;
    description: string;
    places: string[];
  }[];

  pricing: {
    vehicle: string;
    price: number;
  }[];

  metaTitle: string;
  metaDescription: string;
};



export const tourPackages: TourPackage[] = [


{
slug:"amritsar-darshan-tour",

title:"Amritsar Darshan Tour",

shortDescription:
"Explore the spiritual and cultural heart of Punjab covering Golden Temple, Jallianwala Bagh, Wagah Border and famous attractions of Amritsar.",

duration:"1 Day",

location:"Amritsar",

image:"/images/packages/amritsar.jpg",


highlights:[
"Golden Temple",
"Jallianwala Bagh",
"Durgiana Temple",
"Wagah Border Ceremony",
"Hall Bazaar Shopping"
],



itinerary:[

{
day:"Day 1",

title:"Complete Amritsar Sightseeing",

description:
"Start your journey with hotel, airport or railway station pickup and explore the major attractions of Amritsar.",


places:[

"Golden Temple (Sri Harmandir Sahib)",
"Langar Hall",
"Jallianwala Bagh",
"Durgiana Temple",
"Maharaja Ranjit Singh Museum",
"Ram Tirath Temple",
"Wagah Border Ceremony",
"Hall Bazaar"

]

}

],



pricing:[

{
vehicle:"Sedan",
price:3500
},

{
vehicle:"SUV",
price:4500
},

{
vehicle:"Toyota Innova Crysta",
price:5500
}

],



metaTitle:
"Amritsar Darshan Tour Package | Maan Travels",

metaDescription:
"Book Amritsar sightseeing taxi tour covering Golden Temple, Wagah Border, Jallianwala Bagh and major attractions."

},





{
slug:"amritsar-dalhousie-dharamshala-tour",

title:"Amritsar Dalhousie Dharamshala Tour",

shortDescription:
"Experience Punjab and Himachal with a scenic journey covering Dalhousie, Khajjiar, Chamba and Dharamshala.",


duration:"5 Days / 4 Nights",

location:"Punjab & Himachal Pradesh",

image:"/images/packages/dalhousie.jpg",



highlights:[

"Dalhousie Sightseeing",
"Khajjiar Mini Switzerland",
"Chamba",
"McLeodganj",
"Dharamshala"

],



itinerary:[


{
day:"Day 1",

title:"Amritsar to Dalhousie",

description:
"Pickup from Amritsar Railway Station or Airport and transfer to Dalhousie. Explore local attractions.",

places:[

"Churches of Dalhousie",
"Jandhri Ghat",
"Bakrota Hills",
"Gandhi Chowk",
"Subash Bowli",
"Satdhara",
"Panjpulla"

]

},



{
day:"Day 2",

title:"Khajjiar and Chamba Excursion",

description:
"Visit the beautiful landscapes of Khajjiar, known as Mini Switzerland of India, followed by Chamba sightseeing.",

places:[

"Khajjiar Lake",
"Kalatop Sanctuary",
"Horse Riding",
"Chamba Town"

]

},



{
day:"Day 3",

title:"Dalhousie to Dharamshala",

description:
"Drive towards Dharamshala and enjoy a peaceful evening.",

places:[

"Dharamshala",
"Local Market",
"Relaxation Time"

]

},



{
day:"Day 4",

title:"Dharamshala Sightseeing",

description:
"Explore spiritual and scenic attractions around McLeodganj.",

places:[

"Bhagsunag Temple",
"Dalai Lama Monastery",
"Dal Lake",
"McLeodganj Bazaar"

]

},



{
day:"Day 5",

title:"Return Journey",

description:
"After breakfast proceed towards Jalandhar for onward journey.",

places:[

"Hotel Checkout",
"Jalandhar Drop"

]

}


],



pricing:[

{
vehicle:"Sedan",
price:18000
},

{
vehicle:"SUV",
price:23000
},

{
vehicle:"Innova Crysta",
price:28000
}

],



metaTitle:
"Amritsar Dalhousie Dharamshala Tour Package | Maan Travels",

metaDescription:
"Book a 5 day Himachal tour covering Dalhousie, Khajjiar, Chamba and Dharamshala."

},


{
slug:"amritsar-patnitop-srinagar-kashmir-tour",

title:"Amritsar Patnitop Srinagar Kashmir Tour",

shortDescription:
"Experience the beauty of Jammu and Kashmir covering Patnitop, Pahalgam, Srinagar, Gulmarg and Sonamarg with comfortable taxi services.",

duration:"7 Days / 6 Nights",

location:"Jammu & Kashmir",

image:"/images/packages/kashmir.jpg",


highlights:[

"Patnitop Sightseeing",
"Pahalgam Valley",
"Srinagar Lakes & Gardens",
"Gulmarg Snow Point",
"Sonamarg Golden Meadow"

],



itinerary:[


{
day:"Day 1",

title:"Amritsar to Patnitop",

description:
"Pickup from Amritsar and drive towards Patnitop. Explore the beautiful hill station and enjoy local sightseeing.",

places:[

"Patnitop Local Sightseeing",
"Nathatop",
"Nag Temple",
"Horse Riding"

]

},



{
day:"Day 2",

title:"Patnitop to Pahalgam Excursion",

description:
"Enjoy a full day excursion to the beautiful valley of Pahalgam surrounded by mountains and nature.",

places:[

"Pahalgam Valley",
"River Views",
"Local Sightseeing"

]

},



{
day:"Day 3",

title:"Pahalgam to Srinagar",

description:
"Travel towards Srinagar, the beautiful valley famous for lakes, gardens and houseboats.",

places:[

"Srinagar Arrival",
"Hotel Check-in",
"Shikara Ride to Nehru Park"

]

},



{
day:"Day 4",

title:"Srinagar Local Sightseeing",

description:
"Explore the famous Mughal gardens, religious places and scenic locations of Srinagar.",

places:[

"Chashme Shahi Garden",
"Nishat Garden",
"Shalimar Garden",
"Nagin Lake",
"Shankaracharya Temple",
"Hazratbal Shrine",
"Pari Mahal",
"Jama Masjid"

]

},



{
day:"Day 5",

title:"Gulmarg Excursion",

description:
"Visit Gulmarg, the famous meadow of flowers and enjoy snow activities.",

places:[

"Gulmarg",
"Tangmarg",
"Snow Point",
"Sled Riding",
"Gulmarg Golf Course"

]

},



{
day:"Day 6",

title:"Sonamarg Excursion",

description:
"Visit Sonamarg, known as the Golden Meadow surrounded by glaciers and mountains.",

places:[

"Sonamarg",
"Sind Valley",
"Trout Fishing Spots",
"Mountain Views"

]

},



{
day:"Day 7",

title:"Srinagar to Amritsar Drop",

description:
"After breakfast proceed back towards Amritsar for onward journey.",

places:[

"Srinagar Departure",
"Amritsar Drop"

]

}


],



pricing:[

{
vehicle:"Sedan",
price:32000
},

{
vehicle:"SUV",
price:42000
},

{
vehicle:"Toyota Innova Crysta",
price:50000
}

],



metaTitle:
"Amritsar Patnitop Srinagar Kashmir Tour Package | Maan Travels",

metaDescription:
"Book a Kashmir tour package from Amritsar covering Patnitop, Pahalgam, Srinagar, Gulmarg and Sonamarg."

},


];