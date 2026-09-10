import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  Mic, MicOff, MapPin, Star, Bus, Car, Train, Plane, Bot, CreditCard, 
  Wallet, Download, CheckCircle, Phone, ShieldCheck, 
  Compass, Gift, CheckCircle2, Calendar, Accessibility, 
  X, QrCode, Award, Sparkles, Volume2
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { getHotelsForCity, governmentRecognizedHotels } from "@/lib/hotelDirectoryData";
import { getAvailableTransports } from "@/components/lib/transportDirectoryData";
import { generateTripVoucherPDF } from "@/components/lib/pdfGenerator";
import TripPlanDetail from "@/components/TripPlanDetail";
import BudgetDashboard from "@/components/BudgetDashboard";
import VoiceToTextInput from "@/components/ui/VoiceToTextInput";

export const licensedHeritageGuides = [
  {
    id: "g-1",
    name: "Suresh Babu",
    badge: "ASI-AP-849",
    city: "Visakhapatnam",
    languages: ["Telugu", "English", "Hindi"],
    experience: "12 yrs exp",
    rating: 4.95,
    toursCount: 142,
    ratePerDay: 1400,
    specialty: "Buddhist heritage, Araku tribal history & Coastal flora",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "g-2",
    name: "Mirza Farooq",
    badge: "ASI-TS-219",
    city: "Hyderabad",
    languages: ["Urdu", "Hindi", "Telugu", "English"],
    experience: "16 yrs exp",
    rating: 4.98,
    toursCount: 320,
    ratePerDay: 1600,
    specialty: "Qutb Shahi architecture, Golconda acoustics & Nizami culinary lore",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "g-3",
    name: "Rajendra Sharma",
    badge: "ASI-UP-102",
    city: "Agra",
    languages: ["Hindi", "English", "Spanish"],
    experience: "14 yrs exp",
    rating: 4.92,
    toursCount: 410,
    ratePerDay: 1500,
    specialty: "Mughal marble inlay craftsmanship & Taj Mahal sunset angles",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "g-4",
    name: "Ananya Sen",
    badge: "ASI-DL-388",
    city: "Delhi",
    languages: ["Hindi", "Bengali", "English", "French"],
    experience: "9 yrs exp",
    rating: 4.91,
    toursCount: 185,
    ratePerDay: 1350,
    specialty: "Old Delhi Chandni Chowk walks & Mughal architectural conservation",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "g-5",
    name: "Priya Ramanathan",
    badge: "ASI-AP-412",
    city: "Tirupati",
    languages: ["Tamil", "Telugu", "English", "Kannada"],
    experience: "11 yrs exp",
    rating: 4.96,
    toursCount: 220,
    ratePerDay: 1450,
    specialty: "Dravidian temple architecture, Chola inscriptions & Tirumala traditions",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "g-6",
    name: "Vikram Rathore",
    badge: "ASI-RJ-507",
    city: "Jaipur",
    languages: ["Hindi", "Rajasthani", "English", "German"],
    experience: "13 yrs exp",
    rating: 4.94,
    toursCount: 290,
    ratePerDay: 1550,
    specialty: "Rajput fort defense mechanisms & block printing artisan tours",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "g-7",
    name: "Pandit Devendra Pandey",
    badge: "ASI-UP-781",
    city: "Varanasi",
    languages: ["Sanskrit", "Hindi", "English"],
    experience: "18 yrs exp",
    rating: 4.99,
    toursCount: 450,
    ratePerDay: 1600,
    specialty: "Ganga Aarti philosophy, Kashi Vishwanath corridors & Kabir mutt",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
  },
];

export const localTransitOptions = [
  {
    id: "dedicated-cab",
    name: "Dedicated AC Chauffeur Cab / SUV",
    icon: Car,
    desc: "Private air-conditioned car with verified tourist driver throughout the itinerary",
    dailyRate: 1800,
    tag: "Most Popular for Families",
  },
  {
    id: "eco-rickshaw",
    name: "Eco E-Auto & Heritage Rickshaw Passes",
    icon: Car,
    desc: "Clean electric auto-rickshaw rides for navigating heritage bazaars & temple lanes",
    dailyRate: 650,
    tag: "Eco & Agile",
  },
  {
    id: "hop-on-bus",
    name: "State Tourism (APTDC / TG) Hop-On Hop-Off AC Coach",
    icon: Bus,
    desc: "Curated sightseeing circuit coach connecting all monuments with audio commentary",
    dailyRate: 450,
    tag: "Budget Friendly",
  },
  {
    id: "self-drive",
    name: "Self-Drive EV / Sedan Rental",
    icon: Car,
    desc: "GPS-enabled sanitized self-drive car with unlimited km within district circuit",
    dailyRate: 1600,
    tag: "Total Flexibility",
  },
];

const popularDestinations = [
  { name: "Visakhapatnam", state: "Andhra Pradesh", note: "Beaches, Buddhist Hills & Borra Caves" },
  { name: "Hyderabad", state: "Telangana", note: "Charminar, Falaknuma & Golconda Fort" },
  { name: "Tirupati", state: "Andhra Pradesh", note: "Sacred Tirumala Seven Hills" },
  { name: "Vijayawada", state: "Andhra Pradesh", note: "Kanaka Durga & Bhavani Island" },
  { name: "Warangal", state: "Telangana", note: "Kakatiya UNESCO Temple & Laknavaram" },
  { name: "Delhi", state: "Delhi NCR", note: "Mughal Forts & Heritage Bazaars" },
  { name: "Agra", state: "Uttar Pradesh", note: "Taj Mahal & Fatehpur Sikri" },
  { name: "Jaipur", state: "Rajasthan", note: "Amber Fort & Pink City Palaces" },
  { name: "Varanasi", state: "Uttar Pradesh", note: "Ancient Ganga Ghats & Temples" },
];

const budgets = [
  { label: "₹10,000 (Budget)", value: 10000 },
  { label: "₹25,000 (Comfort)", value: 25000 },
  { label: "₹50,000 (Premium)", value: 50000 },
  { label: "₹1,00,000 (Luxury)", value: 100000 },
];

const foodPreferences = [
  { label: "Pure Vegetarian & Satvik", desc: "Strict vegetarian, temple-style satvik cooking without onion/garlic" },
  { label: "South Indian & Andhra Meals", desc: "Authentic thalis, spicy curries, dosas & gongura" },
  { label: "Non-Veg & Coastal Seafood", desc: "Fresh Bay of Bengal fish fry, prawns & biryani" },
  { label: "Jain (Strict No Root Veg)", desc: "Prepared without onion, garlic, potatoes or roots" },
  { label: "North Indian & Mughlai", desc: "Rich gravies, tandoori rotis, paneer & kebabs" },
];

const transportOptions = [
  { label: "Vande Bharat / Express Train", mode: "train", icon: Train, note: "Punctual rail travel with meal service & live tracking", priceMultiplier: 0.15 },
  { label: "Domestic Flight + Cab", mode: "flight", icon: Plane, note: "Fastest travel with airport transfers included", priceMultiplier: 0.35 },
  { label: "AC Volvo Intercity Bus", mode: "bus", icon: Bus, note: "Economical multi-axle sleeper bus with live GPS", priceMultiplier: 0.12 },
  { label: "Private AC Cab / Chauffeur", mode: "car", icon: Car, note: "Doorstep pickup & intercity chauffeur", priceMultiplier: 0.22 },
  { label: "Self-Drive Vehicle Rental", mode: "rental", icon: Car, note: "Clean sedan / SUV for independent road trips", priceMultiplier: 0.18 },
];

export default function Planner() {
  const [params] = useSearchParams();
  const initialDestination = params.get("destination") || params.get("to") || "Visakhapatnam";

  const [from, setFrom] = useState("");
  const [to, setTo] = useState(initialDestination);
  const [tripDate, setTripDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [userConditions, setUserConditions] = useState("Wheelchair assistance for seniors, pure vegetarian satvik meals");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(25000);
  const [food, setFood] = useState("Pure Vegetarian & Satvik");
  const [group, setGroup] = useState("Family");
  const [transport, setTransport] = useState("Vande Bharat / Express Train");
  const [withGuide, setWithGuide] = useState(true);

  // Mode of Transport During Trip (Sightseeing transit)
  const [selectedLocalTransit, setSelectedLocalTransit] = useState(localTransitOptions[0]);

  // Selected ASI Licensed Heritage Guide
  const [selectedGuide, setSelectedGuide] = useState(() => {
    return licensedHeritageGuides.find(g => g.city.toLowerCase() === "visakhapatnam") || licensedHeritageGuides[0];
  });

  // Transport Facilities & Selected Facility
  const [availableFacilities, setAvailableFacilities] = useState({ trains: [], flights: [], buses: [] });
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Real Hotel Selection State
  const [matchingHotels, setMatchingHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Plan & Generation
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiNote, setAiNote] = useState("");
  const [showDetail, setShowDetail] = useState(false);

  // Payment Modal & State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState("upi"); // 'upi' | 'card' | 'cod'
  const [upiApp, setUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("tourist@okaxis");
  const [cardDetails, setCardDetails] = useState({ number: "4532 •••• •••• 8821", name: "Ramesh Sharma", exp: "12/28", cvv: "•••" });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");
  const [spokenTripPrompt, setSpokenTripPrompt] = useState("");
  const recognitionRef = useRef(null);

  // Synchronize URL destination param
  useEffect(() => {
    const urlDest = params.get("destination") || params.get("to");
    if (urlDest) {
      setTo(urlDest);
    }
  }, [params]);

  // Load verified hotels & match certified local guide strictly matching destination city
  useEffect(() => {
    const hotelsForDest = getHotelsForCity(to);
    setMatchingHotels(hotelsForDest);
    if (hotelsForDest.length > 0) {
      setSelectedHotel(hotelsForDest[0]);
    }

    // Auto-match guide for the destination city
    const matchedGuide = licensedHeritageGuides.find(g => 
      g.city.toLowerCase().includes(to.toLowerCase()) || to.toLowerCase().includes(g.city.toLowerCase())
    );
    if (matchedGuide) {
      setSelectedGuide(matchedGuide);
    }
  }, [to]);

  // Refresh available transport facilities whenever route or transport mode changes
  useEffect(() => {
    const facs = getAvailableTransports(from, to, transport);
    setAvailableFacilities(facs);
    if (transport.includes("Train") || transport.includes("Vande Bharat")) {
      setSelectedFacility(facs.trains[0] || null);
    } else if (transport.includes("Flight")) {
      setSelectedFacility(facs.flights[0] || null);
    } else if (transport.includes("Bus")) {
      setSelectedFacility(facs.buses[0] || null);
    } else {
      setSelectedFacility(null);
    }
  }, [from, to, transport]);

  // Handle Voice Input
  function toggleVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceNotice("Speech Recognition is not supported in this browser. Please type your destination.");
      setTimeout(() => setVoiceNotice(""), 4000);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = "en-IN";
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        setVoiceNotice("Listening... Say e.g. 'Plan a 3-day trip to Visakhapatnam for family'");
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceNotice(`Heard: "${transcript}"`);
        parseVoiceCommand(transcript);
        setTimeout(() => setVoiceNotice(""), 4000);
      };

      rec.onerror = (e) => {
        setIsListening(false);
        setVoiceNotice(`Voice error: ${e.error || "Could not hear audio"}`);
        setTimeout(() => setVoiceNotice(""), 4000);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      setIsListening(false);
      setVoiceNotice("Could not access microphone.");
    }
  }

  function parseVoiceCommand(text) {
    if (!text) return;
    setSpokenTripPrompt(text);
    const lower = text.toLowerCase();

    // Check popular & additional heritage circuit destinations
    const recognizedCities = [
      ...popularDestinations.map(d => d.name),
      "Varanasi", "Jaipur", "Hampi", "Konark", "Udaipur", "Amritsar", 
      "Madurai", "Tirupati", "Warangal", "Agra", "Delhi", "Goa", "Jodhpur", "Mysore"
    ];

    let foundCity = "";
    for (const city of recognizedCities) {
      if (lower.includes(city.toLowerCase())) {
        setTo(city);
        foundCity = city;
        break;
      }
    }

    // Days match
    let foundDays = null;
    const dayMatch = lower.match(/(\d+)\s*(?:day|days)/);
    if (dayMatch && dayMatch[1]) {
      foundDays = Math.min(15, Math.max(1, parseInt(dayMatch[1])));
      setDays(foundDays);
    } else if (lower.includes("weekend")) {
      foundDays = 2;
      setDays(2);
    } else if (lower.includes("a week") || lower.includes("one week")) {
      foundDays = 7;
      setDays(7);
    }

    // Group match
    let foundGroup = "";
    if (lower.includes("solo")) {
      setGroup("Solo");
      foundGroup = "Solo";
    } else if (lower.includes("family") || lower.includes("kids") || lower.includes("children")) {
      setGroup("Family");
      foundGroup = "Family";
    } else if (lower.includes("couple") || lower.includes("honeymoon") || lower.includes("romantic")) {
      setGroup("Couple");
      foundGroup = "Couple";
    } else if (lower.includes("friends") || lower.includes("group") || lower.includes("buddies")) {
      setGroup("Group");
      foundGroup = "Group";
    }

    // Food preference match
    if (lower.includes("jain")) {
      setFood("Jain (No Root Veg)");
    } else if (lower.includes("satvik") || lower.includes("temple food")) {
      setFood("Satvik (Pure Veg, No Onion Garlic)");
    } else if (lower.includes("vegetarian") || lower.includes("pure veg") || lower.includes("veg")) {
      setFood("Pure Vegetarian");
    }

    // Budget match if mentioned
    const budgetMatch = lower.match(/(?:budget|spend|cost)\s*(?:of|is|around|about)?\s*(?:rs|inr|₹)?\s*(\d{4,6})/);
    if (budgetMatch && budgetMatch[1]) {
      const bVal = parseInt(budgetMatch[1]);
      if (bVal >= 5000 && bVal <= 100000) {
        setBudget(bVal);
      }
    }

    const summaryParts = [];
    if (foundCity) summaryParts.push(`Destination: ${foundCity}`);
    if (foundDays) summaryParts.push(`${foundDays} Days`);
    if (foundGroup) summaryParts.push(`${foundGroup} Trip`);
    
    setVoiceNotice(
      summaryParts.length > 0
        ? `Applied from voice: ${summaryParts.join(" · ")}`
        : `Voice prompt captured: "${text.slice(0, 50)}..."`
    );
    setTimeout(() => setVoiceNotice(""), 4500);
  }

  // Calculate Transport & Breakdown
  const selectedTransportObj = transportOptions.find(t => t.label === transport) || transportOptions[0];
  const calculatedTransportCost = selectedFacility?.price 
    ? selectedFacility.price * (group.includes("Solo") ? 1 : 2)
    : Math.round((budget * selectedTransportObj.priceMultiplier) / 100) * 100 + 750;

  function ruleItinerary(hotel) {
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: i === 0 ? `Arrive in ${to}` : i === days - 1 ? `Depart ${to}` : `Explore ${to} · Day ${i + 1}`,
      desc:
        i === 0
          ? `Check in at ${hotel.name}. Settle into your room and enjoy authentic ${food} dinner.${userConditions ? ` (Arrangements active: ${userConditions})` : ""}`
          : i === days - 1
          ? `Morning monument visit, souvenir craft shopping & return transfer from ${to}.`
          : `Full-day heritage exploration in ${to}${withGuide ? " with licensed local guide" : ""}, visiting iconic temples & regional craft clusters with elder/dietary ease.`,
    }));
  }

  function calculateBreakdown(hotel, itinerary) {
    const hotelCost = (hotel?.price || 3500) * days;
    const tCost = calculatedTransportCost;
    const localTransitCost = (selectedLocalTransit?.dailyRate || 1800) * days;
    const guideCost = withGuide ? (selectedGuide?.ratePerDay || 1400) * days : 0;
    const foodCost = 800 * days;
    const total = hotelCost + tCost + localTransitCost + guideCost + foodCost;
    return { hotel, itinerary, breakdown: { hotelCost, tCost, localTransitCost, guideCost, foodCost, total } };
  }

  async function generate() {
    if (!to) return;
    setLoading(true);
    setAiNote("");
    const hotel = selectedHotel || matchingHotels[0] || governmentRecognizedHotels[0];

    try {
      let res = null;
      try {
        const fetchRes = await fetch("/api/ai/planner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            days, 
            to, 
            from: from || "Major Gateways / Home City", 
            group, 
            food, 
            budget, 
            transport, 
            tripDate,
            conditions: spokenTripPrompt ? `${spokenTripPrompt}${userConditions ? ` · ${userConditions}` : ""}` : userConditions,
            userPrompt: spokenTripPrompt,
            withGuide,
            guideName: withGuide ? selectedGuide?.name : "None",
            localTransit: selectedLocalTransit?.name,
            hotelName: hotel.name,
            hotelLocation: hotel.location
          }),
        });
        if (fetchRes.ok) {
          res = await fetchRes.json();
        }
      } catch {}

      if (!res) {
        res = await base44.integrations.Core.InvokeLLM({
          prompt: `Create an authentic ${days}-day cultural itinerary for ${group} visiting ${to}${from ? ` from ${from}` : " arriving from nearest hub"}.
Trip Date: ${tripDate}
Special conditions / requirements: ${userConditions}
Staying at: ${hotel.name} (${hotel.location}, ${to})
Food style: ${food}
Intercity Transport: ${transport} (${selectedFacility?.name || "Express"})
Sightseeing Transit: ${selectedLocalTransit?.name}
Heritage Guide: ${withGuide ? `${selectedGuide?.name} (Badge: ${selectedGuide?.badge})` : "Self-guided"}
Return ${days} days with short title and descriptive heritage sights strictly in ${to}.`,
          response_json_schema: {
            type: "object",
            properties: {
              itinerary: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    desc: { type: "string" },
                  },
                  required: ["title", "desc"],
                },
              },
              summary: { type: "string" },
            },
            required: ["itinerary"],
          },
        });
      }

      const raw = Array.isArray(res?.itinerary) ? res.itinerary : [];
      const itin = raw.slice(0, days).map((d, i) => ({
        day: i + 1,
        title: d.title || `Day ${i + 1} in ${to}`,
        desc: d.desc || "",
      }));

      const finalItin = itin.length === days ? itin : ruleItinerary(hotel);
      setPlan({ ...calculateBreakdown(hotel, finalItin), summary: res?.summary || "" });
      setAiNote(`✨ AI verified itinerary with ${withGuide ? `${selectedGuide?.name} & ` : ""}${selectedLocalTransit?.name} in ${to}`);
    } catch {
      setAiNote(`Curated government heritage plan generated for ${to}.`);
      setPlan(calculateBreakdown(hotel, ruleItinerary(hotel)));
    } finally {
      setLoading(false);
    }
  }

  // Handle Complete Payment Simulation & Confirmed Booking
  async function processPaymentAndBook() {
    setPaymentProcessing(true);
    setTimeout(async () => {
      const hotel = selectedHotel || matchingHotels[0] || governmentRecognizedHotels[0];
      const newBooking = {
        id: "BK-" + Math.floor(100000 + Math.random() * 900000),
        destination: to,
        from_city: from || "Major Gateways / Direct Route",
        days,
        travel_date: tripDate,
        conditions: userConditions,
        budget,
        group_type: group,
        food_preference: food,
        transport,
        transport_facility: selectedFacility?.name || selectedTransportObj.label,
        transport_code: selectedFacility?.code || "Direct Route",
        transport_timing: selectedFacility?.departure ? `${selectedFacility.departure} - ${selectedFacility.arrival}` : "Flexible Timings",
        local_transit: selectedLocalTransit,
        with_guide: withGuide,
        selected_guide: withGuide ? selectedGuide : null,
        hotel: hotel,
        payment_method: paymentGateway === "upi" ? `UPI (${upiApp.toUpperCase()})` : paymentGateway === "card" ? "Credit / Debit Card" : "Cash on Delivery (Pay at Hotel)",
        status: "Confirmed",
        booked_at: new Date().toISOString(),
        total_cost: plan?.breakdown?.total || (hotel.price * days + calculatedTransportCost),
        itinerary: plan?.itinerary || ruleItinerary(hotel),
        trip_summary: plan?.summary || `${days}-day cultural tour of ${to} staying at ${hotel.name}`,
      };

      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem("by-user-bookings") || "[]");
        existing.unshift(newBooking);
        localStorage.setItem("by-user-bookings", JSON.stringify(existing));
      } catch {}

      // Save to Base44
      try {
        await base44.entities.Booking.create(newBooking);
      } catch {}

      setPaymentProcessing(false);
      setPaymentModalOpen(false);
      setConfirmedBooking(newBooking);
      setShowDetail(true);
    }, 900);
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                MakeMyTrip-Style Real Transport, Hotels & AI Itinerary
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground mt-3 font-heading">
                Smart Heritage Trip Planner
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
                Search your route or enter just your destination. We instantly match verified trains (Vande Bharat), flights, Volvo buses, and government-recognized hotels with special dietary and elder care facilities.
              </p>
            </div>

            {/* Event Planner CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-primary/10 to-transparent border border-amber-500/30 max-w-sm">
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
                  <Gift className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Event Planner Desk
                  </h4>
                  <p className="text-xs text-foreground mt-0.5 font-medium">
                    Planning a cultural surprise, anniversary, or temple event?
                  </p>
                  <Link 
                    to="/event-planner"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-2"
                  >
                    Open Event Planner & Tracker →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Assistant Banner */}
      {voiceNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2 text-xs sm:text-sm text-primary font-medium">
            <Mic className="w-4 h-4 shrink-0 animate-pulse" />
            <span>{voiceNotice}</span>
          </div>
        </div>
      )}

      {/* SUCCESSFUL BOOKING BANNER MODAL / INLINE VIEW */}
      {confirmedBooking && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="p-3 rounded-2xl bg-emerald-500 text-white shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </span>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
                    Booking Successful & Confirmed
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-1 font-heading">
                    Reservation #{confirmedBooking.id} Confirmed!
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Traveling to <strong>{confirmedBooking.destination}</strong> on <strong>{confirmedBooking.travel_date}</strong>. Hotel stay confirmed at <strong>{confirmedBooking.hotel?.name}</strong> via {confirmedBooking.payment_method}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => generateTripVoucherPDF(confirmedBooking)}
                  className="px-5 py-3 rounded-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md hover:opacity-90 flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" /> Download PDF Itinerary & Voucher
                </button>
                <Link
                  to="/profile?tab=trips"
                  className="px-4 py-3 rounded-full bg-card border border-border text-foreground font-bold text-xs hover:bg-muted transition-colors"
                >
                  View in My Profile
                </Link>
              </div>
            </div>

            {confirmedBooking.conditions && (
              <div className="p-3 rounded-xl bg-card border border-border text-xs text-muted-foreground flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-primary shrink-0" />
                <span>Special Conditions Noted: <strong>{confirmedBooking.conditions}</strong></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Form & Inventory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Conditions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="font-bold text-base text-foreground flex items-center gap-2 font-heading">
                <Compass className="w-4 h-4 text-primary" /> Step 1: Destination & Dates
              </h2>
              <button
                onClick={toggleVoiceInput}
                className={`p-2 rounded-full border transition-all ${
                  isListening 
                    ? "bg-red-500 text-white border-red-600 animate-bounce" 
                    : "bg-muted text-muted-foreground hover:text-primary border-border"
                }`}
                title="Voice Input (Microphone)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Voice-to-Text Dream Trip Input */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-primary flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> Describe Your Ideal Trip (Voice or Text)
                </span>
                <span className="text-[10px] text-muted-foreground">AI recognizes destination, days & style</span>
              </div>
              <VoiceToTextInput
                value={spokenTripPrompt}
                onChange={(val) => setSpokenTripPrompt(val)}
                onTranscript={(txt) => {
                  parseVoiceCommand(txt);
                }}
                placeholder="Speak or describe: 'Plan a 4-day trip to Varanasi for family'..."
              />
              {voiceNotice && (
                <div className="text-[11px] text-primary font-medium flex items-center gap-1.5 animate-fadeIn">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>{voiceNotice}</span>
                </div>
              )}
            </div>

            {/* Popular Destination Quick Chips */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Popular Cultural Destinations
              </label>
              <div className="flex flex-wrap gap-1.5">
                {popularDestinations.map(d => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => setTo(d.name)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      to.toLowerCase() === d.name.toLowerCase()
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "bg-muted/80 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Route Inputs (Starting city optional: destination-only supported!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  From (Optional Starting City)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="e.g. Delhi, Hyderabad (or leave blank)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none text-foreground"
                  />
                </div>
                {!from && (
                  <p className="text-[11px] text-primary/80 mt-1">
                    ✓ Leaving blank shows all transports from major gateways to {to}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  To (Destination) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="e.g. Visakhapatnam, Agra"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-primary/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Trip Date & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Trip Date (Departure)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={days}
                  onChange={(e) => setDays(Math.max(1, Math.min(30, +e.target.value || 1)))}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none text-foreground"
                />
              </div>
            </div>

            {/* Special User Conditions & Preferences Text Box */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Special Conditions & Assistance (Elder / Dietary)</span>
                <Accessibility className="w-3.5 h-3.5 text-primary" />
              </label>
              <textarea
                value={userConditions}
                onChange={(e) => setUserConditions(e.target.value)}
                placeholder="e.g. Elders with wheelchair facilities, ground-floor hotel room, pure vegetarian / satvik food without onion-garlic, infant safety seat"
                rows={2}
                className="w-full p-3 rounded-xl bg-background border border-border text-xs text-foreground focus:ring-2 focus:ring-primary outline-none resize-none leading-relaxed"
              />
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {[
                  "Elder wheelchair needed",
                  "Pure vegetarian / Satvik",
                  "Ground floor room",
                  "Diabetic meal preference",
                  "Temple darshan assistance",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      if (!userConditions.includes(chip)) {
                        setUserConditions(prev => prev ? `${prev}, ${chip}` : chip);
                      }
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-muted text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Budget */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Target Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(+e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none text-foreground cursor-pointer"
              >
                {budgets.map(b => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>

            {/* Transport Preference */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Preferred Mode of Transport
              </label>
              <div className="space-y-2">
                {transportOptions.map(t => {
                  const Icon = t.icon;
                  const isSelected = transport === t.label;
                  return (
                    <div
                      key={t.label}
                      onClick={() => setTransport(t.label)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected 
                          ? "border-primary bg-primary/10 shadow-xs" 
                          : "border-border bg-background hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`p-2 rounded-xl ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                          <Icon className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-foreground">{t.label}</p>
                          <p className="text-[11px] text-muted-foreground">{t.note}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-foreground shrink-0">
                        ₹{Math.round((budget * t.priceMultiplier) / 100) * 100 + 750}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AVAILABLE TRANSPORT FACILITIES CARD (Real Trains with code like Vande Bharat 20833, Flights like 6E 543) */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5" /> Available Transport Facilities for {to}
                </h3>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {from ? `From ${from}` : "Major Gateways"}
                </span>
              </div>

              {/* Trains */}
              {(transport.includes("Train") || transport.includes("Vande Bharat")) && (
                <div className="space-y-2">
                  {availableFacilities.trains.map((tr) => (
                    <div
                      key={tr.id}
                      onClick={() => setSelectedFacility(tr)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedFacility?.id === tr.id
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border bg-card hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground">{tr.name}</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono font-bold text-[10px]">
                              #{tr.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Departs: <strong>{tr.departure}</strong> · Arrives: <strong>{tr.arrival}</strong> ({tr.duration})
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-foreground text-sm">₹{tr.price}</span>
                          <span className="text-[10px] text-muted-foreground block">{tr.classes}</span>
                        </div>
                      </div>
                      <div className="mt-1.5 pt-1.5 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{tr.meals}</span>
                        <span className="text-emerald-600 font-medium">{tr.punctuality}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Flights */}
              {transport.includes("Flight") && (
                <div className="space-y-2">
                  {availableFacilities.flights.map((fl) => (
                    <div
                      key={fl.id}
                      onClick={() => setSelectedFacility(fl)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedFacility?.id === fl.id
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border bg-card hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground">{fl.airline}</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-sky-500/15 text-sky-600 font-mono font-bold text-[10px]">
                              Flight {fl.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Departure: <strong>{fl.departure}</strong> · Arrival: <strong>{fl.arrival}</strong> ({fl.duration})
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-foreground text-sm">₹{fl.price.toLocaleString("en-IN")}</span>
                          <span className="text-[10px] text-muted-foreground block">Economy</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{fl.baggage}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Buses */}
              {transport.includes("Bus") && (
                <div className="space-y-2">
                  {availableFacilities.buses.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedFacility(b)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedFacility?.id === b.id
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border bg-card hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground">{b.operator}</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 font-mono font-bold text-[10px]">
                              {b.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Dep: <strong>{b.departure}</strong> · Arr: <strong>{b.arrival}</strong>
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-foreground text-sm">₹{b.price}</span>
                          <span className="text-[10px] text-muted-foreground block">{b.type}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{b.amenities}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Food Preference */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Cuisine & Dietary Preference
              </label>
              <div className="space-y-2">
                {foodPreferences.map(f => {
                  const isSelected = food === f.label;
                  return (
                    <div
                      key={f.label}
                      onClick={() => setFood(f.label)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? "border-primary bg-primary/10 shadow-xs" 
                          : "border-border bg-background hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-foreground">{f.label}</p>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Group Type */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Traveling Group Type
              </label>
              <div className="flex flex-wrap gap-2">
                {["Solo Traveler", "Couple", "Family with Seniors", "Friends Group"].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGroup(g)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      group === g 
                        ? "bg-primary text-primary-foreground shadow-xs" 
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode of Transport During Trip (Sightseeing & Excursions) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Mode of Transport During Trip (Local Sightseeing)
                </label>
                <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {selectedLocalTransit?.tag}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {localTransitOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSel = selectedLocalTransit?.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        setSelectedLocalTransit(opt);
                        if (plan) {
                          const hotel = selectedHotel || matchingHotels[0] || governmentRecognizedHotels[0];
                          const hotelCost = (hotel?.price || 3500) * days;
                          const tCost = calculatedTransportCost;
                          const localTransitCost = opt.dailyRate * days;
                          const guideCost = withGuide ? (selectedGuide?.ratePerDay || 1400) * days : 0;
                          const foodCost = 800 * days;
                          const total = hotelCost + tCost + localTransitCost + guideCost + foodCost;
                          setPlan({ ...plan, breakdown: { hotelCost, tCost, localTransitCost, guideCost, foodCost, total } });
                        }
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSel
                          ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40"
                          : "border-border bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`p-2 rounded-xl shrink-0 ${isSel ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground leading-tight">{opt.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{opt.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-[11px]">
                        <span className="font-bold text-primary">₹{opt.dailyRate}/day</span>
                        <span className={`font-semibold ${isSel ? "text-primary" : "text-muted-foreground"}`}>
                          {isSel ? "Selected ✓" : "Choose"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Licensed Guide Checkbox & Guide Selection Card */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/50 border border-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={withGuide}
                  onChange={(e) => {
                    setWithGuide(e.target.checked);
                    if (plan) {
                      const hotel = selectedHotel || matchingHotels[0] || governmentRecognizedHotels[0];
                      const hotelCost = (hotel?.price || 3500) * days;
                      const tCost = calculatedTransportCost;
                      const localTransitCost = (selectedLocalTransit?.dailyRate || 1800) * days;
                      const guideCost = e.target.checked ? (selectedGuide?.ratePerDay || 1400) * days : 0;
                      const foodCost = 800 * days;
                      const total = hotelCost + tCost + localTransitCost + guideCost + foodCost;
                      setPlan({ ...plan, breakdown: { hotelCost, tCost, localTransitCost, guideCost, foodCost, total } });
                    }
                  }}
                  className="w-4 h-4 accent-primary rounded"
                />
                <div className="text-xs flex-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-primary" /> Include Government Licensed Heritage Guide
                  </span>
                  <p className="text-muted-foreground mt-0.5">Certified ASI badge guide with historical narratives, temple access & crowd assistance.</p>
                </div>
              </label>

              {/* Guide Selection Picker */}
              {withGuide && (
                <div className="p-4 rounded-2xl bg-card border border-primary/30 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" /> Choose Your ASI Certified Guide
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Verified Identity
                    </span>
                  </div>

                  {/* Guides Carousel/List */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {licensedHeritageGuides.map((guide) => {
                      const isSel = selectedGuide?.id === guide.id;
                      const isCityMatch = guide.city.toLowerCase().includes(to.toLowerCase()) || to.toLowerCase().includes(guide.city.toLowerCase());
                      return (
                        <div
                          key={guide.id}
                          onClick={() => {
                            setSelectedGuide(guide);
                            if (plan) {
                              const hotel = selectedHotel || matchingHotels[0] || governmentRecognizedHotels[0];
                              const hotelCost = (hotel?.price || 3500) * days;
                              const tCost = calculatedTransportCost;
                              const localTransitCost = (selectedLocalTransit?.dailyRate || 1800) * days;
                              const guideCost = guide.ratePerDay * days;
                              const foodCost = 800 * days;
                              const total = hotelCost + tCost + localTransitCost + guideCost + foodCost;
                              setPlan({ ...plan, breakdown: { hotelCost, tCost, localTransitCost, guideCost, foodCost, total } });
                            }
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                            isSel
                              ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40"
                              : "border-border bg-background hover:bg-muted/40"
                          }`}
                        >
                          <img
                            src={guide.avatar}
                            alt={guide.name}
                            className="w-11 h-11 rounded-full object-cover shrink-0 border-2 border-primary/40"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground truncate">{guide.name}</span>
                              <span className="text-[9px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground shrink-0">
                                {guide.badge}
                              </span>
                              {isCityMatch && (
                                <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                                  {guide.city}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                              {guide.specialty}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                              <span className="text-amber-500 font-bold flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-current" /> {guide.rating}
                              </span>
                              <span>·</span>
                              <span>{guide.experience}</span>
                              <span>·</span>
                              <span className="truncate">{guide.languages.join(", ")}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-primary block">₹{guide.ratePerDay}/d</span>
                            <span className={`text-[10px] font-semibold ${isSel ? "text-primary" : "text-muted-foreground"}`}>
                              {isSel ? "Selected ✓" : "Select"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                onClick={generate}
                disabled={loading || !to}
                className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4" />
                {loading ? "Generating Itinerary for " + to + "..." : `Generate ${days}-Day Itinerary for ${to}`}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Real Hotels Inventory & Booking Gateways (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 2: Real Hotel Selection for Destination */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2 font-heading">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Step 2: Verified Hotels in {to}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Government-recognized properties with lift, senior accessibility & pure veg options
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary self-start sm:self-auto">
                {matchingHotels.length} Properties
              </span>
            </div>

            {/* Hotel Cards List */}
            <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
              {matchingHotels.map(h => {
                const isSelected = selectedHotel?.name === h.name;
                return (
                  <div
                    key={h.id || h.name}
                    onClick={() => {
                      setSelectedHotel(h);
                      if (plan) {
                        setPlan(calculateBreakdown(h, plan.itinerary));
                      }
                    }}
                    className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col sm:flex-row gap-4 ${
                      isSelected 
                        ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30" 
                        : "border-border bg-background hover:border-border hover:shadow-xs"
                    }`}
                  >
                    {/* Hotel Image */}
                    <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden shrink-0 bg-muted">
                      <img 
                        src={h.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop&q=80"} 
                        alt={h.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Hotel Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-primary">
                              {h.classification}
                            </span>
                            <h4 className="font-bold text-sm sm:text-base text-foreground mt-1 group-hover:text-primary transition-colors">
                              {h.name}
                            </h4>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm sm:text-base font-bold text-foreground">₹{h.price.toLocaleString("en-IN")}</span>
                            <span className="text-[10px] text-muted-foreground block">/night</span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{h.location}</span>
                        </p>

                        <p className="text-xs text-muted-foreground/90 mt-1.5 line-clamp-2">
                          {h.primaryFacilities || h.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-border text-xs">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 font-bold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-current" /> {h.rating}
                          </span>
                          <span className="text-muted-foreground">({h.reviewsCount || 850}+ reviews)</span>
                          {h.phone && (
                            <span className="hidden sm:flex items-center gap-1 text-muted-foreground">
                              <Phone className="w-3 h-3 text-emerald-500" /> {h.phone}
                            </span>
                          )}
                        </div>

                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {isSelected ? "Selected Hotel ✓" : "Select"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget Breakdown Summary */}
          {plan && (
            <BudgetDashboard plan={plan} budget={budget} days={days} />
          )}

          {/* AI Itinerary Schedule */}
          {plan && (
            <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {aiNote || "Curated Itinerary"}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-2 font-heading">
                    Your {days}-Day Cultural Tour of {to}
                  </h3>
                </div>
              </div>

              {plan.summary && (
                <p className="text-xs sm:text-sm text-muted-foreground italic bg-muted/40 p-3.5 rounded-2xl border border-border">
                  "{plan.summary}"
                </p>
              )}

              {/* Day by Day Cards */}
              <div className="space-y-3 pt-2">
                {plan.itinerary.map(d => (
                  <div key={d.day} className="p-3.5 rounded-2xl bg-muted/40 border border-border flex gap-3.5">
                    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold shrink-0">
                      Day {d.day}
                    </span>
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-sm text-foreground">{d.title}</h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Calculation */}
              <div className="pt-4 border-t border-border space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Hotel Stay ({selectedHotel?.name || "Selected Property"} · {days} nights)</span>
                  <span>₹{plan.breakdown.hotelCost.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Intercity Travel ({selectedFacility?.name ? `${selectedFacility.name} (#${selectedFacility.code})` : transport})</span>
                  <span>₹{plan.breakdown.tCost.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Local Sightseeing ({selectedLocalTransit?.name || "Transit Pass"} · {days} days)</span>
                  <span>₹{plan.breakdown.localTransitCost.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Food & Dining ({food} · {days} days)</span>
                  <span>₹{plan.breakdown.foodCost.toLocaleString("en-IN")}</span>
                </div>
                {plan.breakdown.guideCost > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Licensed Heritage Guide ({selectedGuide?.name} · {days} days)</span>
                    <span>₹{plan.breakdown.guideCost.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-border font-bold text-base text-foreground">
                  <span>Estimated Total</span>
                  <span className="text-primary font-heading text-lg">₹{plan.breakdown.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Book Hotel & Itinerary with Demo Payment Gateway */}
          {plan && (
            <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground font-heading">Book Hotel & Itinerary</h3>
                  <p className="text-xs text-muted-foreground">
                    Instant reservation with demo payment gateways (UPI, Cards, COD). Free cancellation up to 24 hours.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  100% Verified Stay
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <p className="font-bold text-foreground">{selectedHotel?.name}</p>
                  <p className="text-muted-foreground text-xs">{selectedHotel?.location} · {days} Nights · {group}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-primary">₹{plan.breakdown.total.toLocaleString("en-IN")}</span>
                  <span className="text-[10px] text-muted-foreground block">Taxes & transfers included</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPaymentModalOpen(true)}
                className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Proceed to Payment Gateways (UPI / Card / COD)
              </button>
            </div>
          )}

          {/* Detailed Print / PDF View */}
          {plan && showDetail && (
            <TripPlanDetail
              plan={plan}
              from={from || "Your City / Gateway"}
              to={to}
              days={days}
              food={food}
              group={group}
              transport={selectedFacility?.name ? `${selectedFacility.name} (${selectedFacility.code})` : transport}
              localTransit={selectedLocalTransit?.name}
              guide={withGuide ? selectedGuide : null}
              withGuide={withGuide}
              payment={confirmedBooking?.payment_method || "Verified Booking"}
              conditions={userConditions}
              travelDate={tripDate}
            />
          )}
        </div>
      </section>

      {/* PAYMENT GATEWAYS DEMO MODAL */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base text-foreground font-heading">
                  Bharat Yatra Verified Payment Gateway
                </h3>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Amount Summary */}
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Paying for {selectedHotel?.name || to + " Hotel"}</p>
                <p className="text-xs font-bold text-foreground">{days} Days · {selectedFacility?.name || transport}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-primary font-heading">
                  ₹{(plan?.breakdown?.total || (selectedHotel?.price || 3500) * days + calculatedTransportCost).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Zero Conv. Fee</span>
              </div>
            </div>

            {/* Payment Options Selector: UPI | Card | COD */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "upi", label: "UPI Apps", icon: QrCode, desc: "GPay, PhonePe, Paytm" },
                { id: "card", label: "Debit/Credit Card", icon: CreditCard, desc: "Visa, RuPay, Master" },
                { id: "cod", label: "Pay at Hotel (COD)", icon: Wallet, desc: "Pay cash at check-in" },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSel = paymentGateway === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentGateway(opt.id)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isSel 
                        ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary" 
                        : "border-border bg-background hover:bg-muted/40"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mx-auto mb-1 ${isSel ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="text-xs font-bold text-foreground">{opt.label}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Gateway Specific Form Details */}
            {paymentGateway === "upi" && (
              <div className="space-y-3 p-4 rounded-2xl bg-muted/30 border border-border text-xs">
                <span className="font-semibold text-muted-foreground block">Select Preferred UPI App:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "gpay", name: "Google Pay" },
                    { id: "phonepe", name: "PhonePe" },
                    { id: "paytm", name: "Paytm" },
                    { id: "bhim", name: "BHIM UPI" },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setUpiApp(app.id)}
                      className={`py-2 px-1 rounded-xl text-center font-bold text-[11px] border transition-all ${
                        upiApp === app.id
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-background border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {app.name}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Or Enter Virtual Payment Address (VPA / UPI ID):
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@upi or username@okaxis"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>
            )}

            {paymentGateway === "card" && (
              <div className="space-y-3 p-4 rounded-2xl bg-muted/30 border border-border text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Card Number:</label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-medium focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Expiry Date:</label>
                    <input
                      type="text"
                      value={cardDetails.exp}
                      onChange={(e) => setCardDetails({ ...cardDetails, exp: e.target.value })}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">CVV:</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-medium focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentGateway === "cod" && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-foreground space-y-1">
                <p className="font-bold flex items-center gap-1 text-amber-700 dark:text-amber-300">
                  <Wallet className="w-4 h-4" /> Pay Later at Hotel Front Desk
                </p>
                <p className="text-muted-foreground">
                  Your room and transport seats are held securely. You can pay via Cash, Card, or UPI directly when you arrive at {selectedHotel?.name}.
                </p>
              </div>
            )}

            {/* Pay Button */}
            <button
              type="button"
              onClick={processPaymentAndBook}
              disabled={paymentProcessing}
              className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {paymentProcessing ? (
                <>Verifying Transaction with Bank Gateway...</>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {paymentGateway === "cod" ? "Confirm Reservation & Hold Room" : `Confirm & Pay ₹${(plan?.breakdown?.total || (selectedHotel?.price || 3500) * days + calculatedTransportCost).toLocaleString("en-IN")}`}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
