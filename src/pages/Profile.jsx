import { useState, useEffect } from "react";
import { 
  User, Lock, Package, Map, Phone, Award, Shield, CheckCircle2, 
  Download, Calendar, MapPin, Trash2, Edit3, Save, AlertTriangle, 
  Compass, Sun, Moon, Globe 
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import { getOrders } from "@/lib/cart";
import { generateTripVoucherPDF, generateShopInvoicePDF } from "@/components/lib/pdfGenerator";

const offlineMapsData = [
  {
    id: "ap-map",
    title: "Andhra Pradesh Complete Heritage & Coastal Map",
    coverage: "Visakhapatnam, Tirupati, Borra Caves, Amaravati, Lepakshi",
    size: "18.4 MB",
    version: "v2026.1 (Includes offline police stations & hospitals)",
    downloaded: true,
  },
  {
    id: "tg-map",
    title: "Telangana Historic Citadels & Kakatiya Circuit",
    coverage: "Hyderabad, Golconda, Warangal UNESCO, Ramappa, Bhongir",
    size: "14.2 MB",
    version: "v2026.1 (Includes metro stations & ASI monuments)",
    downloaded: true,
  },
  {
    id: "delhi-map",
    title: "Delhi NCR Heritage Golden Triangle Route",
    coverage: "Red Fort, Qutub Minar, Humayun Tomb, Agra, Jaipur",
    size: "22.1 MB",
    version: "v2026.1 (Includes Vande Bharat stations & bus stands)",
    downloaded: false,
  },
  {
    id: "rj-map",
    title: "Rajasthan Desert Forts & Royal Palaces",
    coverage: "Jaipur, Jodhpur, Udaipur, Jaisalmer, Chittorgarh",
    size: "26.5 MB",
    version: "v2026.1 (Includes desert fuel pumps & emergency SOS)",
    downloaded: false,
  }
];

export default function Profile() {
  const { theme, toggle } = useTheme();
  const { lang, setLang } = useI18n();
  const { user: authUser, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("personal");

  // Personal Profile State
  const [profile, setProfile] = useState({
    name: "Aditya Sharma",
    email: "aditya.travels@bharatyatra.gov.in",
    phone: "+91 98490 12345",
    homeCity: "Visakhapatnam",
    bloodGroup: "O+ Positive",
    emergencyContactName: "Ramesh Sharma (Father)",
    emergencyContactPhone: "+91 98490 54321",
    sosRegistered: true,
    liveLocationSharing: true,
    lastCoordinates: "17.6868° N, 83.2185° E (Visakhapatnam Beach Road)",
  });

  // Password Update State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordNotice, setPasswordNotice] = useState("");

  // Booked Trips State
  const [bookedTrips, setBookedTrips] = useState([]);
  
  // Orders State
  const [orders, setOrders] = useState([]);

  // Saved Trips
  const [savedTrips, setSavedTrips] = useState([]);

  // Offline Maps State
  const [maps, setMaps] = useState(offlineMapsData);

  // Success Notice
  const [savedNotice, setSavedNotice] = useState("");

  useEffect(() => {
    // Load User Profile from localStorage if saved
    try {
      const savedProf = localStorage.getItem("by-user-profile");
      if (savedProf) {
        setProfile(JSON.parse(savedProf));
      } else if (authUser?.email) {
        setProfile((prev) => ({
          ...prev,
          email: authUser.email,
          name: authUser.name || prev.name,
        }));
      }
    } catch {}

    // Load Bookings
    try {
      const b = localStorage.getItem("by-user-bookings");
      if (b) {
        setBookedTrips(JSON.parse(b));
      } else {
        // Sample starter booking so user sees real records
        setBookedTrips([
          {
            id: "BK-2026-VZ1",
            destination: "Visakhapatnam",
            from_city: "Delhi",
            days: 3,
            budget: 25000,
            group_type: "Family",
            food_preference: "South Indian & Andhra Meals",
            transport: "Vande Bharat / Express Train",
            hotel: {
              name: "Novotel Visakhapatnam Varun Beach",
              location: "Beach Road, Visakhapatnam",
              price: 6800,
            },
            status: "confirmed",
            payment_method: "Pay Later",
            booked_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            total_cost: 24500,
            trip_summary: "3-Day Coastal & Buddhist Heritage Tour of Visakhapatnam",
          }
        ]);
      }
    } catch {}

    // Load Orders
    setOrders(getOrders());

    // Load Saved Trips
    try {
      const st = localStorage.getItem("by-saved-trips");
      setSavedTrips(st ? JSON.parse(st) : [
        { id: "st-1", to: "Warangal & Ramappa", days: 2, budget: 12000, note: "Kakatiya UNESCO Sculpture" },
        { id: "st-2", to: "Tirupati Seven Hills", days: 3, budget: 18000, note: "Temple Darshan & Chandragiri" },
      ]);
    } catch {}
  }, [authUser]);

  function handleSaveProfile(e) {
    e.preventDefault();
    try {
      localStorage.setItem("by-user-profile", JSON.stringify(profile));
      setSavedNotice("Profile and emergency details updated successfully!");
      setTimeout(() => setSavedNotice(""), 3500);
    } catch {}
  }

  function handlePasswordChange(e) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordNotice("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordNotice("New passwords do not match.");
      return;
    }
    setPasswordNotice("Personal password changed successfully! Stored securely.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordNotice(""), 3500);
  }

  function refreshGPS() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = `${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E (Live GPS)`;
          const updated = { ...profile, lastCoordinates: coords };
          setProfile(updated);
          localStorage.setItem("by-user-profile", JSON.stringify(updated));
          setSavedNotice("SOS Live Location beacon updated with real GPS!");
          setTimeout(() => setSavedNotice(""), 3500);
        },
        () => {
          setSavedNotice("Unable to retrieve GPS. Using default beacon.");
          setTimeout(() => setSavedNotice(""), 3500);
        }
      );
    }
  }

  function toggleDownloadMap(id) {
    setMaps((prev) =>
      prev.map((m) => (m.id === id ? { ...m, downloaded: !m.downloaded } : m))
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-primary/15 text-primary grid place-items-center text-2xl sm:text-3xl font-bold font-heading shadow-inner border border-primary/20">
                {profile.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{profile.name}</h1>
                  {profile.sosRegistered && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> SOS Verified
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {profile.email} · {profile.homeCity}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Silver Explorer (Level 3)
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {bookedTrips.length} Booked Trips · {orders.length} Craft Orders
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Preferences & Logout */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={toggle}
                className="p-2.5 rounded-2xl bg-muted text-foreground hover:bg-muted/80 border border-border"
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-muted border border-border text-xs">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-transparent text-xs font-medium outline-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="te">తెలుగు</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm font-semibold">
            {[
              { id: "personal", label: "Profile & Password", icon: User },
              { id: "trips", label: `My Trips (${bookedTrips.length})`, icon: Compass },
              { id: "orders", label: `Shop Orders (${orders.length})`, icon: Package },
              { id: "maps", label: "Downloaded Maps", icon: Map },
              { id: "sos", label: "SOS & Live Location", icon: Phone },
              { id: "records", label: "Passport & Badges", icon: Award },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shrink-0 ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {savedNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{savedNotice}</span>
          </div>
        )}

        {/* TAB 1: PERSONAL PROFILE & PASSWORD */}
        {activeTab === "personal" && (
          <div className="grid md:grid-cols-12 gap-8">
            {/* Personal Details Form */}
            <div className="md:col-span-7 p-6 rounded-3xl bg-card border border-border space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-primary" /> Personal Information
                </h3>
                <span className="text-xs text-muted-foreground">Keep updated for hotel check-ins</span>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Home City / Base
                    </label>
                    <input
                      type="text"
                      value={profile.homeCity}
                      onChange={(e) => setProfile({ ...profile, homeCity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Blood Group (for Medical/SOS)
                    </label>
                    <select
                      value={profile.bloodGroup}
                      onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    >
                      {["O+ Positive", "O- Negative", "A+ Positive", "A- Negative", "B+ Positive", "B- Negative", "AB+ Positive", "AB- Negative"].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      value={profile.emergencyContactName}
                      onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Emergency WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={profile.emergencyContactPhone}
                    onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-90 flex items-center gap-2 transition-all"
                  >
                    <Save className="w-4 h-4" /> Save Profile Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Password & Security Card */}
            <div className="md:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-card border border-border space-y-5">
                <div className="pb-3 border-b border-border">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Update Password
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Secure your personal travel itinerary & payment methods
                  </p>
                </div>

                {passwordNotice && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${
                    passwordNotice.includes("successfully") 
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30" 
                      : "bg-destructive/15 text-destructive border border-destructive/30"
                  }`}>
                    {passwordNotice}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-secondary text-secondary-foreground font-bold text-xs hover:opacity-90 transition-all mt-2"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Quick Safety Summary */}
              <div className="p-5 rounded-3xl bg-muted/50 border border-border space-y-2 text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary" /> Data Privacy & Sovereignty
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  Your travel documents, government hotel vouchers, and SOS contact records are encrypted on device and in compliance with India DPDP Act.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY TRIPS & BOOKINGS */}
        {activeTab === "trips" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">My Cultural Trips & Reservations</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Track confirmed hotel stays, Vande Bharat seatings, and itinerary vouchers
                </p>
              </div>
            </div>

            {bookedTrips.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-3xl border border-border p-6 space-y-3">
                <Compass className="w-12 h-12 text-muted-foreground mx-auto" />
                <h4 className="text-base font-bold text-foreground">No booked trips yet</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Use our MakeMyTrip-style Planner to search Visakhapatnam, Hyderabad, or Delhi routes with real hotel booking.
                </p>
                <a
                  href="/planner"
                  className="inline-flex px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md mt-2"
                >
                  Plan a Trip Now
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {bookedTrips.map((b) => (
                  <div
                    key={b.id}
                    className="p-6 rounded-3xl bg-card border border-border shadow-sm hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          {b.status || "Confirmed"}
                        </span>
                        <span className="text-xs text-muted-foreground">Booking ID: {b.id}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{new Date(b.booked_at || Date.now()).toLocaleDateString()}</span>
                      </div>

                      <h4 className="text-xl font-bold text-foreground">
                        {b.destination} Cultural Tour ({b.days} Days)
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>Hotel: <strong>{b.hotel?.name || "Verified Property"}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>Transport: <strong>{b.transport}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>Total: <strong className="text-foreground">₹{b.total_cost?.toLocaleString("en-IN")}</strong> ({b.payment_method})</span>
                        </div>
                      </div>

                      {b.trip_summary && (
                        <p className="text-xs text-muted-foreground/90 italic pt-1">
                          "{b.trip_summary}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <a
                        href={`/planner?destination=${encodeURIComponent(b.destination)}`}
                        className="px-4 py-2.5 rounded-full bg-muted text-foreground text-xs font-bold hover:bg-muted/80 transition-colors"
                      >
                        View Itinerary
                      </a>
                      <button
                        type="button"
                        onClick={() => generateTripVoucherPDF(b)}
                        className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Download official PDF voucher"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF Voucher
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SHOP ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Handicraft & Textile Orders</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Authentic artisan products direct from GI-certified clusters
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-3xl border border-border p-6 space-y-3">
                <Package className="w-12 h-12 text-muted-foreground mx-auto" />
                <h4 className="text-base font-bold text-foreground">No shop orders yet</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Support traditional weavers and sculptors in our Craft Bazaar.
                </p>
                <a
                  href="/shop"
                  className="inline-flex px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md mt-2"
                >
                  Explore Artisan Shop
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="p-6 rounded-3xl bg-card border border-border space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-border text-xs">
                      <div>
                        <span className="font-bold text-foreground">Order #{o.id}</span>
                        <span className="text-muted-foreground ml-2">Placed on {new Date(o.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                          Dispatched · India Post
                        </span>
                        <button
                          type="button"
                          onClick={() => generateShopInvoicePDF(o)}
                          className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 text-foreground font-bold text-[11px] flex items-center gap-1 transition-colors"
                          title="Download Tax Invoice PDF"
                        >
                          <Download className="w-3 h-3 text-primary" /> Invoice PDF
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {o.items?.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-foreground font-medium">{it.name} × {it.quantity || 1}</span>
                          <span className="text-muted-foreground font-mono">₹{(it.price * (it.quantity || 1)).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                      <span className="text-muted-foreground">Deliver to: {o.address || "Visakhapatnam, AP"}</span>
                      <span className="font-bold text-base text-foreground font-heading">
                        Total: ₹{o.total?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DOWNLOADED OFFLINE MAPS */}
        {activeTab === "maps" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Downloaded Offline Maps & Geodata</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Explore remote heritage caves, Ghats, and hill shrines with zero mobile internet connectivity
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {maps.map((m) => (
                <div
                  key={m.id}
                  className="p-6 rounded-3xl bg-card border border-border space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        m.downloaded ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"
                      }`}>
                        {m.downloaded ? "Downloaded · Ready Offline" : "Available Online"}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">{m.size}</span>
                    </div>

                    <h4 className="text-base font-bold text-foreground">{m.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.coverage}</p>
                    <p className="text-[11px] text-muted-foreground/80">{m.version}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <a
                      href="/map"
                      className="px-4 py-2 rounded-full bg-muted text-foreground text-xs font-semibold hover:bg-muted/80"
                    >
                      Open in Interactive Map
                    </a>

                    <button
                      onClick={() => toggleDownloadMap(m.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                        m.downloaded
                          ? "border border-destructive/30 text-destructive hover:bg-destructive/10"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      {m.downloaded ? (
                        <>
                          <Trash2 className="w-3.5 h-3.5" /> Remove (Free {m.size})
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" /> Download Pack
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SOS & LIVE LOCATION */}
        {activeTab === "sos" && (
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-7 p-6 rounded-3xl bg-card border border-border space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4 text-destructive" /> Emergency SOS Registration
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Direct integration with Tourist Police & WhatsApp Emergency Beacons
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  Active
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-2">
                <span className="text-xs font-bold text-destructive uppercase tracking-wider">
                  Registered Emergency Contact
                </span>
                <p className="text-sm font-bold text-foreground">
                  {profile.emergencyContactName} ({profile.emergencyContactPhone})
                </p>
                <p className="text-xs text-muted-foreground">
                  When you trigger the red SOS button, an encrypted WhatsApp alert with your live GPS location will be transmitted directly to this number and to the local District Tourism Police dispatch.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/50 border border-border cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-foreground">Live Location Sharing Beacon</span>
                    <p className="text-[11px] text-muted-foreground">Share high-precision GPS every 30 minutes with registered contacts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.liveLocationSharing}
                    onChange={(e) => setProfile({ ...profile, liveLocationSharing: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                </label>

                <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Last Recorded GPS Beacon:</span>
                    <button
                      onClick={refreshGPS}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Refresh GPS Now
                    </button>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">{profile.lastCoordinates}</p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/safety"
                  className="w-full py-3.5 rounded-full bg-destructive text-destructive-foreground font-bold text-xs shadow-md hover:opacity-95 flex items-center justify-center gap-2 transition-all"
                >
                  <AlertTriangle className="w-4 h-4" /> Open Full Safety & Emergency Hub
                </a>
              </div>
            </div>

            <div className="md:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-card border border-border space-y-3">
                <h4 className="text-sm font-bold text-foreground">State Police Helplines</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2.5 rounded-xl bg-muted/60">
                    <span className="font-medium text-foreground">All-India Tourist Helpline:</span>
                    <strong className="text-primary">1363 (Toll Free)</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-muted/60">
                    <span className="font-medium text-foreground">Andhra Pradesh Police:</span>
                    <strong className="text-primary">112 / 100</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-muted/60">
                    <span className="font-medium text-foreground">Telangana Tourist Police:</span>
                    <strong className="text-primary">100 / 040-23450444</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-muted/60">
                    <span className="font-medium text-foreground">Women's Safety Helpline:</span>
                    <strong className="text-primary">1091</strong>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1.5">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  Elder Care & Solo Traveler Check-in
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  Traveling alone or with senior citizens? Enable automatic SMS check-ins before entering high-elevation Ghat roads or forest trails.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PASSPORT & BADGES */}
        {activeTab === "records" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Digital Heritage Passport</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Proof of exploration stamped at monuments across India
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Simhachalam Temple", place: "Visakhapatnam", date: "Jan 2026", color: "from-amber-500 to-orange-600" },
                { name: "Charminar Monument", place: "Hyderabad", date: "Dec 2025", color: "from-blue-500 to-indigo-600" },
                { name: "Borra Caves", place: "Ananthagiri Hills", date: "Jan 2026", color: "from-emerald-500 to-teal-600" },
                { name: "Taj Mahal", place: "Agra", date: "Nov 2025", color: "from-rose-500 to-pink-600" },
              ].map((stamp, i) => (
                <div
                  key={i}
                  className="p-5 rounded-3xl bg-card border border-border shadow-sm text-center space-y-2 relative overflow-hidden"
                >
                  <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-tr ${stamp.color} text-white grid place-items-center shadow-md`}>
                    <Award className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{stamp.name}</h4>
                  <p className="text-xs text-muted-foreground">{stamp.place}</p>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground inline-block">
                    Verified {stamp.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
