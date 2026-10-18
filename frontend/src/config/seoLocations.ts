/**
 * Cities and keyword phrases used across metadata and structured data.
 *
 * Kept in one place so every page targets the same local search terms —
 * Jalandhar first (where the business is), then the Delhi ⇄ Jalandhar
 * corridor, then the rest of Punjab, Delhi NCR, Haryana, Himachal Pradesh
 * and Rajasthan.
 */

export const HOME_CITY = "Jalandhar";

export const PUNJAB_CITIES = [
  "Jalandhar",
  "Amritsar",
  "Ludhiana",
  "Phagwara",
  "Kapurthala",
  "Hoshiarpur",
  "Nawanshahr",
  "Pathankot",
  "Batala",
  "Mohali",
  "Patiala",
  "Bathinda",
  "Moga",
  "Firozpur",
];

export const DELHI_NCR_CITIES = ["Delhi", "New Delhi", "Gurugram", "Noida"];

export const HARYANA_CITIES = ["Ambala", "Karnal", "Panipat", "Kurukshetra", "Sonipat", "Panchkula"];

export const RAJASTHAN_CITIES = ["Jaipur", "Udaipur", "Jodhpur", "Ajmer", "Bikaner", "Jaisalmer"];

export const HIMACHAL_CITIES = [
  "Shimla",
  "Manali",
  "Kullu",
  "Dharamshala",
  "McLeod Ganj",
  "Dalhousie",
  "Kasauli",
  "Chamba",
  "Palampur",
  "Kangra",
  "Una",
  "Mandi",
  "Bilaspur",
  "Solan",
  "Chintpurni",
  "Jwalamukhi",
  "Baijnath",
];

export const OTHER_CITIES = ["Chandigarh", "Jammu", "Katra"];

export const STATES = [
  "Punjab",
  "Delhi",
  "Haryana",
  "Rajasthan",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Chandigarh",
];

/** Highest-intent searches — the Delhi ⇄ Jalandhar corridor and Jalandhar taxi. */
export const PRIMARY_KEYWORDS = [
  "Delhi to Jalandhar taxi",
  "Jalandhar to Delhi taxi",
  "Delhi to Jalandhar cab",
  "Jalandhar to Delhi cab",
  "Delhi airport to Jalandhar taxi",
  "Jalandhar to Delhi airport taxi",
  "taxi service in Jalandhar",
  "cab service in Jalandhar",
  "Jalandhar taxi",
  "one way taxi Jalandhar",
  "outstation cab Jalandhar",
];

export const SECONDARY_KEYWORDS = [
  "Jalandhar to Amritsar taxi",
  "Jalandhar to Chandigarh taxi",
  "Amritsar airport taxi",
  "Chandigarh airport taxi",
  "Ludhiana to Delhi taxi",
  "Amritsar to Delhi taxi",
  "Punjab taxi service",
  "Jalandhar to Jaipur taxi",
  "Delhi to Amritsar taxi",
  "Ambala taxi",
  "Haryana taxi service",
  "Rajasthan tour taxi",
  "Jalandhar to Manali taxi",
  "Jalandhar to Shimla taxi",
  "Jalandhar to Dharamshala taxi",
  "Jalandhar to Dalhousie taxi",
  "Delhi to Manali taxi",
  "Himachal taxi from Jalandhar",
  "Himachal tour package from Punjab",
  "Jalandhar to Chintpurni taxi",
  "tempo traveller Jalandhar",
  "wedding car rental Jalandhar",
  "luxury car rental Punjab",
];

export const ALL_SERVED_CITIES = [
  ...PUNJAB_CITIES,
  ...DELHI_NCR_CITIES,
  ...HARYANA_CITIES,
  ...RAJASTHAN_CITIES,
  ...HIMACHAL_CITIES,
  ...OTHER_CITIES,
];
