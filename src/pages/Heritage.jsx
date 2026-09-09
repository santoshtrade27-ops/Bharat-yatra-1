import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ExternalLink, FileText, Bus, MapPin, Download, Search, BookOpen, Play } from "lucide-react";
import { Image } from "@/components/ui/image";
import { heritageSites, states, travelGuides, stories } from "@/lib/heritageData";
import { enrichedHeritageSites } from "@/lib/richHeritageData";
import HeritageCard from "@/components/HeritageCard";
import HeritageDetailModal from "@/components/HeritageDetailModal";

const storyCats = ["All", "Crafts", "Spiritual", "Travel", "Folk", "History"];

export default function Heritage() {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("id");
  const [activeModalSite, setActiveModalSite] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [storyCat, setStoryCat] = useState("All");

  // Merge enriched heritage sites with legacy heritage sites (avoiding duplicates)
  const allSites = [...enrichedHeritageSites];
  heritageSites.forEach(s => {
    if (!allSites.some(es => es.id === s.id || es.name.toLowerCase() === s.name.toLowerCase())) {
      allSites.push({
        ...s,
        rating: 4.6,
        reviewsCount: 1200,
        timings: "09:00 AM - 05:30 PM",
        crowdDensity: "Moderate",
        dressCode: "Modest casual attire",
        frequentScams: "Always verify licensed ASI guides. Refuse unauthorized street vendors.",
        safetyTips: "Stay on designated paved paths and carry drinking water."
      });
    }
  });

  // Handle URL id param to open modal automatically
  useEffect(() => {
    if (selectedId) {
      const match = allSites.find(s => s.id === selectedId);
      if (match) {
        setActiveModalSite(match);
      }
    }
  }, [selectedId]);

  // Filtering
  const filteredSites = allSites.filter(site => {
    const matchesSearch = 
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (site.district && site.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (site.city && site.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      site.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = selectedTag === "all" || site.tag === selectedTag;
    const matchesState = selectedState === "all" || site.state.toLowerCase() === selectedState.toLowerCase();

    return matchesSearch && matchesTag && matchesState;
  });

  const filteredStories = stories.filter(
    s => storyCat === "All" || s.category === storyCat
  );

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                Ministry of Tourism & Cyclopedic Registry
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground mt-3">
                India's Living Heritage Sites
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
                Explore UNESCO monuments, ancient rock-cut caves, holy temples, and royal citadels across Andhra Pradesh, Telangana, and all states.
              </p>
            </div>

            {/* Quick Search */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Vizag, Charminar, Borra..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="font-semibold text-muted-foreground shrink-0 mr-1">Filter Tag:</span>
            {["all", "monument", "temple", "caves", "ruins", "nature", "spiritual"].map(t => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-3.5 py-1.5 rounded-full capitalize font-medium transition-colors shrink-0 ${
                  selectedTag === t 
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}

            <span className="font-semibold text-muted-foreground shrink-0 ml-3 mr-1">State:</span>
            {["all", "Andhra Pradesh", "Telangana", "Uttar Pradesh", "Rajasthan", "Karnataka", "Kerala"].map(st => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                  selectedState === st 
                    ? "bg-secondary text-secondary-foreground font-semibold shadow-sm" 
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sites Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Monuments & Sacred Shrines ({filteredSites.length})
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click any heritage card to inspect archaeological narratives, secret acoustic chambers, crowd density, scam alerts, and plan trips.
            </p>
          </div>
        </div>

        {filteredSites.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border p-6">
            <p className="text-base font-semibold text-foreground">No monuments found matching "{searchQuery}"</p>
            <p className="text-xs text-muted-foreground mt-1">Try resetting filters or searching for "Vizag", "Hyderabad", or "Temple".</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedTag("all"); setSelectedState("all"); }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-full bg-primary text-primary-foreground"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.map((s) => (
              <div 
                key={s.id} 
                onClick={() => setActiveModalSite(s)}
                className="cursor-pointer transition-transform hover:-translate-y-1"
              >
                <HeritageCard site={s} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stories Section (Moved directly below Heritage Sites as requested!) */}
      <section className="bg-muted/40 border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Folklore & Artisans</span>
              <h2 className="text-xl sm:text-3xl font-bold text-foreground mt-1">
                Living Stories, Craft Legacies & Documentaries
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Watch oral histories of Banaras master weavers, Rajput folk bards, and Godavari traditions.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap text-xs">
              {storyCats.map((c) => (
                <button
                  key={c}
                  onClick={() => setStoryCat(c)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                    storyCat === c 
                      ? "bg-primary text-primary-foreground font-semibold" 
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStories.map((s) => (
              <a
                key={s.id}
                href={s.link}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border hover:shadow-lg transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    fittingType="fill"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md">
                    {s.category}
                  </span>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg">
                      {s.type === "video" ? <Play className="w-5 h-5 fill-current" /> : <BookOpen className="w-5 h-5" />}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                    {s.title}
                  </h3>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                    <span className="capitalize">{s.type} Archive</span>
                    <span className="flex items-center gap-1 text-primary font-medium">
                      Explore <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* States & their history */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-6">
          States & Living Chronicles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {states.map((st) => (
            <div
              key={st.name}
              className="flex flex-col sm:flex-row gap-3 sm:gap-5 bg-card rounded-2xl overflow-hidden ring-1 border border-border hover:shadow-lg transition-shadow"
            >
              <div className="h-40 sm:h-auto sm:w-40 shrink-0 overflow-hidden">
                <Image
                  src={st.image}
                  alt={st.name}
                  className="w-full h-full"
                  fittingType="fill"
                />
              </div>
              <div className="p-4 sm:py-4 sm:pr-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-foreground text-base sm:text-lg">{st.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-3">
                    {st.description}
                  </p>
                </div>
                <a
                  href={st.wiki}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-3 hover:underline w-fit"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Wikipedia Archive
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Travel Guides — AP & Telangana */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="mb-6">
          <p className="text-primary text-xs font-semibold uppercase tracking-wider">
            Official PDF Guides & Portals
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
            Andhra Pradesh & Telangana — Tourism & Transport Portals
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Official brochures, bus route charts, and metro maps directly from government departments.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {travelGuides.map((g) => (
            <a
              key={g.title}
              href={g.url}
              target="_blank"
              rel="noreferrer"
              className="block p-4 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/15 grid place-items-center shrink-0">
                  {g.type === "Transport" ? (
                    <Bus className="w-5 h-5 text-primary" />
                  ) : g.type === "Offline Guide" ? (
                    <Download className="w-5 h-5 text-primary" />
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {g.type}
                  </span>
                  <h3 className="font-semibold text-foreground text-sm mt-1">{g.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{g.description}</p>
                  <p className="text-xs font-medium text-primary mt-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {g.state}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Heritage Detail Modal */}
      {activeModalSite && (
        <HeritageDetailModal
          site={activeModalSite}
          onClose={() => {
            setActiveModalSite(null);
            if (params.get("id")) {
              setParams({});
            }
          }}
        />
      )}
    </div>
  );
}
