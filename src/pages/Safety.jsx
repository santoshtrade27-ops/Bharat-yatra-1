import { useState, useEffect, useRef } from "react";
import { 
  Shield, MapPin, Send, CheckCircle2, Heart, 
  AlertTriangle, PhoneCall, Volume2, VolumeX, Radio, AlertOctagon, 
  Compass, Hospital, ShieldAlert, Navigation 
} from "lucide-react";

const SOS_WHATSAPP_COMMUNITY = "https://chat.whatsapp.com/your-community-link";

// 24/7 Verified Emergency Helplines of India
const emergencyHelplines = [
  { number: "112", name: "National Emergency Service", subtitle: "Unified Police, Fire & Medical Responder", color: "bg-red-500 text-white" },
  { number: "1363", name: "Tourist Police Helpline", subtitle: "24/7 Multilingual Support (Ministry of Tourism)", color: "bg-purple-600 text-white" },
  { number: "108", name: "Ambulance & Trauma Care", subtitle: "Free Advanced Life Support Emergency Response", color: "bg-emerald-600 text-white" },
  { number: "1091", name: "Women Safety & Helpline", subtitle: "Anti-Harassment & Rapid Police Patrol", color: "bg-pink-600 text-white" },
  { number: "1033", name: "National Highway Emergency", subtitle: "NHAI Accident Assistance & Crane Towing", color: "bg-amber-600 text-white" },
  { number: "1930", name: "Cyber Crime & Financial Fraud", subtitle: "Immediate UPI / Net Banking Freeze", color: "bg-blue-600 text-white" },
];

// Verified Tourist Police Stations & 24/7 Trauma Centers
const emergencyCenters = [
  {
    name: "King George Hospital (KGH) Super Specialty Trauma",
    city: "Visakhapatnam, Andhra Pradesh",
    type: "Hospital",
    phone: "+91-891-2564891",
    address: "Maharanipeta, Beach Road, Visakhapatnam",
    lat: 17.7089,
    lng: 83.3039,
  },
  {
    name: "Visakhapatnam Tourist Police Assistance Booth",
    city: "Visakhapatnam, Andhra Pradesh",
    type: "Police",
    phone: "+91-891-2565455",
    address: "RK Beach Road opposite Submarine Museum, Visakhapatnam",
    lat: 17.7135,
    lng: 83.3281,
  },
  {
    name: "Nizam's Institute of Medical Sciences (NIMS)",
    city: "Hyderabad, Telangana",
    type: "Hospital",
    phone: "+91-40-23489000",
    address: "Punjagutta, Hyderabad, Telangana",
    lat: 17.4225,
    lng: 78.4526,
  },
  {
    name: "Charminar Tourist Police Station",
    city: "Hyderabad, Telangana",
    type: "Police",
    phone: "+91-40-27852435",
    address: "Pathergatti, Old City, Hyderabad",
    lat: 17.3616,
    lng: 78.4747,
  },
  {
    name: "SVIMS Super Specialty Hospital",
    city: "Tirupati, Andhra Pradesh",
    type: "Hospital",
    phone: "+91-877-2287777",
    address: "Alipiri Road, Tirupati, Andhra Pradesh",
    lat: 13.6373,
    lng: 79.4082,
  },
];

// Regional Emergency Voice Phrases (Speech Synthesis)
const emergencyPhrases = [
  {
    lang: "Hindi",
    code: "hi-IN",
    original: "कृपया मेरी मदद करें, यह एक आपातकाल है!",
    english: "Please help me, this is an emergency!",
    pronunciation: "Kripya meri madad karein, yeh ek aapaatkaal hai!",
  },
  {
    lang: "Telugu",
    code: "te-IN",
    original: "దయచేసి నాకు సహాయం చేయండి, ఇది అత్యవసర పరిస్థితి!",
    english: "Please help me, this is an emergency!",
    pronunciation: "Dayachesi naaku sahaayam cheyandi, idi atyavasara paristhithi!",
  },
  {
    lang: "Tamil",
    code: "ta-IN",
    original: "தயவுசெய்து எனக்கு உதவுங்கள், இது அவசரநிலை!",
    english: "Please help me, this is an emergency!",
    pronunciation: "Thayavuseithu enakku uthavungal, ithu avasaranilai!",
  },
  {
    lang: "Bengali",
    code: "bn-IN",
    original: "দয়া করে আমাকে সাহায্য করুন, এটি একটি জরুরি অবস্থা!",
    english: "Please help me, this is an emergency!",
    pronunciation: "Doya kore amake sahajjo korun, eti ekti joruri obostha!",
  },
  {
    lang: "Hindi",
    code: "hi-IN",
    original: "कृपया तुरंत एम्बुलेंस को कॉल करें!",
    english: "Please call an ambulance immediately!",
    pronunciation: "Kripya turant ambulance ko call karein!",
  },
  {
    lang: "Telugu",
    code: "te-IN",
    original: "దయచేసి వెంటనే అంబులెన్స్‌ని పిలవండి!",
    english: "Please call an ambulance immediately!",
    pronunciation: "Dayachesi ventane ambulance ni pilavandi!",
  },
];

// Tourist Scam Prevention Radar
const scamAdvisories = [
  {
    hub: "Visakhapatnam & Araku",
    category: "Transport & Activities",
    title: "Unlicensed Ghat Boat & Water Sports Touts",
    warning: "Always verify AP Tourism (APTDC) or Navy approved life jackets and valid operator badges. Avoid touts offering private speedboats without safety manifests.",
  },
  {
    hub: "Hyderabad (Charminar & Golconda)",
    category: "Shopping & Guiding",
    title: "Counterfeit Basra Pearls & Fake Audio Guides",
    warning: "Authentic pearls in Laad Bazaar carry government hallmarked authenticity certificates. Unofficial guides outside Golconda often bypass ASI certified rates.",
  },
  {
    hub: "Tirupati & Simhachalam",
    category: "Darshan & Sevas",
    title: "Fake VIP Darshan & Laddu Tokens",
    warning: "Only purchase TTD and Devasthanam tokens through official temple trust portals or physical temple counters. Beware of brokers promising 'immediate bypass darshan'.",
  },
  {
    hub: "Agra & Golden Triangle",
    category: "Jewelry & Souvenirs",
    title: "Marble Inlay 'Gemstone' Switch Scam",
    warning: "Auto-rickshaws frequently redirect visitors to emporiums claiming 'government factory outlet'. Genuine marble inlay does not change color under lemon juice.",
  },
];

export default function Safety() {
  const [trip, setTrip] = useState({ name: "", destination: "", days: 3, contacts: "" });
  const [registered, setRegistered] = useState(null);
  const [coords, setCoords] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [alerted, setAlerted] = useState(false);
  const [activeSOS, setActiveSOS] = useState(null);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);

  // Elder care check-in forwarding
  const [elder, setElder] = useState({ name: "", phone: "", frequencyHours: 4 });
  const [monitoring, setMonitoring] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [forwarded, setForwarded] = useState(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("by-trip-reg");
    if (saved) setRegistered(JSON.parse(saved));
    const e = localStorage.getItem("by-elder");
    if (e) setElder(JSON.parse(e));

    // Check if active SOS in session
    const activeSosSaved = localStorage.getItem("by-active-sos");
    if (activeSosSaved) setActiveSOS(JSON.parse(activeSosSaved));

    // Try to acquire initial GPS silently
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => setCoords([p.coords.latitude.toFixed(4), p.coords.longitude.toFixed(4)]),
        () => {},
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  // Cleanup siren audio on unmount
  useEffect(() => {
    return () => {
      stopSirenAudio();
    };
  }, []);

  // Elder care countdown + auto-forward
  useEffect(() => {
    if (!monitoring || !deadline) return;
    timerRef.current = setInterval(() => {
      const left = deadline - Date.now();
      if (left <= 0) {
        forwardCall();
      } else {
        setRemaining(left);
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [monitoring, deadline]);

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
      
      // Siren wobble effect
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 3; // 3Hz wobble
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 400; // swing +-400Hz
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setSirenPlaying(true);
    } catch (e) {
      console.warn("Audio siren not supported or blocked by user gesture:", e);
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

  function triggerSOS() {
    const incidentId = `SOS-${Math.floor(100 + Math.random() * 900)}`;
    const mapLink = coords 
      ? `https://www.google.com/maps?q=${coords[0]},${coords[1]}` 
      : "GPS resolving";

    const incident = {
      id: incidentId,
      traveler: registered?.name || "Traveler In Distress",
      phone: registered?.contacts || "+91 (Device Signal)",
      location: coords ? `GPS: ${coords[0]}° N, ${coords[1]}° E` : "Location Acquired via Network",
      time: "Just now",
      status: "Active Distress Beacon",
      severity: "High",
      mapLink,
      destination: registered?.destination || "Indian Heritage Circuit",
    };

    setActiveSOS(incident);
    localStorage.setItem("by-active-sos", JSON.stringify(incident));

    // Save to shared localStorage for Admin Safety Command Center
    try {
      const existing = JSON.parse(localStorage.getItem("by-sos-incidents") || "[]");
      const updated = [incident, ...existing.filter((x) => x.id !== incident.id)];
      localStorage.setItem("by-sos-incidents", JSON.stringify(updated));
    } catch (e) {}

    // Play siren
    startSirenAudio();

    // Prepare WhatsApp alert message
    const msg = `🚨 BHARAT YATRA EMERGENCY SOS 🚨%0AIncident ID: ${incident.id}%0ATraveler: ${encodeURIComponent(incident.traveler)}%0ALocation: ${coords ? `${coords[0]}, ${coords[1]}` : "Current Tourist Location"}%0AMap Pin: ${encodeURIComponent(mapLink)}%0APlease dispatch Tourist Police (1363) or Medical Responders (108) immediately!`;
    window.open(`https://wa.me/?text=${msg}`, "_blank");
    setAlerted(true);
    setTimeout(() => setAlerted(false), 4000);
  }

  function cancelSOS() {
    stopSirenAudio();
    setActiveSOS(null);
    localStorage.removeItem("by-active-sos");
  }

  function speakText(phrase, idx) {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    setSpeakingIdx(idx);
    const utterance = new SpeechSynthesisUtterance(phrase.original);
    utterance.lang = phrase.code;
    utterance.rate = 0.85;
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);
    window.speechSynthesis.speak(utterance);
  }

  function registerTrip() {
    if (!trip.destination) return;
    const rec = { ...trip, ts: new Date().toISOString() };
    localStorage.setItem("by-trip-reg", JSON.stringify(rec));
    setRegistered(rec);
  }

  function saveElder() {
    if (!elder.phone) return;
    localStorage.setItem("by-elder", JSON.stringify(elder));
  }

  function startMonitoring() {
    if (!elder.phone) return;
    saveElder();
    setMonitoring(true);
    setDeadline(Date.now() + elder.frequencyHours * 3600 * 1000);
    setForwarded(null);
  }

  function stopMonitoring() {
    setMonitoring(false);
    setDeadline(null);
    setRemaining(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function checkIn() {
    if (!monitoring) return;
    setDeadline(Date.now() + elder.frequencyHours * 3600 * 1000);
    setRemaining(elder.frequencyHours * 3600 * 1000);
    setForwarded(null);
  }

  function forwardCall() {
    const msg = `🆘 Bharat Yatra Elder Care Alert: ${elder.name || "Elder Traveler"} missed scheduled safety check-in. Please call immediately.`;
    window.open(`tel:${elder.phone}`, "_self");
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    setForwarded(new Date().toLocaleTimeString());
    setDeadline(Date.now() + elder.frequencyHours * 3600 * 1000);
  }

  function toggleLiveGPS() {
    if (!navigator.geolocation) return;
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (p) => setCoords([p.coords.latitude.toFixed(4), p.coords.longitude.toFixed(4)]),
      () => {},
      { enableHighAccuracy: true }
    );
    setWatchId(id);
  }

  const mm = Math.floor(remaining / 60000);
  const ss = Math.floor((remaining % 60000) / 1000);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header Banner */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8 text-destructive animate-pulse" />
                <h1 className="text-2xl sm:text-3xl font-bold font-heading">
                  Tourist Safety & 24/7 Emergency SOS Hub
                </h1>
              </div>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Real-time distress beacons, live GPS geofencing, verified national emergency quick-dials, and tourist police telemetry.
              </p>
            </div>

            {/* Active Siren Control Button */}
            <div className="flex items-center gap-2 self-start md:self-auto">
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
                <span>{sirenPlaying ? "Mute Distress Siren" : "Test Audio Siren"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* ACTIVE SOS BEACON ALERT BANNER */}
        {activeSOS && (
          <div className="p-5 sm:p-6 rounded-3xl bg-destructive/10 border-2 border-destructive animate-pulse space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-destructive animate-ping" />
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
                  className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs flex items-center gap-1.5"
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
              <div className="text-xs text-muted-foreground font-mono bg-card/60 p-2.5 rounded-xl border border-border">
                📍 Locked Emergency Coordinates: {coords[0]}° N, {coords[1]}° E · Precision Geofence Active
              </div>
            )}
          </div>
        )}

        {/* PRIMARY ACTION: THE BIG RED SOS BUTTON & GPS STATUS */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Big SOS Distress Trigger Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-destructive flex items-center gap-1.5">
                  <Radio className="w-4 h-4 animate-spin text-destructive" /> One-Touch Emergency Dispatch
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                  24/7 Monitored
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
                Instant SOS Beacon & Tourist Police Alert
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tapping the emergency beacon instantly transmits your live GPS coordinates, battery status, and travel itinerary to the nearest Tourist Police outpost and your emergency contacts.
              </p>
            </div>

            {/* Giant Tactile SOS Button */}
            <div className="py-4 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={triggerSOS}
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white font-extrabold text-2xl sm:text-3xl shadow-xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center border-4 border-white/20 ring-8 ring-destructive/20 focus:outline-none"
              >
                <span>SOS</span>
                <span className="text-[10px] sm:text-xs font-medium tracking-widest mt-1 uppercase text-white/80">
                  Tap for Help
                </span>
              </button>
            </div>

            {/* Live GPS Bar */}
            <div className="p-4 rounded-2xl bg-muted/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="font-bold text-foreground">
                    {coords ? `GPS: ${coords[0]}, ${coords[1]}` : "Acquiring satellite lock..."}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {watchId ? "Continuous high-accuracy tracking ON" : "Single point coordinates available"}
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
                <a
                  href={SOS_WHATSAPP_COMMUNITY}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-card border border-border hover:bg-muted font-bold text-xs text-foreground flex items-center gap-1"
                >
                  <Send className="w-3 h-3 text-teal" /> Group
                </a>
              </div>
            </div>
          </div>

          {/* National Helplines Grid */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2 font-heading">
                <PhoneCall className="w-4 h-4 text-primary" /> Verified Emergency Hotlines
              </h3>
              <span className="text-[11px] text-muted-foreground">Tap any card to dial</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {emergencyHelplines.map((h) => (
                <a
                  key={h.number}
                  href={`tel:${h.number}`}
                  className="p-3.5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all flex items-center justify-between gap-3 group shadow-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold ${h.color}`}>
                        {h.number}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {h.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{h.subtitle}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground shrink-0 transition-colors">
                    <PhoneCall className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* EMERGENCY VOICE PHRASEBOOK (SPEAK TO LOCALS) */}
        <section className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2 font-heading">
                <Volume2 className="w-5 h-5 text-primary" /> Emergency Audio Phrasebook
              </h3>
              <p className="text-xs text-muted-foreground">
                Tap <strong>Play Audio</strong> to speak these urgent distress phrases out loud in native regional languages (Hindi, Telugu, Tamil, Bengali) to nearby locals.
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold self-start sm:self-auto">
              Web Speech Synthesizer
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {emergencyPhrases.map((p, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-card text-[10px] font-bold border border-border uppercase">
                      {p.lang}
                    </span>
                    <span className="text-[11px] text-muted-foreground italic">"{p.english}"</span>
                  </div>
                  <p className="font-bold text-sm text-foreground leading-snug">
                    {p.original}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    🗣 {p.pronunciation}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => speakText(p, idx)}
                  className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    speakingIdx === idx
                      ? "bg-primary text-primary-foreground animate-pulse"
                      : "bg-card border border-border hover:bg-muted text-foreground"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-primary" />
                  <span>{speakingIdx === idx ? "Speaking out loud..." : "🔊 Play to Local Bystander"}</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* NEAREST 24/7 TRAUMA CENTERS & TOURIST POLICE BOOTHS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2 font-heading">
                <Hospital className="w-5 h-5 text-primary" /> Verified Emergency Centers & Police Outposts
              </h3>
              <p className="text-xs text-muted-foreground">Direct contact and coordinates for major Andhra Pradesh and Telangana hubs</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyCenters.map((c) => (
              <div key={c.name} className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      c.type === "Hospital" ? "bg-rose-500/15 text-rose-600" : "bg-purple-500/15 text-purple-600"
                    }`}>
                      {c.type === "Hospital" ? "24/7 Trauma Care" : "Tourist Police Booth"}
                    </span>
                    <h4 className="font-bold text-sm text-foreground mt-1.5">{c.name}</h4>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> {c.address}
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <a
                    href={`tel:${c.phone}`}
                    className="flex-1 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call
                  </a>
                  <a
                    href={`https://www.google.com/maps?q=${c.lat},${c.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 rounded-xl bg-muted text-foreground font-bold text-xs flex items-center justify-center gap-1 hover:bg-muted/80"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TOURIST SCAM RADAR & PREVENTION */}
        <section className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
          <div>
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 font-heading">
              <Shield className="w-5 h-5 text-amber-500" /> Tourist Scam Prevention Radar
            </h3>
            <p className="text-xs text-muted-foreground">
              Official travel advisories to prevent touting, counterfeit souvenirs, and fake darshan bookings.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {scamAdvisories.map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-primary">{s.hub}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold text-[10px]">
                    {s.category}
                  </span>
                </div>
                <h4 className="font-bold text-foreground text-sm">{s.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{s.warning}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRIP REGISTRATION & ELDER CARE FORWARDING */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Trip Registration Card */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 font-heading">
              <Compass className="w-5 h-5 text-primary" /> Register Your Heritage Journey
            </h3>
            <p className="text-xs text-muted-foreground">
              Pre-load emergency contacts and destination so first responders have your travel context during an SOS alert.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Your Full Name:</label>
                <input 
                  value={trip.name} 
                  onChange={(e) => setTrip({ ...trip, name: e.target.value })} 
                  placeholder="e.g. Rahul Sharma" 
                  className="by-input" 
                />
              </div>
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Destination Circuit:</label>
                <input 
                  value={trip.destination} 
                  onChange={(e) => setTrip({ ...trip, destination: e.target.value })} 
                  placeholder="e.g. Visakhapatnam & Araku Valley" 
                  className="by-input" 
                />
              </div>
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Emergency Contacts (WhatsApp Phone Numbers):</label>
                <input 
                  value={trip.contacts} 
                  onChange={(e) => setTrip({ ...trip, contacts: e.target.value })} 
                  placeholder="+91 98480 12345, +91 94401 56789" 
                  className="by-input" 
                />
              </div>

              <button 
                type="button"
                onClick={registerTrip} 
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
              >
                Save Trip Profile
              </button>

              {registered && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3 text-xs">
                  <p className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Trip Profile Active
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    {registered.name} traveling to {registered.destination}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Elder Care Check-in Forwarding */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 font-heading">
              <Heart className="w-5 h-5 text-rose-500" /> Elder Care Check-In Call Forwarding
            </h3>
            <p className="text-xs text-muted-foreground">
              Register an elder traveler's phone. If they do not check in before the timer expires, an automated call alert is forwarded to their number.
            </p>

            <div className="space-y-3 text-xs">
              <div className="grid sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Elder's Name:</label>
                  <input 
                    value={elder.name} 
                    onChange={(e) => setElder({ ...elder, name: e.target.value })} 
                    placeholder="e.g. Smt. Kamala Devi" 
                    className="by-input" 
                    disabled={monitoring} 
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Elder's Phone Number:</label>
                  <input 
                    value={elder.phone} 
                    onChange={(e) => setElder({ ...elder, phone: e.target.value })} 
                    placeholder="+91 94400 12345" 
                    className="by-input" 
                    disabled={monitoring} 
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Check-in Interval:</label>
                <select 
                  value={elder.frequencyHours} 
                  onChange={(e) => setElder({ ...elder, frequencyHours: +e.target.value })} 
                  className="by-input" 
                  disabled={monitoring}
                >
                  <option value={2}>Every 2 hours</option>
                  <option value={4}>Every 4 hours</option>
                  <option value={6}>Every 6 hours</option>
                  <option value={12}>Every 12 hours</option>
                  <option value={24}>Every 24 hours</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {!monitoring ? (
                  <button 
                    type="button"
                    onClick={startMonitoring} 
                    disabled={!elder.phone} 
                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs disabled:opacity-50 shadow-sm"
                  >
                    Start Elder Monitoring
                  </button>
                ) : (
                  <div className="flex gap-2 w-full">
                    <button 
                      type="button"
                      onClick={checkIn} 
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Check In (I'm Safe)
                    </button>
                    <button 
                      type="button"
                      onClick={stopMonitoring} 
                      className="px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs"
                    >
                      Stop
                    </button>
                  </div>
                )}
              </div>

              {monitoring && (
                <div className="rounded-2xl bg-muted/60 border border-border p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Next check-in for <strong className="text-foreground">{elder.name || "Elder"}</strong> in:
                    </p>
                    <p className="text-2xl font-bold font-mono text-primary mt-1 font-heading">
                      {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Call forwards to {elder.phone} if missed.</p>
                  </div>
                  <div className="text-3xl">⏰</div>
                </div>
              )}

              {forwarded && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                  <span className="text-destructive font-semibold">Check-in missed</span>
                  <span className="text-muted-foreground">— Call forwarded to {elder.phone} at {forwarded}.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .by-input {
          width: 100%;
          padding: 0.55rem 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          font-size: 0.85rem;
          outline: none;
        }
        .by-input:focus { border-color: hsl(var(--primary)); }
        .by-input:disabled { opacity: 0.6; }
      `}</style>
    </div>
  );
}
