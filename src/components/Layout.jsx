import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  Menu, X, Mic, Sun, Moon, Phone, User, Shield, 
  Compass, LogIn, LogOut, Send
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import OfflineBanner from "@/components/OfflineBanner";
import BottomNav from "@/components/BottomNav";
import AIAssistant from "@/components/AIAssistant";
import CartDrawer from "@/components/CartDrawer";
import LanguageToggle from "@/components/LanguageToggle";

const navKeys = [
  { to: "/heritage", key: "nav_heritage" },
  { to: "/planner", key: "nav_planner" },
  { to: "/surprise-planner", key: "nav_surprise_planner" },
  { to: "/map", key: "nav_map" },
  { to: "/events", key: "nav_events" },
  { to: "/guides", key: "nav_guides" },
  { to: "/shop", key: "nav_shop" },
  { to: "/safety", key: "nav_safety" },
  { to: "/translate", key: "nav_translate" },
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
  const { isAuthenticated, logout } = useAuth();

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
    <div className="min-h-screen bg-background text-foreground pb-16 md:pb-0">
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-lg shadow-md">
              ब
            </span>
            <span className="font-heading font-semibold tracking-wide text-sm sm:text-base">
              BHARAT <span className="text-primary">YATRA</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navKeys.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  pathname.startsWith(l.to)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <div className="hidden sm:block">
              <LanguageToggle
                selectedLang={lang}
                onSelectLang={setLang}
              />
            </div>
            <button
              onClick={toggle}
              className="w-9 h-9 grid place-items-center rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              to="/translate"
              className="hidden sm:grid place-items-center w-9 h-9 rounded-full hover:bg-muted transition-colors text-primary"
              aria-label="Voice Translator"
              title="Voice Translator & Speech"
            >
              <Mic className="w-4 h-4" />
            </Link>
            <Link
              to="/safety"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> SOS
            </Link>
            <Link
              to="/admin"
              className="hidden sm:grid place-items-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
              aria-label="Admin"
            >
              <Shield className="w-4 h-4" />
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => logout()}
                className="hidden sm:grid place-items-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
                aria-label="Logout"
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
            <Link
              to="/profile"
              className="w-9 h-9 grid place-items-center rounded-full bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Profile"
            >
              <User className="w-4 h-4" />
            </Link>
            <button
              className="lg:hidden w-9 h-9 grid place-items-center rounded-full hover:bg-muted"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-card px-4 py-3">
            <div className="grid grid-cols-2 gap-3.5">
              {navKeys.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="py-2.5 px-2 text-center text-sm text-muted-foreground hover:text-primary rounded-lg hover:bg-muted"
                >
                  {t(l.key)}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
              <div className="w-full sm:w-auto">
                <LanguageToggle
                  selectedLang={lang}
                  onSelectLang={setLang}
                />
              </div>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-muted"
              >
                <Shield className="w-4 h-4" /> Admin
              </Link>
              <Link
                to="/safety"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Phone className="w-4 h-4" /> SOS
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
              {isAuthenticated ? (
                <button
                  onClick={() => { setOpen(false); logout(); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted ml-auto"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-primary/10 ml-auto"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
              )}
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