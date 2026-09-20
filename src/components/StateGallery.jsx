import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, Eye, X, ArrowRight, Sparkles, 
  Calendar, Award, Compass, Search, Camera
} from "lucide-react";
import { Image } from "@/components/ui/image";
import ThreeDTiltCard from "@/components/ui/ThreeDTiltCard";

export const STATE_GALLERY_DATA = [
  {
    id: "rj",
    state: "Rajasthan",
    region: "West & Central",
    landmark: "Hawa Mahal & Amber Fort",
    title: "Land of Maharajas & Golden Deserts",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&auto=format&fit=crop&q=80",
    caption: "The pink sandstone lattice of Hawa Mahal allowed royal women to observe street pageants unseen. Rajasthan's grand hilltop forts, ornate havelis, and vibrant Thar Desert dunes embody India's chivalric royal legacy.",
    highlights: ["Amber Fort Elephant Passage", "Jaisalmer Golden Fortress", "Udaipur Lake Palaces", "Pushkar Camel Fair"],
    bestTime: "October – March",
    unesco: true,
  },
  {
    id: "kl",
    state: "Kerala",
    region: "South India",
    landmark: "Alleppey Backwaters & Munnar Tea Hills",
    title: "God's Own Country & Spice Trails",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80",
    caption: "Serene coconut-fringed backwaters navigated by traditional Kettuvallam houseboats. Nestled alongside misty Western Ghats tea plantations and ancient Ayurvedic healing traditions.",
    highlights: ["Alleppey Houseboat Cruises", "Munnar Misty Tea Gardens", "Kathakali Temple Dances", "Periyar Elephant Sanctuary"],
    bestTime: "September – March",
    unesco: false,
  },
  {
    id: "jk",
    state: "Jammu & Kashmir",
    region: "North India",
    landmark: "Dal Lake & Gulmarg Snow Peaks",
    title: "Paradise on Earth & Alpine Valleys",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&auto=format&fit=crop&q=80",
    caption: "Wooden Shikaras gliding gently past floating lotus markets on Dal Lake under snow-capped Himalayan peaks. Renowned for hand-knotted Pashmina shawls and saffron fields of Pampore.",
    highlights: ["Shikara Rides on Dal Lake", "Gulmarg Gondola Ski Slopes", "Pahalgam Valley Meadows", "Floating Flower Markets"],
    bestTime: "April – October (Summer) & Dec – Feb (Snow)",
    unesco: false,
  },
  {
    id: "tn",
    state: "Tamil Nadu",
    region: "South India",
    landmark: "Meenakshi Amman & Mahabalipuram",
    title: "Cradle of Dravidian Temple Architecture",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80",
    caption: "Towering Gopurams soaring with thousands of hand-painted mythological sculptures. Shore temples of Mahabalipuram carved from monolith rocks stand as testimony to 7th-century Pallava maritime art.",
    highlights: ["Madurai Meenakshi Gopurams", "Mahabalipuram Shore Temples", "Thanjavur Brihadishvara Temple", "Kanchipuram Silk Looms"],
    bestTime: "November – February",
    unesco: true,
  },
  {
    id: "up",
    state: "Uttar Pradesh",
    region: "North India",
    landmark: "Taj Mahal & Kashi Vishwanath Ghats",
    title: "Heartland of Sacred Rivers & Mughal Splendor",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80",
    caption: "The pristine white marble of the Taj Mahal glowing at sunrise on the banks of Yamuna, alongside Varanasi's ancient Ganga Aarti where bronze lamps illuminate 3,000-year-old riverfront ghats.",
    highlights: ["Agra Fort & Taj Mahal", "Varanasi Evening Ganga Aarti", "Sarnath Buddhist Stupas", "Mathura Vrindavan Temples"],
    bestTime: "October – March",
    unesco: true,
  },
  {
    id: "ka",
    state: "Karnataka",
    region: "South India",
    landmark: "Hampi Boulder Ruins & Mysore Palace",
    title: "Stone Chariots & Golden Royal Palaces",
    image: "https://images.unsplash.com/photo-1600100397608-f010e423b971?w=1200&auto=format&fit=crop&q=80",
    caption: "Surreal boulder-strewn landscapes housing the 14th-century Vijayanagara empire ruins at Hampi, paired with Mysore Palace illuminated by over 100,000 bulbs during Dasara festivities.",
    highlights: ["Hampi Stone Chariot & Vittala", "Mysore Royal Palace", "Badami Cave Temples", "Coorg Coffee Estates"],
    bestTime: "October – March",
    unesco: true,
  },
  {
    id: "or",
    state: "Odisha",
    region: "East & Northeast",
    landmark: "Konark Sun Temple & Puri Beach",
    title: "Chariot of the Sun God & Temple Art",
    image: "https://images.unsplash.com/photo-1626014903708-691955774b14?w=1200&auto=format&fit=crop&q=80",
    caption: "Carved entirely as a massive 24-wheeled stone chariot pulled by seven strain horses, Konark's 13th-century Sun Temple is a monumental masterpiece of Kalinga architectural geometry.",
    highlights: ["Konark Sun Temple Wheels", "Puri Jagannath Rath Yatra", "Chilika Lake Flamingo Sanctuary", "Udayagiri Rock Caves"],
    bestTime: "October – March",
    unesco: true,
  },
  {
    id: "hp",
    state: "Himachal Pradesh",
    region: "North India",
    landmark: "Spiti Valley & Dharamshala Monasteries",
    title: "Land of Snow Monasteries & Pine Valleys",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&auto=format&fit=crop&q=80",
    caption: "High-altitude cold desert landscapes dotted with thousand-year-old Tibetan monasteries like Key Gompa, overlooking crystal turquoise glacier rivers in the shadow of the Himalayas.",
    highlights: ["Key Monastery Spiti", "Dharamshala Dalai Lama Temple", "Shimla Ridge Heritage Mall", "Solang Snow Valley"],
    bestTime: "May – October (Spiti) & Nov – Feb (Snow)",
    unesco: false,
  },
  {
    id: "goa",
    state: "Goa",
    region: "West & Central",
    landmark: "Basilica of Bom Jesus & Palolem Coast",
    title: "Portuguese Heritage & Sunlit Palm Beaches",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80",
    caption: "Baroque Latin Quarter architecture of Fontainhas with pastel-colored homes, historic 16th-century churches of Old Goa, and golden palm-fringed Arabian Sea beaches.",
    highlights: ["Basilica of Bom Jesus UNESCO Site", "Fontainhas Latin Heritage Walk", "Dudhsagar Waterfalls Trek", "Spice Plantation Tours"],
    bestTime: "November – February",
    unesco: true,
  },
  {
    id: "as",
    state: "Assam",
    region: "East & Northeast",
    landmark: "Kaziranga Rhino Sanctuary & Brahmaputra",
    title: "Realm of the One-Horned Rhino & Tea Valleys",
    image: "https://images.unsplash.com/photo-1616881512061-6b83f36dd387?w=1200&auto=format&fit=crop&q=80",
    caption: "Lush elephant grass grasslands of Kaziranga sheltering two-thirds of the world's great one-horned rhinoceros population alongside the mighty Brahmaputra river and emerald tea estates.",
    highlights: ["Kaziranga Rhino Safari", "Majuli World's Largest River Island", "Kamakhya Shakti Shrine", "Assam Silk Looms"],
    bestTime: "November – April",
    unesco: true,
  },
  {
    id: "pb",
    state: "Punjab",
    region: "North India",
    landmark: "Golden Temple Amritsar & Wagah Border",
    title: "Spiritual Sanctum of Gold & Warm Hospitality",
    image: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=1200&auto=format&fit=crop&q=80",
    caption: "The gilded Sri Harmandir Sahib floating peacefully in the Amrit Sarovar holy pool, serving over 100,000 free meals daily in the world's largest community kitchen (Langar).",
    highlights: ["Golden Temple Amrit Sarovar", "World's Largest Community Langar", "Wagah Border Flag Ceremony", "Jallianwala Bagh Memorial"],
    bestTime: "October – March",
    unesco: false,
  },
  {
    id: "mh",
    state: "Maharashtra",
    region: "West & Central",
    landmark: "Ajanta & Ellora Caves & Gateway of India",
    title: "Monolithic Rock Carvings & Fortified Coasts",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
    caption: "The stupendous Kailasa Temple at Ellora — carved top-down out of a single gigantic basalt rock face, alongside ancient Buddhist murals painted inside dark lava caves of Ajanta.",
    highlights: ["Ellora Kailasa Monolithic Temple", "Ajanta Buddhist Mural Caves", "Mumbai Marine Drive Arc", "Raigad Maratha Forts"],
    bestTime: "October – March",
    unesco: true,
  },
];

const REGIONS = ["All Regions", "North India", "South India", "West & Central", "East & Northeast"];

export default function StateGallery({ limit }) {
  const [activeRegion, setActiveRegion] = useState("All Regions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [items, setItems] = useState(() => {
    const cached = localStorage.getItem("by-states-directory") || localStorage.getItem("by-admin-entity-states");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return Array.isArray(STATE_GALLERY_DATA) ? STATE_GALLERY_DATA : [];
  });

  useEffect(() => {
    function handleUpdate(e) {
      if (Array.isArray(e?.detail) && e.detail.length > 0) {
        setItems(e.detail);
      }
    }
    window.addEventListener("by-states-updated", handleUpdate);
    return () => {
      window.removeEventListener("by-states-updated", handleUpdate);
    };
  }, []);

  const safeItems = Array.isArray(items) ? items : [];
  const filteredItems = safeItems.filter((item) => {
    if (!item) return false;
    const stateName = item.state || "";
    const landmarkName = item.landmark || "";
    const titleName = item.title || "";
    const matchesRegion = activeRegion === "All Regions" || item.region === activeRegion;
    const matchesSearch = 
      stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      landmarkName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      titleName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const displayItems = Array.isArray(filteredItems) ? (limit ? filteredItems.slice(0, limit) : filteredItems) : [];

  return (
    <div className="w-full">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Heritage Tapestry</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground font-heading tracking-tight">
            State Visual Highlights
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-1 max-w-xl">
            Explore high-resolution visual stories and descriptive architectural heritage across India's diverse states.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search state or landmark..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-card border border-border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-foreground"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Region Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        {REGIONS.map((r) => {
          const isActive = activeRegion === r;
          return (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 border ${
                isActive
                  ? "bg-amber-500 text-stone-950 border-amber-400 shadow-md scale-105"
                  : "bg-card text-muted-foreground border-border hover:border-amber-500/40 hover:text-foreground"
              }`}
            >
              {r}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      {displayItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-card border border-border">
          <Compass className="w-10 h-10 text-amber-500 mx-auto mb-3 opacity-60" />
          <p className="font-semibold text-foreground">No state highlights match your search</p>
          <p className="text-xs text-muted-foreground mt-1">Try resetting search filters or keywords.</p>
          <button
            onClick={() => { setSearchQuery(""); setActiveRegion("All Regions"); }}
            className="mt-4 px-4 py-2 rounded-full bg-amber-500 text-stone-900 font-semibold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-none -mx-1 px-1">
          {(Array.isArray(displayItems) ? displayItems : []).map((item) => (
            <div key={item.id} className="min-w-[290px] max-w-[290px] sm:min-w-[360px] sm:max-w-[360px] snap-start shrink-0">
              <ThreeDTiltCard
                key={item.id}
                maxTilt={10}
                scale={1.03}
                glare={true}
                onClick={() => setSelectedImage(item)}
                className="group h-full rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer animate-in fade-in zoom-in duration-300"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-56 overflow-hidden rounded-t-3xl bg-slate-900">
                    <Image
                      src={item.image}
                      alt={item.state}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      fittingType="fill"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5" style={{ transform: "translateZ(25px)" }}>
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-amber-500/30">
                        {item.state}
                      </span>
                      {item.unesco && (
                        <span className="px-2 py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                          <Award className="w-3 h-3" /> UNESCO
                        </span>
                      )}
                    </div>

                    {/* Eye Zoom overlay icon */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-stone-200 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                      <Eye className="w-4 h-4" />
                    </div>

                    {/* Landmark overlay tag */}
                    <div className="absolute bottom-3 left-3 right-3 text-white" style={{ transform: "translateZ(20px)" }}>
                      <p className="flex items-center gap-1 text-[11px] font-medium text-amber-300 drop-shadow-sm">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        {item.landmark}
                      </p>
                      <h3 className="text-base font-bold font-heading line-clamp-1 drop-shadow-md mt-0.5">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Caption & Content */}
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {item.caption}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-500" />
                        {item.bestTime}
                      </span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Inspect Caption <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </ThreeDTiltCard>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Visual Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-stone-900 border border-amber-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto text-stone-100 shadow-2xl relative grid md:grid-cols-2 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image View */}
            <div className="relative h-72 md:h-full bg-black flex items-center justify-center">
              <Image
                src={selectedImage.image}
                alt={selectedImage.state}
                className="w-full h-full object-cover"
                fittingType="fill"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 border border-amber-500/40 text-amber-400 text-xs font-bold backdrop-blur-md">
                {selectedImage.state}
              </span>
            </div>

            {/* Content Details & Caption */}
            <div className="p-6 md:p-8 flex flex-col justify-between bg-stone-900">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                    {selectedImage.region}
                  </span>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 grid place-items-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
                  {selectedImage.title}
                </h3>

                <p className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedImage.landmark}
                </p>

                {/* Descriptive Caption */}
                <div className="mt-4 p-4 rounded-2xl bg-stone-800/80 border border-stone-700/80 text-stone-200 text-xs leading-relaxed">
                  <p className="font-semibold text-amber-300 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Heritage Story & Caption:
                  </p>
                  {selectedImage.caption}
                </div>

                {/* Highlights */}
                <div className="mt-4">
                  <p className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                    Key Highlights:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
                    {(selectedImage.highlights_raw 
                      ? selectedImage.highlights_raw.split(",").map(h => h.trim()).filter(Boolean)
                      : (Array.isArray(selectedImage.highlights) ? selectedImage.highlights : [])
                    ).map((h, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Footer Links */}
              <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
                <div className="text-[11px] text-stone-400">
                  <span className="block text-stone-500">Best Season:</span>
                  <span className="font-semibold text-stone-200">{selectedImage.bestTime}</span>
                </div>

                <Link
                  to={`/heritage?search=${encodeURIComponent(selectedImage.state)}`}
                  onClick={() => setSelectedImage(null)}
                  className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg"
                >
                  Explore {selectedImage.state} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
