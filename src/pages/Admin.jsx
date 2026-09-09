import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Shield, Settings, Users, Save, Loader2, CalendarCheck, MapPin, Clock, 
  Wallet, Hotel, ShieldAlert, Landmark, Flame, Gift, ShoppingCart, TrendingUp, 
  Award, Eye, RotateCcw 
} from "lucide-react";
import EntityEditor from "@/components/EntityEditor";
import AdminDashboards from "@/components/AdminDashboards";
import { base44 } from "@/api/base44Client";
import { heritageSites, foods as staticFoods, products as staticProducts, events as staticEvents } from "@/lib/heritageData";
import { enrichedHeritageSites } from "@/lib/richHeritageData";
import { governmentRecognizedHotels } from "@/lib/hotelDirectoryData";

// Merge enriched heritage sites with legacy heritage sites
const combinedPlaces = [...enrichedHeritageSites];
heritageSites.forEach((s) => {
  if (!combinedPlaces.some((cp) => cp.id === s.id || cp.name.toLowerCase() === s.name.toLowerCase())) {
    combinedPlaces.push({
      ...s,
      rating: 4.7,
      ticket_price: "₹25 (Indians) / ₹300 (Foreigners)",
      crowdDensity: "Moderate",
    });
  }
});

const rolesList = [
  { id: "super_admin", label: "Super Admin", icon: Shield, desc: "Full master access to all dashboards, catalog editors & site config" },
  { id: "hotel_mgmt", label: "Hotel Operations", icon: Hotel, desc: "Verified hotel inventory, room tariffs & booking synchronization" },
  { id: "safety_cmd", label: "Safety & SOS Command", icon: ShieldAlert, desc: "Live SOS beacons, tourist police dispatch & emergency response" },
  { id: "site_mgr", label: "ASI Monument Curator", icon: Landmark, desc: "Monument crowd sensors, turnstile throttling & ASI maintenance tickets" },
  { id: "devasthanam", label: "Devasthanam Desk", icon: Flame, desc: "Temple Darshan queues, Annaprasadam waiting times & special Sevas" },
  { id: "guide_coord", label: "Guide Coordinator", icon: Users, desc: "Licensed guide allocations, holographic badge compliance & reviews" },
  { id: "surprise_mgr", label: "Surprise Planner", icon: Gift, desc: "Bespoke cultural surprises, anniversaries & private sunset setups" },
  { id: "ecomm_mgr", label: "Artisan & Handloom", icon: ShoppingCart, desc: "Rural weaver payouts, GI crafts orders & India Post dispatch" },
  { id: "marketing", label: "Marketing Director", icon: TrendingUp, desc: "Footfall campaigns, festive promo codes & state reach analytics" },
  { id: "state_coord", label: "State Coordinators", icon: MapPin, desc: "District infrastructure audits & AP/Telangana tourism portals" },
  { id: "leaderboard", label: "Excellence Leaderboard", icon: Award, desc: "Top performing guides, artisan clusters & cultural ambassadors" },
];

const tabs = [
  { id: "dashboards", label: "Specialized Dashboards" },
  { id: "places", label: "Heritage Places" },
  { id: "foods", label: "Regional Foods" },
  { id: "products", label: "Artisan Crafts" },
  { id: "events", label: "Festivals & Events" },
  { id: "hotels", label: "Hotels & Stays" },
  { id: "bookings", label: "Bookings" },
  { id: "config", label: "Site Config" },
  { id: "staff", label: "Staff & Roles" },
];

const placeFields = [
  { key: "name", label: "Name", type: "text" },
  { key: "state", label: "State", type: "text" },
  { key: "tag", label: "Tag / Category", type: "text" },
  { key: "image", label: "Image URL", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "ticket_price", label: "Ticket Price (₹)", type: "text" },
  { key: "timings", label: "Visiting Timings", type: "text" },
  { key: "wiki", label: "Wiki URL", type: "text" },
  { key: "youtube", label: "YouTube URL", type: "text" },
  { key: "lat", label: "Latitude", type: "number" },
  { key: "lng", label: "Longitude", type: "number" },
];

const foodFields = [
  { key: "name", label: "Name", type: "text" },
  { key: "state", label: "State", type: "text" },
  { key: "rating", label: "Rating (1-5)", type: "number" },
  { key: "image", label: "Image URL", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
];

const productFields = [
  { key: "name", label: "Name", type: "text" },
  { key: "origin", label: "Origin / Region", type: "text" },
  { key: "rating", label: "Rating (1-5)", type: "number" },
  { key: "image", label: "Image URL", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "price", label: "Offer Price (₹)", type: "number" },
  { key: "mrp", label: "MRP (₹)", type: "number" },
];

const eventFields = [
  { key: "name", label: "Festival Name", type: "text" },
  { key: "state", label: "State", type: "text" },
  { key: "month", label: "Month / Season", type: "text" },
  { key: "image", label: "Image URL", type: "text" },
  { key: "timing", label: "Festival Timing", type: "text" },
  { key: "dress", label: "Dress Code & Attire", type: "text" },
  { key: "rules", label: "Entry Rules & Etiquette", type: "text" },
  { key: "history", label: "Cultural Significance", type: "textarea" },
];

const hotelFields = [
  { key: "name", label: "Hotel Name", type: "text" },
  { key: "city", label: "City", type: "text" },
  { key: "state", label: "State", type: "text" },
  { key: "location", label: "Location / Landmark", type: "text" },
  { key: "classification", label: "Classification (e.g. 5-Star Luxury)", type: "text" },
  { key: "price", label: "Tariff Per Night (₹)", type: "number" },
  { key: "rating", label: "Star Rating (1-5)", type: "number" },
  { key: "phone", label: "Official Contact Phone", type: "text" },
  { key: "primaryFacilities", label: "Primary Facilities", type: "text" },
  { key: "image", label: "Image URL", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
];

export default function Admin() {
  const [params, setParams] = useSearchParams();
  const initialTab = params.get("tab") === "surprise_planners" ? "dashboards" : (params.get("tab") || "dashboards");
  const [tab, setTab] = useState(initialTab);
  
  // Active simulated role
  const [activeRole, setActiveRole] = useState(params.get("tab") === "surprise_planners" ? "surprise_mgr" : "super_admin");

  function handleRoleSwitch(roleId) {
    setActiveRole(roleId);
    if (roleId === "super_admin") {
      setTab("dashboards");
    } else {
      setTab("dashboards");
    }
  }

  const currentRoleObj = rolesList.find((r) => r.id === activeRole) || rolesList[0];

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Top Banner with Role Simulator Controls */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">
                  Multi-Role Administrative Cockpit
                </h1>
              </div>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                Switch between different administrative and departmental roles to test and preview operational workflows.
              </p>
            </div>

            {/* Current simulated status tag */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Simulating: <strong>{currentRoleObj.label}</strong></span>
              </span>
              {activeRole !== "super_admin" && (
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("super_admin")}
                  className="px-3 py-1.5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Return to Super Admin mode with all capabilities"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Super Admin</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Role Simulator Bar */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between pb-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                Switch Role to Preview Dashboard:
              </span>
              <span className="text-[11px] text-muted-foreground hidden md:inline">
                {currentRoleObj.desc}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {rolesList.map((r) => {
                const Icon = r.icon;
                const isSelected = activeRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSwitch(r.id)}
                    className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold shrink-0 transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                        : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {activeRole !== "super_admin" ? (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {currentRoleObj?.icon ? (
                    <currentRoleObj.icon className="w-5 h-5" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-base text-foreground font-heading">
                      {currentRoleObj.label} Dashboard
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                      Active Perspective
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {currentRoleObj.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("super_admin")}
                  className="px-3.5 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Return to Super Admin</span>
                </button>
              </div>
            </div>

            {/* Render isolated single role dashboard */}
            <AdminDashboards 
              activeRole={activeRole} 
              onRoleChange={(r) => handleRoleSwitch(r)}
              singleRoleMode={true}
            />
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                    tab === t.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {tab === "dashboards" && (
              <AdminDashboards 
                activeRole="hotel_mgmt" 
                onRoleChange={(r) => handleRoleSwitch(r)} 
              />
            )}

        {tab === "places" && (
          <EntityEditor 
            entityName="Place" 
            fields={placeFields} 
            title="Heritage Places" 
            defaultData={combinedPlaces}
          />
        )}

        {tab === "foods" && (
          <EntityEditor 
            entityName="Food" 
            fields={foodFields} 
            title="Regional Foods" 
            defaultData={staticFoods}
          />
        )}

        {tab === "products" && (
          <EntityEditor 
            entityName="Product" 
            fields={productFields} 
            title="Artisan GI Products" 
            defaultData={staticProducts}
          />
        )}

        {tab === "events" && (
          <EntityEditor 
            entityName="Event" 
            fields={eventFields} 
            title="Festivals & Events" 
            defaultData={staticEvents}
          />
        )}

        {tab === "hotels" && (
          <EntityEditor 
            entityName="Hotel" 
            fields={hotelFields} 
            title="Government-Recognized Hotels" 
            defaultData={governmentRecognizedHotels}
          />
        )}

        {tab === "bookings" && <Bookings />}
        {tab === "config" && <SiteConfig />}
        {tab === "staff" && <Staff />}
          </>
        )}
      </section>
    </div>
  );
}

function SiteConfig() {
  const [cfg, setCfg] = useState({ heroImage: "", heroVideo: "", heroVideoUrl: "", footer: "", sosWhatsapp: "" });
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    const c = localStorage.getItem("by-site-config");
    if (c) setCfg(JSON.parse(c));
  }, []);
  function save() {
    localStorage.setItem("by-site-config", JSON.stringify(cfg));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  async function uploadVideo(file) {
    if (!file) return;
    setUploading(true);
    try {
      if (base44?.integrations?.Core?.UploadFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setCfg({ ...cfg, heroVideoUrl: file_url });
      }
    } catch (e) {
      alert("Upload failed: " + (e?.message || "try again"));
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="max-w-xl space-y-4 rounded-3xl bg-card border border-border p-6 shadow-xs">
      <h3 className="font-bold text-lg flex items-center gap-2 text-foreground font-heading">
        <Settings className="w-5 h-5 text-primary" /> Site Configuration
      </h3>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">Hero photo URL</label>
        <input value={cfg.heroImage} onChange={(e) => setCfg({ ...cfg, heroImage: e.target.value })} className="by-input" placeholder="https://…" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">Hero video — upload your own (MP4)</label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => uploadVideo(e.target.files?.[0])}
            className="text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer"
          />
          {uploading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
        </div>
        {cfg.heroVideoUrl && (
          <p className="text-xs text-emerald-600 mt-1.5 break-all">✓ Uploaded: {cfg.heroVideoUrl.slice(0, 60)}…</p>
        )}
      </div>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">Hero video (YouTube ID — used if no upload)</label>
        <input value={cfg.heroVideo} onChange={(e) => setCfg({ ...cfg, heroVideo: e.target.value })} className="by-input" placeholder="p8mXAQ6cPxg" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">Footer text</label>
        <input value={cfg.footer} onChange={(e) => setCfg({ ...cfg, footer: e.target.value })} className="by-input" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">SOS WhatsApp community link</label>
        <input value={cfg.sosWhatsapp} onChange={(e) => setCfg({ ...cfg, sosWhatsapp: e.target.value })} className="by-input" placeholder="https://chat.whatsapp.com/…" />
      </div>
      <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-90">
        <Save className="w-4 h-4" /> Save Configuration
      </button>
      {saved && <p className="text-xs text-emerald-600 font-semibold">✓ Configuration saved successfully.</p>}
      <style>{`.by-input{width:100%;padding:.55rem .75rem;border-radius:.8rem;border:1px solid hsl(var(--border));background:hsl(var(--background));color:hsl(var(--foreground));font-size:.85rem;outline:none}.by-input:focus{border-color:hsl(var(--primary))}`}</style>
    </div>
  );
}

function Staff() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const roles = ["admin", "guide", "vendor", "devasthanam_admin", "hotel_owner", "safety_officer", "volunteer", "user"];

  async function load() {
    setLoading(true);
    try {
      if (base44?.entities?.User?.list) {
        const list = await base44.entities.User.list();
        setUsers(list || []);
      } else {
        setUsers([
          { id: "u1", full_name: "Super Administrator (Ministry)", email: "admin@bharatyatra.gov.in", role: "admin" },
          { id: "u2", full_name: "Inspector Rajesh Kumar (Tourist Police)", email: "police.vizag@bharatyatra.gov.in", role: "safety_officer" },
          { id: "u3", full_name: "K. Venkatesh (Certified ASI Guide)", email: "venkatesh.guide@bharatyatra.gov.in", role: "guide" },
          { id: "u4", full_name: "Suresh Reddy (Varun Beach Novotel)", email: "gm@novotelvizag.com", role: "hotel_owner" },
          { id: "u5", full_name: "Simhachalam Devasthanam Desk", email: "trust@simhachalam.org", role: "devasthanam_admin" },
        ]);
      }
    } catch (e) {
      setUsers([
        { id: "u1", full_name: "Super Administrator (Ministry)", email: "admin@bharatyatra.gov.in", role: "admin" },
        { id: "u2", full_name: "Inspector Rajesh Kumar (Tourist Police)", email: "police.vizag@bharatyatra.gov.in", role: "safety_officer" },
        { id: "u3", full_name: "K. Venkatesh (Certified ASI Guide)", email: "venkatesh.guide@bharatyatra.gov.in", role: "guide" },
        { id: "u4", full_name: "Suresh Reddy (Varun Beach Novotel)", email: "gm@novotelvizag.com", role: "hotel_owner" },
        { id: "u5", full_name: "Simhachalam Devasthanam Desk", email: "trust@simhachalam.org", role: "devasthanam_admin" },
      ]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function setRole(u, role) {
    try {
      if (base44?.entities?.User?.update) {
        await base44.entities.User.update(u.id, { role });
      }
      setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, role } : x)));
    } catch (e) {
      setError(e?.message || "Update failed");
    }
  }

  if (loading) return <div className="py-10 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2 text-foreground font-heading">
            <Users className="w-5 h-5 text-primary" /> Staff & Role Permissions
          </h3>
          <p className="text-xs text-muted-foreground">Manage portal permissions across departmental stakeholders</p>
        </div>
      </div>
      {error && <p className="text-xs text-destructive mb-3">{error}</p>}
      <div className="grid gap-2.5">
        {users.map((u, idx) => (
          <div key={u.id || u.email || idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-card border border-border rounded-2xl p-4 gap-3">
            <div className="min-w-0">
              <p className="font-bold text-sm text-foreground truncate">{u.full_name || u.email}</p>
              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">Role:</span>
              <select 
                value={u.role || "user"} 
                onChange={(e) => setRole(u, e.target.value)} 
                className="by-input w-full sm:w-48 text-xs font-semibold"
              >
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
      <style>{`.by-input{padding:.45rem .75rem;border-radius:.7rem;border:1px solid hsl(var(--border));background:hsl(var(--background));color:hsl(var(--foreground));font-size:.8rem;outline:none}`}</style>
    </div>
  );
}

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [guides, setGuides] = useState([]);

  const defaultSampleBookings = [
    {
      id: "BK-801",
      destination: "Visakhapatnam & Araku Valley Circuit",
      days: 4,
      group_type: "Family with Elders",
      food_preference: "Pure Vegetarian (Satvik)",
      from_city: "Hyderabad",
      status: "confirmed",
      total_cost: 38400,
      payment_method: "UPI (Verified)",
      transport: "AC Innova Crysta + Vistadome Train",
      trip_summary: "4-Day Coastal & Hill Journey: Kailasagiri, Submarine Museum, Borra Caves, and Araku Coffee Plantation.",
      assigned_guide_id: "g1",
    },
    {
      id: "BK-802",
      destination: "Golden Triangle: Delhi, Agra & Jaipur",
      days: 5,
      group_type: "Solo Cultural Traveler",
      food_preference: "Regional Authentic",
      from_city: "Bengaluru",
      status: "pending",
      total_cost: 29500,
      payment_method: "Net Banking",
      transport: "Vande Bharat Express + Private Cab",
      trip_summary: "Taj Mahal sunrise tour, Fatehpur Sikri, Amber Fort elephant path, and Chandni Chowk food walk.",
      assigned_guide_id: "",
    },
    {
      id: "BK-803",
      destination: "Tirupati Balaji Sacred Pilgrimage",
      days: 2,
      group_type: "Senior Citizens (Elder Care Checked)",
      food_preference: "Temple Prasadam / South Indian",
      from_city: "Chennai",
      status: "confirmed",
      total_cost: 16800,
      payment_method: "Credit Card",
      transport: "AC Tempo Traveller",
      trip_summary: "Special Entry Darshan slot arranged, Simhachalam connecting itinerary, and battery car assistance.",
      assigned_guide_id: "g2",
    },
  ];

  async function load() {
    setLoading(true);
    try {
      let bList = [];
      if (base44?.entities?.Booking?.list) {
        bList = await base44.entities.Booking.list("-created_date", 100);
      }
      if (!bList || bList.length === 0) {
        bList = defaultSampleBookings;
      }
      setBookings(bList);

      let gList = [];
      if (base44?.entities?.User?.list) {
        const users = await base44.entities.User.list();
        gList = users.filter((u) => u.role === "guide");
      }
      if (!gList || gList.length === 0) {
        gList = [
          { id: "g1", full_name: "K. Venkatesh (ASI Vizag Badge #401)" },
          { id: "g2", full_name: "S. Ramanathan (Tirupati Cultural Guide)" },
          { id: "g3", full_name: "Anita Saxena (Agra & Delhi Historian)" },
        ];
      }
      setGuides(gList);
    } catch (e) {
      setBookings(defaultSampleBookings);
      setGuides([
        { id: "g1", full_name: "K. Venkatesh (ASI Vizag Badge #401)" },
        { id: "g2", full_name: "S. Ramanathan (Tirupati Cultural Guide)" },
      ]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    try {
      if (base44?.entities?.Booking?.update) {
        await base44.entities.Booking.update(id, { status });
      }
      setBookings((list) => list.map((b) => (b.id === id ? { ...b, status } : b)));
    } catch (e) {
      setError(e?.message || "Update failed");
    }
  }

  async function assignGuide(id, guideId) {
    try {
      if (base44?.entities?.Booking?.update) {
        await base44.entities.Booking.update(id, { assigned_guide_id: guideId });
      }
      setBookings((list) => list.map((b) => (b.id === id ? { ...b, assigned_guide_id: guideId } : b)));
    } catch (e) {
      setError(e?.message || "Assignment failed");
    }
  }

  const statusColors = {
    pending: "bg-amber-500/15 text-amber-600",
    confirmed: "bg-teal-500/15 text-teal-600",
    cancelled: "bg-destructive/15 text-destructive",
    completed: "bg-emerald-500/15 text-emerald-600",
  };

  if (loading) return <div className="py-10 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2 text-foreground font-heading">
            <CalendarCheck className="w-5 h-5 text-primary" /> Active Travel Bookings & Itineraries
          </h3>
          <p className="text-xs text-muted-foreground">Manage tour reservations, payments and guide assignments</p>
        </div>
      </div>
      {error && <p className="text-xs text-destructive mb-3">{error}</p>}
      <div className="space-y-3">
        {bookings.map((b, idx) => (
          <div key={b.id || idx} className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" /> {b.destination}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {b.days} day{b.days > 1 ? "s" : ""} · {b.group_type} · {b.food_preference}
                  {b.from_city ? ` · From: ${b.from_city}` : ""}
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColors[b.status] || statusColors.pending}`}>
                {b.status}
              </span>
            </div>
            {b.trip_summary && (
              <p className="text-xs text-muted-foreground leading-relaxed bg-muted/40 p-3 rounded-xl border border-border/50">
                {b.trip_summary}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Wallet className="w-3.5 h-3.5 text-primary" /> ₹{b.total_cost?.toLocaleString("en-IN") || b.budget?.toLocaleString("en-IN")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {b.payment_method || "UPI / Card"}
              </span>
              <span>Transport: {b.transport || "Private AC Car"}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
              <div className="flex-1">
                <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Booking Status:</label>
                <select
                  value={b.status || "pending"}
                  onChange={(e) => updateStatus(b.id, e.target.value)}
                  className="by-input"
                >
                  <option value="pending">Pending Verification</option>
                  <option value="confirmed">Confirmed & Ticketed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Tour Completed</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Assigned ASI Guide:</label>
                <select
                  value={b.assigned_guide_id || ""}
                  onChange={(e) => assignGuide(b.id, e.target.value)}
                  className="by-input"
                >
                  <option value="">Assign licensed guide…</option>
                  {guides.map((g) => (
                    <option key={g.id} value={g.id}>{g.full_name || g.email}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`.by-input{width:100%;padding:.45rem .75rem;border-radius:.7rem;border:1px solid hsl(var(--border));background:hsl(var(--background));color:hsl(var(--foreground));font-size:.8rem;outline:none}`}</style>
    </div>
  );
}