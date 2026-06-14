export type ItineraryDay = {
  day: string;
  title: string;
  description?: string;
  places?: string[];
};


export type TourPackage = {
  id: string;
  title: string;
  slug: string;
  duration: string;
  location: string;
  image: string;
  shortDescription: string;

  highlights: string[];

  itinerary: ItineraryDay[];

  vehicles: string[];
};



export const tourPackages: TourPackage[] = [


/* -------------------------------------------------
   AMRITSAR DARSHAN
-------------------------------------------------- */

{
  id:"amritsar-darshan",

  title:"Amritsar Darshan Tour",

  slug:"amritsar-darshan",

  duration:"1 Day",

  location:"Amritsar, Punjab",

  image:"/images/packages/amritsar.jpg",


  shortDescription:
  "Experience the spiritual and cultural heritage of Amritsar with Golden Temple, Wagah Border and historic landmarks.",


  highlights:[
    "Golden Temple",
    "Jallianwala Bagh",
    "Durgiana Temple",
    "Wagah Border",
    "Hall Bazaar"
  ],


  itinerary:[

    {
      day:"Day 1",

      title:"Complete Amritsar Sightseeing",

      description:
      "Pickup from your preferred location and explore the famous spiritual, historical and cultural attractions of Amritsar.",

      places:[
        "Golden Temple (Sri Harmandir Sahib)",
        "Langar Hall",
        "Jallianwala Bagh",
        "Durgiana Temple",
        "Maharaja Ranjit Singh Museum",
        "Ram Tirath Temple",
        "Wagah Border Retreat Ceremony",
        "Hall Bazaar Shopping"
      ]
    }

  ],


  vehicles:[
    "Sedan",
    "SUV",
    "Innova Crysta",
    "Tempo Traveller"
  ]

},



/* -------------------------------------------------
 AMRITSAR DALHOUSIE DHARAMSHALA
-------------------------------------------------- */


{
 id:"amritsar-dalhousie-dharamshala",

 title:"Amritsar Dalhousie Dharamshala Tour",

 slug:"amritsar-dalhousie-dharamshala",

 duration:"5 Days / 4 Nights",

 location:"Punjab & Himachal Pradesh",

 image:"/images/packages/dalhousie.jpg",


 shortDescription:
 "A beautiful Himachal journey covering Dalhousie, Khajjiar, Dharamshala and the spiritual city of Amritsar.",


 highlights:[
   "Amritsar Sightseeing",
   "Khajjiar Mini Switzerland",
   "Dalhousie Hills",
   "McLeod Ganj",
   "Dalai Lama Temple"
 ],


 itinerary:[

 {
   day:"Day 1",

   title:"Amritsar To Dalhousie",

   description:
   "Pickup from Amritsar Railway Station/Airport and drive towards Dalhousie.",

   places:[
    "Golden Temple",
    "Jallianwala Bagh",
    "Dalhousie Churches",
    "Gandhi Chowk",
    "Bakrota Hills",
    "Satdhara",
    "Panjpulla"
   ]
 },


 {
   day:"Day 2",

   title:"Khajjiar & Chamba Sightseeing",

   description:
   "Explore the scenic beauty of Khajjiar, famous as Mini Switzerland of India.",

   places:[
    "Khajjiar Lake",
    "Khajji Nag Temple",
    "Horse Riding",
    "Adventure Activities",
    "Chamba Valley"
   ]
 },


 {
   day:"Day 3",

   title:"Dalhousie To Dharamshala",

   description:
   "Drive towards Dharamshala and enjoy the peaceful Himalayan surroundings.",

   places:[
    "Dharamshala",
    "Local Market",
    "Relaxation Time"
   ]
 },


 {
   day:"Day 4",

   title:"Dharamshala & McLeod Ganj Sightseeing",

   places:[
    "Bhagsunag Temple",
    "Dalai Lama Monastery",
    "Dal Lake",
    "McLeod Ganj Bazaar"
   ]
 },


 {
   day:"Day 5",

   title:"Dharamshala To Jalandhar Drop",

   description:
   "After breakfast proceed towards Jalandhar for onward journey."
 }


 ],


 vehicles:[
  "Sedan",
  "SUV",
  "Innova Crysta",
  "Tempo Traveller"
 ]

},



/* -------------------------------------------------
 KASHMIR TOUR
-------------------------------------------------- */


{
id:"amritsar-patnitop-srinagar",

title:"Amritsar Patnitop Srinagar Kashmir Tour",

slug:"amritsar-patnitop-srinagar",

duration:"7 Days / 6 Nights",

location:"Jammu & Kashmir",

image:"/images/packages/kashmir.jpg",


shortDescription:
"Discover the beauty of Kashmir with Patnitop, Pahalgam, Srinagar, Gulmarg and Sonamarg sightseeing.",


highlights:[
 "Patnitop",
 "Pahalgam Valley",
 "Srinagar Lakes",
 "Gulmarg",
 "Sonamarg"
],


itinerary:[

{
day:"Day 1",
title:"Amritsar To Patnitop",

places:[
"Patnitop Local Sightseeing",
"Nag Temple",
"Nathatop",
"Horse Riding"
]
},


{
day:"Day 2",
title:"Patnitop To Pahalgam",

places:[
"Pahalgam Valley",
"Nature Sightseeing"
]
},


{
day:"Day 3",
title:"Pahalgam To Srinagar",

places:[
"Srinagar",
"Dallake",
"Shikara Ride",
"Nehru Park"
]
},


{
day:"Day 4",
title:"Srinagar Local Sightseeing",

places:[
"Chashme Shahi Garden",
"Nishat Garden",
"Shalimar Garden",
"Nagin Lake",
"Shankaracharya Temple",
"Hazratbal Shrine"
]
},


{
day:"Day 5",
title:"Gulmarg Excursion",

places:[
"Gulmarg Valley",
"Snow Point",
"Ski Slopes",
"Sled Riding"
]
},


{
day:"Day 6",
title:"Sonamarg Excursion",

places:[
"Golden Meadow",
"Mountain Views",
"Glacier Views"
]
},


{
day:"Day 7",
title:"Srinagar To Amritsar Drop"
}

],


vehicles:[
"Sedan",
"SUV",
"Innova Crysta",
"Tempo Traveller"
]

},



/* -------------------------------------------------
 SHIMLA MANALI
-------------------------------------------------- */


{
id:"shimla-manali",

title:"Chandigarh Shimla Manali Tour",

slug:"shimla-manali",

duration:"5 Days / 4 Nights",

location:"Himachal Pradesh",

image:"/images/packages/shimla-manali.jpg",


shortDescription:
"Explore Shimla and Manali with scenic valleys, adventure destinations and Himalayan sightseeing.",


highlights:[
"Shimla Mall Road",
"Kufri",
"Manali",
"Solang Valley",
"Rohtang Pass"
],


itinerary:[

{
day:"Day 1",
title:"Chandigarh To Shimla",

places:[
"Shimla Arrival",
"Hotel Check-in",
"Mountain Drive"
]
},


{
day:"Day 2",
title:"Shimla Sightseeing",

places:[
"Kufri",
"Wild Flower Hall",
"Kali Bari Temple",
"Mall Road",
"The Ridge"
]
},


{
day:"Day 3",
title:"Shimla To Manali",

places:[
"Sundernagar Lake",
"Pandoh Dam",
"Kullu Valley",
"Vaishno Devi Temple"
]
},


{
day:"Day 4",
title:"Manali Sightseeing",

places:[
"Hadimba Temple",
"Club House",
"Tibetan Monastery",
"Vashisht Temple",
"Solang Valley",
"Rohtang Pass"
]
},


{
day:"Day 5",
title:"Manali To Chandigarh Drop"
}

],


vehicles:[
"Sedan",
"SUV",
"Innova Crysta",
"Tempo Traveller"
]

}

];