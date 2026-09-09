/**
 * Realistic Indian Transport Directory with live-like timetable data:
 * - Vande Bharat Express, Rajdhani, Shatabdi & Superfast Trains with codes (e.g. 20833)
 * - Domestic Flights (IndiGo 6E 543, Air India AI 889, Akasa Air)
 * - AC Volvo Multi-Axle Intercity Buses (APSRTC Amaravati, KSRTC Club Class, IntrCity)
 * - Major gateway cities mapping for destination-only plans.
 */

export const majorGateways = [
  { city: "Delhi NCR", state: "Delhi", hub: "NDLS / IGI T3" },
  { city: "Hyderabad", state: "Telangana", hub: "Secunderabad (SC) / RGIA (HYD)" },
  { city: "Visakhapatnam", state: "Andhra Pradesh", hub: "VSKP / VTZ Airport" },
  { city: "Bengaluru", state: "Karnataka", hub: "SBC / BLR Airport" },
  { city: "Mumbai", state: "Maharashtra", hub: "CSMT / BOM T2" },
  { city: "Kolkata", state: "West Bengal", hub: "Howrah (HWH) / CCU Airport" },
  { city: "Chennai", state: "Tamil Nadu", hub: "MAS / MAA Airport" },
];

export const transportFacilities = {
  trains: [
    {
      id: "tr-20833",
      name: "Vande Bharat Express",
      code: "20833 / 20834",
      departure: "05:45 AM",
      arrival: "02:15 PM",
      duration: "8h 30m",
      classes: "Chair Car (CC) & Exec (EC)",
      price: 1420,
      punctuality: "98% On-Time",
      meals: "Complimentary Hot Breakfast & Lunch Included",
      routes: ["Visakhapatnam", "Secunderabad", "Hyderabad", "Vijayawada", "Rajahmundry", "Warangal"],
    },
    {
      id: "tr-22436",
      name: "Vande Bharat Express (Kashi)",
      code: "22436",
      departure: "06:00 AM",
      arrival: "02:00 PM",
      duration: "8h 00m",
      classes: "CC / EC",
      price: 1750,
      punctuality: "99% On-Time",
      meals: "Satvik Vegetarian Breakfast & Lunch",
      routes: ["Delhi", "Varanasi", "Prayagraj", "Kanpur"],
    },
    {
      id: "tr-12002",
      name: "Bhopal Shatabdi Express",
      code: "12002",
      departure: "06:00 AM",
      arrival: "07:50 AM",
      duration: "1h 50m",
      classes: "CC / EC",
      price: 790,
      punctuality: "97% On-Time",
      meals: "Morning Tea & Breakfast",
      routes: ["Delhi", "Agra", "Gwalior", "Bhopal"],
    },
    {
      id: "tr-12438",
      name: "Secunderabad Rajdhani Express",
      code: "12438",
      departure: "03:35 PM",
      arrival: "01:10 PM (+1 day)",
      duration: "21h 35m",
      classes: "3AC / 2AC / 1AC",
      price: 2850,
      punctuality: "96% On-Time",
      meals: "Full Course Dinner, Tea & Breakfast Included",
      routes: ["Delhi", "Hyderabad", "Nagpur", "Bhopal"],
    },
    {
      id: "tr-12728",
      name: "Godavari Superfast Express",
      code: "12727 / 12728",
      departure: "05:05 PM",
      arrival: "05:45 AM (+1 day)",
      duration: "12h 40m",
      classes: "Sleeper (SL) / 3AC / 2AC",
      price: 850,
      punctuality: "94% On-Time",
      meals: "Pantry Car Available",
      routes: ["Hyderabad", "Visakhapatnam", "Vijayawada", "Eluru", "Samalkot"],
    },
    {
      id: "tr-12806",
      name: "Janmabhoomi Express",
      code: "12805 / 12806",
      departure: "06:15 AM",
      arrival: "06:40 PM",
      duration: "12h 25m",
      classes: "2S / CC",
      price: 640,
      punctuality: "93% On-Time",
      meals: "On-Seat Pantry Meals",
      routes: ["Visakhapatnam", "Vijayawada", "Guntur", "Secunderabad"],
    },
    {
      id: "tr-12952",
      name: "Mumbai Rajdhani Express",
      code: "12951 / 12952",
      departure: "04:55 PM",
      arrival: "08:35 AM (+1 day)",
      duration: "15h 40m",
      classes: "3AC / 2AC / 1AC",
      price: 3100,
      punctuality: "98% On-Time",
      meals: "Multi-Course Gourmet Rail Dining",
      routes: ["Delhi", "Mumbai", "Surat", "Vadodara", "Kota"],
    },
    {
      id: "tr-20608",
      name: "Mysuru - Chennai Vande Bharat",
      code: "20607 / 20608",
      departure: "01:05 PM",
      arrival: "07:20 PM",
      duration: "6h 15m",
      classes: "CC / EC",
      price: 1280,
      punctuality: "99% On-Time",
      meals: "South Indian Snacks & Beverage Service",
      routes: ["Bengaluru", "Chennai", "Mysore", "Katpadi"],
    },
  ],

  flights: [
    {
      id: "fl-6e543",
      airline: "IndiGo",
      code: "6E 543",
      departure: "07:15 AM",
      arrival: "09:30 AM",
      duration: "2h 15m",
      price: 4850,
      baggage: "15kg Check-in + 7kg Cabin",
      routes: ["Delhi", "Visakhapatnam", "Hyderabad", "Bengaluru", "Mumbai"],
    },
    {
      id: "fl-ai889",
      airline: "Air India (Tata)",
      code: "AI 889",
      departure: "11:20 AM",
      arrival: "01:40 PM",
      duration: "2h 20m",
      price: 5400,
      baggage: "25kg Check-in + Complimentary Warm Meal",
      routes: ["Delhi", "Varanasi", "Hyderabad", "Mumbai", "Chennai"],
    },
    {
      id: "fl-qp1388",
      airline: "Akasa Air",
      code: "QP 1388",
      departure: "04:30 PM",
      arrival: "06:45 PM",
      duration: "2h 15m",
      price: 4200,
      baggage: "15kg Check-in + 7kg Cabin",
      routes: ["Bengaluru", "Visakhapatnam", "Hyderabad", "Kolkata", "Mumbai"],
    },
    {
      id: "fl-6e2104",
      airline: "IndiGo Heritage Link",
      code: "6E 2104",
      departure: "09:10 AM",
      arrival: "10:45 AM",
      duration: "1h 35m",
      price: 3950,
      baggage: "15kg Check-in + 7kg Cabin",
      routes: ["Delhi", "Jaipur", "Agra", "Varanasi", "Tirupati"],
    },
  ],

  buses: [
    {
      id: "bus-amr01",
      operator: "APSRTC Amaravati Multi-Axle Volvo",
      code: "AP-09-V88",
      departure: "09:00 PM",
      arrival: "06:30 AM (+1 day)",
      duration: "9h 30m",
      type: "AC Multi-Axle Sleeper (2+1)",
      price: 1250,
      amenities: "Blanket, Water Bottle, USB Charging, Live GPS",
      routes: ["Visakhapatnam", "Hyderabad", "Vijayawada", "Tirupati", "Rajahmundry"],
    },
    {
      id: "bus-ic402",
      operator: "IntrCity SmartBus AC Sleeper",
      code: "IC-402",
      departure: "08:30 PM",
      arrival: "06:00 AM (+1 day)",
      duration: "9h 30m",
      type: "Air-Suspension AC Sleeper",
      price: 1550,
      amenities: "Lounge Access, Mineral Water, Clean Bedding, CCTV",
      routes: ["Delhi", "Agra", "Jaipur", "Varanasi"],
    },
    {
      id: "bus-ksrtc05",
      operator: "KSRTC Airavat Club Class",
      code: "KA-01-F900",
      departure: "10:15 PM",
      arrival: "06:45 AM (+1 day)",
      duration: "8h 30m",
      type: "Scania Multi-Axle AC Recliner",
      price: 1180,
      amenities: "Reclining Seats, Reading Light, Emergency Button",
      routes: ["Bengaluru", "Mysore", "Hampi", "Tirupati"],
    },
  ],
};

/**
 * Find matched transport facilities for a given origin & destination.
 * If origin is omitted, provides options arriving at destination from key gateway hubs.
 */
export function getAvailableTransports(origin, destination, selectedMode) {
  const destClean = (destination || "").toLowerCase();
  const origClean = (origin || "").toLowerCase();

  const isModeMatch = (modeStr, targetMode) => {
    if (!targetMode) return true;
    const t = targetMode.toLowerCase();
    if (t.includes("train") || t.includes("vande bharat")) return modeStr === "train";
    if (t.includes("flight") || t.includes("plane")) return modeStr === "flight";
    if (t.includes("bus") || t.includes("volvo")) return modeStr === "bus";
    return true;
  };

  const trainMatches = transportFacilities.trains.filter((tr) => {
    const touchesDest = tr.routes.some((r) => destClean.includes(r.toLowerCase()) || r.toLowerCase().includes(destClean));
    if (!touchesDest) return false;
    if (origClean) {
      return tr.routes.some((r) => origClean.includes(r.toLowerCase()) || r.toLowerCase().includes(origClean));
    }
    return true;
  });

  const flightMatches = transportFacilities.flights.filter((fl) => {
    const touchesDest = fl.routes.some((r) => destClean.includes(r.toLowerCase()) || r.toLowerCase().includes(destClean));
    if (!touchesDest) return false;
    if (origClean) {
      return fl.routes.some((r) => origClean.includes(r.toLowerCase()) || r.toLowerCase().includes(origClean));
    }
    return true;
  });

  const busMatches = transportFacilities.buses.filter((b) => {
    const touchesDest = b.routes.some((r) => destClean.includes(r.toLowerCase()) || r.toLowerCase().includes(destClean));
    if (!touchesDest) return false;
    if (origClean) {
      return b.routes.some((r) => origClean.includes(r.toLowerCase()) || r.toLowerCase().includes(origClean));
    }
    return true;
  });

  return {
    trains: trainMatches.length > 0 ? trainMatches : transportFacilities.trains.slice(0, 3),
    flights: flightMatches.length > 0 ? flightMatches : transportFacilities.flights.slice(0, 3),
    buses: busMatches.length > 0 ? busMatches : transportFacilities.buses.slice(0, 2),
  };
}
