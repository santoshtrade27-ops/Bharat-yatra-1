// Bharat Yatra Admin Data Store: Emergency Centers, Sub-Employees, TODOs, Forms & State Volunteers

export const initialEmergencyCenters = [
  {
    id: "ec-1",
    name: "King George Hospital (KGH) Super Specialty Trauma",
    city: "Visakhapatnam, Andhra Pradesh",
    type: "Hospital",
    phone: "+91-891-2564891",
    address: "Maharanipeta, Beach Road, Visakhapatnam",
    lat: 17.7089,
    lng: 83.3039,
  },
  {
    id: "ec-2",
    name: "Visakhapatnam Tourist Police Assistance Booth",
    city: "Visakhapatnam, Andhra Pradesh",
    type: "Police",
    phone: "+91-891-2565455",
    address: "RK Beach Road opposite Submarine Museum, Visakhapatnam",
    lat: 17.7135,
    lng: 83.3281,
  },
  {
    id: "ec-3",
    name: "Nizam's Institute of Medical Sciences (NIMS)",
    city: "Hyderabad, Telangana",
    type: "Hospital",
    phone: "+91-40-23489000",
    address: "Punjagutta, Hyderabad, Telangana",
    lat: 17.4225,
    lng: 78.4526,
  },
  {
    id: "ec-4",
    name: "Charminar Tourist Police Station",
    city: "Hyderabad, Telangana",
    type: "Police",
    phone: "+91-40-27852435",
    address: "Pathergatti, Old City, Hyderabad",
    lat: 17.3616,
    lng: 78.4747,
  },
  {
    id: "ec-5",
    name: "SVIMS Super Specialty Hospital",
    city: "Tirupati, Andhra Pradesh",
    type: "Hospital",
    phone: "+91-877-2287777",
    address: "Alipiri Road, Tirupati, Andhra Pradesh",
    lat: 13.6373,
    lng: 79.4082,
  },
  {
    id: "ec-6",
    name: "AIIMS New Delhi Emergency Department",
    city: "New Delhi, Delhi",
    type: "Hospital",
    phone: "+91-11-26588500",
    address: "Ansari Nagar, New Delhi",
    lat: 28.5672,
    lng: 77.2100,
  },
  {
    id: "ec-7",
    name: "Agra Tourist Police Station",
    city: "Agra, Uttar Pradesh",
    type: "Police",
    phone: "+91-562-2421204",
    address: "Near Taj Mahal Western Gate, Agra",
    lat: 27.1750,
    lng: 78.0422,
  }
];

export function getEmergencyCenters() {
  try {
    const saved = localStorage.getItem("by-emergency-centers");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return initialEmergencyCenters;
}

export function saveEmergencyCenters(centers) {
  localStorage.setItem("by-emergency-centers", JSON.stringify(centers));
  window.dispatchEvent(new CustomEvent("by-emergency-centers-updated", { detail: centers }));
}

// SUB-EMPLOYEES
export const initialSubEmployees = [
  {
    id: "EMP-101",
    name: "Ramesh Verma",
    department: "Hotel Operations",
    role: "Senior Hospitality Coordinator",
    email: "ramesh.v@bharatyatra.gov.in",
    phone: "+91 98480 23451",
    assignedHotel: "Novotel Visakhapatnam Varun Beach",
    assignedTask: "Review VIP arrival suites and airport shuttle timings",
    status: "Active",
    joinedDate: "2025-03-15",
  },
  {
    id: "EMP-102",
    name: "Priya Sundaram",
    department: "Event / Surprise Planner",
    role: "Lead Surprise Experience Architect",
    email: "priya.s@bharatyatra.gov.in",
    phone: "+91 94401 77882",
    assignedHotel: "Taj Falaknuma Palace, Hyderabad",
    assignedTask: "Coordinate horse chariot arrival and anniversary violin musician",
    status: "On Duty",
    joinedDate: "2025-05-10",
  },
  {
    id: "EMP-103",
    name: "Abdul Qadir",
    department: "Guide Coordinator Desk",
    role: "ASI Guide Allocator & Verifier",
    email: "abdul.q@bharatyatra.gov.in",
    phone: "+91 98850 66554",
    assignedHotel: "The Gateway Hotel Beach Road",
    assignedTask: "Verify holographic badge IDs for new Vizag coast applicants",
    status: "Active",
    joinedDate: "2025-06-01",
  },
  {
    id: "EMP-104",
    name: "Sunita Devi",
    department: "Artisans & Handloom",
    role: "Craft Cluster Fulfillment Manager",
    email: "sunita.d@bharatyatra.gov.in",
    phone: "+91 97000 88991",
    assignedHotel: "ITC Kohenur, Hyderabad",
    assignedTask: "Inspect GI silk authenticity tags and packaging dispatch",
    status: "Active",
    joinedDate: "2025-07-20",
  },
  {
    id: "EMP-105",
    name: "Dr. K. Rao",
    department: "Safety & Emergency Response",
    role: "SOS Command Field Officer",
    email: "k.rao@bharatyatra.gov.in",
    phone: "+91 99881 12233",
    assignedHotel: "Fortune Grand Ridge, Tirupati",
    assignedTask: "Monitor high-altitude Simhachalam ghat road distress beacons",
    status: "On Duty",
    joinedDate: "2025-01-12",
  },
  {
    id: "EMP-106",
    name: "Vikramaditya Rathore",
    department: "Hotel Operations",
    role: "Regional Stay Auditor",
    email: "vikram.r@bharatyatra.gov.in",
    phone: "+91 98110 33445",
    assignedHotel: "Taj view by IHCL, Agra",
    assignedTask: "Inspect wheelchair accessibility ramps and Satvik dining hygiene",
    status: "Active",
    joinedDate: "2025-08-04",
  },
];

export function getSubEmployees() {
  try {
    const saved = localStorage.getItem("by-sub-employees");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return initialSubEmployees;
}

export function saveSubEmployees(employees) {
  localStorage.setItem("by-sub-employees", JSON.stringify(employees));
  window.dispatchEvent(new CustomEvent("by-sub-employees-updated", { detail: employees }));
}

// TODOS
export const initialTodos = [
  {
    id: "TODO-1",
    title: "Inspect room tariff update for Novotel Varun Beach weekend rush",
    department: "Hotel Operations",
    priority: "High",
    assignedTo: "Ramesh Verma",
    dueDate: "Today, 5:00 PM",
    completed: false,
  },
  {
    id: "TODO-2",
    title: "Verify credentials of new guide applicant from Araku Valley",
    department: "Guide Coordinator Desk",
    priority: "High",
    assignedTo: "Abdul Qadir",
    dueDate: "Tomorrow, 11:00 AM",
    completed: false,
  },
  {
    id: "TODO-3",
    title: "Call Elder traveler Smt. Kamala Devi for afternoon safety check-in",
    department: "Safety & Emergency Response",
    priority: "Urgent",
    assignedTo: "Dr. K. Rao",
    dueDate: "Today, 2:30 PM",
    completed: true,
  },
  {
    id: "TODO-4",
    title: "Pack & dispatch GI certified Kondapalli toy set for Order #BY-ART-89104",
    department: "Artisans & Handloom",
    priority: "Medium",
    assignedTo: "Sunita Devi",
    dueDate: "Today, 6:00 PM",
    completed: false,
  },
  {
    id: "TODO-5",
    title: "Confirm carnatic veena artist and floral setup for Vizag cliffside surprise",
    department: "Event / Surprise Planner",
    priority: "High",
    assignedTo: "Priya Sundaram",
    dueDate: "Tomorrow, 4:00 PM",
    completed: false,
  },
];

export function getTodos() {
  try {
    const saved = localStorage.getItem("by-admin-todos");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return initialTodos;
}

export function saveTodos(todos) {
  localStorage.setItem("by-admin-todos", JSON.stringify(todos));
  window.dispatchEvent(new CustomEvent("by-admin-todos-updated", { detail: todos }));
}

// VOLUNTEER NETWORK BY STATE
export const initialVolunteers = [
  // Andhra Pradesh
  {
    id: "VOL-AP-01",
    name: "Rajesh Kumar",
    state: "Andhra Pradesh",
    city: "Visakhapatnam",
    phone: "+91 98480 11223",
    specialization: "Coastal Water Rescue & English/Telugu/Hindi Guide",
    status: "Active & On Call",
    emergencyRole: "First Aid & Beach Safety",
  },
  {
    id: "VOL-AP-02",
    name: "Sai Praneeth Reddy",
    state: "Andhra Pradesh",
    city: "Tirupati",
    phone: "+91 94401 55667",
    specialization: "Temple Darshan Navigation, Telugu/Tamil/Kannada/English",
    status: "Active & On Call",
    emergencyRole: "Crowd Control & Lost Pilgrim Reunification",
  },
  {
    id: "VOL-AP-03",
    name: "Lavanya Patrudu",
    state: "Andhra Pradesh",
    city: "Araku Valley",
    phone: "+91 90001 88990",
    specialization: "Tribal Trekking First Responder & Local Dialects",
    status: "Active & On Call",
    emergencyRole: "Medical Evacuation & Trail Support",
  },

  // Telangana
  {
    id: "VOL-TS-01",
    name: "Mohammed Zeeshan",
    state: "Telangana",
    city: "Hyderabad (Charminar / Old City)",
    phone: "+91 98850 44332",
    specialization: "Heritage Urban Navigation, Urdu/Telugu/Hindi/English",
    status: "Active & On Call",
    emergencyRole: "Tourist Police Liaison & Heatstroke First Aid",
  },
  {
    id: "VOL-TS-02",
    name: "Deepika Rao",
    state: "Telangana",
    city: "Warangal",
    phone: "+91 97000 22114",
    specialization: "Kakatiya Heritage & Archaeological Protection",
    status: "Active & On Call",
    emergencyRole: "UNESCO Monument Guide & Emergency Dispatch",
  },

  // Uttar Pradesh
  {
    id: "VOL-UP-01",
    name: "Amit Pathak",
    state: "Uttar Pradesh",
    city: "Varanasi (Dashashwamedh Ghat)",
    phone: "+91 98390 12345",
    specialization: "River Rescue, Hindi/English/French, Boat Safety",
    status: "Active & On Call",
    emergencyRole: "Ghat Water Rescue & Senior Citizen Support",
  },
  {
    id: "VOL-UP-02",
    name: "Neha Sharma",
    state: "Uttar Pradesh",
    city: "Agra",
    phone: "+91 94120 67890",
    specialization: "Foreigner Scam Intervention & Female Solo Traveler Guide",
    status: "Active & On Call",
    emergencyRole: "Tourist Police Assistance & Rapid Escort",
  },

  // Rajasthan
  {
    id: "VOL-RJ-01",
    name: "Vikram Singh Rathore",
    state: "Rajasthan",
    city: "Jaipur",
    phone: "+91 98290 54321",
    specialization: "Desert & Fort First Responder, Marwari/Hindi/English",
    status: "Active & On Call",
    emergencyRole: "Heat Exhaustion Care & Transport Assistance",
  },

  // Delhi
  {
    id: "VOL-DL-01",
    name: "Rohit Arora",
    state: "Delhi",
    city: "New Delhi (Connaught Place & Old Delhi)",
    phone: "+91 98110 99887",
    specialization: "Interstate Transit Coordination & Metro Rescue",
    status: "Active & On Call",
    emergencyRole: "Rapid Responder & Lost Luggage Tracing",
  },

  // Karnataka
  {
    id: "VOL-KA-01",
    name: "Manjunath Bhat",
    state: "Karnataka",
    city: "Hampi",
    phone: "+91 94480 77665",
    specialization: "Boulder Trail Rescue & Kannada/Telugu/English Guide",
    status: "Active & On Call",
    emergencyRole: "Wilderness First Aid & Heat Safety",
  },

  // Maharashtra
  {
    id: "VOL-MH-01",
    name: "Tanmay Joshi",
    state: "Maharashtra",
    city: "Aurangabad (Ellora/Ajanta)",
    phone: "+91 98220 33445",
    specialization: "Cave Navigation & Marathi/Hindi/German/English",
    status: "Active & On Call",
    emergencyRole: "Cave Emergency Lighting & Medical Kit",
  },

  // Tamil Nadu
  {
    id: "VOL-TN-01",
    name: "Karthik Subramanian",
    state: "Tamil Nadu",
    city: "Madurai & Rameswaram",
    phone: "+91 98401 22334",
    specialization: "Temple Corridor Guidance & Tamil/English First Responder",
    status: "Active & On Call",
    emergencyRole: "Pilgrim Medical Dispatch & Language Help",
  }
];

export function getVolunteers() {
  try {
    const saved = localStorage.getItem("by-volunteers-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return initialVolunteers;
}

export function saveVolunteers(volunteers) {
  localStorage.setItem("by-volunteers-data", JSON.stringify(volunteers));
  window.dispatchEvent(new CustomEvent("by-volunteers-updated", { detail: volunteers }));
}

// VOLUNTEER EMERGENCY GROUP CHAT
export const initialVolunteerMessages = [
  {
    id: "msg-1",
    sender: "National Volunteer Control",
    role: "Coordinator",
    state: "All India",
    time: "10:15 AM",
    text: "📢 Alert: High pilgrim footfall expected at Tirupati & Varanasi for upcoming festival. All volunteers on standby.",
    priority: "Normal",
  },
  {
    id: "msg-2",
    sender: "Rajesh Kumar",
    role: "Field Volunteer",
    state: "Andhra Pradesh",
    time: "11:04 AM",
    text: "Vizag RK Beach patrol active. First aid booth staffed at Submarine Museum. No active distress reported.",
    priority: "Low",
  },
  {
    id: "msg-3",
    sender: "Mohammed Zeeshan",
    role: "Field Volunteer",
    state: "Telangana",
    time: "11:32 AM",
    text: "Assisted elderly couple from Gujarat near Charminar with hydration and battery recharge. Now safely escorted to hotel.",
    priority: "Low",
  },
  {
    id: "msg-4",
    sender: "Amit Pathak",
    role: "Ghat Water Rescue",
    state: "Uttar Pradesh",
    time: "12:10 PM",
    text: "Dashashwamedh evening boat queue guidance active. High water advisory issued by river police.",
    priority: "High",
  }
];

export function getVolunteerChatMessages() {
  try {
    const saved = localStorage.getItem("by-volunteer-chat");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return initialVolunteerMessages;
}

export function sendVolunteerChatMessage(msg) {
  const messages = getVolunteerChatMessages();
  const newMsg = {
    id: `msg-${Date.now()}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ...msg,
  };
  const updated = [...messages, newMsg];
  localStorage.setItem("by-volunteer-chat", JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("by-volunteer-chat-updated", { detail: newMsg }));
  return updated;
}

// =========================================================================
// SOS REGISTRATIONS & MONITORING DATA
// =========================================================================

export const initialSosRegistrations = [
  {
    id: "SOS-REG-101",
    name: "Rahul & Ananya Sharma",
    phone: "+91 98480 12345",
    tripType: "Family",
    destination: "Visakhapatnam & Araku Valley",
    state: "Andhra Pradesh",
    days: 4,
    travelDate: "2026-10-12",
    purpose: "Heritage Tourism & Coffee Plantations",
    emergencyContacts: "+91 94401 56789 (Father - Ramesh Sharma), +91 98850 11223 (Sister)",
    localContacts: "Novotel Varun Beach Front Desk (+91-891-3045678), Cab Driver Satish (+91 98482 44331)",
    checkInTime: "08:00 AM & 08:00 PM",
    specialInstructions: "Elderly mother traveling along; requires ground-floor accommodations and low-altitude walking trails.",
    status: "Verified Active",
    registeredAt: "2026-09-08 14:30",
    ticketInfo: "Vande Bharat Express Train #20834 (Seat B4 21,22)",
    liveLocation: {
      lat: 17.7089,
      lng: 83.3039,
      address: "RK Beach Road Promenade, Visakhapatnam",
      updatedAt: "10 mins ago",
      battery: "85%",
      status: "Safe - Local Sightseeing",
      activities: [
        { time: "09:00 AM", text: "Checked in at Novotel Visakhapatnam Varun Beach", location: "Beach Road" },
        { time: "11:30 AM", text: "Visiting Submarine Museum & Kursura Memorial", location: "RK Beach" },
        { time: "02:15 PM", text: "Boarded cab AP31-TX-9901 towards Kailasagiri ropeway", location: "Kailasagiri" }
      ]
    }
  },
  {
    id: "SOS-REG-102",
    name: "Vikram Malhotra",
    phone: "+91 98110 44219",
    tripType: "Solo",
    destination: "Hyderabad (Charminar & Golconda)",
    state: "Telangana",
    days: 3,
    travelDate: "2026-10-18",
    purpose: "Cultural & Archaeological Photography",
    emergencyContacts: "+91 98110 99887 (Brother - Arjun Malhotra)",
    localContacts: "Taj Falaknuma Palace Concierge (+91-40-66298585)",
    checkInTime: "Every 4 Hours",
    specialInstructions: "Carrying professional camera gear; solo evening walks near Old City monuments.",
    status: "Verified Active",
    registeredAt: "2026-09-09 09:15",
    ticketInfo: "IndiGo 6E-452 (PNR: YTR892)",
    liveLocation: {
      lat: 17.3616,
      lng: 78.4747,
      address: "Near Charminar East Gate, Hyderabad",
      updatedAt: "25 mins ago",
      battery: "62%",
      status: "Safe - Walking Tour",
      activities: [
        { time: "08:30 AM", text: "Morning heritage walk started from Chowmahalla Palace", location: "Old City" },
        { time: "11:00 AM", text: "Exploring Laad Bazaar bangles artisan street", location: "Charminar" }
      ]
    }
  },
  {
    id: "SOS-REG-103",
    name: "Smt. Kamala Devi & Grandson",
    phone: "+91 94400 12345",
    tripType: "Elder Care",
    destination: "Tirupati & Simhachalam Circuit",
    state: "Andhra Pradesh",
    days: 3,
    travelDate: "2026-10-15",
    purpose: "Temple Pilgrimage & Darshan",
    emergencyContacts: "+91 98480 99881 (Son - Venkat Rao), +91 94401 22334 (Daughter)",
    localContacts: "SVIMS Doctor Dr. K. Murthy (+91 98770 11223), Fortune Grand Ridge Hotel",
    checkInTime: "Every 4 Hours",
    specialInstructions: "Diabetic patient with insulin requirements. Wheelchair assistance booked for Temple entry.",
    status: "Active Care Watch",
    registeredAt: "2026-09-09 11:00",
    ticketInfo: "APSRTC Garuda AC Sleeper Bus",
    liveLocation: {
      lat: 13.6373,
      lng: 79.4082,
      address: "Alipiri Footpath Gate 1, Tirupati",
      updatedAt: "40 mins ago",
      battery: "78%",
      status: "Safe - Temple Corridor",
      activities: [
        { time: "07:00 AM", text: "Special Darshan Entry verified with TTD pass", location: "Alipiri" },
        { time: "10:30 AM", text: "Resting at Pilgrim Rest House 4", location: "Tirumala Hills" }
      ]
    }
  }
];

export function getSosRegistrations() {
  try {
    const saved = localStorage.getItem("by-sos-registrations");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return initialSosRegistrations;
}

export function saveSosRegistrations(regs) {
  localStorage.setItem("by-sos-registrations", JSON.stringify(regs));
  window.dispatchEvent(new CustomEvent("by-sos-registrations-updated", { detail: regs }));
}

export function addSosRegistration(reg) {
  const existing = getSosRegistrations();
  const newReg = {
    id: reg.id || `SOS-REG-${Date.now().toString().slice(-4)}`,
    status: "Verified Active",
    registeredAt: new Date().toLocaleString(),
    liveLocation: reg.liveLocation || {
      lat: reg.lat || 17.7089,
      lng: reg.lng || 83.3039,
      address: reg.destination || "Tourist Location",
      updatedAt: "Just now",
      battery: "90%",
      status: "Safe - Journey Active",
      activities: [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: "Registered trip & activated safety radar", location: reg.destination || "Destination" }
      ]
    },
    ...reg
  };
  const updated = [newReg, ...existing.filter(x => x.id !== newReg.id && x.phone !== newReg.phone)];
  saveSosRegistrations(updated);
  return newReg;
}

export function updateTravelerLiveLocation(registrationId, locationUpdate) {
  const regs = getSosRegistrations();
  const updated = regs.map(r => {
    if (r.id === registrationId || r.phone === registrationId) {
      const currentLoc = r.liveLocation || {};
      const newActivities = locationUpdate.activityText 
        ? [{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: locationUpdate.activityText, location: locationUpdate.address || r.destination }, ...(currentLoc.activities || [])]
        : (currentLoc.activities || []);
      
      return {
        ...r,
        liveLocation: {
          ...currentLoc,
          lat: locationUpdate.lat ?? currentLoc.lat,
          lng: locationUpdate.lng ?? currentLoc.lng,
          address: locationUpdate.address || currentLoc.address || r.destination,
          updatedAt: "Just now",
          status: locationUpdate.status || "Safe - Active Tracking",
          battery: locationUpdate.battery || currentLoc.battery || "88%",
          activities: newActivities
        }
      };
    }
    return r;
  });
  saveSosRegistrations(updated);
  return updated;
}

// =========================================================================
// SCAMS DIRECTORY (Admin Configured per City / State)
// =========================================================================

export const initialScamsDirectory = [
  {
    id: "scam-1",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    category: "Transport & Coastal Waters",
    title: "Unlicensed Ghat Boat & Water Sports Touts",
    riskLevel: "Moderate",
    warning: "Always verify AP Tourism (APTDC) or Navy approved life jackets and valid operator badges at Rushikonda Beach & Araku waterfalls. Avoid touts offering private speedboats without safety manifests.",
    counterMeasure: "Book only through APTDC counters at Haritha Resorts or official government booths."
  },
  {
    id: "scam-2",
    city: "Hyderabad",
    state: "Telangana",
    category: "Shopping & Guiding",
    title: "Counterfeit Basra Pearls & Fake Audio Guides",
    riskLevel: "High",
    warning: "Street vendors outside Charminar and Golconda Fort sell plastic-coated beads as authentic pearls. Unofficial guides outside Golconda often bypass ASI certified rates.",
    counterMeasure: "Purchase pearls only from Government hallmarked emporiums in Laad Bazaar. Hire ASI guides with physical ID cards at the official ticket gate."
  },
  {
    id: "scam-3",
    city: "Tirupati",
    state: "Andhra Pradesh",
    category: "Darshan & Sevas",
    title: "Fake VIP Darshan & Laddu Tokens",
    riskLevel: "High",
    warning: "Private agents near the railway station and bus stand claim to provide immediate VIP Break Darshan tokens for hefty cash fees. These tokens are fraudulent and rejected at Vaikuntam queue complex.",
    counterMeasure: "Only purchase TTD tokens via the official tirupatibalaji.ap.gov.in portal or physical CRO counters."
  },
  {
    id: "scam-4",
    city: "Agra",
    state: "Uttar Pradesh",
    category: "Jewelry & Souvenirs",
    title: "Marble Inlay 'Gemstone' Switch Scam",
    riskLevel: "High",
    warning: "Auto-rickshaws frequently redirect visitors to emporiums claiming 'government factory outlet'. Genuine marble inlay does not change color under lemon juice.",
    counterMeasure: "Insist on visiting only the monument. Decline unsolicited shopping stopovers from transport drivers."
  },
  {
    id: "scam-5",
    city: "Varanasi",
    state: "Uttar Pradesh",
    category: "Boat Rides & Ceremonies",
    title: "Overcharged Sunrise Boat Rides & Cremation Photo Fees",
    riskLevel: "Moderate",
    warning: "Unauthorized boatmen demand exorbitant fees mid-river during Ganga Aarti or claim 'temple donation tax' for photographing Manikarnika Ghat.",
    counterMeasure: "Agree on rates fixed by the District Magistrate at Dashashwamedh Ghat counter before boarding."
  },
  {
    id: "scam-6",
    city: "Jaipur",
    state: "Rajasthan",
    category: "Gemstones & Textiles",
    title: "Precious Stone Export & Custom Duty Loophole Scam",
    riskLevel: "High",
    warning: "Friendly shopkeepers convince tourists to buy synthetic gems claiming they can sell them abroad for triple profit.",
    counterMeasure: "Never participate in postal export schemes for jewelry. Buy only with government GJEPC certificates."
  }
];

export function getScamsDirectory() {
  try {
    const saved = localStorage.getItem("by-scams-directory");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return initialScamsDirectory;
}

export function saveScamsDirectory(scams) {
  localStorage.setItem("by-scams-directory", JSON.stringify(scams));
  window.dispatchEvent(new CustomEvent("by-scams-directory-updated", { detail: scams }));
}

// =========================================================================
// SOS SETTINGS: Find My Device Credentials & WhatsApp Communities
// =========================================================================

export const initialSosSettings = {
  findMyDeviceEmail: "sos.safety@bharatyatra.gov.in",
  findMyDevicePassword: "BY-SOS-SECURE-2026#PROTECT",
  whatsappGroups: {
    // District / City level
    "Visakhapatnam": "https://chat.whatsapp.com/invite/BharatYatraVizagSafety",
    "Araku Valley": "https://chat.whatsapp.com/invite/BharatYatraArakuSafety",
    "Hyderabad": "https://chat.whatsapp.com/invite/BharatYatraHyderabadSafety",
    "Tirupati": "https://chat.whatsapp.com/invite/BharatYatraTirupatiSafety",
    "Agra": "https://chat.whatsapp.com/invite/BharatYatraAgraSafety",
    "Varanasi": "https://chat.whatsapp.com/invite/BharatYatraVaranasiSafety",
    "Jaipur": "https://chat.whatsapp.com/invite/BharatYatraJaipurSafety",
    
    // State level fallbacks
    "Andhra Pradesh": "https://chat.whatsapp.com/invite/BharatYatraAndhraSafety",
    "Telangana": "https://chat.whatsapp.com/invite/BharatYatraTelanganaSafety",
    "Uttar Pradesh": "https://chat.whatsapp.com/invite/BharatYatraUPSafety",
    "Rajasthan": "https://chat.whatsapp.com/invite/BharatYatraRajasthanSafety",
    "Delhi": "https://chat.whatsapp.com/invite/BharatYatraDelhiSafety",
    "Tamil Nadu": "https://chat.whatsapp.com/invite/BharatYatraTamilNaduSafety",
    "Karnataka": "https://chat.whatsapp.com/invite/BharatYatraKarnatakaSafety",
    "Maharashtra": "https://chat.whatsapp.com/invite/BharatYatraMaharashtraSafety",
    
    // Country level default
    "All India": "https://chat.whatsapp.com/invite/BharatYatraNationalSOS"
  }
};

export function getSosSettings() {
  try {
    const saved = localStorage.getItem("by-sos-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.findMyDeviceEmail) return parsed;
    }
  } catch (e) {}
  return initialSosSettings;
}

export function saveSosSettings(settings) {
  localStorage.setItem("by-sos-settings", JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("by-sos-settings-updated", { detail: settings }));
}

export function getWhatsAppGroupLink(destination = "", state = "") {
  const settings = getSosSettings();
  const groups = settings.whatsappGroups || {};
  
  // 1. Check exact city / destination match
  for (const [key, link] of Object.entries(groups)) {
    if (destination.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(destination.toLowerCase())) {
      return { level: "City / District", name: key, link };
    }
  }
  
  // 2. Check state match
  for (const [key, link] of Object.entries(groups)) {
    if (state && (state.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(state.toLowerCase()))) {
      return { level: "State", name: key, link };
    }
    if (destination && destination.toLowerCase().includes(key.toLowerCase())) {
      return { level: "State", name: key, link };
    }
  }
  
  // 3. Fallback to All India National SOS
  return { 
    level: "National", 
    name: "All India National Tourist Safety Community", 
    link: groups["All India"] || "https://chat.whatsapp.com/invite/BharatYatraNationalSOS" 
  };
}

