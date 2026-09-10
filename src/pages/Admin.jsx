import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { 
  Shield, Settings, Users, Save, Loader2, CalendarCheck, MapPin, Clock, 
  Wallet, Hotel, ShieldAlert, Landmark, Gift, ShoppingCart, 
  Award, Eye, RotateCcw, KeyRound, UserCheck, ArrowRight, CheckCircle2,
  Lock
} from "lucide-react";
import EntityEditor from "@/components/EntityEditor";
import AdminDashboards from "@/components/AdminDashboards";
import { useAuth, getSystemCredentials } from "@/components/lib/AuthContext";
import { heritageSites, foods as staticFoods, products as staticProducts, events as staticEvents } from "@/lib/heritageData";
import { enrichedHeritageSites } from "@/lib/richHeritageData";
import { governmentRecognizedHotels } from "@/lib/hotelDirectoryData";
import { STATE_GALLERY_DATA } from "@/components/StateGallery";

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
  { id: "super_admin", label: "Super Admin", icon: Shield, desc: "Master operations, full control & database administration" },
  { id: "guide_coord", label: "Guide Coordinator", icon: Users, desc: "ASI guide verifications, badge muster roll & audio scripts" },
  { id: "hotel_mgmt", label: "Hotel Operations", icon: Hotel, desc: "Verified hotel inventory, room tariffs & VIP check-in audit" },
  { id: "surprise_mgr", label: "Surprise Planner", icon: Gift, desc: "Custom event forms, negotiated pricing & surprise logistics" },
  { id: "safety_cmd", label: "Safety & SOS Command", icon: ShieldAlert, desc: "Distress beacons, emergency centers & elder care alerts" },
  { id: "ecomm_mgr", label: "Artisan & Handloom", icon: ShoppingCart, desc: "Handcrafted catalog, GI silk tags & order fulfillment" },
  { id: "employees_mgmt", label: "Employees & Staff", icon: Users, desc: "Duty shifts, staff tasks, and hotel property assignments" },
  { id: "volunteers", label: "Volunteer Portal", icon: Users, desc: "State-wise volunteer network & emergency dispatch chat" },
  { id: "site_mgr", label: "ASI Monument Curator", icon: Landmark, desc: "Monument crowd sensors, turnstiles & ASI maintenance" },
  { id: "leaderboard", label: "Excellence Leaderboard", icon: Award, desc: "Top performing guides & artisan clusters" },
];

const tabs = [
  { id: "dashboards", label: "Specialized Dashboards" },
  { id: "places", label: "Heritage Places" },
  { id: "states", label: "State Portals" },
  { id: "foods", label: "Regional Foods" },
  { id: "products", label: "Artisan Crafts" },
  { id: "events", label: "Festivals & Events" },
  { id: "hotels", label: "Hotels & Stays" },
  { id: "bookings", label: "Bookings" },
  { id: "config", label: "Site Config" },
  { id: "credentials", label: "Role Credentials & Passwords" },
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

const stateFields = [
  { key: "state", label: "State Name", type: "text" },
  { key: "region", label: "Region (e.g. North India, South India)", type: "text" },
  { key: "landmark", label: "Key Landmark", type: "text" },
  { key: "title", label: "Tapestry Title", type: "text" },
  { key: "image", label: "Image URL", type: "text" },
  { key: "caption", label: "Detailed Caption", type: "textarea" },
  { key: "highlights_raw", label: "Key Highlights (comma-separated)", type: "text" },
  { key: "bestTime", label: "Best Visiting Season", type: "text" },
  { key: "unesco", label: "UNESCO site? (true/false)", type: "text" },
];

export default function Admin() {
  const { user, quickSwitchRole } = useAuth();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = params.get("tab") || "dashboards";
  const [tab, setTab] = useState(initialTab);
  const [copiedKey, setCopiedKey] = useState("");
  const [localCreds, setLocalCreds] = useState(() => getSystemCredentials());
  const [credsSaved, setCredsSaved] = useState(false);

  const saveCreds = (updatedCreds) => {
    localStorage.setItem("by-custom-credentials", JSON.stringify(updatedCreds));
    setLocalCreds(updatedCreds);
    setCredsSaved(true);
    setTimeout(() => setCredsSaved(false), 2500);
  };

  // Determine initial role from logged in user
  const userRole = user?.role || "admin";
  const isSuperAdmin = userRole === "admin" || userRole === "super_admin" || user?.email === "santoshtrade27@gmail.com";
  const isEmployee = user?.isEmployee && !isSuperAdmin;
  const isTourist = userRole === "tourist";

  // Active simulated or dedicated role
  const initialRole = isEmployee 
    ? (user.designatedDashboard || "guide_coord")
    : (params.get("tab") === "surprise_planners" ? "surprise_mgr" : "super_admin");

  const [activeRole, setActiveRole] = useState(initialRole);

  useEffect(() => {
    if (isEmployee && user?.designatedDashboard) {
      setActiveRole(user.designatedDashboard);
    }
  }, [isEmployee, user]);

  function handleRoleSwitch(roleId) {
    setActiveRole(roleId);
    setTab("dashboards");
  }

  const currentRoleObj = rolesList.find((r) => r.id === activeRole) || rolesList[0];

  // If user is a standard tourist, restrict admin dashboard and guide them to Profile
  if (isTourist) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full p-8 rounded-3xl bg-card border border-border shadow-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto grid place-items-center">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider">
              Traveler Account Notice
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
              Administrative Console is Restricted
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              You are currently logged in as a <strong>Registered Tourist</strong> (<code className="text-primary font-mono">{user?.email}</code>). Administrative and departmental dashboards are reserved exclusively for certified field employees and administrators.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/50 border border-border text-xs text-left space-y-2">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> What's available for Travelers:
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Your personal profile contains your saved travel itineraries, tour bookings, emergency SOS emergency contacts, and personalized surprise planning requests.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/profile"
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-sm hover:opacity-90 flex items-center justify-center gap-2 transition-all"
            >
              <span>Go to My Traveler Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                quickSwitchRole("admin");
              }}
              className="w-full py-2.5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Switch to Super Admin (Santosh Trade)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Top Header Banner */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">
                  {isEmployee ? `${currentRoleObj.label} Cockpit` : "Multi-Role Master Operations Cockpit"}
                </h1>
              </div>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                {isEmployee 
                  ? `Designated operational console for ${user?.full_name || "Certified Duty Officer"}.`
                  : "Super Administrator central command: manage all 10 perspectives, catalog entries, staff, and database schemas."}
              </p>
            </div>

            {/* Operator Identity Tag */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <div className="px-3 py-1.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Operator: <strong>{user?.email || "santoshtrade27@gmail.com"}</strong> ({user?.role || "admin"})</span>
              </div>

              {isSuperAdmin && activeRole !== "super_admin" && (
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("super_admin")}
                  className="px-3 py-1.5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Return to Super Admin mode with all capabilities"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Master Operations</span>
                </button>
              )}
            </div>
          </div>

          {/* Super Admin Quick Role Switcher Bar */}
          {isSuperAdmin && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-primary" /> Inspect Employee Perspectives:
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
                      className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold shrink-0 transition-all cursor-pointer ${
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
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Dedicated Employee Mode (or simulated single-role mode) */}
        {(isEmployee || (isSuperAdmin && activeRole !== "super_admin")) ? (
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
                      {currentRoleObj.label} Duty Cockpit
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                      Active Duty Shift
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {currentRoleObj.desc}
                  </p>
                </div>
              </div>

              {isSuperAdmin && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch("super_admin")}
                    className="px-3.5 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Return to Master Operations</span>
                  </button>
                </div>
              )}
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
            {/* Super Admin Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    tab === t.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Dashboards Tab */}
            {tab === "dashboards" && (
              <AdminDashboards 
                activeRole="core_admin" 
                onRoleChange={(r) => handleRoleSwitch(r)}
              />
            )}

            {/* Places Tab */}
            {tab === "places" && (
              <EntityEditor
                entityName="places"
                title="Heritage Sites & Monuments"
                description="Manage national heritage monuments, entry fees, timings and coordinates."
                fields={placeFields}
                initialData={combinedPlaces}
              />
            )}

            {/* State Portals Tab */}
            {tab === "states" && (
              <EntityEditor
                entityName="states"
                title="State Portals & Visual Highlights"
                description="Manage high-resolution visual stories, state landmarks, best visiting season, and key highlights."
                fields={stateFields}
                initialData={STATE_GALLERY_DATA.map((s) => ({
                  ...s,
                  highlights_raw: Array.isArray(s.highlights) ? s.highlights.join(", ") : s.highlights_raw || "",
                }))}
              />
            )}

            {/* Foods Tab */}
            {tab === "foods" && (
              <EntityEditor
                entityName="foods"
                title="Regional Cuisine Catalog"
                description="Manage traditional delicacies and culinary highlights."
                fields={foodFields}
                initialData={staticFoods}
              />
            )}

            {/* Products Tab */}
            {tab === "products" && (
              <EntityEditor
                entityName="products"
                title="Artisan & Handloom Products"
                description="Manage handicraft items, GI tags, prices and artisan stock."
                fields={productFields}
                initialData={staticProducts}
              />
            )}

            {/* Events Tab */}
            {tab === "events" && (
              <EntityEditor
                entityName="events"
                title="Cultural Festivals & Events"
                description="Manage cultural events, seasonal festivals and dress codes."
                fields={eventFields}
                initialData={staticEvents}
              />
            )}

            {/* Hotels Tab */}
            {tab === "hotels" && (
              <EntityEditor
                entityName="hotels"
                title="Government Recognized Hotels & Stays"
                description="Verified hotel inventory, room tariffs and accessibility ratings."
                fields={hotelFields}
                initialData={governmentRecognizedHotels}
              />
            )}

            {/* Bookings Tab */}
            {tab === "bookings" && <BookingsManager />}

            {/* Role Credentials & Passwords Tab */}
            {tab === "credentials" && (
              <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground font-heading flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-primary" /> Role Credentials & Passwords Matrix
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Configure and edit official login credentials for all administrative roles and Super Administrator.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("by-custom-credentials");
                        window.location.reload();
                      }}
                      className="px-3 py-1.5 rounded-full border border-border hover:bg-muted text-foreground text-xs font-semibold transition-colors cursor-pointer"
                      title="Reset all emails and passwords to default"
                    >
                      Reset Defaults
                    </button>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      Master Security Directory
                    </span>
                  </div>
                </div>

                {credsSaved && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                    <span>Credentials updated successfully! All active sessions & login check-ins synchronized with new emails.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {localCreds.map((cred, idx) => (
                    <div
                      key={cred.role}
                      className="p-5 rounded-2xl bg-muted/30 border border-border space-y-4 flex flex-col justify-between shadow-xs hover:border-primary/20 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                            {cred.badge}
                          </span>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            Role: {cred.role}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-foreground">{cred.roleName}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed text-[11px]">{cred.description}</p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-border/60">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Login Email:</label>
                          <input
                            type="email"
                            value={cred.email}
                            onChange={(e) => {
                              const updated = [...localCreds];
                              updated[idx] = { ...updated[idx], email: e.target.value };
                              saveCreds(updated);
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border text-foreground outline-none focus:border-primary font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Password:</label>
                          <input
                            type="text"
                            value={cred.password}
                            onChange={(e) => {
                              const updated = [...localCreds];
                              updated[idx] = { ...updated[idx], password: e.target.value };
                              saveCreds(updated);
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border text-foreground outline-none focus:border-primary font-mono"
                          />
                        </div>
                        <div className="text-[10px] text-muted-foreground pt-1 border-t border-dashed border-border/60">
                          Scope: {cred.accessScope}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          quickSwitchRole(cred.role);
                          if (cred.role === "tourist") {
                            navigate("/profile");
                          }
                        }}
                        className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        Sign in as {cred.roleName.split(" ")[0]} →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Site Config Tab */}
            {tab === "config" && <SiteConfigManager />}
          </>
        )}
      </section>
    </div>
  );
}

// Subcomponent: Bookings Manager
function BookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const defaultSampleBookings = [
    {
      id: "BK-801",
      destination: "Visakhapatnam & Araku Valley Coastal Circuit",
      days: 4,
      group_type: "Family & Elders (Accessibility Checked)",
      food_preference: "South Indian Vegetarian",
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
      setBookings(defaultSampleBookings);
      setGuides([
        { id: "g1", full_name: "Abdul Qadir (ASI Guide Allocator)" },
        { id: "g2", full_name: "K. Venkatesh (ASI Vizag Badge #401)" },
        { id: "g3", full_name: "S. Ramanathan (Tirupati Cultural Guide)" },
      ]);
    } catch {
      setBookings(defaultSampleBookings);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  async function assignGuide(id, guideId) {
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, assigned_guide_id: guideId } : b)));
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
                  className="w-full p-2 rounded-xl bg-background border border-border text-xs text-foreground outline-none"
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
                  className="w-full p-2 rounded-xl bg-background border border-border text-xs text-foreground outline-none"
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
    </div>
  );
}

// Subcomponent: Site Config Manager
function SiteConfigManager() {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("by-site-config");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          siteName: parsed.siteName || "Bharat Yatra",
          tagline: parsed.tagline || "India's Cultural Tourism & Heritage Platform",
          helplinePhone: parsed.helplinePhone || "1363 (Toll Free 24x7)",
          emergencyPhone: parsed.emergencyPhone || "112 (National Emergency)",
          heroVideo: parsed.heroVideo || "p8mXAQ6cPxg",
          heroVideoUrl: parsed.heroVideoUrl || "https://media.base44.com/videos/public/6a9bae9fd15b41c75cea5237/4135fd9b0_vidssavecomIncredibleIndia4K-BeyondtheStereotypes_TheRealIndiaRevealed720P.mp4",
          heroImage: parsed.heroImage || "https://media.base44.com/images/public/6a9bae27c746fec94dc69b172/fc65e0714_generated_image.png",
          curfewAlerts: parsed.curfewAlerts || false,
          offlineModeAvailable: parsed.offlineModeAvailable || true,
        };
      }
    } catch {}
    return {
      siteName: "Bharat Yatra",
      tagline: "India's Cultural Tourism & Heritage Platform",
      helplinePhone: "1363 (Toll Free 24x7)",
      emergencyPhone: "112 (National Emergency)",
      heroVideo: "p8mXAQ6cPxg",
      heroVideoUrl: "https://media.base44.com/videos/public/6a9bae9fd15b41c75cea5237/4135fd9b0_vidssavecomIncredibleIndia4K-BeyondtheStereotypes_TheRealIndiaRevealed720P.mp4",
      heroImage: "https://media.base44.com/images/public/6a9bae27c746fec94dc69b172/fc65e0714_generated_image.png",
      curfewAlerts: false,
      offlineModeAvailable: true,
    };
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem("by-site-config", JSON.stringify(config));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-xs max-w-2xl">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="font-bold text-base text-foreground font-heading flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" /> Platform & Emergency Settings
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Configure global helpline numbers, video headers and background media</p>
        </div>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">Site Title</label>
          <input
            type="text"
            value={config.siteName}
            onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-background border border-border text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">Tagline</label>
          <input
            type="text"
            value={config.tagline}
            onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-background border border-border text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-primary">Header Hero Media Customization</h4>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Hero Video Direct Stream URL (.mp4 / live loop)</label>
            <input
              type="text"
              value={config.heroVideoUrl}
              onChange={(e) => setConfig({ ...config, heroVideoUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-background border border-border text-xs text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., https://media.base44.com/videos/...mp4"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Hero YouTube Video ID (backup)</label>
              <input
                type="text"
                value={config.heroVideo}
                onChange={(e) => setConfig({ ...config, heroVideo: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-background border border-border text-xs text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., p8mXAQ6cPxg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Hero Background Image URL (fallback)</label>
              <input
                type="text"
                value={config.heroImage}
                onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-background border border-border text-xs text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., https://media.base44.com/images/..."
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Tourist Helpline</label>
            <input
              type="text"
              value={config.helplinePhone}
              onChange={(e) => setConfig({ ...config, helplinePhone: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-background border border-border text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Emergency Number</label>
            <input
              type="text"
              value={config.emergencyPhone}
              onChange={(e) => setConfig({ ...config, emergencyPhone: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-background border border-border text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:opacity-90 flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </form>
    </div>
  );
}
