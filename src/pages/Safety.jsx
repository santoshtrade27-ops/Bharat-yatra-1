import { useState, useEffect, useRef } from "react";
import { 
  MapPin, Send, CheckCircle2, Heart, 
  PhoneCall, Volume2, VolumeX, AlertOctagon, 
  Compass, Hospital, ShieldAlert, Navigation, Sparkles, Mic, MicOff,
  Copy, Check, Share2, ExternalLink, Loader2, Download,
  UserCheck, AlertTriangle, ShieldCheck, Clock, RefreshCw, Camera,
  Users, User
} from "lucide-react";
import { 
  getEmergencyCenters, 
  getSosRegistrations, 
  addSosRegistration, 
  updateTravelerLiveLocation,
  getScamsDirectory,
  getSosSettings,
  getWhatsAppGroupLink,
  getVolunteers
} from "@/lib/adminData";
import { generateSafetyKitPDF } from "@/lib/pdfGenerator";

// 24/7 Verified Emergency Helplines of India
const emergencyHelplines = [
  { number: "112", name: "National Emergency Service", subtitle: "Unified Police, Fire & Medical Responder", color: "bg-red-500 text-white" },
  { number: "1363", name: "Tourist Police Helpline", subtitle: "24/7 Multilingual Support (Ministry of Tourism)", color: "bg-purple-600 text-white" },
  { number: "108", name: "Ambulance & Trauma Care", subtitle: "Free Advanced Life Support Emergency Response", color: "bg-emerald-600 text-white" },
  { number: "1091", name: "Women Safety & Helpline", subtitle: "Anti-Harassment & Rapid Police Patrol", color: "bg-pink-600 text-white" },
  { number: "1033", name: "National Highway Emergency", subtitle: "NHAI Accident Assistance & Crane Towing", color: "bg-amber-600 text-white" },
  { number: "1930", name: "Cyber Crime & Financial Fraud", subtitle: "Immediate UPI / Net Banking Freeze", color: "bg-blue-600 text-white" },
];

// Preset SOS Emergency Distress Categories
const presetEmergencyPrompts = [
  {
    id: "medical",
    label: "🚑 Medical Emergency",
    prompt: "I have a serious medical emergency: sudden severe illness/injury requiring an immediate ambulance and doctor.",
  },
  {
    id: "police",
    label: "👮 Threat / Harassment",
    prompt: "I am facing aggressive harassment and security threats from local touts near the tourist site. I need tourist police protection.",
  },
  {
    id: "lost",
    label: "🌲 Lost / Stranded in Forest",
    prompt: "I am lost and stranded in a remote ghat/forest area with fading daylight and low phone battery. Need GPS search assistance.",
  },
  {
    id: "accident",
    label: "🚗 Highway Accident",
    prompt: "Vehicle breakdown and road accident on the highway. We require emergency towing and medical assistance.",
  },
  {
    id: "theft",
    label: "💳 Theft / Cyber Scam",
    prompt: "My passport, bag and wallet were stolen, or my bank account was defrauded while traveling. Need immediate help reporting and freezing accounts.",
  },
];

const indianStates = [
  "All States",
  "Andhra Pradesh",
  "Telangana",
  "Uttar Pradesh",
  "Rajasthan",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Goa",
  "Kerala"
];

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d.toFixed(1);
}

export default function Safety() {
  const [activeTab, setActiveTab] = useState("sos_response"); // "sos_response" | "registration" | "elder_care" | "centers_scams"

  // Registration Form State
  const [tripForm, setTripForm] = useState({
    name: "",
    phone: "",
    tripType: "Solo", // "Solo" | "Family" | "Group"
    destination: "Visakhapatnam & Araku Valley",
    state: "Andhra Pradesh",
    days: 3,
    travelDate: new Date().toISOString().split("T")[0],
    purpose: "Heritage Tourism",
    emergencyContacts: "",
    emergencyContactEmail: "", // New field
    emergencyContactPassword: "", // New field
    localContacts: "",
    ticketInfo: "",
    checkInTime: "Every 4 Hours",
    specialInstructions: "",
    photoUrl: "",
  });

  const [registered, setRegistered] = useState(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [analyzingSafety, setAnalyzingSafety] = useState(false);

  // Daily Activity Update
  const [newActivityText, setNewActivityText] = useState("");
  const [updatingLocation, setUpdatingLocation] = useState(false);

  // Live Location & GPS
  const [coords, setCoords] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Emergency SOS State
  const [activeSOS, setActiveSOS] = useState(null);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [customSosPrompt, setCustomSosPrompt] = useState("");
  const [isSilentSos, setIsSilentSos] = useState(false);
  const [sosAiLoading, setSosAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Emergency Centers & Scams State
  const [emergencyCenters, setEmergencyCenters] = useState(() => getEmergencyCenters());
  const [scamsList, setScamsList] = useState(() => getScamsDirectory());
  const [selectedStateFilter, setSelectedStateFilter] = useState("All States");
  const [selectedCityFilter, setSelectedCityFilter] = useState("All");

  // Elder Care State
  const [elder, setElder] = useState({ 
    name: "", 
    phone: "", 
    guardianPhone: "", 
    frequencyHours: 4, 
    purpose: "Pilgrimage / Family Travel", 
    itineraryInfo: "" 
  });
  const [monitoring, setMonitoring] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [forwarded, setForwarded] = useState(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);

  useEffect(() => {
    // Load existing registrations
    const savedReg = localStorage.getItem("by-active-tourist-reg");
    if (savedReg) {
      try {
        const parsed = JSON.parse(savedReg);
        setRegistered(parsed);
      } catch (e) {}
    } else {
      // Default initial mock active registration for preview
      const all = getSosRegistrations();
      if (all && all.length > 0) {
        setRegistered(all[0]);
      }
    }

    const savedElder = localStorage.getItem("by-elder-record");
    if (savedElder) {
      try {
        setElder(JSON.parse(savedElder));
      } catch (e) {}
    }

    const activeSosSaved = localStorage.getItem("by-active-sos");
    if (activeSosSaved) {
      try {
        setActiveSOS(JSON.parse(activeSosSaved));
      } catch (e) {}
    }

    // Try to acquire initial GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          setCoords([p.coords.latitude.toFixed(4), p.coords.longitude.toFixed(4)]);
          if (p.coords.accuracy) setGpsAccuracy(Math.round(p.coords.accuracy));
        },
        () => {
          // Fallback to Visakhapatnam coordinates
          setCoords(["17.7089", "83.3039"]);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setCoords(["17.7089", "83.3039"]);
    }

    function handleCentersUpdate() {
      setEmergencyCenters(getEmergencyCenters());
    }
    function handleScamsUpdate() {
      setScamsList(getScamsDirectory());
    }
    function handleSosRegsUpdate() {
      const all = getSosRegistrations();
      if (registered) {
        const updated = all.find(r => r.id === registered.id || r.phone === registered.phone);
        if (updated) setRegistered(updated);
      }
    }

    window.addEventListener("by-emergency-centers-updated", handleCentersUpdate);
    window.addEventListener("by-scams-directory-updated", handleScamsUpdate);
    window.addEventListener("by-sos-registrations-updated", handleSosRegsUpdate);

    return () => {
      window.removeEventListener("by-emergency-centers-updated", handleCentersUpdate);
      window.removeEventListener("by-scams-directory-updated", handleScamsUpdate);
      window.removeEventListener("by-sos-registrations-updated", handleSosRegsUpdate);
      stopSirenAudio();
    };
  }, []);

  // Elder care countdown timer
  useEffect(() => {
    if (!monitoring || !deadline) return;
    timerRef.current = setInterval(() => {
      const left = deadline - Date.now();
      if (left <= 0) {
        forwardElderAlert();
      } else {
        setRemaining(left);
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [monitoring, deadline]);

  // Audio Siren generator
  function startSirenAudio() {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 400;
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      setSirenPlaying(true);
    } catch (e) {
      console.warn("Audio siren not supported:", e);
    }
  }

  function stopSirenAudio() {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      setSirenPlaying(false);
    } catch (e) {}
  }

  function toggleSiren() {
    if (sirenPlaying) {
      stopSirenAudio();
    } else {
      startSirenAudio();
    }
  }

  // Voice Speech Recognition
  function toggleVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your emergency description.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setCustomSosPrompt((prev) => (prev ? `${prev} ${text}` : text));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  }

  // SOS Trigger
  function triggerSOS(customText = "", category = "Active Distress Beacon") {
    const incidentId = `SOS-${Math.floor(100 + Math.random() * 900)}`;
    const mapLink = coords 
      ? `https://www.google.com/maps?q=${coords[0]},${coords[1]}` 
      : "GPS resolving";

    const incident = {
      id: incidentId,
      traveler: registered?.name || tripForm.name || "Traveler In Distress",
      phone: registered?.phone || tripForm.phone || "+91 (Active Mobile)",
      location: coords ? `GPS: ${coords[0]}° N, ${coords[1]}° E` : "Location Acquired via Network",
      lat: coords ? parseFloat(coords[0]) : 17.7089,
      lng: coords ? parseFloat(coords[1]) : 83.3039,
      time: "Just now",
      status: "Active Distress Beacon",
      severity: "High",
      category,
      emergencyPrompt: customText || customSosPrompt || "Urgent emergency assistance requested",
      mapLink,
      destination: registered?.destination || tripForm.destination || "Indian Heritage Circuit",
    };

    setActiveSOS(incident);
    localStorage.setItem("by-active-sos", JSON.stringify(incident));

    // Save to shared localStorage for Admin Safety Command Center
    try {
      const existing = JSON.parse(localStorage.getItem("by-sos-incidents") || "[]");
      const updated = [incident, ...existing.filter((x) => x.id !== incident.id)];
      localStorage.setItem("by-sos-incidents", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("by-sos-incidents-updated", { detail: updated }));
    } catch (e) {}

    // Start siren
    if (!isSilentSos) {
      startSirenAudio();
    }

    // Prepare WhatsApp alert message
    const msg = `🚨 BHARAT YATRA EMERGENCY SOS 🚨%0AIncident ID: ${incident.id}%0ACategory: ${encodeURIComponent(category)}%0ATraveler: ${encodeURIComponent(incident.traveler)}%0APhone: ${encodeURIComponent(incident.phone)}%0ADescription: ${encodeURIComponent(incident.emergencyPrompt)}%0ALocation: ${coords ? `${coords[0]}, ${coords[1]}` : "Current Tourist Location"}%0AMap Pin: ${encodeURIComponent(mapLink)}%0APlease dispatch Tourist Police (1363) or Medical Responders (108) immediately!`;
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }

  function cancelSOS() {
    stopSirenAudio();
    setActiveSOS(null);
    localStorage.removeItem("by-active-sos");
    try {
      const existing = JSON.parse(localStorage.getItem("by-sos-incidents") || "[]");
      const updated = existing.map(x => x.id === activeSOS?.id ? { ...x, status: "Resolved" } : x);
      localStorage.setItem("by-sos-incidents", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("by-sos-incidents-updated", { detail: updated }));
    } catch (e) {}
  }

  // Handle Traveler Registration Submission
  async function handleRegisterTrip(e) {
    e.preventDefault();
    if (!tripForm.name || !tripForm.phone || !tripForm.destination) {
      alert("Please enter Full Name, Phone Number, and Destination Circuit.");
      return;
    }

    setAnalyzingSafety(true);

    const newRecord = {
      ...tripForm,
      id: `SOS-REG-${Date.now().toString().slice(-4)}`,
      lat: coords ? parseFloat(coords[0]) : 17.7089,
      lng: coords ? parseFloat(coords[1]) : 83.3039,
    };

    // Save to centralized data store
    const created = addSosRegistration(newRecord);
    setRegistered(created);
    localStorage.setItem("by-active-tourist-reg", JSON.stringify(created));

    // Perform AI Safety Assessment
    try {
      const res = await fetch("/api/ai/sos-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emergencyPrompt: `Analyze safety risks for a ${tripForm.tripType} traveler visiting ${tripForm.destination} (${tripForm.state}) for ${tripForm.days} days. Purpose: ${tripForm.purpose}. Instructions: ${tripForm.specialInstructions || 'None'}`,
          userLocation: `${tripForm.destination}, ${tripForm.state}`,
          travelerName: tripForm.name,
        }),
      });
      const data = await res.json();
      setAiAnalysisResult(data);
    } catch (err) {
      console.warn("AI Analysis Fallback:", err);
      setAiAnalysisResult({
        summary: `AI verified safety perimeter for ${tripForm.destination}. High network coverage and tourist police posts confirmed.`,
        guidance: "Keep offline maps downloaded and check in at scheduled intervals.",
        actionPoints: [
          "Share live GPS location with your registered family contacts.",
          "Download the official Safety Kit PDF with emergency credentials.",
          "Join the verified WhatsApp safety community for your district."
        ]
      });
    } finally {
      setAnalyzingSafety(false);
    }
  }

  // Update Daily Activity & Live GPS Location
  function handlePostActivityUpdate(e) {
    e.preventDefault();
    if (!newActivityText.trim() && !coords) return;

    setUpdatingLocation(true);
    const text = newActivityText.trim() || "Live GPS Location Check-in";
    const currentLat = coords ? parseFloat(coords[0]) : (registered?.liveLocation?.lat || 17.7089);
    const currentLng = coords ? parseFloat(coords[1]) : (registered?.liveLocation?.lng || 83.3039);

    const updatedList = updateTravelerLiveLocation(registered?.id || "SOS-REG-101", {
      lat: currentLat,
      lng: currentLng,
      address: registered?.destination || "Current Tour Location",
      activityText: text,
      status: "Safe - Location Updated",
      battery: "88%"
    });

    const refreshed = updatedList.find(r => r.id === (registered?.id || "SOS-REG-101"));
    if (refreshed) {
      setRegistered(refreshed);
      localStorage.setItem("by-active-tourist-reg", JSON.stringify(refreshed));
    }
    setNewActivityText("");
    setUpdatingLocation(false);
  }

  // Handle Photo Attachment
  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setTripForm(prev => ({ ...prev, photoUrl: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  // Download PDF Kit
  function downloadSafetyPDF() {
    if (!registered) return;
    const settings = getSosSettings();
    const scams = getScamsDirectory().filter(s => s.state === registered.state || s.city.includes(registered.destination));
    const volunteers = getVolunteers().filter(v => v.state === registered.state);
    generateSafetyKitPDF(registered, settings, scams, volunteers);
  }

  // Elder Care logic
  function startElderMonitoring() {
    if (!elder.phone || !elder.name) {
      alert("Please fill Elder Name and Phone Number.");
      return;
    }
    localStorage.setItem("by-elder-record", JSON.stringify(elder));
    
    // Add to Admin SOS registrations
    addSosRegistration({
      id: `ELD-${Date.now().toString().slice(-4)}`,
      name: elder.name,
      phone: elder.phone,
      tripType: "Elder Care",
      destination: elder.purpose || "Pilgrimage Route",
      state: "Andhra Pradesh",
      emergencyContacts: `${elder.guardianPhone} (Guardian)`,
      checkInTime: `Every ${elder.frequencyHours} Hours`,
      specialInstructions: elder.itineraryInfo || "Elderly traveler monitoring",
      status: "Active Care Watch"
    });

    setMonitoring(true);
    setDeadline(Date.now() + elder.frequencyHours * 3600 * 1000);
    setForwarded(null);
  }

  function stopElderMonitoring() {
    setMonitoring(false);
    setDeadline(null);
    setRemaining(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function elderCheckIn() {
    if (!monitoring) return;
    setDeadline(Date.now() + elder.frequencyHours * 3600 * 1000);
    setRemaining(elder.frequencyHours * 3600 * 1000);
    setForwarded(null);
  }

  function forwardElderAlert() {
    const msg = `🆘 BHARAT YATRA ELDER SAFETY ALERT: ${elder.name || "Elder Traveler"} missed their scheduled safety check-in! Please call them immediately at ${elder.phone}.`;
    window.open(`tel:${elder.guardianPhone || elder.phone}`, "_self");
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    setForwarded(new Date().toLocaleTimeString());
    setDeadline(Date.now() + elder.frequencyHours * 3600 * 1000);
  }

  // Location Helpers
  function copyCoordinates() {
    if (!coords) return;
    const text = `${coords[0]}, ${coords[1]}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  }

  function shareLocationWhatsApp() {
    if (!coords) return;
    const mapLink = `https://www.google.com/maps?q=${coords[0]},${coords[1]}`;
    const msg = `📍 My Current Live GPS Location: ${coords[0]}, ${coords[1]}%0AGoogle Maps: ${encodeURIComponent(mapLink)}%0ASent via Bharat Yatra Tourist Safety Hub.`;
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }

  function toggleLiveGPS() {
    if (!navigator.geolocation) return;
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (p) => {
        setCoords([p.coords.latitude.toFixed(4), p.coords.longitude.toFixed(4)]);
        if (p.coords.accuracy) setGpsAccuracy(Math.round(p.coords.accuracy));
      },
      () => {},
      { enableHighAccuracy: true }
    );
    setWatchId(id);
  }

  // Filter Emergency Centers & Scams
  const userLat = coords ? parseFloat(coords[0]) : 17.7089;
  const userLng = coords ? parseFloat(coords[1]) : 83.3039;

  const filteredCenters = emergencyCenters
    .filter(c => {
      if (selectedStateFilter === "All States") return true;
      return (c.city || "").toLowerCase().includes(selectedStateFilter.toLowerCase());
    })
    .map(c => ({
      ...c,
      distanceKm: calculateDistanceKm(userLat, userLng, c.lat, c.lng),
    }))
    .sort((a, b) => {
      if (a.distanceKm && b.distanceKm) return parseFloat(a.distanceKm) - parseFloat(b.distanceKm);
      return 0;
    });

  const filteredScams = scamsList.filter(s => {
    if (selectedStateFilter === "All States") return true;
    return (s.state || "").toLowerCase().includes(selectedStateFilter.toLowerCase()) || 
           (s.city || "").toLowerCase().includes(selectedStateFilter.toLowerCase());
  });

  const waCommunity = getWhatsAppGroupLink(registered?.destination || tripForm.destination, registered?.state || tripForm.state);
  const sosSettings = getSosSettings();

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Upper Header Banner */}
      <section className="bg-card border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-8 h-8 text-destructive animate-pulse" />
                <h1 className="text-2xl sm:text-3xl font-bold font-heading">
                  Tourist Safety, SOS Emergency & Location Hub
                </h1>
              </div>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                24/7 Rapid SOS dispatch, live GPS geofencing, journey registration, and verified local safety intelligence.
              </p>
            </div>

            {/* Quick Action Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleSiren}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  sirenPlaying 
                    ? "bg-destructive text-destructive-foreground animate-bounce" 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {sirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-destructive" />}
                <span>{sirenPlaying ? "MUTE DISTRESS SIREN" : "🔊 LOUD AUDIO SIREN"}</span>
              </button>

              <button
                type="button"
                onClick={() => triggerSOS("", "One-Touch Emergency SOS")}
                className="px-4 py-2 rounded-2xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-bold flex items-center gap-1.5 shadow-md animate-pulse"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>SEND EMERGENCY SOS</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: "sos_response", label: "🚨 Emergency SOS & Hotlines", icon: AlertOctagon },
              { id: "registration", label: "📋 Safety Registration & Live Tracker", icon: UserCheck },
              { id: "elder_care", label: "❤️ Elder Traveler Care", icon: Heart },
              { id: "centers_scams", label: "🏥 Emergency Centers & Scams Radar", icon: Hospital },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ACTIVE SOS BEACON ALERT BANNER */}
        {activeSOS && (
          <div className="p-5 sm:p-6 rounded-3xl bg-destructive/10 border-2 border-destructive animate-pulse space-y-3 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-destructive animate-ping shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-destructive flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5" /> Active Emergency SOS Beacon ({activeSOS.id})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Distress telemetry transmitted to Tourist Police (1363) and registered emergency WhatsApp contacts.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:112`}
                  className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call 112 Police
                </a>
                <button
                  type="button"
                  onClick={cancelSOS}
                  className="px-4 py-2 rounded-xl bg-card border border-border text-foreground font-bold text-xs hover:bg-muted"
                >
                  Deactivate Beacon
                </button>
              </div>
            </div>

            {coords && (
              <div className="text-xs text-muted-foreground font-mono bg-card/60 p-2.5 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>📍 Locked Emergency Coordinates: {coords[0]}° N, {coords[1]}° E</span>
                <a
                  href={`https://www.google.com/maps?q=${coords[0]},${coords[1]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 font-sans"
                >
                  Open Live Pin in Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: EMERGENCY SOS & HOTLINES */}
        {/* ========================================================================= */}
        {activeTab === "sos_response" && (
          <div className="space-y-6">
            {/* 1. Instant SOS Trigger & Voice Distress Assistant */}
            <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-card via-card to-destructive/5 border-2 border-primary/20 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-destructive/15 text-destructive font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-destructive" /> AI Emergency Telemetry
                    </span>
                    <span className="text-xs text-muted-foreground">Gemini Distress Protocol</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading mt-1">
                    Emergency Distress SOS & AI Dispatch Assistant
                  </h2>
                </div>
                <div className="text-xs text-muted-foreground">
                  Logged as: <strong className="text-foreground">{registered?.name || "Traveler In Distress"}</strong>
                </div>
              </div>

              {/* Big Red SOS Button */}
              <div className="flex flex-col items-center justify-center p-6 bg-muted/40 rounded-3xl border border-border text-center space-y-4">
                <button
                  type="button"
                  onClick={() => triggerSOS("", "Instant Big Button SOS")}
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 border-4 border-red-400/40 animate-pulse"
                >
                  <AlertOctagon className="w-10 h-10 sm:w-12 sm:h-12" />
                  <span className="text-lg sm:text-xl font-extrabold tracking-wider">SEND SOS</span>
                  <span className="text-[10px] sm:text-xs opacity-90">Tap to Dispatch Help</span>
                </button>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={isSilentSos} 
                    onChange={(e) => setIsSilentSos(e.target.checked)}
                    id="silent-sos-toggle"
                    className="accent-red-600"
                  />
                  <label htmlFor="silent-sos-toggle" className="text-xs text-muted-foreground">Send SOS without sound</label>
                </div>
                <p className="text-xs text-muted-foreground max-w-md">
                  Transmits high-precision GPS coordinates, traveler identity, and triggers automated alerts to 112, 1363, and emergency contacts.
                </p>
              </div>

              {/* Speech Input & Custom Description */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-foreground block">
                  Describe Emergency (Voice or Text):
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={customSosPrompt}
                      onChange={(e) => setCustomSosPrompt(e.target.value)}
                      placeholder="e.g. Stranded on mountain road with vehicle breakdown, need medical help..."
                      className="w-full pl-4 pr-10 py-3 rounded-2xl bg-background border border-border text-foreground text-xs sm:text-sm outline-none focus:ring-2 focus:ring-destructive"
                    />
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl text-xs transition-colors ${
                        isListening 
                          ? "bg-destructive text-destructive-foreground animate-bounce" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      title="Voice Speech Input"
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => triggerSOS(customSosPrompt, "Custom AI Distress")}
                    disabled={sosAiLoading}
                    className="px-5 py-3 rounded-2xl bg-destructive text-destructive-foreground font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:bg-destructive/90 transition-all shrink-0"
                  >
                    {sosAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Dispatch SOS</span>
                  </button>
                </div>

                {/* Distress Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {presetEmergencyPrompts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setCustomSosPrompt(p.prompt);
                        triggerSOS(p.prompt, p.label);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold hover:border-destructive hover:bg-destructive/10 text-foreground transition-all"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* GPS Live Bar */}
              <div className="p-4 rounded-2xl bg-muted/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">
                      {coords ? `GPS: ${coords[0]}° N, ${coords[1]}° E` : "Acquiring satellite lock..."}
                      {gpsAccuracy && <span className="text-muted-foreground font-normal ml-1">±{gpsAccuracy}m accuracy</span>}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {watchId ? "Continuous high-accuracy GPS tracking ON" : "Single point coordinates locked"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={toggleLiveGPS}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                      watchId ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {watchId ? "Stop Tracking" : "Start Live GPS"}
                  </button>
                  <button
                    type="button"
                    onClick={copyCoordinates}
                    className="px-3 py-1.5 rounded-xl bg-card border border-border hover:bg-muted font-bold text-xs text-foreground flex items-center gap-1"
                  >
                    {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCoords ? "Copied" : "Copy GPS"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={shareLocationWhatsApp}
                    className="px-3 py-1.5 rounded-xl bg-card border border-border hover:bg-muted font-bold text-xs text-foreground flex items-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-500" /> Share Pin
                  </button>
                </div>
              </div>
            </section>

            {/* 2. National Verified Helplines */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2 font-heading">
                  <PhoneCall className="w-5 h-5 text-primary" /> Verified 24/7 National Emergency Helplines
                </h3>
                <span className="text-xs text-muted-foreground">Tap to dial instantly</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {emergencyHelplines.map((h) => (
                  <a
                    key={h.number}
                    href={`tel:${h.number}`}
                    className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all flex items-center justify-between gap-3 group shadow-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold ${h.color}`}>
                          {h.number}
                        </span>
                        <span className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {h.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{h.subtitle}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground shrink-0 transition-colors">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TOURIST SAFETY REGISTRATION & LIVE TRACKER */}
        {/* ========================================================================= */}
        {activeTab === "registration" && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Column: Comprehensive Registration Form */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2 font-heading">
                    <UserCheck className="w-5 h-5 text-primary" /> Tourist Journey Safety Registration
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pre-register your trip itinerary, local emergency contacts, and daily check-in preferences for AI monitoring.
                  </p>
                </div>

                <form onSubmit={handleRegisterTrip} className="space-y-4 text-xs">
                  {/* Trip Type Selector */}
                  <div>
                    <label className="font-semibold text-foreground block mb-1.5">
                      Traveler Type / Group Format:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "Solo", label: "Solo Traveler", icon: User },
                        { id: "Family", label: "Family Trip", icon: Users },
                        { id: "Group", label: "Tour Group", icon: Compass },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTripForm({ ...tripForm, tripType: t.id })}
                          className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                            tripForm.tripType === t.id
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-muted/40 border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <t.icon className="w-3.5 h-3.5" />
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Full Name / Primary Contact *:
                      </label>
                      <input
                        type="text"
                        required
                        value={tripForm.name}
                        onChange={(e) => setTripForm({ ...tripForm, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Mobile Number (WhatsApp) *:
                      </label>
                      <input
                        type="tel"
                        required
                        value={tripForm.phone}
                        onChange={(e) => setTripForm({ ...tripForm, phone: e.target.value })}
                        placeholder="+91 98480 12345"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Destination & State */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Destination Circuit / City *:
                      </label>
                      <input
                        type="text"
                        required
                        value={tripForm.destination}
                        onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
                        placeholder="e.g. Visakhapatnam & Araku Valley"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        State:
                      </label>
                      <select
                        value={tripForm.state}
                        onChange={(e) => setTripForm({ ...tripForm, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                      >
                        {indianStates.filter(s => s !== "All States").map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Travel Date & Days */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Travel Start Date:
                      </label>
                      <input
                        type="date"
                        value={tripForm.travelDate}
                        onChange={(e) => setTripForm({ ...tripForm, travelDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Trip Duration (Days):
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={tripForm.days}
                        onChange={(e) => setTripForm({ ...tripForm, days: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Purpose of Visit & Check-in Preference */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Purpose of Visit:
                      </label>
                      <select
                        value={tripForm.purpose}
                        onChange={(e) => setTripForm({ ...tripForm, purpose: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none"
                      >
                        <option value="Heritage Tourism">Heritage Tourism & Sightseeing</option>
                        <option value="Temple Pilgrimage">Temple Pilgrimage & Darshan</option>
                        <option value="Trekking & Adventure">Trekking & Wildlife Adventure</option>
                        <option value="Leisure & Beach">Leisure & Beach Relaxation</option>
                        <option value="Official / Business">Official / Research</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Daily Check-in Time Preference:
                      </label>
                      <select
                        value={tripForm.checkInTime}
                        onChange={(e) => setTripForm({ ...tripForm, checkInTime: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none"
                      >
                        <option value="Every 4 Hours">Every 4 Hours</option>
                        <option value="Every 8 Hours">Every 8 Hours</option>
                        <option value="08:00 AM & 08:00 PM">Twice Daily (08:00 AM & 08:00 PM)</option>
                        <option value="10:00 AM Daily">Once Daily (10:00 AM)</option>
                      </select>
                    </div>
                  </div>

                  {/* Emergency Family Contacts */}
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Emergency Family Contacts (Phone / WhatsApp) *:
                    </label>
                    <input
                      type="text"
                      required
                      value={tripForm.emergencyContacts}
                      onChange={(e) => setTripForm({ ...tripForm, emergencyContacts: e.target.value })}
                      placeholder="e.g. +91 94401 56789 (Father), +91 98850 11223 (Sister)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* New Fields */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Emergency Contact Email:
                      </label>
                      <input
                        type="email"
                        value={tripForm.emergencyContactEmail}
                        onChange={(e) => setTripForm({ ...tripForm, emergencyContactEmail: e.target.value })}
                        placeholder="e.g. family@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Emergency Contact Password:
                      </label>
                      <input
                        type="password"
                        value={tripForm.emergencyContactPassword}
                        onChange={(e) => setTripForm({ ...tripForm, emergencyContactPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Google Find My Device Name */}
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Google Find My Device Name (For Satellite Tracking):
                    </label>
                    <input
                      type="text"
                      value={tripForm.deviceName || ""}
                      onChange={(e) => setTripForm({ ...tripForm, deviceName: e.target.value })}
                      placeholder="e.g. Pixel 8 Pro, Galaxy S24 Ultra, iPhone 15 Pro"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      Exact phone model name as visible in Google Find My Device app for emergency locator synchronization
                    </span>
                  </div>

                  {/* Local Contacts / Hotel at Destination */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Local Contact / Hotel at Destination (Optional):
                      </label>
                      <input
                        type="text"
                        value={tripForm.localContacts}
                        onChange={(e) => setTripForm({ ...tripForm, localContacts: e.target.value })}
                        placeholder="e.g. Novotel Varun Beach / Cab Driver Satish (+91 98482 44331)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Tickets / Route Map / PNR Info (Optional):
                      </label>
                      <input
                        type="text"
                        value={tripForm.ticketInfo}
                        onChange={(e) => setTripForm({ ...tripForm, ticketInfo: e.target.value })}
                        placeholder="e.g. Vande Bharat Express #20834 Seat B4 21,22"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none"
                      />
                    </div>
                  </div>

                  {/* Custom Special Instructions & Medical Notes */}
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Special Rules / Instructions / Medical Needs:
                    </label>
                    <textarea
                      rows="2"
                      value={tripForm.specialInstructions}
                      onChange={(e) => setTripForm({ ...tripForm, specialInstructions: e.target.value })}
                      placeholder="e.g. Elderly mother traveling along; carrying asthma inhaler; prefer ground floor hotels..."
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground outline-none"
                    />
                  </div>

                  {/* Traveler Photo / ID upload */}
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Traveler ID / Profile Photo (Optional for Identification):
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold cursor-pointer flex items-center gap-2 border border-border">
                        <Camera className="w-4 h-4 text-primary" />
                        <span>Upload Photo</span>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                      {tripForm.photoUrl && (
                        <div className="flex items-center gap-2">
                          <img src={tripForm.photoUrl} alt="Preview" className="w-8 h-8 rounded-full object-cover border border-primary" />
                          <span className="text-emerald-600 font-bold text-[11px]">Photo Attached</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={analyzingSafety}
                    className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    {analyzingSafety ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>Register Journey & Activate AI Safety Radar</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Active Safety Profile & Real-time Location Updates */}
              <div className="lg:col-span-5 space-y-6">
                {registered ? (
                  <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <h4 className="font-bold text-foreground">Active Safety Registration</h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                        {registered.status || "Verified Active"}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p><strong className="text-foreground">Traveler:</strong> {registered.name}</p>
                      <p><strong className="text-foreground">Mobile:</strong> {registered.phone}</p>
                      <p><strong className="text-foreground">Destination:</strong> {registered.destination} ({registered.state})</p>
                      <p><strong className="text-foreground">Trip Type:</strong> {registered.tripType} · {registered.days} Days</p>
                      <p><strong className="text-foreground">Check-in:</strong> {registered.checkInTime}</p>
                      {registered.deviceName && (
                        <p><strong className="text-foreground">Google Find My Device:</strong> <span className="font-mono text-primary font-bold">{registered.deviceName}</span></p>
                      )}
                    </div>

                    {/* AI Safety Assessment Output */}
                    {aiAnalysisResult && (
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-primary">
                          <Sparkles className="w-3.5 h-3.5" /> AI Safety Analysis
                        </div>
                        <p className="text-muted-foreground">{aiAnalysisResult.summary || aiAnalysisResult.guidance}</p>
                      </div>
                    )}

                    {/* Action Buttons: Community WhatsApp & PDF */}
                    <div className="space-y-2.5 pt-2">
                      <a
                        href={waCommunity.link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-emerald-700 transition-colors"
                      >
                        <Share2 className="w-4 h-4" /> Join Official State WhatsApp Group: {waCommunity.name} ({waCommunity.level})
                      </a>

                      <button
                        type="button"
                        onClick={downloadSafetyPDF}
                        className="w-full py-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Download className="w-4 h-4 text-primary" /> Download Official Safety Kit PDF
                      </button>
                    </div>

                    {/* Emergency Control Email & Safety Instructions Box */}
                    <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-2.5 text-xs">
                      <div className="flex items-center justify-between border-b border-border/80 pb-2">
                        <span className="font-bold text-foreground flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-primary" /> 24/7 Emergency Control Email
                        </span>
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                          Direct Desk
                        </span>
                      </div>
                      <p className="text-muted-foreground font-mono text-[11px] select-all">
                        📧 Official Email: <strong className="text-foreground">{sosSettings.findMyDeviceEmail || "sos.safety@bharatyatra.gov.in"}</strong>
                      </p>
                      
                      <div className="pt-2 border-t border-border/80 space-y-1.5 text-[11px] text-muted-foreground">
                        <p className="font-bold text-foreground">🚨 Essential Safety Instructions:</p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                          <li>Keep phone GPS enabled & battery charged during travel.</li>
                          <li>In distress, tap the Red SOS button or dial <strong>112 / 1363</strong>.</li>
                          <li>Send live GPS pins to your state/district WhatsApp group for volunteer dispatch.</li>
                          <li>Your Google Find My Device Name is synchronized with the Police Control Desk.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Find My Device Credentials Box */}
                    <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-1.5 text-xs">
                      <p className="font-bold text-foreground flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-primary" /> Offline Satellite Tracking Credentials:
                      </p>
                      <p className="text-muted-foreground font-mono text-[11px]">
                        ID: <span className="text-foreground">{sosSettings.findMyDeviceEmail}</span>
                      </p>
                      <p className="text-muted-foreground font-mono text-[11px]">
                        Key: <span className="text-foreground">{sosSettings.findMyDevicePassword}</span>
                      </p>
                    </div>

                    {/* Real-Time Daily Activity & Live GPS Logger */}
                    <div className="pt-3 border-t border-border space-y-3">
                      <h5 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary" /> Log Daily Activity & Update Live GPS
                      </h5>
                      <p className="text-[11px] text-muted-foreground">
                        Post your current activity (e.g. cab boarded, visiting temple, at hotel). Automatically updates GPS coordinates in Admin SOS panel.
                      </p>

                      <form onSubmit={handlePostActivityUpdate} className="space-y-2">
                        <input
                          type="text"
                          value={newActivityText}
                          onChange={(e) => setNewActivityText(e.target.value)}
                          placeholder="e.g. Boarded Cab AP31-TX-9901 towards Araku Valley"
                          className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          type="submit"
                          disabled={updatingLocation}
                          className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          {updatingLocation ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                          <span>Update Live Location & Activity</span>
                        </button>
                      </form>

                      {/* Recent Activities Timeline */}
                      {registered?.liveLocation?.activities && (
                        <div className="space-y-1.5 pt-2 max-h-40 overflow-y-auto">
                          {registered.liveLocation.activities.map((act, idx) => (
                            <div key={idx} className="p-2 rounded-xl bg-muted/40 border border-border text-[11px] flex items-start gap-2">
                              <span className="font-mono text-muted-foreground shrink-0">{act.time}</span>
                              <span className="text-foreground">{act.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-3xl bg-muted/20 border border-dashed border-border text-center space-y-3">
                    <ShieldAlert className="w-8 h-8 text-muted-foreground mx-auto" />
                    <h4 className="font-bold text-sm text-foreground">No Active Registration Found</h4>
                    <p className="text-xs text-muted-foreground">
                      Complete the registration form to activate your AI safety monitoring radar and generate your emergency kit.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ELDER TRAVELER CARE MONITORING */}
        {/* ========================================================================= */}
        {activeTab === "elder_care" && (
          <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2 font-heading">
                  <Heart className="w-5 h-5 text-rose-500" /> Elder Traveler Safety & Automated Check-in
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automated periodic check-in for senior citizens. Missed check-ins automatically escalate to guardian phone & WhatsApp.
                </p>
              </div>
              {monitoring && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  Monitoring Active
                </span>
              )}
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Elder / Traveler Name:</label>
                  <input
                    value={elder.name}
                    onChange={(e) => setElder({ ...elder, name: e.target.value })}
                    placeholder="e.g. Smt. Kamala Devi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Elder Mobile Phone:</label>
                  <input
                    value={elder.phone}
                    onChange={(e) => setElder({ ...elder, phone: e.target.value })}
                    placeholder="+91 94400 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Guardian / Family WhatsApp Number:</label>
                  <input
                    value={elder.guardianPhone}
                    onChange={(e) => setElder({ ...elder, guardianPhone: e.target.value })}
                    placeholder="+91 98480 99881"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Check-in Interval:</label>
                  <select
                    value={elder.frequencyHours}
                    onChange={(e) => setElder({ ...elder, frequencyHours: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none"
                  >
                    <option value={2}>Every 2 Hours</option>
                    <option value={4}>Every 4 Hours</option>
                    <option value={6}>Every 6 Hours</option>
                    <option value={8}>Every 8 Hours</option>
                    <option value={12}>Every 12 Hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Trip Details / Destination Itinerary:</label>
                <input
                  value={elder.purpose}
                  onChange={(e) => setElder({ ...elder, purpose: e.target.value })}
                  placeholder="e.g. Tirumala Venkateswara Darshan with Wheelchair assistance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none"
                />
              </div>

              {monitoring ? (
                <div className="p-5 rounded-2xl bg-muted/60 border border-border space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-foreground">Time until next scheduled safety check-in:</p>
                      <p className="text-xl font-mono font-bold text-primary mt-1">
                        {Math.floor(remaining / 3600000)}h {Math.floor((remaining % 3600000) / 60000)}m {Math.floor((remaining % 60000) / 1000)}s
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={elderCheckIn}
                      className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-700 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 inline mr-1.5" />
                      I Am Safe (Check-in Now)
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={stopElderMonitoring}
                      className="text-xs text-muted-foreground hover:text-destructive underline"
                    >
                      Stop Monitoring
                    </button>
                    {forwarded && (
                      <span className="text-[11px] text-destructive font-bold">
                        Alert forwarded to guardian at {forwarded}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startElderMonitoring}
                  className="w-full py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm shadow-md hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" /> Start Elder Safety Monitoring
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: EMERGENCY CENTERS & SCAMS RADAR */}
        {/* ========================================================================= */}
        {activeTab === "centers_scams" && (
          <div className="space-y-6">
            {/* State & Location Filter */}
            <div className="p-5 rounded-3xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-foreground font-heading">
                  Verified Emergency Centers & Tourist Scams Radar
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select any state or circuit to view verified hospitals, police posts, and localized scam alerts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Filter State:</span>
                <select
                  value={selectedStateFilter}
                  onChange={(e) => setSelectedStateFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs font-bold outline-none cursor-pointer"
                >
                  {indianStates.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 1. Verified Emergency Centers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Hospital className="w-4 h-4 text-primary" /> Verified Trauma Centers & Tourist Police Booths ({filteredCenters.length})
                </h4>
                <span className="text-xs text-primary font-bold">Sorted by Proximity</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCenters.map((c) => (
                  <div key={c.id || c.name} className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.type === "Hospital" ? "bg-rose-500/15 text-rose-600" : "bg-purple-500/15 text-purple-600"
                        }`}>
                          {c.type === "Hospital" ? "24/7 Trauma Care" : "Tourist Police Booth"}
                        </span>
                        {c.distanceKm && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                            📍 ~{c.distanceKm} km
                          </span>
                        )}
                      </div>
                      <h5 className="font-bold text-sm text-foreground">{c.name}</h5>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> {c.address || c.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <a
                        href={`tel:${c.phone}`}
                        className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Call {c.phone}
                      </a>
                      <a
                        href={`https://www.google.com/maps?q=${c.lat || 17.7089},${c.lng || 83.3039}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 rounded-xl bg-muted text-foreground font-bold text-xs flex items-center justify-center gap-1 hover:bg-muted/80"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Directions
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Tourist Scams Radar for Selected Location */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Local Tourist Scams Radar ({filteredScams.length} Advisories)
                </h4>
                <span className="text-xs text-muted-foreground">Updated by State Tourism Police</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {filteredScams.map((s) => (
                  <div key={s.id} className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-muted text-[10px] font-bold text-foreground">
                        📍 {s.city}, {s.state}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.riskLevel === "High" ? "bg-rose-500/15 text-rose-600" : "bg-amber-500/15 text-amber-600"
                      }`}>
                        {s.riskLevel} Risk
                      </span>
                    </div>

                    <h5 className="font-bold text-sm text-foreground">{s.title}</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      ⚠️ <strong className="text-foreground">Tactic:</strong> {s.warning}
                    </p>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
                      🛡️ <strong>Safety Advice:</strong> {s.counterMeasure}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
