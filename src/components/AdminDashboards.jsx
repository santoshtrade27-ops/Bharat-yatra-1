import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, Hotel, Landmark, ShoppingCart, 
  MapPin, Award, Gift, Users, Plus, Search, Edit, Trash2, CheckCircle2,
  PhoneCall, X, Shield, CheckSquare,
  FileText, UserCheck, MessageSquare, Send, Check,
  Briefcase, Eye, UserPlus, ExternalLink, Navigation, Copy
} from "lucide-react";
import { getSavedHotels, saveHotels, governmentRecognizedHotels } from "@/lib/hotelDirectoryData";
import { products as initialDefaultProducts } from "@/lib/heritageData";
import { 
  getEmergencyCenters, saveEmergencyCenters,
  getSubEmployees, saveSubEmployees,
  getTodos, saveTodos,
  getVolunteers,
  getVolunteerChatMessages, sendVolunteerChatMessage,
  getSosSettings, saveSosSettings
} from "@/lib/adminData";
import { getOrders, updateOrderStatus } from "@/lib/cart";

export default function AdminDashboards({ activeRole, onRoleChange, singleRoleMode = false }) {
  // Roles list with Devasthanam and Marketing Director REMOVED as requested
  const roles = [
    { id: "core_admin", label: "Master Operations", icon: Shield, desc: "Unified cockpit: Registrations, Emergency, Employees, Forms, TODO & Completed" },
    { id: "employees_mgmt", label: "Employees & Staff", icon: Briefcase, desc: "Manage team staff, duty shifts, tasks, and hotel property assignments" },
    { id: "hotel_mgmt", label: "Hotel Operations", icon: Hotel, desc: "Verified hotel inventory, add & edit hotels & room assignments" },
    { id: "safety_cmd", label: "Emergency Command", icon: ShieldAlert, desc: "Live SOS beacons, tourist police dispatch & emergency centers" },
    { id: "guide_coord", label: "Guide Coordinator", icon: Users, desc: "New guides, assigned guides, offline & free guide rosters" },
    { id: "surprise_mgr", label: "Surprise Planner", icon: Gift, desc: "Custom event forms, negotiated pricing & employee execution" },
    { id: "ecomm_mgr", label: "Artisan & Handloom", icon: ShoppingCart, desc: "Handloom orders, dispatch status & rural artisan catalog" },
    { id: "volunteers", label: "Volunteer Portal", icon: Users, desc: "State-wise volunteer network & emergency dispatch group chat" },
    { id: "site_mgr", label: "Site Manager", icon: Landmark, desc: "Monument crowd density, ticket counters & ASI maintenance" },
    { id: "leaderboard", label: "Leaderboard", icon: Award, desc: "Top performing guides & rural artisan clusters" },
  ];

  const currentRole = activeRole || "core_admin";

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

      {/* RENDER ACTIVE PERSPECTIVE */}
      {(currentRole === "core_admin" || currentRole === "super_admin") && <CoreMasterOperationsDashboard onSwitchRole={onRoleChange} />}
      {currentRole === "employees_mgmt" && <EmployeesModule />}
      {currentRole === "guide_coord" && <GuideCoordinatorDashboard />}
      {currentRole === "surprise_mgr" && <SurprisePlannerDashboard />}
      {currentRole === "ecomm_mgr" && <EcommerceDashboard />}
      {currentRole === "volunteers" && <VolunteerPortalDashboard />}
      {currentRole === "hotel_mgmt" && <HotelManagementDashboard />}
      {currentRole === "safety_cmd" && <SafetyCommandDashboard />}
      {currentRole === "site_mgr" && <SiteManagerDashboard />}
      {currentRole === "leaderboard" && <LeaderboardDashboard />}
    </div>
  );
}

// =========================================================================
// 1. CORE MASTER OPERATIONS DASHBOARD (Unified Modules)
// Contains: Registrations, Emergency, Employees, Forms, TODO, Completed
// =========================================================================
function CoreMasterOperationsDashboard({ onSwitchRole }) {
  const [activeModule, setActiveModule] = useState("registrations");

  const modules = [
    { id: "registrations", label: "Registrations", icon: UserCheck, desc: "Tourist trip, elder care & guide applicant registrations" },
    { id: "emergency", label: "Emergency", icon: ShieldAlert, desc: "Active SOS distress beacons & emergency centers manager" },
    { id: "employees", label: "Employees", icon: Briefcase, desc: "Sub-employees management & hotel/task assignments" },
    { id: "forms", label: "Forms", icon: FileText, desc: "Central repository of all submitted user forms" },
    { id: "todo", label: "TODO", icon: CheckSquare, desc: "Operational tasks, employee assignments & deadlines" },
    { id: "completed", label: "Completed", icon: CheckCircle2, desc: "Fulfilled tasks, resolved cases & completed milestones" },
  ];

  return (
    <div className="space-y-6">
      {/* Module Navigation Tabs */}
      <div className="p-2 rounded-2xl bg-card border border-border shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {modules.map((m) => {
          const Icon = m.icon;
          const isSelected = activeModule === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Module Content */}
      {activeModule === "registrations" && <RegistrationsModule />}
      {activeModule === "emergency" && <EmergencyModule />}
      {activeModule === "employees" && <EmployeesModule />}
      {activeModule === "forms" && <FormsCentralModule />}
      {activeModule === "todo" && <TodoModule />}
      {activeModule === "completed" && <CompletedModule />}
    </div>
  );
}

// --- A. REGISTRATIONS MODULE ---
function RegistrationsModule() {
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  // Load Safety trip registrations
  const [safetyRegs, setSafetyRegs] = useState(() => {
    try {
      const s = localStorage.getItem("by-safety-registrations");
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed;
      }
      const single = localStorage.getItem("by-trip-reg");
      if (single) {
        const parsed = JSON.parse(single);
        if (parsed.name) return [{ id: "REG-01", type: "Safety Trip", date: "Today", status: "Verified Active", ...parsed }];
      }
    } catch (e) {}
    return [
      { id: "REG-101", type: "Safety Trip", name: "Kiran & Priya", phone: "+91 98480 12345", destination: "Visakhapatnam & Araku Valley", hotel: "Novotel Varun Beach", purpose: "Heritage Tourism", dates: "12-16 Oct 2026", status: "Verified Active" },
      { id: "REG-102", type: "Safety Trip", name: "Deepak Verma", phone: "+91 94401 98765", destination: "Charminar & Golconda Circuit", hotel: "Taj Falaknuma Palace", purpose: "Cultural Exploration", dates: "18-21 Oct 2026", status: "Verified Active" },
    ];
  });

  // Load Elder registrations
  const [elderRegs, setElderRegs] = useState(() => {
    try {
      const s = localStorage.getItem("by-elder-registrations");
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed;
      }
      const single = localStorage.getItem("by-elder");
      if (single) {
        const parsed = JSON.parse(single);
        if (parsed.name) return [{ id: "ELD-01", type: "Elder Care", ...parsed, status: "Active Care Watch" }];
      }
    } catch (e) {}
    return [
      { id: "ELD-201", type: "Elder Care", name: "Smt. Kamala Devi", phone: "+91 94400 12345", destination: "Tirumala Venkateswara Darshan", frequency: "Every 4 hours", guardian: "Venkat Rao (+91 98480 99881)", status: "Active Care Watch", lat: 13.6833, lng: 79.3500, checkInTime: "10:30 AM", battery: "92%", lastUpdate: "14 mins ago" },
      { id: "ELD-202", type: "Elder Care", name: "Sri G. Narayana Swamy", phone: "+91 98110 55443", destination: "Varanasi Ghats Pilgrimage", frequency: "Every 6 hours", guardian: "Suresh (+91 98110 55444)", status: "Active Care Watch", lat: 25.3176, lng: 83.0062, checkInTime: "08:15 AM", battery: "78%", lastUpdate: "35 mins ago" },
    ];
  });

  // Load Guide applicant registrations
  const [guideRegs, setGuideRegs] = useState(() => {
    try {
      const s = localStorage.getItem("by-guide-applications");
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [
      { id: "GD-301", type: "Guide Application", name: "B. Ramesh Babu", phone: "+91 98482 11992", city: "Visakhapatnam", state: "Andhra Pradesh", address: "Dolphin Hill Colony, Vizag", hiddenSpot: "Ross Hill Chapel sunset vantage overlooking harbor mouth", bio: "10+ years exploring coastal Andhra heritage", status: "Pending Verification", lat: 17.6868, lng: 83.2185 },
      { id: "GD-302", type: "Guide Application", name: "Syed Kareem", phone: "+91 98850 77112", city: "Hyderabad", state: "Telangana", address: "Moghulpura, Old City", hiddenSpot: "16th-century secret acoustic well inside Golconda outer bailey", bio: "Historian specializing in Qutb Shahi architecture", status: "Approved", lat: 17.3850, lng: 78.4867 },
    ];
  });

  const [selectedDossier, setSelectedDossier] = useState(null);
  const [locationUpdateForm, setLocationUpdateForm] = useState({ location: "", lat: "", lng: "" });
  const [updateNotice, setUpdateNotice] = useState("");

  const allRegistrations = [
    ...(Array.isArray(safetyRegs) ? safetyRegs : []).map(r => ({ ...r, category: "Safety Trip" })),
    ...(Array.isArray(elderRegs) ? elderRegs : []).map(r => ({ ...r, category: "Elder Care" })),
    ...(Array.isArray(guideRegs) ? guideRegs : []).map(r => ({ ...r, category: "Guide Application" })),
  ];

  const filtered = allRegistrations.filter(r => {
    const matchType = filterType === "all" || r.category.toLowerCase().replace(/\s+/g, "_") === filterType;
    const matchSearch = !search || 
      (r.name || "").toLowerCase().includes(search.toLowerCase()) || 
      (r.phone || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.destination || r.city || "").toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  // Open Dossier & set up location update fields
  const handleOpenDossier = (item) => {
    setSelectedDossier(item);
    setLocationUpdateForm({
      location: item.destination || item.city || "Visakhapatnam Coastal Axis",
      lat: item.lat || (item.coords ? item.coords[0] : 17.6868),
      lng: item.lng || (item.coords ? item.coords[1] : 83.2185),
    });
  };

  // Save updated location from admin
  const handleSaveLocationUpdate = (e) => {
    e.preventDefault();
    if (!selectedDossier) return;

    const updatedItem = {
      ...selectedDossier,
      destination: locationUpdateForm.location,
      lat: Number(locationUpdateForm.lat) || 17.6868,
      lng: Number(locationUpdateForm.lng) || 83.2185,
      lastUpdate: "Just now (Admin Updated)",
    };

    if (selectedDossier.category === "Safety Trip") {
      const updated = safetyRegs.map(r => r.id === selectedDossier.id ? updatedItem : r);
      setSafetyRegs(updated);
      localStorage.setItem("by-safety-registrations", JSON.stringify(updated));
    } else if (selectedDossier.category === "Elder Care") {
      const updated = elderRegs.map(r => r.id === selectedDossier.id ? updatedItem : r);
      setElderRegs(updated);
      localStorage.setItem("by-elder-registrations", JSON.stringify(updated));
    } else if (selectedDossier.category === "Guide Application") {
      const updated = guideRegs.map(r => r.id === selectedDossier.id ? updatedItem : r);
      setGuideRegs(updated);
      localStorage.setItem("by-guide-applications", JSON.stringify(updated));
    }

    setSelectedDossier(updatedItem);
    setUpdateNotice(`✓ Location updated to ${locationUpdateForm.location}! Broadcasted to safety command.`);
    setTimeout(() => setUpdateNotice(""), 4000);
  };

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
            <UserCheck className="w-5 h-5 text-primary" /> Inbound Tourist, Elder & Guide Registrations
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified traveler trip records, GPS location updates, elder care live tracking & licensed guide rosters
          </p>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-xl bg-primary/10 text-primary font-bold">
            Total: {allRegistrations.length}
          </span>
          <span className="px-3 py-1 rounded-xl bg-rose-500/15 text-rose-600 font-bold">
            Elders: {elderRegs.length}
          </span>
          <span className="px-3 py-1 rounded-xl bg-purple-500/15 text-purple-600 font-bold">
            Guides: {guideRegs.length}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or place..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "All Registrations" },
            { id: "safety_trip", label: "Safety Trips" },
            { id: "elder_care", label: "Elder Care" },
            { id: "guide_application", label: "Guide Applicants" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                filterType === f.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Registrations List */}
      <div className="space-y-3">
        {filtered.map((item, idx) => (
          <div key={item.id || idx} className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-primary/40 transition-colors">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  item.category === "Elder Care" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" :
                  item.category === "Guide Application" ? "bg-purple-500/15 text-purple-600 dark:text-purple-400" :
                  "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                }`}>
                  {item.category}
                </span>
                <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
                <span className="font-mono text-muted-foreground">({item.id})</span>
                {item.tripType && (
                  <span className="px-2 py-0.5 rounded-full bg-muted text-foreground text-[10px] font-bold">
                    {item.tripType} Trip
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">
                📞 <strong className="text-foreground">{item.phone}</strong> · 
                {item.destination && ` Destination: ${item.destination}`}
                {item.city && ` Location: ${item.city}, ${item.state}`}
                {item.hotel && ` · Hotel: ${item.hotel}`}
                {item.frequency && ` · Check-in: ${item.frequency}`}
                {item.guardian && ` · Guardian: ${item.guardian}`}
              </p>
              {item.lat && item.lng && (
                <p className="text-[11px] text-primary font-mono flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> GPS: {Number(item.lat).toFixed(4)}° N, {Number(item.lng).toFixed(4)}° E
                  {item.lastUpdate && <span className="text-muted-foreground font-sans">· {item.lastUpdate}</span>}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => handleOpenDossier(item)}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-1.5 shadow-xs hover:opacity-90"
              >
                <Eye className="w-3.5 h-3.5" /> Inspect Dossier & GPS
              </button>
              <a
                href={`tel:${item.phone}`}
                className="px-3 py-1.5 rounded-xl bg-card border border-border hover:bg-muted text-foreground font-bold flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5 text-primary" /> Call
              </a>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-muted-foreground text-xs">
            No registrations found matching the current search criteria.
          </div>
        )}
      </div>

      {/* TRAVELER SAFETY DOSSIER & LIVE LOCATION MODAL */}
      {selectedDossier && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    selectedDossier.category === "Elder Care" ? "bg-rose-500/15 text-rose-600" :
                    selectedDossier.category === "Guide Application" ? "bg-purple-500/15 text-purple-600" :
                    "bg-blue-500/15 text-blue-600"
                  }`}>
                    {selectedDossier.category}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground font-bold">
                    {selectedDossier.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground font-heading mt-1">
                  {selectedDossier.name}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span>📞 {selectedDossier.phone}</span>
                  <span>·</span>
                  <span>Registered: {selectedDossier.travelDate || selectedDossier.dates || "Active"}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDossier(null)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground text-lg"
              >
                ✕
              </button>
            </div>

            {updateNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {updateNotice}
              </div>
            )}

            {/* LIVE GPS LOCATION TELEMETRY CARD */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Navigation className="w-4 h-4" /> Live Location Telemetry & GPS Coordinates
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  GPS Linked
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-card border border-border">
                  <span className="text-muted-foreground block text-[10px]">Current Location:</span>
                  <strong className="text-foreground text-xs">{selectedDossier.destination || selectedDossier.city || "Visakhapatnam"}</strong>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border">
                  <span className="text-muted-foreground block text-[10px]">WGS-84 Coordinates:</span>
                  <strong className="text-primary font-mono text-xs">
                    {Number(selectedDossier.lat || 17.6868).toFixed(4)}, {Number(selectedDossier.lng || 83.2185).toFixed(4)}
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border">
                  <span className="text-muted-foreground block text-[10px]">Battery & Last Ping:</span>
                  <strong className="text-foreground text-xs">{selectedDossier.battery || "86%"} · {selectedDossier.lastUpdate || "10 mins ago"}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedDossier.lat || 17.6868},${selectedDossier.lng || 83.2185}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-xs hover:opacity-90"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View on Google Maps
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${selectedDossier.lat || 17.6868}, ${selectedDossier.lng || 83.2185}`);
                    alert("GPS Coordinates copied to clipboard!");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-card border border-border hover:bg-muted font-bold text-xs flex items-center gap-1.5 text-foreground"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Coordinates
                </button>
              </div>
            </div>

            {/* LOCATION UPDATE FORM (FOR ADMIN LOCATION CONTROL) */}
            <form onSubmit={handleSaveLocationUpdate} className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500" /> Update Traveler Location Checkpoint
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-bold mb-1">Location / Checkpoint</label>
                  <input
                    type="text"
                    required
                    value={locationUpdateForm.location}
                    onChange={(e) => setLocationUpdateForm({ ...locationUpdateForm, location: e.target.value })}
                    placeholder="e.g. Borra Caves Entry Gate"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-bold mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={locationUpdateForm.lat}
                    onChange={(e) => setLocationUpdateForm({ ...locationUpdateForm, lat: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-bold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={locationUpdateForm.lng}
                    onChange={(e) => setLocationUpdateForm({ ...locationUpdateForm, lng: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-xs shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Save Location Update
              </button>
            </form>

            {/* DETAILED TRIP & MEDICAL DATA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                <span className="font-bold text-foreground block">🏨 Stay & Hotel Logistics</span>
                <p className="text-muted-foreground">
                  <strong>Hotel:</strong> {selectedDossier.hotel || "Haritha Resort / Direct Booking"}
                </p>
                <p className="text-muted-foreground">
                  <strong>Purpose:</strong> {selectedDossier.purpose || "Spiritual / Heritage Circuit"}
                </p>
                <p className="text-muted-foreground">
                  <strong>Check-in Interval:</strong> {selectedDossier.checkInTime || selectedDossier.frequency || "Every 4 Hours"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                <span className="font-bold text-foreground block">🚨 Emergency Contacts & Guardian</span>
                <p className="text-muted-foreground">
                  <strong>Guardian:</strong> {selectedDossier.guardian || selectedDossier.emergencyContacts || "+91 98480 99881 (Family Lead)"}
                </p>
                <p className="text-muted-foreground">
                  <strong>Local Guide/Cab:</strong> {selectedDossier.localContacts || "Assigned Tour Desk"}
                </p>
                <p className="text-muted-foreground">
                  <strong>Ticket PNR:</strong> {selectedDossier.ticketInfo || "IRCTC / State Roadways"}
                </p>
              </div>
            </div>

            {selectedDossier.specialInstructions && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-muted-foreground">
                <strong className="text-foreground block mb-1">⚠️ Medical / Senior Special Instructions:</strong>
                "{selectedDossier.specialInstructions}"
              </div>
            )}

            {/* Footer action buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-border flex-wrap gap-2">
              <a
                href={`tel:${selectedDossier.phone}`}
                className="px-4 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Traveler Directly
              </a>
              <button
                type="button"
                onClick={() => setSelectedDossier(null)}
                className="px-5 py-2.5 rounded-full bg-muted text-foreground font-bold text-xs hover:bg-muted/80"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- B. EMERGENCY MODULE (Active SOS + Emergency Centers Editor) ---
function EmergencyModule() {
  const [centers, setCenters] = useState(getEmergencyCenters());
  const [alerts, setAlerts] = useState(() => {
    try {
      const s = localStorage.getItem("by-sos-incidents");
      if (s) return JSON.parse(s);
    } catch (e) {}
    return [
      { id: "SOS-904", traveler: "Kavita Rao", phone: "+91 94401 88321", location: "Borra Caves Lower Trail", time: "12 mins ago", status: "Officer Dispatched", severity: "High", lat: 18.2811, lng: 83.0401, emergencyPrompt: "Stranded on lower cave staircase with injured ankle." },
      { id: "SOS-903", traveler: "Vikram Malhotra", phone: "+91 98110 44219", location: "Kailasagiri Ropeway Station, Vizag", time: "1 hr ago", status: "Resolved", severity: "Medium", lat: 17.7492, lng: 83.3421, emergencyPrompt: "Wallet lost and tout harassment near viewpoint." },
    ];
  });

  const [selectedSos, setSelectedSos] = useState(null);
  const [sosLocationForm, setSosLocationForm] = useState({ location: "", lat: "", lng: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "Visakhapatnam, Andhra Pradesh",
    type: "Hospital",
    phone: "+91-",
    address: "",
    lat: "17.7089",
    lng: "83.3039",
  });

  // State & District WhatsApp Group Links Management
  const [sosSettings, setSosSettings] = useState(() => getSosSettings());
  const [newGroupRegion, setNewGroupRegion] = useState("");
  const [newGroupLink, setNewGroupLink] = useState("");
  const [waNotice, setWaNotice] = useState("");

  function handleAddOrUpdateGroup(e) {
    e.preventDefault();
    if (!newGroupRegion || !newGroupLink) return;
    const updatedGroups = {
      ...(sosSettings.whatsappGroups || {}),
      [newGroupRegion.trim()]: newGroupLink.trim()
    };
    const updatedSettings = { ...sosSettings, whatsappGroups: updatedGroups };
    setSosSettings(updatedSettings);
    saveSosSettings(updatedSettings);
    setNewGroupRegion("");
    setNewGroupLink("");
    setWaNotice(`WhatsApp group link for '${newGroupRegion}' updated successfully!`);
    setTimeout(() => setWaNotice(""), 3500);
  }

  function handleDeleteGroup(regionName) {
    const updatedGroups = { ...(sosSettings.whatsappGroups || {}) };
    delete updatedGroups[regionName];
    const updatedSettings = { ...sosSettings, whatsappGroups: updatedGroups };
    setSosSettings(updatedSettings);
    saveSosSettings(updatedSettings);
    setWaNotice(`Removed WhatsApp group link for '${regionName}'.`);
    setTimeout(() => setWaNotice(""), 3500);
  }

  function openAddModal() {
    setEditingCenter(null);
    setFormData({
      name: "",
      city: "Visakhapatnam, Andhra Pradesh",
      type: "Hospital",
      phone: "+91-",
      address: "",
      lat: "17.7089",
      lng: "83.3039",
    });
    setModalOpen(true);
  }

  function openEditModal(c) {
    setEditingCenter(c);
    setFormData({
      name: c.name,
      city: c.city,
      type: c.type,
      phone: c.phone,
      address: c.address,
      lat: String(c.lat || "17.7089"),
      lng: String(c.lng || "83.3039"),
    });
    setModalOpen(true);
  }

  function handleSaveCenter(e) {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    let updated;
    if (editingCenter) {
      updated = centers.map(c => c.id === editingCenter.id ? {
        ...c,
        ...formData,
        lat: Number(formData.lat) || 17.7089,
        lng: Number(formData.lng) || 83.3039,
      } : c);
    } else {
      const newC = {
        id: `ec-${Date.now()}`,
        ...formData,
        lat: Number(formData.lat) || 17.7089,
        lng: Number(formData.lng) || 83.3039,
      };
      updated = [newC, ...centers];
    }
    setCenters(updated);
    saveEmergencyCenters(updated);
    setModalOpen(false);
  }

  function handleDeleteCenter(id) {
    if (!confirm("Are you sure you want to remove this emergency center?")) return;
    const updated = centers.filter(c => c.id !== id);
    setCenters(updated);
    saveEmergencyCenters(updated);
  }

  function resolveAlert(id) {
    const updated = alerts.map(a => a.id === id ? { ...a, status: "Resolved" } : a);
    setAlerts(updated);
    localStorage.setItem("by-sos-incidents", JSON.stringify(updated));
  }

  function openSosDetail(alertItem) {
    setSelectedSos(alertItem);
    setSosLocationForm({
      location: alertItem.location || "Tourist Sector",
      lat: alertItem.lat || (alertItem.coords ? alertItem.coords[0] : 17.6868),
      lng: alertItem.lng || (alertItem.coords ? alertItem.coords[1] : 83.2185),
    });
  }

  function handleUpdateSosLocation(e) {
    e.preventDefault();
    if (!selectedSos) return;
    const updated = alerts.map(a => a.id === selectedSos.id ? {
      ...a,
      location: sosLocationForm.location,
      lat: Number(sosLocationForm.lat) || a.lat || 17.6868,
      lng: Number(sosLocationForm.lng) || a.lng || 83.2185,
    } : a);
    setAlerts(updated);
    localStorage.setItem("by-sos-incidents", JSON.stringify(updated));
    setSelectedSos(prev => ({ ...prev, location: sosLocationForm.location, lat: Number(sosLocationForm.lat), lng: Number(sosLocationForm.lng) }));
    alert("SOS Incident Location updated and broadcasted to Police Control Room!");
  }

  return (
    <div className="space-y-6">
      {/* Active Distress Signals */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive animate-ping" />
            <h3 className="font-bold text-base text-foreground font-heading">
              Active SOS Distress Signals & Police Telemetry
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-destructive/15 text-destructive font-bold">
            Live Hotline 112 & 1363 Linked
          </span>
        </div>

        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-xs bg-muted/20 rounded-2xl border border-dashed border-border">
              No active distress beacons. All tourist safety sectors operational.
            </div>
          ) : (
            alerts.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl bg-destructive/10 border border-destructive/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-destructive text-sm">{a.traveler}</span>
                    <span className="font-mono text-muted-foreground font-bold text-[11px]">({a.id})</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      a.status === "Resolved" ? "bg-emerald-500/20 text-emerald-600" : "bg-destructive text-destructive-foreground"
                    }`}>
                      {a.status}
                    </span>
                    {a.category && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                        {a.category}
                      </span>
                    )}
                  </div>
                  {a.emergencyPrompt && (
                    <p className="text-foreground italic bg-card/60 p-2 rounded-xl border border-border text-[11px]">
                      "{a.emergencyPrompt}"
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    📍 <strong>{a.location}</strong> · 📞 <strong className="text-foreground">{a.phone}</strong> · {a.time}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={() => openSosDetail(a)}
                    className="px-3 py-1.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted font-bold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-primary" /> Inspect GPS & SOS
                  </button>
                  <a
                    href={`tel:${a.phone}`}
                    className="px-3 py-1.5 rounded-xl bg-destructive text-destructive-foreground font-bold flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call Tourist
                  </a>
                  {a.status !== "Resolved" && (
                    <button
                      type="button"
                      onClick={() => resolveAlert(a.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SOS INCIDENT DETAIL & LOCATION UPDATE MODAL */}
      {selectedSos && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-destructive text-destructive-foreground font-bold text-[10px]">
                    {selectedSos.id}
                  </span>
                  <span className="text-xs font-bold text-destructive">
                    {selectedSos.severity || "Critical"} Distress Signal
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mt-1 font-heading">
                  {selectedSos.traveler}
                </h3>
                <p className="text-xs text-muted-foreground">📞 {selectedSos.phone} · Signal Time: {selectedSos.time}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSos(null)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground text-lg"
              >
                ✕
              </button>
            </div>

            {selectedSos.emergencyPrompt && (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/25 space-y-1 text-xs">
                <span className="font-bold text-destructive block">🚨 Emergency Voice / Prompt Transcript:</span>
                <p className="text-foreground italic font-medium leading-relaxed">
                  "{selectedSos.emergencyPrompt}"
                </p>
              </div>
            )}

            {/* GPS Telemetry */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2 text-xs">
              <span className="font-bold text-primary block flex items-center gap-1.5">
                <Navigation className="w-4 h-4" /> Real-time Satellite Coordinates
              </span>
              <p className="font-mono text-foreground font-bold">
                {selectedSos.lat || 18.2811}° N, {selectedSos.lng || 83.0401}° E
              </p>
              <div className="pt-1 flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedSos.lat || 18.2811},${selectedSos.lng || 83.0401}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Satellite Map
                </a>
              </div>
            </div>

            {/* SOS Location Checkpoint Updater */}
            <form onSubmit={handleUpdateSosLocation} className="p-4 rounded-2xl bg-card border border-border space-y-3 text-xs">
              <span className="font-bold text-foreground block">Update Incident Location / Dispatch Zone:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  value={sosLocationForm.location}
                  onChange={(e) => setSosLocationForm({ ...sosLocationForm, location: e.target.value })}
                  placeholder="Location name..."
                  className="px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                />
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={sosLocationForm.lat}
                  onChange={(e) => setSosLocationForm({ ...sosLocationForm, lat: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono"
                />
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={sosLocationForm.lng}
                  onChange={(e) => setSosLocationForm({ ...sosLocationForm, lng: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-xs"
              >
                Broadcast Location Update
              </button>
            </form>

            <div className="pt-2 flex items-center justify-between border-t border-border flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedSos.phone}`}
                  className="px-3.5 py-2 rounded-full bg-destructive text-destructive-foreground font-bold flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call Traveler
                </a>
                <a
                  href="tel:112"
                  className="px-3.5 py-2 rounded-full bg-purple-600 text-white font-bold flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" /> Call Police 112
                </a>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSos(null)}
                className="px-4 py-2 rounded-full bg-muted text-foreground font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Tourist Safety Location & Geofence Tracker */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-2 font-heading">
              <MapPin className="w-5 h-5 text-primary" /> Live Tourist Safety Location Radar & Geofence
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live GPS feeds from registered tourist mobile devices, pilgrim circuits & active excursion teams
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            Satellite Geofence Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Visakhapatnam & RK Beach</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              GPS: 17.7135° N, 83.3281° E · 14 active registered travelers · 0 distress
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/60">
              <span>Tourist Police Booth: #3 Submarine</span>
              <span className="text-emerald-600 font-bold">Secure Zone</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Araku Valley & Borra Caves</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              GPS: 18.2811° N, 83.0401° E · 8 active registered travelers · Ghat Road Watch
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/60">
              <span>Forest Range Patrol: Active</span>
              <span className="text-amber-600 font-bold">Ghat Precaution</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Hyderabad Charminar Circuit</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              GPS: 17.3616° N, 78.4747° E · 22 active registered travelers · 0 distress
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/60">
              <span>Old City Outpost: Station #1</span>
              <span className="text-emerald-600 font-bold">Secure Zone</span>
            </div>
          </div>
        </div>
      </div>

      {/* State & District WhatsApp Group Links Manager */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-2 font-heading">
              <MessageSquare className="w-5 h-5 text-emerald-600" /> State-Wise & District-Wise WhatsApp Group Links
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add or edit official state and district emergency WhatsApp community links. Tourists registering for SOS automatically receive their local state/district group link.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            Live SOS Integration
          </span>
        </div>

        {waNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{waNotice}</span>
          </div>
        )}

        {/* Add / Edit New WhatsApp Group Form */}
        <form onSubmit={handleAddOrUpdateGroup} className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3 text-xs">
          <span className="font-bold text-foreground block">Add / Update State or District WhatsApp Group Link:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                State or District Name (e.g. Andhra Pradesh, Visakhapatnam, Telangana):
              </label>
              <input
                type="text"
                required
                value={newGroupRegion}
                onChange={(e) => setNewGroupRegion(e.target.value)}
                placeholder="e.g. Visakhapatnam, Goa, Kerala, Varanasi..."
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                WhatsApp Group Invite URL:
              </label>
              <input
                type="url"
                required
                value={newGroupLink}
                onChange={(e) => setNewGroupLink(e.target.value)}
                placeholder="https://chat.whatsapp.com/invite/..."
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary font-mono text-[11px]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Save WhatsApp Group Link
          </button>
        </form>

        {/* List of Configured State & District WhatsApp Groups */}
        <div className="space-y-2">
          <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
            Active Configured Groups ({Object.keys(sosSettings.whatsappGroups || {}).length}):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {Object.entries(sosSettings.whatsappGroups || {}).map(([region, link]) => (
              <div key={region} className="p-3 rounded-xl bg-card border border-border flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-bold text-foreground block truncate">{region}</span>
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono hover:underline block truncate"
                  >
                    {link}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteGroup(region)}
                  className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 shrink-0"
                  title="Remove Group Link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Centers Management Table */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-2 font-heading">
              <ShieldAlert className="w-5 h-5 text-primary" /> Emergency Centers & Police Stations (Editable by Staff)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Updates here immediately sync to the user Safety & SOS page for tourists across India
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Emergency Center
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Center Name</th>
                <th className="py-3 px-4">City / State</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Helpline Phone</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {centers.map((c) => (
                <tr key={c.id || c.name} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">{c.name}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{c.city}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      c.type === "Hospital" ? "bg-rose-500/15 text-rose-600" : "bg-purple-500/15 text-purple-600"
                    }`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">{c.phone}</td>
                  <td className="py-3.5 px-4 text-muted-foreground max-w-xs truncate">{c.address}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(c)}
                        className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground"
                        title="Edit Center"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCenter(c.id)}
                        className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                        title="Delete Center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Center Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-3xl border border-border p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h4 className="font-bold text-base text-foreground">
                {editingCenter ? "Edit Emergency Center" : "Add Emergency Center"}
              </h4>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSaveCenter} className="space-y-3">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Center / Hospital / Police Name:</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apollo Super Specialty Hospital"
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Type:</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                  >
                    <option value="Hospital">Hospital / Trauma</option>
                    <option value="Police">Police Outpost</option>
                    <option value="Tourist Assistance">Tourist Booth</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Contact Phone:</label>
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91-891-2564891"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">City & State:</label>
                <input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Visakhapatnam, Andhra Pradesh"
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Address / Landmark:</label>
                <input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Beach Road, Opposite RK Beach"
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Latitude:</label>
                  <input
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Longitude:</label>
                  <input
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold"
                >
                  Save Emergency Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- C. SUB-EMPLOYEES MODULE (Create, Assign Hotels / Tasks) ---
function EmployeesModule() {
  const [employees, setEmployees] = useState(getSubEmployees());
  const [modalOpen, setModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  // New Employee Form
  const [newEmp, setNewEmp] = useState({
    name: "",
    department: "Hotel Operations",
    role: "Operational Coordinator",
    email: "",
    phone: "",
    assignedHotel: "Novotel Visakhapatnam Varun Beach",
    assignedTask: "Perform regular room quality check and guest assistance",
    status: "Active",
  });

  // Assign Hotel or Task Form
  const [assignmentData, setAssignmentData] = useState({
    hotel: "Novotel Visakhapatnam Varun Beach",
    task: "",
  });

  function handleAddEmployee(e) {
    e.preventDefault();
    if (!newEmp.name || !newEmp.phone) return;

    const empObj = {
      id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      ...newEmp,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    const updated = [empObj, ...employees];
    setEmployees(updated);
    saveSubEmployees(updated);
    setModalOpen(false);
    setNewEmp({
      name: "",
      department: "Hotel Operations",
      role: "Operational Coordinator",
      email: "",
      phone: "",
      assignedHotel: "Novotel Visakhapatnam Varun Beach",
      assignedTask: "Perform regular room quality check and guest assistance",
      status: "Active",
    });
  }

  function openAssignModal(emp) {
    setSelectedEmp(emp);
    setAssignmentData({
      hotel: emp.assignedHotel || "Novotel Visakhapatnam Varun Beach",
      task: emp.assignedTask || "",
    });
    setAssignModalOpen(true);
  }

  function handleSaveAssignment(e) {
    e.preventDefault();
    if (!selectedEmp) return;

    const updated = employees.map(emp => {
      if (emp.id === selectedEmp.id) {
        return {
          ...emp,
          assignedHotel: assignmentData.hotel,
          assignedTask: assignmentData.task,
        };
      }
      return emp;
    });

    setEmployees(updated);
    saveSubEmployees(updated);
    setAssignModalOpen(false);
  }

  function toggleEmployeeStatus(id) {
    const updated = employees.map(emp => {
      if (emp.id === id) {
        const nextStatus = emp.status === "Active" ? "On Duty" : emp.status === "On Duty" ? "On Leave" : "Active";
        return { ...emp, status: nextStatus };
      }
      return emp;
    });
    setEmployees(updated);
    saveSubEmployees(updated);
  }

  function handleDeleteEmployee(id) {
    if (!confirm("Are you sure you want to remove this employee?")) return;
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    saveSubEmployees(updated);
  }

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
            <Briefcase className="w-5 h-5 text-primary" /> Sub-Employee Operations & Task Delegations
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add team employees, assign government-recognized hotels, allocate tasks, and monitor active duty
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Sub-Employee
        </button>
      </div>

      {/* Employees Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div key={emp.id} className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col justify-between space-y-3 text-xs">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] text-muted-foreground font-bold">{emp.id}</span>
                  <h4 className="font-bold text-sm text-foreground">{emp.name}</h4>
                  <p className="text-[11px] text-primary font-semibold">{emp.department} · {emp.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleEmployeeStatus(emp.id)}
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] cursor-pointer ${
                    emp.status === "Active" ? "bg-emerald-500/15 text-emerald-600" :
                    emp.status === "On Duty" ? "bg-blue-500/15 text-blue-600" :
                    "bg-amber-500/15 text-amber-600"
                  }`}
                  title="Click to toggle status"
                >
                  {emp.status}
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-card border border-border space-y-1">
                <p className="text-[11px] font-bold text-foreground flex items-center gap-1">
                  <Hotel className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{emp.assignedHotel || "No hotel assigned"}</span>
                </p>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  📌 {emp.assignedTask || "Standard operational monitoring"}
                </p>
              </div>

              <div className="text-[11px] text-muted-foreground space-y-0.5">
                <p>📞 {emp.phone}</p>
                <p>✉️ {emp.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => openAssignModal(emp)}
                className="flex-1 py-1.5 rounded-xl bg-card border border-border hover:bg-muted font-bold text-foreground text-[11px]"
              >
                Assign Hotel / Task
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEmployee(emp.id)}
                className="p-1.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20"
                title="Remove Employee"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-3xl border border-border p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h4 className="font-bold text-base text-foreground">Add New Sub-Employee</h4>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Employee Full Name:</label>
                <input
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  placeholder="e.g. Sandeep Reddy"
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Department:</label>
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                  >
                    <option value="Hotel Operations">Hotel Operations</option>
                    <option value="Event / Surprise Planner">Event / Surprise Planner</option>
                    <option value="Guide Coordinator Desk">Guide Coordinator Desk</option>
                    <option value="Artisans & Handloom">Artisans & Handloom</option>
                    <option value="Safety & Emergency Response">Safety & Emergency Response</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Role Title:</label>
                  <input
                    value={newEmp.role}
                    onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                    placeholder="e.g. Field Supervisor"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Phone Number:</label>
                  <input
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                    placeholder="+91 98480 12345"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Official Email:</label>
                  <input
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                    placeholder="name@bharatyatra.gov.in"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Assign Hotel (Optional):</label>
                <select
                  value={newEmp.assignedHotel}
                  onChange={(e) => setNewEmp({ ...newEmp, assignedHotel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                >
                  {governmentRecognizedHotels.slice(0, 15).map((h) => (
                    <option key={h.id} value={`${h.name} (${h.city})`}>
                      {h.name} — {h.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Assigned Operational Task:</label>
                <textarea
                  rows={2}
                  value={newEmp.assignedTask}
                  onChange={(e) => setNewEmp({ ...newEmp, assignedTask: e.target.value })}
                  placeholder="Specific task to supervise..."
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm"
                >
                  Add Sub-Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Hotel / Task Modal */}
      {assignModalOpen && selectedEmp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-3xl border border-border p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h4 className="font-bold text-base text-foreground">Assign Hotel or Task</h4>
                <p className="text-muted-foreground text-[11px]">Employee: {selectedEmp.name} ({selectedEmp.id})</p>
              </div>
              <button type="button" onClick={() => setAssignModalOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-3">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Select Hotel Property to Assign:</label>
                <select
                  value={assignmentData.hotel}
                  onChange={(e) => setAssignmentData({ ...assignmentData, hotel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                >
                  <option value="Unassigned / Floating">Unassigned / Floating Across Hubs</option>
                  {governmentRecognizedHotels.map((h) => (
                    <option key={h.id} value={`${h.name} (${h.city})`}>
                      {h.name} — {h.city} ({h.classification})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Specific Task or Directive:</label>
                <textarea
                  rows={3}
                  value={assignmentData.task}
                  onChange={(e) => setAssignmentData({ ...assignmentData, task: e.target.value })}
                  placeholder="e.g. Coordinate room occupancy, oversee Satvik food kitchen, supervise airport greeting"
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- D. FORMS CENTRAL MODULE ---
function FormsCentralModule() {
  const [selectedForm, setSelectedForm] = useState(null);

  // Collect all forms across domains
  const [formsList, setFormsList] = useState(() => {
    const list = [];
    try {
      const guideApps = JSON.parse(localStorage.getItem("by-guide-applications") || "[]");
      guideApps.forEach(g => list.push({ formType: "Guide Registration Form", title: `Guide App: ${g.name}`, date: g.date || "Recent", data: g }));
      
      const surprises = JSON.parse(localStorage.getItem("by-event-requests") || "[]");
      surprises.forEach(s => list.push({ formType: "Surprise Event Form", title: `Surprise: ${s.client || s.name}`, date: s.date || "Recent", data: s }));

      const safety = JSON.parse(localStorage.getItem("by-safety-registrations") || "[]");
      safety.forEach(sf => list.push({ formType: "Safety Journey Form", title: `Trip: ${sf.name}`, date: sf.dates || "Active", data: sf }));
    } catch (e) {}

    // Default fallbacks if empty
    if (list.length === 0) {
      list.push(
        {
          formType: "Guide Registration Form",
          title: "Guide Application: B. Ramesh Babu",
          date: "Yesterday",
          data: {
            name: "B. Ramesh Babu",
            phone: "+91 98482 11992",
            city: "Visakhapatnam",
            state: "Andhra Pradesh",
            address: "Dolphin Hill Colony, Vizag",
            hiddenSpot: "Ross Hill Chapel sunset vantage overlooking harbor mouth",
            bio: "Certified local storyteller with 10+ years experience",
            status: "Pending Review",
          }
        },
        {
          formType: "Surprise Event Form",
          title: "Surprise Event: Vikram & Ananya",
          date: "2 days ago",
          data: {
            client: "Vikram Sharma",
            phone: "+91 98480 99881",
            surprisePerson: "Ananya",
            destination: "Visakhapatnam Beach & Dolphin Nose",
            details: "Private cliffside seafood dinner with carnatic veena artist",
            budget: "₹18,000",
            status: "Contacted (Agreed: ₹16,500)",
          }
        }
      );
    }
    return list;
  });

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
            <FileText className="w-5 h-5 text-primary" /> Centralized User Forms & Intake Repository
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review completed traveler safety forms, guide licensing questionnaires, and custom event requests
          </p>
        </div>
        <span className="px-3 py-1 rounded-xl bg-primary/10 text-primary font-bold text-xs">
          {formsList.length} Total Forms Submitted
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {formsList.map((f, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col justify-between space-y-3 text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase text-[10px]">
                  {f.formType}
                </span>
                <span className="text-muted-foreground text-[11px]">{f.date}</span>
              </div>
              <h4 className="font-bold text-sm text-foreground">{f.title}</h4>
              <p className="text-muted-foreground text-[11px] line-clamp-2">
                {JSON.stringify(f.data).replace(/[{}"_]/g, " ").slice(0, 140)}...
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedForm(f)}
              className="w-full py-2 rounded-xl bg-card border border-border hover:bg-muted font-bold text-foreground flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-primary" /> View Full Form Details
            </button>
          </div>
        ))}
      </div>

      {/* Form Details Modal */}
      {selectedForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card rounded-3xl border border-border p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase text-[10px]">
                  {selectedForm.formType}
                </span>
                <h4 className="font-bold text-base text-foreground mt-1">{selectedForm.title}</h4>
              </div>
              <button type="button" onClick={() => setSelectedForm(null)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(selectedForm.data || {}).map(([key, val]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1 border-b border-border/50">
                  <span className="font-bold capitalize text-foreground">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-muted-foreground text-right">{String(val)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedForm(null)}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold"
              >
                Close Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- E. TODO MODULE ---
function TodoModule() {
  const [todos, setTodos] = useState(getTodos());
  const [newTitle, setNewTitle] = useState("");
  const [dept, setDept] = useState("Hotel Operations");
  const [priority, setPriority] = useState("High");
  const [assignedTo, setAssignedTo] = useState("Ramesh Verma");

  function handleAddTodo(e) {
    e.preventDefault();
    if (!newTitle) return;

    const newT = {
      id: `TODO-${Date.now()}`,
      title: newTitle,
      department: dept,
      priority,
      assignedTo,
      dueDate: "Today",
      completed: false,
    };

    const updated = [newT, ...todos];
    setTodos(updated);
    saveTodos(updated);
    setNewTitle("");
  }

  function toggleComplete(id) {
    const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTodos(updated);
    saveTodos(updated);
  }

  function deleteTodo(id) {
    const updated = todos.filter(t => t.id !== id);
    setTodos(updated);
    saveTodos(updated);
  }

  const activeTodos = todos.filter(t => !t.completed);

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
            <CheckSquare className="w-5 h-5 text-primary" /> Active Operations TODO Board
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time operational tasks, hotel verifications, urgent traveler assistance & employee delegations
          </p>
        </div>
        <span className="px-3 py-1 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-xs">
          {activeTodos.length} Pending Tasks
        </span>
      </div>

      {/* Add New TODO Input Bar */}
      <form onSubmit={handleAddTodo} className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col md:flex-row items-center gap-2.5 text-xs">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter new operational task or directive..."
          className="flex-1 w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
          required
        />
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none w-full md:w-auto"
        >
          <option value="Hotel Operations">Hotel Ops</option>
          <option value="Guide Coordinator Desk">Guide Desk</option>
          <option value="Safety & Emergency Response">Safety SOS</option>
          <option value="Artisans & Handloom">Artisans</option>
          <option value="Event / Surprise Planner">Surprise Planner</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none w-full md:w-auto"
        >
          <option value="High">High Priority</option>
          <option value="Urgent">Urgent</option>
          <option value="Medium">Medium</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shrink-0 shadow-xs hover:opacity-90 w-full md:w-auto"
        >
          Add Task
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-2.5">
        {activeTodos.map((t) => (
          <div
            key={t.id}
            className="p-3.5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleComplete(t.id)}
                className="w-5 h-5 rounded-lg border-2 border-muted-foreground flex items-center justify-center hover:border-primary"
              >
                {t.completed && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
              <div>
                <p className="font-bold text-foreground">{t.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t.department} · Assigned to: <strong className="text-foreground">{t.assignedTo}</strong> · {t.dueDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                t.priority === "Urgent" ? "bg-destructive text-destructive-foreground" :
                t.priority === "High" ? "bg-amber-500/15 text-amber-700 dark:text-amber-300" :
                "bg-muted text-muted-foreground"
              }`}>
                {t.priority}
              </span>
              <button
                type="button"
                onClick={() => deleteTodo(t.id)}
                className="p-1 rounded-lg text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {activeTodos.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-xs">
            🎉 All operational TODO items completed!
          </div>
        )}
      </div>
    </div>
  );
}

// --- F. COMPLETED MODULE ---
function CompletedModule() {
  const [todos, setTodos] = useState(getTodos());
  const completedList = todos.filter(t => t.completed);

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Completed Operational Archives
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit history of fulfilled tasks, verified registrations, executed surprises and resolved emergencies
          </p>
        </div>
        <span className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
          {completedList.length} Archived & Fulfilled
        </span>
      </div>

      <div className="space-y-3">
        {completedList.map((t) => (
          <div
            key={t.id}
            className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <p className="font-bold text-foreground line-through opacity-80">{t.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  Fulfilled by: <strong className="text-foreground">{t.assignedTo}</strong> ({t.department})
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 font-bold text-[10px]">
              Archived
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// 2. GUIDE COORDINATOR DASHBOARD (Requested: New Guides, Assigned, Offline, Free)
// =========================================================================
function GuideCoordinatorDashboard() {
  const [guideTab, setGuideTab] = useState("new_guides"); // new_guides, assigned, offline, free

  // New Guides submitted from Footer Form
  const [newGuides, setNewGuides] = useState(() => {
    try {
      const s = localStorage.getItem("by-guide-applications");
      if (s) return JSON.parse(s);
    } catch (e) {}
    return [
      {
        id: "GD-APP-01",
        name: "B. Ramesh Babu",
        phone: "+91 98482 11992",
        city: "Visakhapatnam",
        state: "Andhra Pradesh",
        address: "Dolphin Hill Colony, Vizag",
        hiddenSpot: "Ross Hill Chapel sunset vantage overlooking harbor mouth",
        profile: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        bio: "Certified local storyteller with 10+ years experience guiding Buddhist Thotlakonda & coastal heritage trails.",
        status: "Pending Review",
        date: "Today, 10:30 AM",
      },
      {
        id: "GD-APP-02",
        name: "V. Sai Krishna",
        phone: "+91 94401 22334",
        city: "Tirupati",
        state: "Andhra Pradesh",
        address: "Alipiri Foothills, Tirupati",
        hiddenSpot: "Silathoranam natural rock arch geological secret passage",
        profile: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
        bio: "Spiritual heritage guide fluent in Telugu, Tamil, Hindi and English.",
        status: "Pending Review",
        date: "Yesterday",
      }
    ];
  });

  // Assigned Guides
  const [assignedGuides, setAssignedGuides] = useState([
    { id: "G-101", name: "Suresh Babu", badge: "ASI-AP-849", city: "Visakhapatnam", langs: "Telugu, Hindi, English", rating: 4.9, assignedToGroup: "Rao Family (4 tourists) — Borra Caves & Araku Trail", status: "Active with Group" },
    { id: "G-102", name: "Mirza Farooq", badge: "ASI-TS-219", city: "Hyderabad", langs: "Urdu, Telugu, Hindi, English", rating: 4.95, assignedToGroup: "Cultural Travelers (6 tourists) — Golconda Sunset Acoustic Tour", status: "Active with Group" },
  ]);

  // Offline Guides
  const [offlineGuides, setOfflineGuides] = useState([
    { id: "G-103", name: "Rajendra Sharma", badge: "ASI-UP-102", city: "Agra", langs: "English, French, Hindi", rating: 4.9, reason: "Scheduled Weekly Off / Leave", status: "Offline" },
    { id: "G-104", name: "Devendra Joshi", badge: "ASI-MH-404", city: "Aurangabad", langs: "Marathi, Hindi, English", rating: 4.8, reason: "Cave Route Maintenance", status: "Offline" },
  ]);

  // Free / Available Guides
  const [freeGuides, setFreeGuides] = useState([
    { id: "G-105", name: "Meenakshi Sundaram", badge: "ASI-AP-311", city: "Tirupati", langs: "Tamil, Telugu, English", rating: 4.88, ratePerDay: "₹1,200", status: "Free & Ready" },
    { id: "G-106", name: "Sunil Narang", badge: "ASI-DL-512", city: "Delhi", langs: "Hindi, English, Spanish", rating: 4.92, ratePerDay: "₹1,500", status: "Free & Ready" },
    { id: "G-107", name: "K. Satyanarayana", badge: "ASI-AP-774", city: "Vijayawada", langs: "Telugu, Hindi", rating: 4.85, ratePerDay: "₹1,000", status: "Free & Ready" },
  ]);

  function approveGuide(appId) {
    const app = newGuides.find(g => g.id === appId);
    if (!app) return;

    // Move to Free Guides with official badge
    const newLicensedGuide = {
      id: `G-${Math.floor(100 + Math.random() * 900)}`,
      name: app.name,
      badge: `ASI-${app.state.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      city: app.city,
      langs: "Telugu, Hindi, English",
      rating: 5.0,
      ratePerDay: "₹1,200",
      status: "Free & Ready",
    };

    setFreeGuides([newLicensedGuide, ...freeGuides]);
    const updatedApps = newGuides.map(g => g.id === appId ? { ...g, status: "Approved & Licensed" } : g);
    setNewGuides(updatedApps);
    localStorage.setItem("by-guide-applications", JSON.stringify(updatedApps));
    alert(`Guide ${app.name} approved! Assigned badge ${newLicensedGuide.badge} and added to Free Guides roster.`);
  }

  function rejectGuide(appId) {
    const updatedApps = newGuides.map(g => g.id === appId ? { ...g, status: "Rejected" } : g);
    setNewGuides(updatedApps);
    localStorage.setItem("by-guide-applications", JSON.stringify(updatedApps));
  }

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
            <Users className="w-5 h-5 text-primary" /> Licensed Guide Coordinator Roster
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review new guide applications from website footer, oversee active allocations, offline schedules & free guides
          </p>
        </div>

        {/* Sub-module navigation tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border text-xs">
          {[
            { id: "new_guides", label: "New Guides", count: newGuides.filter(g => g.status === "Pending Review").length },
            { id: "assigned", label: "Assigned", count: assignedGuides.length },
            { id: "offline", label: "Offline", count: offlineGuides.length },
            { id: "free", label: "Free Guides", count: freeGuides.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setGuideTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                guideTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-md bg-card/60 text-[10px] font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. NEW GUIDES (From Footer Form) */}
      {guideTab === "new_guides" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              Incoming Guide Applications (Website Footer Form Submissions)
            </span>
          </div>

          <div className="grid gap-4">
            {newGuides.map((g) => (
              <div key={g.id} className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={g.profile || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                      alt={g.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-border shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground">{g.name}</h4>
                        <span className="font-mono text-muted-foreground">({g.id})</span>
                      </div>
                      <p className="text-muted-foreground">
                        📍 {g.city}, {g.state} · 📞 <strong className="text-foreground">{g.phone}</strong>
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full font-bold self-start ${
                    g.status === "Pending Review" ? "bg-amber-500/15 text-amber-700 dark:text-amber-300" :
                    g.status.includes("Approved") ? "bg-emerald-500/15 text-emerald-600" :
                    "bg-destructive/15 text-destructive"
                  }`}>
                    {g.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Residential Address:</strong> {g.address}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    🌟 <strong className="text-foreground">Hidden Heritage Spot to Showcase:</strong> "{g.hiddenSpot}"
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    📝 <strong className="text-foreground">Guide Experience & Profile:</strong> {g.bio}
                  </p>
                </div>

                {g.status === "Pending Review" && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => rejectGuide(g.id)}
                      className="px-4 py-1.5 rounded-xl bg-destructive/10 text-destructive font-bold hover:bg-destructive/20"
                    >
                      Reject Application
                    </button>
                    <button
                      type="button"
                      onClick={() => approveGuide(g.id)}
                      className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm"
                    >
                      Approve & Issue ASI License
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ASSIGNED GUIDES */}
      {guideTab === "assigned" && (
        <div className="space-y-3 text-xs">
          {assignedGuides.map((g) => (
            <div key={g.id} className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-foreground">{g.name}</h4>
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono font-bold text-[10px]">
                    {g.badge}
                  </span>
                  <span className="text-amber-500 font-bold">★ {g.rating}</span>
                </div>
                <p className="text-muted-foreground">
                  Base: {g.city} · Languages: {g.langs}
                </p>
                <p className="font-semibold text-primary">
                  🎯 Currently Guiding: {g.assignedToGroup}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-600 font-bold self-start sm:self-auto">
                {g.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 3. OFFLINE GUIDES */}
      {guideTab === "offline" && (
        <div className="space-y-3 text-xs">
          {offlineGuides.map((g) => (
            <div key={g.id} className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-foreground">{g.name}</h4>
                  <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono font-bold text-[10px]">
                    {g.badge}
                  </span>
                </div>
                <p className="text-muted-foreground">{g.city} · Reason: {g.reason}</p>
              </div>

              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground font-bold">
                {g.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 4. FREE GUIDES */}
      {guideTab === "free" && (
        <div className="space-y-3 text-xs">
          {freeGuides.map((g) => (
            <div key={g.id} className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-foreground">{g.name}</h4>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 font-mono font-bold text-[10px]">
                    {g.badge}
                  </span>
                  <span className="text-amber-500 font-bold">★ {g.rating}</span>
                </div>
                <p className="text-muted-foreground">
                  Base: {g.city} · Tariff: <strong className="text-foreground">{g.ratePerDay}/day</strong> · Languages: {g.langs}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                  Available
                </span>
                <button
                  type="button"
                  onClick={() => alert(`Allocating ${g.name} to next incoming itinerary booking!`)}
                  className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold"
                >
                  Allocate Tour
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 3. SURPRISE PLANNER DASHBOARD (Requested: Employees & Forms Modules)
// =========================================================================
function SurprisePlannerDashboard() {
  const [tab, setTab] = useState("forms"); // forms, employees
  const [agreedPriceModal, setAgreedPriceModal] = useState(null);
  const [priceInput, setPriceInput] = useState("");

  // Surprise Planner Employees
  const [employees, setEmployees] = useState([
    { id: "SURP-EMP-01", name: "Priya Sundaram", role: "Lead Surprise Architect", phone: "+91 94401 77882", activeSurprises: 2, status: "On Duty" },
    { id: "SURP-EMP-02", name: "Karan Johar Rathore", role: "Cliffside Dinner & Decor Coordinator", phone: "+91 98480 33221", activeSurprises: 1, status: "Active" },
    { id: "SURP-EMP-03", name: "Sita Mahalakshmi", role: "Royal Chariot & Temple Seva Liaison", phone: "+91 99881 44556", activeSurprises: 0, status: "Available" },
  ]);

  // Surprise Inbound Forms
  const [requests, setRequests] = useState(() => {
    try {
      const s = localStorage.getItem("by-event-requests");
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      { 
        id: "SURP-101", 
        client: "Vikram Sharma", 
        phone: "+91 98480 12345", 
        surprisePerson: "Ananya", 
        destination: "Visakhapatnam Beach & Dolphin Nose", 
        details: "Private cliffside Andhra seafood candle-lit dinner with carnatic veena artist at sunset", 
        budget: "₹18,000", 
        agreedPrice: "₹16,500", 
        status: "Contacted", 
        feedback: "Amazing experience! The veena player was magical.", 
        rating: 5 
      },
      { 
        id: "SURP-102", 
        client: "Rohan Kapoor", 
        phone: "+91 98110 44219", 
        surprisePerson: "Sneha", 
        destination: "Taj Falaknuma Palace, Hyderabad", 
        details: "Royal horse chariot arrival with Nizam royal tea degustation & private photographer", 
        budget: "₹45,000", 
        agreedPrice: "Pending discussion", 
        status: "New Form Submitted", 
        feedback: null, 
        rating: null 
      },
      { 
        id: "SURP-103", 
        client: "Sita Mahalakshmi", 
        phone: "+91 94401 99882", 
        surprisePerson: "Grandmother (75th Birthday)", 
        destination: "Tirumala Special Darshan", 
        details: "Wheelchair assistance throughout temple corridor & customized Satvik laddu prasadam box", 
        budget: "₹12,000", 
        agreedPrice: "₹11,000", 
        status: "Completed", 
        feedback: "Grandmother was thrilled with the smooth darshan!", 
        rating: 5 
      },
    ];
  });

  function openAgreedPrice(req) {
    setAgreedPriceModal(req);
    setPriceInput(req.agreedPrice && req.agreedPrice !== "Pending discussion" ? req.agreedPrice.replace(/[^0-9]/g, "") : "15000");
  }

  function saveAgreedPrice(e) {
    e.preventDefault();
    if (!agreedPriceModal) return;

    const formattedPrice = `₹${Number(priceInput).toLocaleString("en-IN")}`;
    const updated = requests.map(r => {
      if (r.id === agreedPriceModal.id) {
        return {
          ...r,
          agreedPrice: formattedPrice,
          status: "Contacted (Agreed Price Confirmed)",
        };
      }
      return r;
    });

    setRequests(updated);
    localStorage.setItem("by-event-requests", JSON.stringify(updated));

    // Also sync to user surprises so user Profile immediately reflects this
    try {
      const userSurp = JSON.parse(localStorage.getItem("by-user-surprises") || "[]");
      const updatedUserSurp = userSurp.map(s => {
        if (s.id === agreedPriceModal.id || s.client === agreedPriceModal.client) {
          return { ...s, agreedPrice: formattedPrice, status: "Contacted (Agreed Price Confirmed)" };
        }
        return s;
      });
      localStorage.setItem("by-user-surprises", JSON.stringify(updatedUserSurp));
    } catch (err) {}

    setAgreedPriceModal(null);
    alert(`Agreed price of ${formattedPrice} confirmed for ${agreedPriceModal.client}! Automatically synced to traveler's profile.`);
  }

  function markCompleted(id) {
    const updated = requests.map(r => r.id === id ? { ...r, status: "Completed" } : r);
    setRequests(updated);
    localStorage.setItem("by-event-requests", JSON.stringify(updated));
  }

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
            <Gift className="w-5 h-5 text-amber-500" /> Surprise / Event Planner Command
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage custom event forms, negotiate traveler prices, assign execution staff and review guest ratings
          </p>
        </div>

        {/* Tab switcher: Forms vs Employees */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border text-xs">
          <button
            type="button"
            onClick={() => setTab("forms")}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
              tab === "forms" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            Custom Event Forms ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("employees")}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
              tab === "employees" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            Execution Employees ({employees.length})
          </button>
        </div>
      </div>

      {/* 1. FORMS SUB-MODULE */}
      {tab === "forms" && (
        <div className="space-y-4">
          <div className="space-y-3.5">
            {requests.map((r) => (
              <div key={r.id} className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold uppercase text-[10px]">
                      Surprise For: {r.surprisePerson || "Special Someone"}
                    </span>
                    <h4 className="font-bold text-sm text-foreground">{r.client}</h4>
                    <span className="font-mono text-muted-foreground">({r.id})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">User Budget: {r.budget}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                      {r.status}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Destination:</strong> {r.destination}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Event Description:</strong> {r.details}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    📞 <strong className="text-foreground">Traveler Phone:</strong> {r.phone} · 
                    💰 <strong className="text-primary font-bold">Negotiated / Agreed Price:</strong> {r.agreedPrice || "Pending call"}
                  </p>
                  {r.feedback && (
                    <div className="p-2 mt-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                      ★ {typeof r.feedback === "object" ? r.feedback.rating : (r.rating || 5)}/5 —{" "}
                      <em>"{typeof r.feedback === "object" ? (r.feedback.comment || r.feedback.text || "") : String(r.feedback)}"</em>
                      {typeof r.feedback === "object" && r.feedback.date && (
                        <span className="text-[10px] text-muted-foreground ml-2">({r.feedback.date})</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Staff Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
                  <a
                    href={`tel:${r.phone}`}
                    className="px-3 py-1.5 rounded-xl bg-card border border-border hover:bg-muted font-bold text-foreground flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-primary" /> Call Client
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openAgreedPrice(r)}
                      className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold"
                    >
                      {r.agreedPrice && r.agreedPrice !== "Pending discussion" ? "Update Agreed Price" : "Mark Contacted & Enter Agreed Price"}
                    </button>

                    {r.status !== "Completed" && (
                      <button
                        type="button"
                        onClick={() => markCompleted(r.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. EMPLOYEES SUB-MODULE */}
      {tab === "employees" && (
        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          {employees.map((emp) => (
            <div key={emp.id} className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">{emp.id}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-bold text-[10px]">
                  {emp.status}
                </span>
              </div>
              <h4 className="font-bold text-sm text-foreground">{emp.name}</h4>
              <p className="text-primary font-medium">{emp.role}</p>
              <p className="text-muted-foreground">📞 {emp.phone}</p>
              <p className="text-[11px] font-bold text-foreground">
                Active Surprises in Hand: {emp.activeSurprises}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Agreed Price Modal */}
      {agreedPriceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card rounded-3xl border border-border p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h4 className="font-bold text-base text-foreground">Set Agreed Final Price</h4>
              <button type="button" onClick={() => setAgreedPriceModal(null)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={saveAgreedPrice} className="space-y-3">
              <p className="text-muted-foreground">
                Client: <strong className="text-foreground">{agreedPriceModal.client}</strong><br />
                User's Original Budget: <strong>{agreedPriceModal.budget}</strong>
              </p>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">
                  Agreed Money Talked with Client (₹):
                </label>
                <input
                  type="number"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder="e.g. 16500"
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground font-mono font-bold text-sm outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setAgreedPriceModal(null)}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm"
                >
                  Save & Sync to User Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 4. ARTISANS & HANDLOOM DASHBOARD (Requested: Order Status Management)
// =========================================================================
function EcommerceDashboard() {
  const [activeTab, setActiveTab] = useState("orders"); // orders, products
  const [orders, setOrders] = useState(() => getOrders());

  useEffect(() => {
    function refresh() {
      setOrders(getOrders());
    }
    window.addEventListener("by-orders-updated", refresh);
    return () => window.removeEventListener("by-orders-updated", refresh);
  }, []);

  function handleStatusChange(orderId, newStatus) {
    updateOrderStatus(orderId, newStatus);
    setOrders(getOrders());
    alert(`Order #${orderId} status updated to: ${newStatus}`);
  }

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
            <ShoppingCart className="w-5 h-5 text-primary" /> Rural Artisans & Handloom Orders Desk
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage customer handloom orders, update fulfillment statuses (Cancelled, Confirmed, Packed, Out for Delivery) & track artisan payouts
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === "orders" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            Manage Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === "products" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            Handicraft Catalog
          </button>
        </div>
      </div>

      {/* 1. ORDERS STATUS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Unique Order ID</th>
                  <th className="py-3 px-4">Customer / Phone</th>
                  <th className="py-3 px-4">Craft Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status Selector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {orders.map((o) => (
                  <tr key={o.id || o.orderId} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {o.id || o.orderId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{o.name || "Customer"}</div>
                      <div className="text-[11px] text-muted-foreground">{o.phone || "+91 98480 00000"}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground max-w-xs truncate">
                        {Array.isArray(o.items) ? o.items.map(i => `${i.name} (x${i.qty})`).join(", ") : "Handcrafted Product"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      ₹{(o.total || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        o.paymentMethod === "COD" ? "bg-amber-500/15 text-amber-700" : "bg-emerald-500/15 text-emerald-600"
                      }`}>
                        {o.paymentMethod || "Online Gateway"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={o.status || "Confirmed"}
                        onChange={(e) => handleStatusChange(o.id || o.orderId, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs border outline-none cursor-pointer ${
                          o.status === "Cancelled" ? "bg-destructive/15 text-destructive border-destructive/30" :
                          o.status === "Out for Delivery" ? "bg-purple-500/15 text-purple-600 border-purple-500/30" :
                          o.status === "Delivered" ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" :
                          o.status === "Packed" ? "bg-blue-500/15 text-blue-600 border-blue-500/30" :
                          "bg-amber-500/15 text-amber-700 border-amber-500/30"
                        }`}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-xs">
              No orders placed yet. Orders from the Shop checkout will appear here in real-time.
            </div>
          )}
        </div>
      )}

      {/* 2. CATALOG TAB */}
      {activeTab === "products" && (
        <div className="space-y-4 text-xs">
          <p className="text-muted-foreground">
            Rural artisan GI craft inventory managed directly from state weaver clusters:
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {initialDefaultProducts.slice(0, 6).map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2">
                <img src={p.image} alt={p.name} className="w-full h-32 rounded-xl object-cover" />
                <h4 className="font-bold text-foreground">{p.name}</h4>
                <p className="text-muted-foreground text-[11px]">{p.origin} · {p.craftCategory || "Handloom"}</p>
                <p className="font-mono font-bold text-primary">₹{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 5. VOLUNTEER PORTAL DASHBOARD (Requested: State-wise info & Emergency Chat)
// =========================================================================
function VolunteerPortalDashboard() {
  const [selectedState, setSelectedState] = useState("Andhra Pradesh");
  const [volunteers, setVolunteers] = useState(getVolunteers());
  const [messages, setMessages] = useState(getVolunteerChatMessages());
  const [chatInput, setChatInput] = useState("");
  const [myStateTag, setMyStateTag] = useState("Andhra Pradesh");

  const indianStates = [
    "Andhra Pradesh",
    "Telangana",
    "Uttar Pradesh",
    "Rajasthan",
    "Delhi",
    "Karnataka",
    "Maharashtra",
    "Tamil Nadu",
    "West Bengal",
    "Kerala",
    "Gujarat"
  ];

  useEffect(() => {
    function refreshChat() {
      setMessages(getVolunteerChatMessages());
    }
    window.addEventListener("by-volunteer-chat-updated", refreshChat);
    return () => window.removeEventListener("by-volunteer-chat-updated", refreshChat);
  }, []);

  const stateVolunteers = volunteers.filter(v => v.state === selectedState);

  function handleSendMessage(e) {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sendVolunteerChatMessage({
      sender: "State Coordinator (Admin)",
      role: "Coordinator",
      state: myStateTag,
      text: chatInput,
      priority: "Normal",
    });
    setChatInput("");
  }

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
            <Users className="w-5 h-5 text-primary" /> National Heritage Volunteer Network & Rapid Dispatch
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            State-wise verified community volunteers and 24/7 volunteer emergency broadcast group chat
          </p>
        </div>

        {/* State Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Select State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-background border border-border text-foreground text-xs font-bold outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {indianStates.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: State-wise Volunteers List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Verified Volunteers in {selectedState} ({stateVolunteers.length})
            </h4>
            <span className="text-[11px] text-emerald-600 font-bold">24/7 Field Ready</span>
          </div>

          <div className="space-y-3">
            {stateVolunteers.map((vol) => (
              <div key={vol.id} className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-sm text-foreground">{vol.name}</h5>
                    <p className="text-muted-foreground font-semibold">📍 {vol.city}, {vol.state}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                    {vol.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-card border border-border space-y-1">
                  <p className="text-foreground font-medium">
                    🛡️ <strong className="text-primary">Emergency Role:</strong> {vol.emergencyRole}
                  </p>
                  <p className="text-muted-foreground">
                    🗣️ <strong className="text-foreground">Skills / Languages:</strong> {vol.specialization}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-muted-foreground">{vol.id}</span>
                  <a
                    href={`tel:${vol.phone}`}
                    className="px-3 py-1 rounded-lg bg-card border border-border hover:bg-muted font-bold text-foreground flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3 text-primary" /> {vol.phone}
                  </a>
                </div>
              </div>
            ))}

            {stateVolunteers.length === 0 && (
              <div className="p-6 text-center text-muted-foreground text-xs">
                No volunteers currently registered for {selectedState}. Community enrollment open.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Emergency Group Chat for Volunteers */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-muted/30 border border-border flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-primary" /> Volunteer Emergency Group Chat
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-card border border-border font-mono text-muted-foreground">
                Live Inter-State Desk
              </span>
            </div>

            {/* Chat Message Scroll */}
            <div className="space-y-3 py-3 max-h-96 overflow-y-auto pr-1">
              {messages.map((m) => (
                <div key={m.id} className="p-3 rounded-2xl bg-card border border-border space-y-1 text-xs shadow-2xs">
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-foreground">{m.sender}</strong>
                      <span className="px-1.5 py-0.2 rounded-md bg-muted text-[10px] text-muted-foreground font-mono">
                        {m.state}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-[10px]">{m.time}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {m.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="space-y-2 pt-2 border-t border-border text-xs">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Broadcast emergency advisory or coordination message..."
                className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-1 hover:opacity-90"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 6. HOTEL MANAGEMENT DASHBOARD (Full CRUD & Employee Assignments)
// =========================================================================
function HotelManagementDashboard() {
  const [hotels, setHotels] = useState(() => getSavedHotels());
  const [employees, setEmployees] = useState(() => getSubEmployees());
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedHotelForAssign, setSelectedHotelForAssign] = useState(null);
  const [assignedEmployeeId, setAssignedEmployeeId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    district: "Visakhapatnam",
    location: "",
    classification: "Luxury 5-Star",
    tariffRange: "₹8,500 - ₹14,000",
    price: 8500,
    rating: 4.8,
    phone: "+91-",
    primaryFacilities: "Free Wi-Fi, Multi-cuisine Dining, Swimming Pool, 24/7 Room Service, Concierge",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    description: "Ministry of Tourism certified luxury hospitality partner for heritage circuits.",
    verifiedGovtRegistry: true,
    assignedEmployee: "",
  });

  useEffect(() => {
    function handleUpdate() {
      setHotels(getSavedHotels());
      setEmployees(getSubEmployees());
    }
    window.addEventListener("by-hotels-updated", handleUpdate);
    window.addEventListener("by-employees-updated", handleUpdate);
    return () => {
      window.removeEventListener("by-hotels-updated", handleUpdate);
      window.removeEventListener("by-employees-updated", handleUpdate);
    };
  }, []);

  function openAddModal() {
    setEditingHotel(null);
    setFormData({
      name: "",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      district: "Visakhapatnam",
      location: "",
      classification: "Luxury 5-Star",
      tariffRange: "₹8,500 - ₹14,000",
      price: 8500,
      rating: 4.8,
      phone: "+91-",
      primaryFacilities: "Free Wi-Fi, Multi-cuisine Dining, Swimming Pool, 24/7 Room Service, Concierge",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
      description: "Ministry of Tourism certified luxury hospitality partner for heritage circuits.",
      verifiedGovtRegistry: true,
      assignedEmployee: "",
    });
    setModalOpen(true);
  }

  function openEditModal(hotel) {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name || "",
      city: hotel.city || "Visakhapatnam",
      state: hotel.state || "Andhra Pradesh",
      district: hotel.district || hotel.city || "Visakhapatnam",
      location: hotel.location || "",
      classification: hotel.classification || "Luxury 5-Star",
      tariffRange: hotel.tariffRange || `₹${hotel.price || 5000} per night`,
      price: hotel.price || 5000,
      rating: hotel.rating || 4.5,
      phone: hotel.phone || "+91-",
      primaryFacilities: hotel.primaryFacilities || "Free Wi-Fi, Dining, 24/7 Service",
      image: hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
      description: hotel.description || "",
      verifiedGovtRegistry: hotel.verifiedGovtRegistry !== false,
      assignedEmployee: hotel.assignedEmployee || "",
    });
    setModalOpen(true);
  }

  function handleSaveHotel(e) {
    e.preventDefault();
    if (!formData.name || !formData.city) return;

    let updated;
    if (editingHotel) {
      updated = hotels.map((h) =>
        h.id === editingHotel.id
          ? {
              ...h,
              ...formData,
              price: Number(formData.price) || 5000,
              rating: Number(formData.rating) || 4.5,
            }
          : h
      );
    } else {
      const newHotel = {
        id: `ht-${Date.now()}`,
        ...formData,
        price: Number(formData.price) || 5000,
        rating: Number(formData.rating) || 4.5,
        reviewsCount: 1,
      };
      updated = [newHotel, ...hotels];
    }

    setHotels(updated);
    saveHotels(updated);
    setModalOpen(false);
  }

  function handleDeleteHotel(id) {
    if (!confirm("Are you sure you want to remove this hotel from the directory?")) return;
    const updated = hotels.filter((h) => h.id !== id);
    setHotels(updated);
    saveHotels(updated);
  }

  function openAssignModal(hotel) {
    setSelectedHotelForAssign(hotel);
    const existingEmp = employees.find((e) => e.assignedHotel === hotel.name);
    setAssignedEmployeeId(existingEmp?.id || "");
    setAssignModalOpen(true);
  }

  function handleSaveAssignment(e) {
    e.preventDefault();
    if (!selectedHotelForAssign) return;

    const selectedEmp = employees.find((e) => e.id === assignedEmployeeId);
    
    // Update hotel's assignedEmployee
    const updatedHotels = hotels.map((h) =>
      h.id === selectedHotelForAssign.id
        ? { ...h, assignedEmployee: selectedEmp ? selectedEmp.name : "" }
        : h
    );
    setHotels(updatedHotels);
    saveHotels(updatedHotels);

    // Update employee's assignedHotel
    if (selectedEmp) {
      const updatedEmps = employees.map((emp) =>
        emp.id === selectedEmp.id
          ? { ...emp, assignedHotel: selectedHotelForAssign.name, assignedTask: `Active property manager for ${selectedHotelForAssign.name}` }
          : emp
      );
      setEmployees(updatedEmps);
      saveSubEmployees(updatedEmps);
    }

    setAssignModalOpen(false);
  }

  const filtered = hotels.filter((h) => {
    const mCity = selectedCity === "all" || (h.city && h.city.toLowerCase().includes(selectedCity.toLowerCase()));
    const mSearch =
      (h.name && h.name.toLowerCase().includes(search.toLowerCase())) ||
      (h.location && h.location.toLowerCase().includes(search.toLowerCase())) ||
      (h.city && h.city.toLowerCase().includes(search.toLowerCase()));
    return mCity && mSearch;
  });

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
            <Hotel className="w-5 h-5 text-primary" /> Verified Hotel Operations & Staff Assignments
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ministry of Tourism accredited properties across Andhra Pradesh, Telangana, and national circuits. Add, edit, and assign employees directly.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Hotel
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="w-full sm:w-64 relative">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hotel, city, or address..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border outline-none focus:ring-1 focus:ring-primary text-foreground"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {["all", "Visakhapatnam", "Hyderabad", "Tirupati", "Vijayawada", "Delhi", "Agra", "Jaipur", "Varanasi"].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 rounded-full capitalize shrink-0 font-bold ${
                selectedCity === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-semibold uppercase text-[11px]">
              <th className="py-3 px-4">Property Name</th>
              <th className="py-3 px-4">City / State</th>
              <th className="py-3 px-4">Classification</th>
              <th className="py-3 px-4">Base Tariff</th>
              <th className="py-3 px-4">Assigned Staff</th>
              <th className="py-3 px-4">Compliance</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((h) => {
              const assignedStaff = employees.find((e) => e.assignedHotel === h.name || h.assignedEmployee === e.name);
              return (
                <tr key={h.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={h.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&auto=format&fit=crop&q=80"}
                        alt={h.name}
                        className="w-10 h-10 rounded-lg object-cover border border-border shrink-0"
                      />
                      <div>
                        <div className="font-bold text-foreground">{h.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-xs">{h.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-foreground font-medium">
                    {h.city}, {h.state}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[10px]">
                      {h.classification || "Standard"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    ₹{(h.price || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4">
                    {assignedStaff ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 font-bold text-[10px] flex items-center gap-1 w-fit">
                        <Briefcase className="w-3 h-3" /> {assignedStaff.name}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openAssignModal(h)}
                        className="text-[10px] text-muted-foreground hover:text-primary font-semibold underline cursor-pointer"
                      >
                        + Assign Staff
                      </button>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                      NIDHI Verified
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openAssignModal(h)}
                        className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground"
                        title="Assign Staff / Sub-Employee"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(h)}
                        className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground"
                        title="Edit Hotel"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteHotel(h.id)}
                        className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                        title="Delete Hotel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Hotel Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-card rounded-3xl border border-border p-6 shadow-2xl space-y-4 text-xs my-8">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <Hotel className="w-4 h-4 text-primary" /> {editingHotel ? "Edit Hotel Property" : "Add Government Recognized Hotel"}
              </h4>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSaveHotel} className="space-y-3">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Hotel / Resort Name:</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Gateway Beachfront Resort"
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">City:</label>
                  <input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Visakhapatnam"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">State:</label>
                  <input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Andhra Pradesh"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Location / Address / Landmark:</label>
                <input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Beach Road, Maharani Peta, Visakhapatnam"
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Classification:</label>
                  <select
                    value={formData.classification}
                    onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                  >
                    <option value="Luxury Beachfront 5-Star">Luxury Beachfront 5-Star</option>
                    <option value="Luxury 5-Star">Luxury 5-Star</option>
                    <option value="Heritage Palace 5-Star">Heritage Palace 5-Star</option>
                    <option value="Premium 4-Star">Premium 4-Star</option>
                    <option value="APTDC Haritha Heritage">APTDC Haritha Heritage</option>
                    <option value="Boutique Stay">Boutique Stay</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Tariff Per Night (₹):</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="8500"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Star Rating (1-5):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Official Contact Phone:</label>
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91-891-2822222"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Assign Staff Member:</label>
                  <select
                    value={formData.assignedEmployee}
                    onChange={(e) => setFormData({ ...formData, assignedEmployee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                  >
                    <option value="">-- No Employee Assigned --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Key Facilities (comma separated):</label>
                <input
                  value={formData.primaryFacilities}
                  onChange={(e) => setFormData({ ...formData, primaryFacilities: e.target.value })}
                  placeholder="Infinity Pool, Sea View Rooms, Jiva Spa, Multi-cuisine Dining"
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Image URL:</label>
                <input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief property overview and heritage circuit proximity..."
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm"
                >
                  {editingHotel ? "Update Hotel" : "Save Hotel to Registry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Employee to Hotel Modal */}
      {assignModalOpen && selectedHotelForAssign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-3xl border border-border p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" /> Assign Staff to {selectedHotelForAssign.name}
              </h4>
              <button type="button" onClick={() => setAssignModalOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-4">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1.5">Select Team Employee:</label>
                <select
                  value={assignedEmployeeId}
                  onChange={(e) => setAssignedEmployeeId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">-- Remove / No Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} — {emp.department} ({emp.role}) [{emp.status}]
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Assigning an employee will designate them as the on-site hospitality manager for VIP guest arrivals, itinerary coordination, and room quality inspections at this property.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold"
                >
                  Confirm Staff Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 7. SITE MANAGER DASHBOARD
// =========================================================================
function SiteManagerDashboard() {
  const sites = [
    { name: "Taj Mahal (East Gate)", city: "Agra", capacity: 85, status: "High Density", dailyFootfall: "24,800" },
    { name: "Borra Caves", city: "Visakhapatnam", capacity: 54, status: "Moderate", dailyFootfall: "4,200" },
    { name: "Charminar & Laad Bazaar", city: "Hyderabad", capacity: 68, status: "Moderate", dailyFootfall: "12,600" },
  ];

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
          <Landmark className="w-5 h-5 text-primary" /> Monument Site Manager & Crowd Density
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time turnstile counts & ASI archaeological preservation alerts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {sites.map((s) => (
          <div key={s.name} className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground">{s.name}</h4>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                s.capacity > 75 ? "bg-destructive/15 text-destructive" : "bg-emerald-500/15 text-emerald-600"
              }`}>
                {s.status} ({s.capacity}%)
              </span>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${s.capacity > 75 ? "bg-destructive" : "bg-primary"}`} 
                  style={{ width: `${s.capacity}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Footfall: {s.dailyFootfall}</span>
                <span>Gate: Normal</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// 8. SAFETY COMMAND DASHBOARD (Stand-alone view)
// =========================================================================
function SafetyCommandDashboard() {
  return <EmergencyModule />;
}

// =========================================================================
// 9. LEADERBOARD DASHBOARD
// =========================================================================
function LeaderboardDashboard() {
  const topGuides = [
    { rank: 1, name: "Mirza Farooq", badge: "ASI-TS-219", city: "Hyderabad", rating: 4.98, tours: 320 },
    { rank: 2, name: "Suresh Babu", badge: "ASI-AP-849", city: "Visakhapatnam", rating: 4.92, tours: 142 },
    { rank: 3, name: "Rajendra Sharma", badge: "ASI-UP-102", city: "Agra", rating: 4.90, tours: 410 },
  ];

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
          <Award className="w-5 h-5 text-amber-500" /> Bharat Yatra Excellence Leaderboard
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Recognizing top-performing ASI licensed guides & master craft clusters
        </p>
      </div>

      <div className="space-y-2">
        {topGuides.map((g) => (
          <div key={g.name} className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold grid place-items-center text-xs">
                {g.rank}
              </span>
              <div>
                <p className="font-bold text-foreground">{g.name}</p>
                <p className="text-[11px] text-muted-foreground">{g.city} · {g.badge}</p>
              </div>
            </div>
            <span className="text-amber-500 font-bold">★ {g.rating} ({g.tours} tours)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
