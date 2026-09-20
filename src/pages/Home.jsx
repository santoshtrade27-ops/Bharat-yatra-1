import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  ArrowRight, MapPin, Star, Camera, 
  Video, User, Users, UsersRound, X, ShieldAlert 
} from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { heritageSites, foods as staticFoods, products as staticProducts, heroImage } from "@/lib/heritageData";
import { useI18n } from "@/lib/i18n";
import HeritageCard from "@/components/HeritageCard";
import FoodCard from "@/components/FoodCard";
import ProductCard from "@/components/ProductCard";
import HeroVideo from "@/components/HeroVideo";
import StateGallery from "@/components/StateGallery";



const groupCards = [
  { label: "Solo", tagline: "Explore at your own pace", icon: User },
  { label: "Family", tagline: "Kid-friendly heritage trips", icon: Users },
  { label: "Group", tagline: "Friends & group adventures", icon: UsersRound },
];

const groupOverviews = {
  Solo: {
    title: "Solo Heritage Journey",
    points: [
      "Flexible itinerary — linger where you love",
      "Budget-friendly stays & public transport",
      "Best for photography & slow travel",
      "Recommended: 3–5 day trips",
    ],
    budget: "₹10,000 – ₹25,000",
  },
  Family: {
    title: "Family & Senior Heritage Trip",
    points: [
      "Kid & elder-friendly sites with zero-climb access & shaded rest stops",
      "Verified family suites at heritage hotels & resorts",
      "Licensed guides with safe, comfortable pace & wheelchair support",
      "Recommended: 3–6 day circuits with minimal road fatigue",
    ],
    budget: "₹30,000 – ₹75,000",
    scams: [
      { name: "Fake VIP Darshan Passes", desc: "Touts near Tirupati / Varanasi charging ₹2,000+ for fake priority slips. Only official Devasthanam counters are valid." },
      { name: "'Monument Closed Today' Auto Trick", desc: "Drivers in Delhi, Jaipur & Agra claiming monuments are closed for VIP prayer to divert families to expensive private stores." },
      { name: "Counterfeit Pearls & Gemstones", desc: "Untested synthetic pearls sold near Charminar with fake plastic certificates. Look for govt hallmark." },
      { name: "Unauthorized Cave Torch Touts", desc: "At Borra Caves, touts demanding steep fees for torches. The main walking trail has official lights." },
      { name: "Aggressive Boat Donation Extortion", desc: "Private boatmen demanding cash donations mid-stream. Book only through government tourism counters." }
    ]
  },
  Group: {
    title: "Group Adventure",
    points: [
      "Group discounts on transport & guides",
      "Shared rooms & bulk booking rates",
      "Best for college & office trips",
      "Recommended: 5–10 day trips",
    ],
    budget: "₹15,000 – ₹40,000 per person",
  },
};

export default function Home() {
  const [media, setMedia] = useState("photo");
  const [heroVideo, setHeroVideo] = useState("p8mXAQ6cPxg");
  const [heroVideoUrl, setHeroVideoUrl] = useState(
    "https://media.base44.com/videos/public/6a9bae9fd15b41c75cea5237/4135fd9b0_vidssavecomIncredibleIndia4K-BeyondtheStereotypes_TheRealIndiaRevealed720P.mp4"
  );
  const [currentHeroImage, setCurrentHeroImage] = useState(heroImage);
  const [activeGroup, setActiveGroup] = useState(null);
  const [foods, setFoods] = useState(staticFoods);
  const [products, setProducts] = useState(staticProducts);
  const [sites, setSites] = useState(heritageSites);
  const { t } = useI18n();
  useEffect(() => {
    try {
      const c = localStorage.getItem("by-site-config");
      if (c) {
        const cfg = JSON.parse(c);
        if (cfg.heroVideo) setHeroVideo(cfg.heroVideo);
        if (cfg.heroVideoUrl) setHeroVideoUrl(cfg.heroVideoUrl);
        if (cfg.heroImage) setCurrentHeroImage(cfg.heroImage);
      }
    } catch {}

    const loadPlaces = () => {
      try {
        const saved = localStorage.getItem("by-admin-entity-places");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSites(parsed);
            return;
          }
        }
      } catch {}
      setSites(heritageSites);
    };

    const loadFoods = () => {
      try {
        const saved = localStorage.getItem("by-admin-entity-foods");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFoods(parsed);
            return;
          }
        }
      } catch {}
      setFoods(staticFoods);
    };

    const loadProducts = () => {
      try {
        const saved = localStorage.getItem("by-admin-entity-products") || localStorage.getItem("by-artisan-products");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
            return;
          }
        }
      } catch {}
      setProducts(staticProducts);
    };

    loadPlaces();
    loadFoods();
    loadProducts();

    // Fetch from base44 backend if available and has items
    base44.entities.Place.list("-created_date", 20).then((list) => {
      if (list && list.length) {
        const formatted = list.map((p) => ({
          id: p.id, name: p.name, state: p.state, tag: p.tag,
          image: p.image, description: p.description, wiki: p.wiki, youtube: p.youtube,
        }));
        setSites(formatted);
        localStorage.setItem("by-admin-entity-places", JSON.stringify(formatted));
      }
    }).catch(() => {});

    base44.entities.Food.list("-created_date", 20).then((list) => {
      if (list && list.length) {
        setFoods(list);
        localStorage.setItem("by-admin-entity-foods", JSON.stringify(list));
      }
    }).catch(() => {});

    base44.entities.Product.list("-created_date", 20).then((list) => {
      if (list && list.length) {
        setProducts(list);
        localStorage.setItem("by-admin-entity-products", JSON.stringify(list));
        localStorage.setItem("by-artisan-products", JSON.stringify(list));
      }
    }).catch(() => {});

    window.addEventListener("by-places-updated", loadPlaces);
    window.addEventListener("by-foods-updated", loadFoods);
    window.addEventListener("by-products-updated", loadProducts);

    return () => {
      window.removeEventListener("by-places-updated", loadPlaces);
      window.removeEventListener("by-foods-updated", loadFoods);
      window.removeEventListener("by-products-updated", loadProducts);
    };
  }, []);
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[560px] flex items-center justify-center text-center overflow-hidden">
        <Image
          src={currentHeroImage}
          alt="Red Fort, Delhi"
          className="absolute inset-0 w-full h-full"
          fittingType="fill"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/55 to-stone-900/80" />

        <div className="absolute top-5 right-4 z-20 flex items-center gap-1 p-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-800 text-stone-200 text-xs font-medium shadow-lg">
          <button
            onClick={() => setMedia("photo")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
              media === "photo" ? "bg-amber-500 text-stone-900 font-bold shadow-md" : "hover:text-amber-400"
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Photo
          </button>
          <button
            onClick={() => setMedia("video")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
              media === "video" ? "bg-amber-500 text-stone-900 font-bold shadow-md" : "hover:text-amber-400"
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Video
          </button>
        </div>

        {media === "video" && (
          <div className="absolute inset-0 z-[1] overflow-hidden bg-black">
            {heroVideoUrl ? (
              <HeroVideo src={heroVideoUrl} />
            ) : (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${heroVideo}?autoplay=1&mute=1&controls=1&modestbranding=1&playsinline=1&rel=0`}
                title="Heritage India"
                allow="autoplay; encrypted-media; fullscreen"
                frameBorder="0"
              />
            )}
          </div>
        )}

        {media === "photo" && (
          <div className="relative z-10 max-w-3xl px-4 sm:px-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/70 text-stone-200 text-xs font-medium mb-4 sm:mb-6">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Red Fort, Delhi
            </span>
            <h1 className="text-3xl sm:text-6xl font-bold text-white leading-tight tracking-tight font-heading">
              {t("hero_title_1")}{" "}
              <span className="text-amber-400">{t("hero_title_2")}</span>
            </h1>
            <p className="mt-4 sm:mt-5 text-sm sm:text-lg text-stone-200 max-w-xl mx-auto">
              {t("hero_sub")}
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none mx-auto">
              <Link
                to="/planner"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-amber-500 text-stone-900 font-bold text-sm hover:bg-amber-400 active:scale-95 transition-all shadow-lg"
              >
                Plan my trip <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/heritage"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-white/40 text-white font-semibold text-sm hover:bg-white/10 active:scale-95 transition-all"
              >
                Explore sites
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Heritage sites */}
      <Section
        eyebrow={t("section_heritage_sites")}
        title={t("section_heritage_sub")}
      >
        <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 snap-x scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 touch-scroll">
          {sites.map((s) => (
            <div key={s.id} className="min-w-[270px] max-w-[270px] sm:min-w-[280px] snap-start shrink-0">
              <HeritageCard site={s} />
            </div>
          ))}
        </div>
      </Section>

      {/* State Gallery Highlights */}
      <section className="bg-muted/40 border-y border-border py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <StateGallery />
        </div>
      </section>

      {/* Food */}
      <Section eyebrow={t("section_foods")} title={t("section_foods_sub")}>
        <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 snap-x scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 touch-scroll">
          {foods.map((f) => (
            <div key={f.name} className="min-w-[250px] max-w-[250px] snap-start shrink-0">
              <FoodCard food={f} />
            </div>
          ))}
        </div>
      </Section>

      {/* Products */}
      <Section
        eyebrow={t("section_crafts")}
        title={t("section_crafts_sub")}
      >
        <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 snap-x scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 touch-scroll">
          {products.slice(0, 6).map((p, idx) => (
            <div key={p.id || p.name || p.title || idx} className="min-w-[250px] max-w-[250px] snap-start shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-foreground hover:text-background active:scale-95 transition-all"
          >
            {t("lbl_artisan_bazaar")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Section>

      {activeGroup && groupOverviews[activeGroup] && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setActiveGroup(null)}
        >
          <div
            className="bg-card rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6 shadow-2xl ring-1 ring-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-foreground">{groupOverviews[activeGroup].title}</h3>
              <button
                onClick={() => setActiveGroup(null)}
                className="w-8 h-8 grid place-items-center rounded-full hover:bg-muted shrink-0"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {groupOverviews[activeGroup].points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>

            {/* Real Scams Alert Section (Especially for Family & Seniors) */}
            {groupOverviews[activeGroup].scams && (
              <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 space-y-2.5">
                <div className="flex items-center gap-2 text-destructive font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Real Local Scams & Traps to Avoid Here</span>
                </div>
                <div className="space-y-2">
                  {groupOverviews[activeGroup].scams.map((scam) => (
                    <div key={scam.name} className="p-2 rounded-lg bg-background/80 border border-border text-xs">
                      <p className="font-bold text-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                        {scam.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{scam.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  Tip: Always dial National Tourist Police Helpline 1363 for instant assistance at monuments & stations.
                </p>
              </div>
            )}

            <div className="mt-4 p-3 rounded-xl bg-muted text-sm">
              <span className="text-muted-foreground">Typical budget: </span>
              <span className="font-bold text-foreground">{groupOverviews[activeGroup].budget}</span>
            </div>
            <Link
              to="/planner"
              onClick={() => setActiveGroup(null)}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Plan this trip <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ eyebrow, title, children }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-6 sm:mb-8">
        <p className="text-primary text-xs font-semibold uppercase tracking-wider">
          {eyebrow}
        </p>
        <h2 className="text-xl sm:text-3xl font-bold text-foreground mt-1.5">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}