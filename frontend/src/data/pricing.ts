export const travelPricing = {
  taxi: [
    {
      id: "sedan",
      name: "Sedan",
      base: 2000,
      perKm: 14,
      kmpl: 18, // ⛽ fuel efficiency
    },
    {
      id: "suv",
      name: "SUV",
      base: 2500,
      perKm: 18,
      kmpl: 14,
    },
    {
      id: "innova",
      name: "Toyota Innova",
      base: 3000,
      perKm: 22,
      kmpl: 12,
    },
  ],

  group: [
    {
      id: "traveller12",
      name: "12 Seater Tempo Traveller",
      perDay: 4500,
      kmpl: 9,
    },
    {
      id: "urbania",
      name: "Force Urbania",
      perDay: 7500,
      kmpl: 8,
    },
  ],

  luxury: [
    {
      id: "fortuner",
      name: "Toyota Fortuner",
      perDay: 9000,
      kmpl: 10,
    },
    {
      id: "defender",
      name: "Land Rover Defender",
      perDay: 25000,
      kmpl: 8,
    },
    {
      id: "maybach",
      name: "Mercedes Maybach",
      perDay: 50000,
      kmpl: 6,
    },
  ],
};