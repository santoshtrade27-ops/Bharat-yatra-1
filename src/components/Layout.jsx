import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Menu, X, Mic, Sun, Moon, Phone, User, Shield, 
  Compass, LogIn, LogOut, Send, ShoppingBag, Landmark, 
  Sparkles, Gift, Map as MapIcon, Calendar, ShieldAlert, 
  Languages, ChevronRight, CheckCircle2, HeartHandshake
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/cart";
import OfflineBanner from "@/components/OfflineBanner";
import BottomNav from "@/components/BottomNav";
import AIAssistant from "@/components/AIAssistant";
import CartDrawer from "@/components/CartDrawer";
import LanguageToggle from "@/components/LanguageToggle";

const navKeys = [
  { to: "/heritage", key: "nav_heritage", icon: Landmark, desc: "Monuments, Caves & Temples" },
  { to: "/planner", key: "nav_planner", icon: Sparkles, badge: "AI", desc: "Real trains, hotels & itinerary" },
  { to: "/surprise-planner", key: "nav_surprise_planner", icon: Gift, desc: "Cultural gifts & surprise tours" },
  { to: "/map", key: "nav_map", icon: MapIcon, desc: "Interactive geographic exploration" },
  { to: "/events", key: "nav_events", icon: Calendar, desc: "Festivals, melas & seasonal fairs" },
  { to: "/guides", key: "nav_guides", icon: Compass, desc: "Licensed ASI certified guides" },
  { to: "/shop", key: "nav_shop", icon: ShoppingBag, desc: "Direct rural artisan crafts" },
  { to: "/safety", key: "nav_safety", icon: ShieldAlert, alert: true, desc: "Emergency SOS & scam alerts" },
  { to: "/translate", key: "nav_translate", icon: Languages, desc: "Real-time speech & voice" },
];

const mobileLanguages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [guideSubmitted, setGuideSubmitted] = useState(false);
  const [guideForm, setGuideForm] = useState({
    name: "",
    phone: "",
    city: "",
    state: "Andhra Pradesh",
    address: "",
    hiddenSpot: "",
    bio: "",
  });

  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();
  const { isAuthenticated, logout, user } = useAuth();
  const { count: cartCount } = useCart();

  // Close drawer on location changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleGuideSubmit = (e) => {
    e.preventDefault();
    if (!guideForm.name || !guideForm.phone || !guideForm.city) {
      alert("Please enter Name, Phone Number and City.");
      return;
    }

    const newApplication = {
      id: `GUIDE-APP-${Date.now().toString().slice(-6)}`,
      ...guideForm,
      status: "New Form",
      submittedAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("by-guide-applications") || "[]");
      const updated = [newApplication, ...existing];
      localStorage.setItem("by-guide-applications", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("by-guide-applications-updated", { detail: newApplication }));
    } catch {}

    setGuideSubmitted(true);
    setTimeout(() => {
      setGuideSubmitted(false);
      setGuideModalOpen(false);
      setGuideForm({
        name: "",
        phone: "",
        city: "",
        state: "Andhra Pradesh",
        address: "",
        hiddenSpot: "",
        bio: "",
      });
    }, 2400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      <header className="sticky top-0 z-40 glass border-b border-border/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <span className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-base sm:text-lg shadow-sm">
              ब
            </span>
            <span className="font-heading font-semibold tracking-wide text-sm sm:text-base">
              BHARAT <span className="text-primary">YATRA</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navKeys.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  pathname.startsWith(l.to)
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Language Selector (Desktop) */}
            <div className="hidden sm:block">
              <LanguageToggle
                selectedLang={lang}
                onSelectLang={setLang}
              />
            </div>

            {/* Emergency SOS Button (Always visible on mobile & desktop) */}
            <Link
              to="/safety"
              className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-full border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-xs"
              title="Tourist Emergency SOS & Scam Police"
            >
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" /> 
              <span>SOS</span>
            </Link>

            {/* Cart Button (Always visible) */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("cart-open"))}
              className="relative w-8.5 h-8.5 sm:w-9 sm:h-9 grid place-items-center rounded-full hover:bg-muted text-foreground transition-colors"
              aria-label="Artisan Cart"
              title="Artisan Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-50">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 grid place-items-center rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Voice Translator (Desktop) */}
            <Link
              to="/translate"
              className="hidden sm:grid place-items-center w-9 h-9 rounded-full hover:bg-muted transition-colors text-primary"
              aria-label="Voice Translator"
              title="Voice Translator & Speech"
            >
              <Mic className="w-4 h-4" />
            </Link>

            {/* Admin (Desktop) */}
            <Link
              to="/admin"
              className="hidden sm:grid place-items-center w-9 h-9 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Admin Directorate"
              title="Admin Directorate"
            >
              <Shield className="w-4 h-4" />
            </Link>

            {/* Auth / Profile (Desktop) */}
            {isAuthenticated ? (
              <button
                onClick={() => logout()}
                className="hidden sm:grid place-items-center w-9 h-9 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-3.5 h-3.5" /> Login
              </Link>
            )}

            {/* User Profile Avatar */}
            <Link
              to="/profile"
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 grid place-items-center rounded-full bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="User Profile"
              title="My Profile & Trips"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              className="lg:hidden w-8.5 h-8.5 grid place-items-center rounded-full hover:bg-muted transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Over Drawer Sheet */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Dimmed Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
              onClick={() => setOpen(false)}
            />

            {/* Slide-over Drawer Panel */}
            <div className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-xs sm:max-w-sm bg-card border-l border-border shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-250 pb-safe overflow-hidden">
              {/* Drawer Top Bar */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-sm shadow-xs">
                    ब
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-foreground">BHARAT YATRA</h3>
                    <p className="text-[10px] text-muted-foreground">National Cultural Tourism</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 touch-scroll">
                {/* User Status Card */}
                <div className="p-3 rounded-2xl bg-muted/50 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-9 h-9 rounded-full bg-primary/20 text-primary grid place-items-center font-bold shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-foreground truncate">
                        {isAuthenticated ? (user?.name || user?.email || "Authenticated Traveler") : "Guest Traveler"}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {isAuthenticated ? "Govt Verified Account" : "Sign in to save trips & bookings"}
                      </p>
                    </div>
                  </div>
                  {isAuthenticated ? (
                    <button
                      onClick={() => { setOpen(false); logout(); }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold shrink-0 shadow-xs"
                    >
                      Login
                    </Link>
                  )}
                </div>

                {/* Quick Emergency Strip */}
                <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-destructive">
                    <Phone className="w-3.5 h-3.5 animate-pulse shrink-0" />
                    <span>Helpline 1800-11-1363</span>
                  </div>
                  <a
                    href="tel:1800111363"
                    className="px-2.5 py-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold shadow-xs shrink-0"
                  >
                    Call SOS
                  </a>
                </div>

                {/* Regional Language Quick Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Languages className="w-3 h-3 text-primary" /> Language / भाषा
                    </span>
                    <span className="text-[10px] font-medium text-primary">
                      {mobileLanguages.find(l => l.code === lang)?.label || "English"}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {mobileLanguages.map((ml) => (
                      <button
                        key={ml.code}
                        onClick={() => setLang(ml.code)}
                        className={`py-1 px-1 rounded-lg text-center text-xs font-medium transition-all ${
                          lang === ml.code
                            ? "bg-primary text-primary-foreground font-bold shadow-xs"
                            : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {ml.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation Links Group */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Explore & Services
                  </span>
                  <div className="space-y-1">
                    {navKeys.map((item) => {
                      const Icon = item.icon;
                      const active = pathname.startsWith(item.to);

                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                            active
                              ? "bg-primary/10 text-primary font-bold border border-primary/20"
                              : "text-foreground hover:bg-muted/60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`p-1.5 rounded-lg ${
                              active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}>
                              <Icon className="w-4 h-4" />
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold">{t(item.key)}</span>
                                {item.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-primary/20 text-primary">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground leading-tight">{item.desc}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Administrative & Direct Actions */}
                <div className="pt-2 border-t border-border space-y-1">
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>Admin Directorate Panel</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => { setOpen(false); setGuideModalOpen(true); }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <HeartHandshake className="w-4 h-4 text-amber-500" />
                      <span>Register as Certified Guide</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href="https://wa.me/918019402710"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <span>💬</span>
                      <span>Chat with WhatsApp Bot</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Drawer Bottom Footer */}
              <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">Theme</span>
                <button
                  onClick={toggle}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-foreground font-semibold shadow-xs"
                >
                  {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <OfflineBanner />

      <main>
        <Outlet />
      </main>

      <footer className="bg-slate-950 text-slate-300 mt-12 sm:mt-20">
        {/* Main Footer Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            
            {/* Brand & Office Directorate */}
            <div className="space-y-6">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-lg shadow-sm">
                  ब
                </span>
                <span className="font-heading font-bold tracking-wide text-lg text-white">
                  BHARAT <span className="text-primary">YATRA</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                National Cultural Tourism Directorate & Digital Heritage Information System. Connecting travellers with authenticated heritage, artisans, guides, and emergency infrastructure.
              </p>
              
              {/* WhatsApp Business CTA */}
              <a 
                href="https://wa.me/918019402710" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-900/20"
              >
                <span className="text-lg">💬</span> Chat with Business Bot
              </a>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/heritage" className="hover:text-primary transition-colors">Heritage Sites</Link></li>
                <li><Link to="/planner" className="hover:text-primary transition-colors">Cultural Planner</Link></li>
                <li><Link to="/events" className="hover:text-primary transition-colors">Festivals</Link></li>
                <li><Link to="/map" className="hover:text-primary transition-colors">Heritage Map</Link></li>
              </ul>
            </div>

            {/* Column 3: Services */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Services</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/guides" className="hover:text-primary transition-colors">Guides</Link></li>
                <li><Link to="/shop" className="hover:text-primary transition-colors">Artisan Shop</Link></li>
                <li><Link to="/safety" className="hover:text-primary transition-colors text-red-400">Emergency SOS</Link></li>
                <li><Link to="/translate" className="hover:text-primary transition-colors">Translator</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact/Support */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Support</h3>
              <div className="text-sm text-slate-400 space-y-2">
                <p>Helpline: <a href="tel:1800111363" className="text-white hover:text-primary">1800-11-1363</a></p>
                <p><a href="mailto:contact@bharatyatra.gov.in" className="hover:text-primary">contact@bharatyatra.gov.in</a></p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Bharat Yatra Directorate.</p>
            <div className="flex items-center gap-6">
              <Link to="/safety" className="hover:text-white">Safety</Link>
              <button onClick={() => setGuideModalOpen(true)} className="hover:text-white">Become a Guide</button>
              <Link to="/guides" className="hover:text-white">Guides</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Guide Registration Modal */}
      {guideModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setGuideModalOpen(false)}
        >
          <div 
            className="bg-card text-card-foreground w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Compass className="w-5 h-5" />
                  </span>
                  <h2 className="text-lg font-bold text-foreground">Register as a Certified Guide</h2>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect with national & international travellers. Forms are sent to the Guides Coordinator.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGuideModalOpen(false)}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {guideSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-base font-bold text-foreground">Application Received!</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Your guide registration has been submitted and forwarded to the Guides Coordinator Dashboard for review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleGuideSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar Verma"
                    value={guideForm.name}
                    onChange={(e) => setGuideForm({ ...guideForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={guideForm.phone}
                      onChange={(e) => setGuideForm({ ...guideForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Primary Operating City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Visakhapatnam / Varanasi"
                      value={guideForm.city}
                      onChange={(e) => setGuideForm({ ...guideForm, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">State *</label>
                    <select
                      value={guideForm.state}
                      onChange={(e) => setGuideForm({ ...guideForm, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                    >
                      {["Andhra Pradesh", "Telangana", "Uttar Pradesh", "Delhi", "Rajasthan", "Tamil Nadu", "Karnataka", "Maharashtra", "West Bengal", "Kerala", "Madhya Pradesh", "Gujarat", "Odisha", "Punjab", "Other"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Residential Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Door No, Street, Landmark"
                      value={guideForm.address}
                      onChange={(e) => setGuideForm({ ...guideForm, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Hidden / Secret Spot Address You Specialize In *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ancient Buddhist rock cistern behind Bavikonda Hill, secluded bay at Yarada"
                    value={guideForm.hiddenSpot}
                    onChange={(e) => setGuideForm({ ...guideForm, hiddenSpot: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    Share a hidden local heritage spot you know inside out to enrich tourist experiences.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Profile & Guiding Bio (Languages, Experience) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your guiding experience, languages spoken (e.g. English, Hindi, Telugu), license number if any, and cultural specialty."
                    value={guideForm.bio}
                    onChange={(e) => setGuideForm({ ...guideForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGuideModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-1.5 hover:opacity-90 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <BottomNav />
      <AIAssistant />
      <CartDrawer />
    </div>
  );
}