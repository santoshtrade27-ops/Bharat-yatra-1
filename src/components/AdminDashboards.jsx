import React, { useState } from "react";
import { 
  TrendingUp, ShieldAlert, Hotel, Landmark, ShoppingCart, 
  MapPin, Flame, Award, Gift, Users, Plus, Search, Edit, Trash2, CheckCircle2,
  PhoneCall, X, Shield, Navigation2, PackagePlus
} from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { governmentRecognizedHotels } from "@/lib/hotelDirectoryData";
import { products as initialDefaultProducts } from "@/lib/heritageData";

export default function AdminDashboards({ activeRole, onRoleChange, singleRoleMode = false }) {
  // Role switcher tabs
  const roles = [
    { id: "hotel_mgmt", label: "Hotel Management", icon: Hotel, desc: "Manage verified hotel inventory, room tariffs & booking sync" },
    { id: "safety_cmd", label: "Safety & SOS Hub", icon: ShieldAlert, desc: "Live SOS beacons, tourist police dispatch & scam alerts" },
    { id: "site_mgr", label: "Site Manager", icon: Landmark, desc: "Monument crowd density, ticket counters & ASI maintenance" },
    { id: "devasthanam", label: "Devasthanam Desk", icon: Flame, desc: "Temple Darshan slots, Sevas & queue density protocols" },
    { id: "guide_coord", label: "Guide Coordinator", icon: Users, desc: "Licensed guide allocations, badge compliance & traveler reviews" },
    { id: "surprise_mgr", label: "Surprise Planner", icon: Gift, desc: "Bespoke cultural surprises, anniversaries & private sunset setups" },
    { id: "ecomm_mgr", label: "Artisan & Ecommerce", icon: ShoppingCart, desc: "Handloom orders, rural artisan payouts & India Post dispatch" },
    { id: "marketing", label: "Marketing Analytics", icon: TrendingUp, desc: "Footfall campaigns, festive promo codes & state reach" },
    { id: "state_coord", label: "State Coordinators", icon: MapPin, desc: "District infrastructure audits & AP/Telangana tourism portals" },
    { id: "leaderboard", label: "Excellence Leaderboard", icon: Award, desc: "Top performing guides, artisan clusters & cultural ambassadors" },
  ];

  const currentRole = activeRole || "hotel_mgmt";

  return (
    <div className="space-y-6">
      {/* Role Switcher Pills - only shown when NOT in single dedicated role mode */}
      {!singleRoleMode && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onRoleChange && onRoleChange(r.id)}
                className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 transition-all shrink-0 font-semibold ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* RENDER ACTIVE DASHBOARD */}
      {currentRole === "hotel_mgmt" && <HotelManagementDashboard />}
      {currentRole === "safety_cmd" && <SafetyCommandDashboard />}
      {currentRole === "site_mgr" && <SiteManagerDashboard />}
      {currentRole === "devasthanam" && <DevasthanamDashboard />}
      {currentRole === "guide_coord" && <GuideCoordinatorDashboard />}
      {currentRole === "surprise_mgr" && <SurprisePlannerDashboard />}
      {currentRole === "ecomm_mgr" && <EcommerceDashboard />}
      {currentRole === "marketing" && <MarketingDashboard />}
      {currentRole === "state_coord" && <StateCoordinatorDashboard />}
      {currentRole === "leaderboard" && <LeaderboardDashboard />}
    </div>
  );
}

// 1. HOTEL MANAGEMENT DASHBOARD
function HotelManagementDashboard() {
  const [hotels, setHotels] = useState(governmentRecognizedHotels);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  const filtered = hotels.filter((h) => {
    const mCity = selectedCity === "all" || h.city.toLowerCase().includes(selectedCity.toLowerCase());
    const mSearch = h.name.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase());
    return mCity && mSearch;
  });

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Hotel className="w-5 h-5 text-primary" /> Hotel Management & Inventory Desk
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real Ministry of Tourism classification, live tariff controls & booking occupancy
          </p>
        </div>
        <button 
          onClick={() => alert("New property onboarded! Verification submitted to State Tourism Directorate.")}
          className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Onboard Verified Property
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="w-full sm:w-64 relative">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hotel or location..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["all", "Visakhapatnam", "Hyderabad", "Tirupati", "Delhi", "Agra"].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 rounded-full capitalize shrink-0 font-medium ${
                selectedCity === c ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Property</th>
              <th className="py-3 px-3">City</th>
              <th className="py-3 px-3">Classification</th>
              <th className="py-3 px-3">Base Tariff</th>
              <th className="py-3 px-3">Rating</th>
              <th className="py-3 px-3">Compliance</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.slice(0, 10).map((h) => (
              <tr key={h.id} className="hover:bg-muted/40 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-bold text-foreground">{h.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate max-w-xs">{h.location}</div>
                </td>
                <td className="py-3 px-3 text-foreground font-medium">{h.city}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[10px]">
                    {h.classification}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-foreground">₹{h.price.toLocaleString("en-IN")}</td>
                <td className="py-3 px-3 font-semibold text-amber-500">★ {h.rating}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                    NIDHI Verified
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button 
                    onClick={() => alert(`Adjusting live tariff for ${h.name}`)}
                    className="px-2.5 py-1 rounded-lg bg-muted text-foreground hover:bg-muted/80 font-semibold text-[11px]"
                  >
                    Edit Tariff
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 2. SAFETY & SOS COMMAND DASHBOARD
function SafetyCommandDashboard() {
  const defaultAlerts = [
    { id: "SOS-904", traveler: "Kavita Rao", phone: "+91 94401 88321", location: "Borra Caves Lower Trail", lat: 18.280, lng: 83.040, time: "12 mins ago", status: "Officer Dispatched", severity: "High" },
    { id: "SOS-903", traveler: "Vikram Malhotra", phone: "+91 98110 44219", location: "Kailasagiri Ropeway Station, Vizag", lat: 17.747, lng: 83.342, time: "1 hr ago", status: "Resolved", severity: "Medium" },
    { id: "SOS-902", traveler: "Pooja Reddy", phone: "+91 90002 11983", location: "Golconda Fort Outer Moat, Hyderabad", lat: 17.383, lng: 78.401, time: "3 hrs ago", status: "Resolved", severity: "Low" },
  ];

  // Base registered tourists (who completed journey registration)
  const defaultRegisteredTourists = [
    { id: "REG-801", name: "Ananya Roy", phone: "+91 98480 23112", destination: "Tirupati & Chandragiri Circuit", lat: 13.6288, lng: 79.4192, status: "Verified Active", battery: "84%", lastCheckIn: "25 mins ago" },
    { id: "REG-802", name: "Rahul & Sneha Sharma", phone: "+91 94401 56789", destination: "Charminar & Golconda Cultural Trail", lat: 17.3616, lng: 78.4747, status: "Verified Active", battery: "92%", lastCheckIn: "10 mins ago" },
    { id: "REG-803", name: "Lakshmi Narayana (Senior)", phone: "+91 98481 99882", destination: "Visakhapatnam RK Beach & Submarine", lat: 17.7135, lng: 83.3281, status: "Elder Care Monitored", battery: "68%", lastCheckIn: "4 mins ago" },
    { id: "REG-804", name: "David Miller (UK)", phone: "+44 7911 123456", destination: "Red Fort & Old Delhi Heritage", lat: 28.6562, lng: 77.2410, status: "Verified Active", battery: "76%", lastCheckIn: "1 hr ago" },
  ];

  // Verified Police Outposts & Trauma Centers
  const policeOutposts = [
    { name: "Visakhapatnam Tourist Police Booth", lat: 17.7135, lng: 83.3281, phone: "+91-891-2565455", type: "Police Outpost" },
    { name: "Charminar Tourist Police Station", lat: 17.3616, lng: 78.4747, phone: "+91-40-27852435", type: "Police Outpost" },
    { name: "SVIMS Super Specialty Trauma Center", lat: 13.6373, lng: 79.4082, phone: "+91-877-2287777", type: "Emergency Hospital" },
  ];

  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem("by-sos-incidents");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...parsed];
          defaultAlerts.forEach((d) => {
            if (!merged.some((m) => m.id === d.id)) merged.push(d);
          });
          return merged;
        }
      }
    } catch (e) {}
    return defaultAlerts;
  });

  const [registeredTourists, setRegisteredTourists] = useState(() => {
    try {
      const saved = localStorage.getItem("by-trip-reg");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) {
          return [
            {
              id: "REG-USER",
              name: parsed.name,
              phone: parsed.contacts || "+91 98480 00000",
              destination: parsed.destination || "Andhra & Telangana Circuit",
              lat: 17.720,
              lng: 83.310,
              status: "Live App Traveler",
              battery: "95%",
              lastCheckIn: "Just now",
            },
            ...defaultRegisteredTourists,
          ];
        }
      }
    } catch (e) {}
    return defaultRegisteredTourists;
  });

  const [mapFilter, setMapFilter] = useState("all"); // 'all', 'sos', 'tourists', 'police'
  const [simulatedCount, setSimulatedCount] = useState(0);

  function updateStatus(id, newStatus) {
    setAlerts((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
      localStorage.setItem("by-sos-incidents", JSON.stringify(updated));
      return updated;
    });
  }

  function simulateSOS() {
    const randomId = `SOS-${Math.floor(100 + Math.random() * 900)}`;
    const newAlert = {
      id: randomId,
      traveler: `Traveler ${(simulatedCount + 1)}`,
      phone: "+91 98480 " + Math.floor(10000 + Math.random() * 90000),
      location: "Near Submarine Museum, Beach Road, Visakhapatnam",
      lat: 17.7140 + (Math.random() - 0.5) * 0.02,
      lng: 83.3290 + (Math.random() - 0.5) * 0.02,
      time: "Just now",
      status: "Active Distress Beacon",
      severity: "High",
    };
    const nextList = [newAlert, ...alerts];
    setAlerts(nextList);
    setSimulatedCount((c) => c + 1);
    localStorage.setItem("by-sos-incidents", JSON.stringify(nextList));
  }

  const activeCount = alerts.filter((a) => a.status !== "Resolved").length;

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-destructive flex items-center gap-2 font-heading">
            <ShieldAlert className="w-5 h-5 text-destructive animate-pulse" /> Safety & Emergency SOS Command Center
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live telemetry with Tourist Police (1363), registered travelers, and active distress beacons
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={simulateSOS}
            className="px-3.5 py-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Test Inbound SOS
          </button>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Coordinator Live · 24/7 Monitoring
          </span>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/25 space-y-1">
          <span className="text-muted-foreground font-semibold">Active Distress Beacons</span>
          <p className="text-2xl font-bold text-destructive font-heading">{activeCount}</p>
          <p className="text-[11px] text-muted-foreground">Tourist Police patrol notified in real time</p>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
          <span className="text-muted-foreground font-semibold">Registered Travelers in Hub</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-heading">{registeredTourists.length} Active</p>
          <p className="text-[11px] text-muted-foreground">With verified contacts & elder monitoring</p>
        </div>
        <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-1">
          <span className="text-muted-foreground font-semibold">Average Response Time</span>
          <p className="text-2xl font-bold text-foreground font-heading">5.8 Mins</p>
          <p className="text-[11px] text-muted-foreground">Patrol GPS geofence response</p>
        </div>
      </div>

      {/* INTERACTIVE SOS & REGISTERED TRAVELERS MAP */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Navigation2 className="w-4 h-4 text-primary" /> Live Coordinator Map: SOS Beacons & Registered Travelers
            </h4>
            <p className="text-xs text-muted-foreground">
              Visual telemetry showing active alerts (red), registered travelers (emerald), and police stations (indigo)
            </p>
          </div>

          {/* Map Layer Filter Pills */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => setMapFilter("all")}
              className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
                mapFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Layers
            </button>
            <button
              type="button"
              onClick={() => setMapFilter("sos")}
              className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
                mapFilter === "sos" ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Distress Beacons ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setMapFilter("tourists")}
              className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
                mapFilter === "tourists" ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Registered Users ({registeredTourists.length})
            </button>
            <button
              type="button"
              onClick={() => setMapFilter("police")}
              className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
                mapFilter === "police" ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Police Outposts
            </button>
          </div>
        </div>

        {/* Leaflet Map Box */}
        <div className="h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-border shadow-inner relative z-0">
          <MapContainer
            center={[17.6868, 83.2185]}
            zoom={8}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Active SOS Beacons */}
            {(mapFilter === "all" || mapFilter === "sos") &&
              alerts.map((a) => {
                if (!a.lat || !a.lng) return null;
                const isResolved = a.status === "Resolved";
                return (
                  <CircleMarker
                    key={a.id}
                    center={[a.lat, a.lng]}
                    radius={isResolved ? 8 : 14}
                    pathOptions={{
                      color: isResolved ? "#10b981" : "#ef4444",
                      fillColor: isResolved ? "#10b981" : "#dc2626",
                      fillOpacity: 0.85,
                      weight: 3,
                    }}
                  >
                    <Popup>
                      <div className="p-1 space-y-1 text-xs">
                        <div className="flex items-center gap-1 font-bold text-destructive">
                          <ShieldAlert className="w-3.5 h-3.5" /> {a.id} ({a.severity} Distress)
                        </div>
                        <p className="font-semibold text-foreground">{a.traveler}</p>
                        <p className="text-muted-foreground text-[11px]">{a.location}</p>
                        <p className="font-mono text-[11px]">{a.phone}</p>
                        <div className="pt-1 flex gap-1">
                          {a.status !== "Resolved" && (
                            <button
                              type="button"
                              onClick={() => updateStatus(a.id, "Officer Dispatched")}
                              className="px-2 py-0.5 rounded-md bg-destructive text-white text-[10px] font-bold"
                            >
                              Dispatch Unit
                            </button>
                          )}
                          <a
                            href={`tel:${a.phone}`}
                            className="px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold"
                          >
                            Call Traveler
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

            {/* Registered Tourists */}
            {(mapFilter === "all" || mapFilter === "tourists") &&
              registeredTourists.map((t) => (
                <CircleMarker
                  key={t.id}
                  center={[t.lat, t.lng]}
                  radius={9}
                  pathOptions={{
                    color: "#059669",
                    fillColor: "#10b981",
                    fillOpacity: 0.85,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-xs">
                      <div className="flex items-center gap-1 font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t.name}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{t.destination}</p>
                      <p className="font-mono text-[11px]">{t.phone}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>🔋 {t.battery}</span>
                        <span>⏱ {t.lastCheckIn}</span>
                      </div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 text-[10px] font-bold">
                        {t.status}
                      </span>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

            {/* Tourist Police Outposts */}
            {(mapFilter === "all" || mapFilter === "police") &&
              policeOutposts.map((p) => (
                <CircleMarker
                  key={p.name}
                  center={[p.lat, p.lng]}
                  radius={8}
                  pathOptions={{
                    color: "#4338ca",
                    fillColor: "#6366f1",
                    fillOpacity: 0.9,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-xs">
                      <div className="font-bold text-indigo-700 flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" /> {p.name}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{p.type}</p>
                      <a
                        href={`tel:${p.phone}`}
                        className="inline-block px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold mt-1"
                      >
                        Call Booth: {p.phone}
                      </a>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
          </MapContainer>
        </div>
      </div>

      {/* REGISTERED TRAVELERS DIRECTORY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Registered Tourists in Sector</h4>
            <p className="text-[11px] text-muted-foreground">Travelers who have registered contacts and itinerary details</p>
          </div>
          <span className="text-[11px] text-muted-foreground">{registeredTourists.length} travelers enrolled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-border rounded-xl overflow-hidden">
            <thead className="bg-muted/60 text-muted-foreground font-semibold">
              <tr>
                <th className="p-2.5">Traveler Name</th>
                <th className="p-2.5">Emergency Contact</th>
                <th className="p-2.5">Destination Circuit</th>
                <th className="p-2.5">Battery</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {registeredTourists.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30">
                  <td className="p-2.5 font-bold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{t.name}</span>
                    </div>
                  </td>
                  <td className="p-2.5 font-mono text-muted-foreground">{t.phone}</td>
                  <td className="p-2.5 text-muted-foreground">{t.destination}</td>
                  <td className="p-2.5 font-mono">{t.battery}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      {t.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-right">
                    <a
                      href={`tel:${t.phone}`}
                      className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold inline-flex items-center gap-1 hover:opacity-90"
                    >
                      <PhoneCall className="w-3 h-3" /> Call
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LIVE SOS INCIDENT LOG */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Live SOS Incident Log</h4>
          <span className="text-[11px] text-muted-foreground">{alerts.length} total logged cases</span>
        </div>
        
        <div className="space-y-3">
          {alerts.map((a) => (
            <div key={a.id} className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    a.severity === "High" ? "bg-destructive text-destructive-foreground" : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                  }`}>
                    {a.id} · {a.severity}
                  </span>
                  <span className="font-bold text-foreground">{a.traveler}</span>
                  <span className="text-muted-foreground font-mono">{a.phone}</span>
                </div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-destructive shrink-0" /> {a.location}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap md:self-auto">
                <span className="text-[11px] text-muted-foreground mr-1">{a.time}</span>
                <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                  a.status === "Resolved" 
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" 
                    : "bg-destructive/15 text-destructive font-semibold animate-pulse"
                }`}>
                  {a.status}
                </span>

                {a.status !== "Resolved" && (
                  <>
                    <button
                      type="button"
                      onClick={() => updateStatus(a.id, "Officer Dispatched")}
                      className="px-2.5 py-1 rounded-xl bg-card border border-border text-foreground hover:bg-muted font-bold text-[11px]"
                    >
                      Dispatch Unit
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(a.id, "Resolved")}
                      className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-[11px]"
                    >
                      Resolve
                    </button>
                  </>
                )}
                <a
                  href={`tel:${a.phone}`}
                  className="px-2.5 py-1 rounded-xl bg-primary text-primary-foreground font-bold text-[11px]"
                >
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. SITE MANAGER DASHBOARD
function SiteManagerDashboard() {
  const sites = [
    { name: "Taj Mahal (East Gate)", city: "Agra", capacity: 85, status: "High Density", dailyFootfall: "24,800", maintenance: "Normal" },
    { name: "Borra Caves", city: "Visakhapatnam", capacity: 54, status: "Moderate", dailyFootfall: "4,200", maintenance: "Lighting Check" },
    { name: "Charminar & Laad Bazaar", city: "Hyderabad", capacity: 68, status: "Moderate", dailyFootfall: "12,600", maintenance: "Normal" },
    { name: "Simhachalam Temple", city: "Visakhapatnam", capacity: 72, status: "High Density", dailyFootfall: "18,900", maintenance: "Ghat Road Safety" },
  ];

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Landmark className="w-5 h-5 text-primary" /> Monument Site Manager & Crowd Control
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time sensor entry tracking, ASI maintenance logs & ticket counter telemetry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sites.map((s) => (
          <div key={s.name} className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground">{s.name}</h4>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                s.capacity > 75 ? "bg-destructive/15 text-destructive" : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              }`}>
                {s.status} ({s.capacity}%)
              </span>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${s.capacity > 75 ? "bg-destructive" : "bg-primary"}`} 
                  style={{ width: `${s.capacity}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Daily Footfall: {s.dailyFootfall} visitors</span>
                <span>Maintenance: {s.maintenance}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border text-xs">
              <button 
                onClick={() => alert(`Gate entry throttled for ${s.name}`)}
                className="flex-1 py-1.5 rounded-lg bg-card border border-border font-semibold hover:bg-muted"
              >
                Throttle Turnstiles
              </button>
              <button 
                onClick={() => alert(`Maintenance dispatch requested for ${s.name}`)}
                className="flex-1 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
              >
                Log ASI Ticket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. DEVASTHANAM (TEMPLE TRUST) DASHBOARD
function DevasthanamDashboard() {
  const darshans = [
    { temple: "Tirumala Venkateswara (TTD)", darshan: "Special Entry (₹300)", queueHours: "2.5 Hours", slotsAvailable: 1200, status: "Smooth" },
    { temple: "Simhachalam Varaha Narasimha", darshan: "Nijarupa Darshanam", queueHours: "45 Mins", slotsAvailable: 850, status: "Normal" },
    { temple: "Kanaka Durga (Vijayawada)", darshan: "Antralaya Darshanam", queueHours: "1 Hour", slotsAvailable: 400, status: "Normal" },
    { temple: "Ramappa UNESCO Temple (Warangal)", darshan: "Archaeological Darshan", queueHours: "15 Mins", slotsAvailable: 1500, status: "Open" },
  ];

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500" /> Devasthanam (Temple Trust) Protocol Desk
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Sacred Seva timings, Annaprasadam queue estimates & traditional dress code compliance
        </p>
      </div>

      <div className="space-y-3">
        {darshans.map((d) => (
          <div key={d.temple} className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-foreground">{d.temple}</h4>
              <p className="text-muted-foreground">
                Seva: <strong className="text-foreground">{d.darshan}</strong> · Queue Waiting: <strong className="text-amber-500">{d.queueHours}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-card border border-border font-mono font-semibold text-foreground">
                {d.slotsAvailable} slots remaining
              </span>
              <button 
                onClick={() => alert(`Devasthanam slot allocation updated for ${d.temple}`)}
                className="px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90"
              >
                Release Extra Slots
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. GUIDE COORDINATOR DASHBOARD
function GuideCoordinatorDashboard() {
  const guides = [
    { name: "Suresh Babu", badge: "ASI-AP-849", city: "Visakhapatnam & Borra", langs: "Telugu, Hindi, English", rating: 4.9, tours: 142, status: "Active with Group" },
    { name: "Mirza Farooq", badge: "ASI-TS-219", city: "Hyderabad (Golconda/Charminar)", langs: "Urdu, Telugu, Hindi, English", rating: 4.95, tours: 320, status: "Available" },
    { name: "Meenakshi Sundaram", badge: "ASI-AP-311", city: "Tirupati & Chandragiri", langs: "Tamil, Telugu, English", rating: 4.85, tours: 98, status: "Available" },
    { name: "Rajendra Sharma", badge: "ASI-UP-102", city: "Agra (Taj & Fort)", langs: "English, French, Hindi", rating: 4.9, tours: 410, status: "On Leave" },
  ];

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Licensed Guide Coordinator Desk
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Government ASI holographic badge compliance, multi-lingual assignments & guest ratings
        </p>
      </div>

      <div className="space-y-3">
        {guides.map((g) => (
          <div key={g.name} className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-foreground">{g.name}</h4>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-[10px]">
                  {g.badge}
                </span>
                <span className="text-amber-500 font-semibold">★ {g.rating} ({g.tours} tours)</span>
              </div>
              <p className="text-muted-foreground">
                Base: {g.city} · Languages: <strong>{g.langs}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                g.status === "Available" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"
              }`}>
                {g.status}
              </span>
              <button 
                onClick={() => alert(`Assigning ${g.name} to upcoming cultural traveler group`)}
                className="px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground font-semibold hover:opacity-90"
              >
                Assign Tour
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. SURPRISE PLANNER DASHBOARD
function SurprisePlannerDashboard() {
  const [requests, setRequests] = useState([
    { id: "SURP-101", client: "Vikram & Ananya", occasion: "Wedding Anniversary", destination: "Visakhapatnam Beach & Dolphin Nose", details: "Private cliffside Andhra seafood candle-lit dinner with carnatic veena artist", budget: "₹18,000", status: "Planning Confirmed" },
    { id: "SURP-102", client: "Rohan Kapoor", occasion: "Marriage Proposal", destination: "Taj Falaknuma Palace, Hyderabad", details: "Royal horse chariot arrival with Nizam royal tea degustation & photographer", budget: "₹45,000", status: "In Execution" },
    { id: "SURP-103", client: "Sita Mahalakshmi", occasion: "Elder 75th Birthday Pilgrimage", destination: "Tirumala Special Darshan", details: "Wheelchair assistance throughout temple queue & customized Satvik prasadam box", budget: "₹12,000", status: "Assigned to Guide" },
  ]);

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" /> Surprise Planner & Bespoke Cultural Concierge
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curate secret proposals, heritage anniversaries, private musical evenings & royal darshans
          </p>
        </div>
        <button 
          onClick={() => alert("New bespoke cultural surprise itinerary created!")}
          className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> New Custom Request
        </button>
      </div>

      <div className="space-y-3.5">
        {requests.map((r) => (
          <div key={r.id} className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2.5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold uppercase text-[10px]">
                  {r.occasion}
                </span>
                <h4 className="font-bold text-sm text-foreground">{r.client}</h4>
                <span className="text-muted-foreground font-mono">({r.id})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-foreground">Budget: {r.budget}</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                  {r.status}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Destination:</strong> {r.destination} — {r.details}
            </p>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-muted-foreground">Assigned Coordinator: Bharat Yatra Heritage Concierge</span>
              <button 
                onClick={() => alert(`Surprise milestone checklist opened for ${r.client}`)}
                className="px-3 py-1 rounded-lg bg-card border border-border font-semibold hover:bg-muted"
              >
                Update Milestone Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. ECOMMERCE / ARTISAN DASHBOARD
function EcommerceDashboard() {
  const [products, setProducts] = useState(() => {
    let list = initialDefaultProducts;
    try {
      const saved = localStorage.getItem("by-artisan-products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) list = parsed;
      }
    } catch (e) {}
    return list.map((p, idx) => ({
      ...p,
      id: p.id || `artisan-prod-${idx}-${(p.name || p.title || "craft").toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    }));
  });

  const [selectedCluster, setSelectedCluster] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    origin: "",
    artisan: "",
    craftCategory: "Handloom & Textiles",
    price: "",
    mrp: "",
    stock: "15",
    gi_tag: "Certified GI Product",
    description: "",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
  });

  const clusters = [
    "All",
    "Pochampally Ikat Weavers",
    "Kondapalli Woodcraft Guild",
    "Varanasi Silk Cooperatives",
    "Channapatna Lacquerware",
    "Dhokra Tribal Bell Metal",
    "Kashmir Pashmina Artisans",
  ];

  const presetImages = [
    { label: "Pochampally Ikat", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80" },
    { label: "Kondapalli Toys", url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80" },
    { label: "Varanasi Silk", url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80" },
    { label: "Brass Craft", url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80" },
    { label: "Handmade Pottery", url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80" },
  ];

  function openAddModal() {
    setEditingProduct(null);
    setFormData({
      title: "",
      origin: "Andhra Pradesh / Telangana",
      artisan: "Cooperative Master Artisan",
      craftCategory: "Handloom & Textiles",
      price: "1200",
      mrp: "1800",
      stock: "20",
      gi_tag: "Certified GI Product",
      description: "Authentic handcrafted regional artifact made using sustainable heritage techniques.",
      image: presetImages[0].url,
    });
    setModalOpen(true);
  }

  function openEditModal(prod) {
    setEditingProduct(prod);
    setFormData({
      title: prod.title || prod.name || "",
      origin: prod.origin || prod.craft_origin || "",
      artisan: prod.artisan || prod.artisan_name || "Cooperative Artisan",
      craftCategory: prod.craftCategory || prod.category || "Handloom & Textiles",
      price: String(prod.price || ""),
      mrp: String(prod.mrp || (prod.price ? Math.round(prod.price * 1.3) : "")),
      stock: String(prod.stock || "12"),
      gi_tag: prod.gi_tag || (prod.is_gi_tagged ? "Certified GI Product" : "Authentic Handloom"),
      description: prod.description || "",
      image: prod.image || presetImages[0].url,
    });
    setModalOpen(true);
  }

  function handleSaveProduct(e) {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    const numPrice = Number(formData.price) || 0;
    const numMrp = Number(formData.mrp) || Math.round(numPrice * 1.25);
    const numStock = Number(formData.stock) || 10;

    let updatedList;
    if (editingProduct) {
      // Edit existing product
      updatedList = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            title: formData.title,
            name: formData.title,
            origin: formData.origin,
            craft_origin: formData.origin,
            artisan: formData.artisan,
            artisan_name: formData.artisan,
            craftCategory: formData.craftCategory,
            price: numPrice,
            mrp: numMrp,
            stock: numStock,
            gi_tag: formData.gi_tag,
            is_gi_tagged: formData.gi_tag.includes("GI"),
            description: formData.description,
            image: formData.image,
          };
        }
        return p;
      });
    } else {
      // Add brand new product
      const newProd = {
        id: `prod-artisan-${Date.now()}`,
        title: formData.title,
        name: formData.title,
        origin: formData.origin,
        craft_origin: formData.origin,
        artisan: formData.artisan,
        artisan_name: formData.artisan,
        craftCategory: formData.craftCategory,
        price: numPrice,
        mrp: numMrp,
        stock: numStock,
        gi_tag: formData.gi_tag,
        is_gi_tagged: formData.gi_tag.includes("GI"),
        description: formData.description,
        image: formData.image,
        is_artisan_verified: true,
      };
      updatedList = [newProd, ...products];
    }

    setProducts(updatedList);
    localStorage.setItem("by-artisan-products", JSON.stringify(updatedList));
    window.dispatchEvent(new Event("by-products-updated"));
    setModalOpen(false);
  }

  function handleDeleteProduct(id, idx) {
    if (!confirm("Are you sure you want to remove this handcrafted product from the catalog?")) return;
    const updatedList = products.filter((p, i) => (p.id ? p.id !== id : i !== idx));
    setProducts(updatedList);
    localStorage.setItem("by-artisan-products", JSON.stringify(updatedList));
    window.dispatchEvent(new Event("by-products-updated"));
  }

  const filteredProducts = products.filter((p) => {
    const textMatch =
      !searchQuery ||
      (p.title || p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.origin || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.artisan || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (!textMatch) return false;
    if (selectedCluster === "All") return true;
    if (selectedCluster === "Pochampally Ikat Weavers") {
      return (p.title || p.name || "").toLowerCase().includes("pochampally") || (p.origin || "").toLowerCase().includes("pochampally");
    }
    if (selectedCluster === "Kondapalli Woodcraft Guild") {
      return (p.title || p.name || "").toLowerCase().includes("kondapalli") || (p.origin || "").toLowerCase().includes("kondapalli");
    }
    if (selectedCluster === "Varanasi Silk Cooperatives") {
      return (p.title || p.name || "").toLowerCase().includes("banarasi") || (p.title || p.name || "").toLowerCase().includes("silk");
    }
    if (selectedCluster === "Channapatna Lacquerware") {
      return (p.title || p.name || "").toLowerCase().includes("channapatna") || (p.title || p.name || "").toLowerCase().includes("toy");
    }
    return true;
  });

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
      {/* HEADER & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" /> Artisan Guild & Handcraft Product Management
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Artisan product add/edit, GI-tag compliance, price adjustments & cooperative order tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
          >
            <PackagePlus className="w-4 h-4" /> Add Handcrafted Product
          </button>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-1">
          <span className="text-muted-foreground font-semibold">Total Handcrafted Items</span>
          <p className="text-2xl font-bold text-foreground font-heading">{products.length} Products</p>
          <p className="text-[11px] text-emerald-600 font-semibold">+18% direct revenue to master weavers</p>
        </div>
        <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-1">
          <span className="text-muted-foreground font-semibold">Active Craft Dispatches</span>
          <p className="text-2xl font-bold text-foreground font-heading">142 Parcels</p>
          <p className="text-[11px] text-muted-foreground">Via India Post Speed Post</p>
        </div>
        <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-1">
          <span className="text-muted-foreground font-semibold">GI Certified Clusters</span>
          <p className="text-2xl font-bold text-foreground font-heading">38 Cooperatives</p>
          <p className="text-[11px] text-muted-foreground">Pochampally, Kondapalli, Banaras</p>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {clusters.map((c, i) => (
            <button
              key={`cluster-${c}-${i}`}
              type="button"
              onClick={() => setSelectedCluster(c)}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                selectedCluster === c
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by craft, artisan or village..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((p, idx) => {
          const title = p.title || p.name || "Handcrafted Artifact";
          const origin = p.origin || p.craft_origin || "Heritage Hub";
          const artisan = p.artisan || p.artisan_name || "Cooperative Guild";
          const price = p.price || 0;
          const mrp = p.mrp || Math.round(price * 1.3);
          const gi = p.gi_tag || (p.is_gi_tagged ? "Certified GI" : "Handcrafted");
          const itemKey = `ecom-prod-${p.id || 'item'}-${idx}`;

          return (
            <div key={itemKey} className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col justify-between gap-3 text-xs shadow-xs hover:border-primary/40 transition-colors">
              <div className="space-y-2">
                <div className="relative h-36 rounded-xl overflow-hidden bg-muted">
                  <img
                    src={p.image || presetImages[0].url}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                    {gi}
                  </span>
                  {p.stock && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-card/90 text-foreground text-[10px] font-semibold border border-border">
                      Stock: {p.stock}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-foreground line-clamp-1">{title}</h4>
                  <p className="text-muted-foreground text-[11px] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-primary shrink-0" /> {origin}
                  </p>
                  <p className="text-muted-foreground text-[11px] mt-0.5 font-medium">
                    Artisan: <span className="text-foreground">{artisan}</span>
                  </p>
                </div>

                <div className="flex items-baseline gap-2 pt-1 border-t border-border/60">
                  <span className="text-base font-bold text-primary">₹{price.toLocaleString()}</span>
                  {mrp > price && (
                    <span className="text-muted-foreground line-through text-[11px]">
                      ₹{mrp.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => openEditModal(p)}
                  className="flex-1 py-1.5 rounded-lg bg-card border border-border hover:bg-muted font-bold text-foreground flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3 text-primary" /> Edit Product
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(p.id, idx)}
                  className="p-1.5 rounded-lg bg-card border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  title="Remove product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <PackagePlus className="w-4 h-4 text-primary" />
                {editingProduct ? "Edit Handcrafted Product" : "Add New Handcrafted Product"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Product Title / Name *</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Kondapalli Dancing Doll (Aata Bomma)"
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Origin / Craft Village</label>
                  <input
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g. Kondapalli, Andhra Pradesh"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Artisan / Guild Name</label>
                  <input
                    value={formData.artisan}
                    onChange={(e) => setFormData({ ...formData, artisan: e.target.value })}
                    placeholder="e.g. Master Artisan K. Rama Rao"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Price (₹) *</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1200"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="1600"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Available Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="15"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">GI Tag / Certification</label>
                  <select
                    value={formData.gi_tag}
                    onChange={(e) => setFormData({ ...formData, gi_tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="Certified GI Product">Certified GI Product</option>
                    <option value="Traditional Handloom Mark">Traditional Handloom Mark</option>
                    <option value="GI Tag In Verification">GI Tag In Verification</option>
                    <option value="Tribal Cooperative Certified">Tribal Cooperative Certified</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Craft Category</label>
                  <select
                    value={formData.craftCategory}
                    onChange={(e) => setFormData({ ...formData, craftCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="Handloom & Textiles">Handloom & Textiles</option>
                    <option value="Woodcraft & Toys">Woodcraft & Toys</option>
                    <option value="Metalwork & Bell Brass">Metalwork & Bell Brass</option>
                    <option value="Terracotta & Pottery">Terracotta & Pottery</option>
                    <option value="Paintings & Kalamkari">Paintings & Kalamkari</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Product Image URL</label>
                <input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                />
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] text-muted-foreground mr-1">Presets:</span>
                  {presetImages.map((img, idx) => (
                    <button
                      key={`preset-${img.label}-${idx}`}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img.url })}
                      className="px-2 py-0.5 rounded-md bg-muted hover:bg-muted/80 text-[10px] text-muted-foreground hover:text-foreground font-medium"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Description / Heritage Story</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the artisan technique, materials used, and care instructions..."
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:opacity-90"
                >
                  {editingProduct ? "Save Changes" : "Publish to Shop"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 8. MARKETING DASHBOARD
function MarketingDashboard() {
  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Marketing & Tourist Footfall Campaigns
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          State tourism campaigns, social storytelling impressions & international tourist outreach
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-1">
          <span className="text-muted-foreground">Campaign: "Vizag Beyond Beaches"</span>
          <p className="text-xl font-bold text-foreground">420K Reach</p>
          <span className="text-emerald-500 font-semibold">4.8% Booking Conversion</span>
        </div>
        <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-1">
          <span className="text-muted-foreground">Campaign: "Kakatiya Heritage Trail"</span>
          <p className="text-xl font-bold text-foreground">310K Reach</p>
          <span className="text-emerald-500 font-semibold">5.2% Booking Conversion</span>
        </div>
        <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-1">
          <span className="text-muted-foreground">Campaign: "Tirupati Spiritual Heritage"</span>
          <p className="text-xl font-bold text-foreground">890K Reach</p>
          <span className="text-emerald-500 font-semibold">8.1% Booking Conversion</span>
        </div>
        <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-1">
          <span className="text-muted-foreground">Active Promo: "BHARAT2026"</span>
          <p className="text-xl font-bold text-foreground">₹2,000 Off</p>
          <span className="text-muted-foreground">Valid on Hotel + Guide Bundles</span>
        </div>
      </div>
    </div>
  );
}

// 9. STATE & DISTRICT COORDINATORS DASHBOARD
function StateCoordinatorDashboard() {
  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" /> State & District Tourism Coordinators
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Monitoring Andhra Pradesh & Telangana district facilities (hygiene, signage, drinking water)
        </p>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
          <div>
            <h4 className="font-bold text-foreground">Visakhapatnam District Tourism Directorate</h4>
            <p className="text-muted-foreground">Rushikonda Blue Flag Beach & Kailasagiri Solar Kiosks</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 font-bold">100% Audit Pass</span>
        </div>
        <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
          <div>
            <h4 className="font-bold text-foreground">Hyderabad District & Golconda Heritage Zone</h4>
            <p className="text-muted-foreground">Qutb Shahi Tombs Restoration & Electric Buggy Fleet</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 font-bold">Audit Verified</span>
        </div>
      </div>
    </div>
  );
}

// 10. LEADERBOARD DASHBOARD
function LeaderboardDashboard() {
  const topGuides = [
    { rank: 1, name: "Mirza Farooq", badge: "ASI-TS-219", city: "Hyderabad", rating: 4.98, tours: 320, reward: "National Heritage Award 2026" },
    { rank: 2, name: "Suresh Babu", badge: "ASI-AP-849", city: "Visakhapatnam", rating: 4.92, tours: 142, reward: "Top Coastal Storyteller" },
    { rank: 3, name: "Rajendra Sharma", badge: "ASI-UP-102", city: "Agra", rating: 4.90, tours: 410, reward: "Master Architectural Historian" },
    { rank: 4, name: "Meenakshi Sundaram", badge: "ASI-AP-311", city: "Tirupati", rating: 4.88, tours: 98, reward: "Temple Heritage Guide of the Year" },
  ];

  const topArtisans = [
    { rank: 1, name: "Kondapalli Toys Guild", state: "Andhra Pradesh", sales: "₹4.8 Lakhs", specialty: "Hand-carved Softwood Figurines" },
    { rank: 2, name: "Pochampally Ikat Weavers", state: "Telangana", sales: "₹6.2 Lakhs", specialty: "Geometric Silk Sarees" },
    { rank: 3, name: "Bidriware Master Crafts", state: "Telangana/Karnataka", sales: "₹3.9 Lakhs", specialty: "Silver Inlay on Zinc & Copper" },
  ];

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" /> Bharat Yatra Excellence Leaderboard
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Honoring India's top heritage guides, master artisan guilds, and cultural conservationists
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Guides */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Top Performing Licensed Guides
          </h4>
          <div className="space-y-2">
            {topGuides.map((g) => (
              <div key={g.name} className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full font-bold grid place-items-center text-xs ${
                    g.rank === 1 ? "bg-amber-500 text-white" : g.rank === 2 ? "bg-slate-400 text-white" : "bg-amber-700 text-white"
                  }`}>
                    {g.rank}
                  </span>
                  <div>
                    <p className="font-bold text-foreground">{g.name}</p>
                    <p className="text-[11px] text-muted-foreground">{g.city} · {g.badge}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-amber-500 font-bold">★ {g.rating}</span>
                  <p className="text-[10px] text-muted-foreground">{g.tours} tours</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Artisan Guilds */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-500" /> Top Rural Artisan Guilds
          </h4>
          <div className="space-y-2">
            {topArtisans.map((a) => (
              <div key={a.name} className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold grid place-items-center text-xs">
                    {a.rank}
                  </span>
                  <div>
                    <p className="font-bold text-foreground">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground">{a.state} · {a.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground font-mono">{a.sales}</span>
                  <p className="text-[10px] text-emerald-600 font-semibold">Direct Payouts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
