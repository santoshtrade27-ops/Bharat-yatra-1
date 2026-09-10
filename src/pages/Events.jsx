import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  CalendarDays, ArrowRight, 
  MapPin, Search, X, Sparkles, ExternalLink, 
  AlertTriangle, Users, BookOpen, Video, Send, Bot
} from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";

// Festival details enriched with Scam Warnings, Crowd Density, Best Visiting Hours, and Media Links
const enrichedEvents = [
  {
    id: "kumbh",
    name: "Maha Kumbh Mela",
    state: "Uttar Pradesh",
    city: "Prayagraj",
    month: "January–February",
    category: "Sacred & Temple",
    image: "https://www.google.com/imgres?q=maha%20kumbh%20mela%20image&imgurl=https%3A%2F%2Fc9admin.cottage9.com%2Fuploads%2F5612%2Fmahakumbh-2025.jpg&imgrefurl=https%3A%2F%2Fwww.cottage9.com%2Fblog%2Fmahakumbh-mela-2025-a-spiritual-journey-of-a-lifetime%2F&docid=s-e4N558utcueM&tbnid=vNKRgKsX2Lpf_M&vet=12ahUKEwi7up_5k-SWAxW-SGwGHXU8NwsQnPAOegQIRRAA..i&w=980&h=692&hcb=2&ved=2ahUKEwi7up_5k-SWAxW-SGwGHXU8NwsQnPAOegQIRRAA",
    timing: "Sacred Shahi Snan dips begin at 4:00 AM; Aarti at 6:30 PM",
    dress: "Simple modest cotton dhotis or kurtas; warm layers for cold mornings",
    rules: "Follow designated one-way pontoon bridges; do not carry valuable jewelry to the ghats",
    history:
      "The largest peaceful gathering of humanity on earth, where millions of sadhus and pilgrims take a holy dip at the confluence of the Ganga, Yamuna, and Saraswati rivers.",
    crowdDensity: "Extremely High (Millions daily)",
    crowdRating: "5/5",
    bestVisitingHours: "Early morning 4:30 AM – 7:30 AM or late night after 9:30 PM",
    scamWarning: "Beware of unauthorized boatmen at Sangam charging ₹2,500 to ₹5,000 for a 15-minute ride. Always use official government ticketed boats (fixed rate of ₹100–₹150 per head with life jackets).",
    wikiQuery: "Kumbh_Mela",
    youtubeQuery: "Kumbh Mela Prayagraj documentary celebration",
    aiPlan: {
      summary: "Think of Kumbh Mela like the biggest family gathering in the whole world! People come to celebrate and wash away bad feelings in the cool sacred rivers. It is super colorful with monks, lamps, and evening songs.",
      day1: "Arrive in Prayagraj early morning. Take the official shuttle bus to Sector 4 tent city. Walk across the pontoon bridges to see the holy flags and akharas.",
      day2: "Wake up at 5:00 AM for the morning river dip at Sangam. Have hot jalebi and poori-bhaji from government approved food stalls. Attend the grand evening Ganga Aarti at 6:30 PM.",
      day3: "Visit the underground Patalpuri Temple inside the historic Allahabad Fort. Shop for handcrafted brass bells and rudraksha beads from registered local artisans.",
      familyTips: "Keep an identity slip with your phone number inside your child's pocket. Stick together and use designated lost-and-found camps.",
    },
  },
  {
    id: "pushkar",
    name: "Pushkar Camel Fair & Kartik Purnima",
    state: "Rajasthan",
    city: "Pushkar",
    month: "November",
    category: "Royal Heritage",
    image: "https://media.base44.com/images/public/6a9bae9fd15b41c75cea5237/9ff7e9e4f_generated_97a8ecae.jpg",
    timing: "Desert camp sunrise hot air balloons at 6:00 AM; Mela ground dances 2:00 PM – 9:00 PM",
    dress: "Sun-protective cotton clothing, scarf/hat for desert sand, comfortable walking shoes",
    rules: "Ask for permission before photographing local nomads; remove shoes before stepping onto sacred ghats",
    history:
      "A magnificent spectacle on the edge of the Thar Desert, bringing together nomadic camel herders, folk musicians, puppet artists, and spiritual bathers around the sacred Brahma Lake.",
    crowdDensity: "High (Festive Rush)",
    crowdRating: "4/5",
    bestVisitingHours: "Sunrise 6:00 AM – 9:00 AM for camel races; Evening 5:00 PM – 8:00 PM for folk dance",
    scamWarning: "Beware of the infamous 'Rose Petal / Priest Blessing Scam' near the lake ghats. Strangers hand you flowers, chant mantras, and then demand ₹2,000 to ₹10,000. Firmly say 'No thank you' and walk away.",
    wikiQuery: "Pushkar_Fair",
    youtubeQuery: "Pushkar Camel Fair Rajasthan celebration",
    aiPlan: {
      summary: "Pushkar Fair is a giant desert carnival where decorated camels wear pretty pom-poms and bracelets! You will hear Rajasthani fiddles, see snake charmers, and watch hot air balloons float in the pink sky.",
      day1: "Arrive in Pushkar and walk through the bustling bazaar. Reach the sand dunes before sunset to see thousands of camels resting beside campfires.",
      day2: "Early morning visit to the world-famous Jagatpita Brahma Temple. Enjoy the hilarious camel beauty contest and turban-tying championship at the Mela ground.",
      day3: "Take a desert camel safari to sunset point. Taste authentic Rajasthani Dal Baati Churma and sweet rabdi malpua in the village square.",
      familyTips: "Desert sand can get warm in afternoon. Wear sun hats and carry plenty of bottled water.",
    },
  },
  {
    id: "mysore-dasara",
    name: "Mysore Dasara Jumboo Savari",
    state: "Karnataka",
    city: "Mysore",
    month: "October",
    category: "Royal Heritage",
    image: "https://media.base44.com/images/public/6a9bae9fd15b41c75cea5237/10b42fd24_generated_c8aeaf12.jpg",
    timing: "Palace illumination daily 7:00 PM; Grand Jumboo Savari procession begins 2:00 PM on Vijayadashami",
    dress: "Modest smart casuals or traditional South Indian attire",
    rules: "No drone flying without police permit; laser pointers strictly prohibited near elephant procession",
    history:
      "A 400-year-old royal celebration honoring Goddess Chamundeshwari, featuring majestic decorated elephants carrying a 750 kg golden howdah through illuminated palace avenues.",
    crowdDensity: "High to Peak",
    crowdRating: "4.5/5",
    bestVisitingHours: "10:00 AM – 1:00 PM for palace halls; 6:45 PM – 8:00 PM for glittering lights",
    scamWarning: "Beware of touts outside Palace Gate 4 selling counterfeit VIP gallery wristbands for ₹1,500. Genuine tickets are only issued via the official Karnataka Tourism portal.",
    wikiQuery: "Mysore_Dasara",
    youtubeQuery: "Mysore Dasara Jumboo Savari royal elephant procession",
    aiPlan: {
      summary: "Mysore Dasara is like a real-life fairy tale! A magnificent royal palace lights up with 100,000 golden bulbs, and giant gentle elephants wear golden painted suits to march proudly.",
      day1: "Tour the grand Mysore Palace durbar halls in the morning. Visit the nearby royal chariot museum and taste authentic melt-in-mouth Mysore Pak.",
      day2: "Climb the Chamundi Hill steps to visit the ancient temple and see the huge stone Nandi bull. At night, watch the palace illuminate into a sea of gold.",
      day3: "Watch the thrilling torchlight parade at Bannimantap grounds and explore the handicrafts exhibition at the Dasara grounds.",
      familyTips: "Reach the procession route at least 2 hours early to get a comfortable shaded seat with children.",
    },
  },
  {
    id: "puri-ratha-yatra",
    name: "Puri Jagannath Ratha Yatra",
    state: "Odisha",
    city: "Puri",
    month: "June–July",
    category: "Sacred & Temple",
    image: "https://media.base44.com/images/public/6a9bae9fd15b41c75cea5237/feb383a40_generated_96c388ce.jpg",
    timing: "Chariot pulling begins 2:00 PM along Badadanda Grand Road",
    dress: "Traditional white or yellow cotton dhotis and sarees",
    rules: "Do not climb onto the chariots; keep mobile phones safe in zippered pouches",
    history:
      "The world-renowned chariot festival where Lord Jagannath, Balabhadra, and Subhadra journey in colossal wooden chariots hand-pulled by millions of devoted pilgrims.",
    crowdDensity: "Extremely High (Millions)",
    crowdRating: "5/5",
    bestVisitingHours: "Early morning 6:00 AM – 9:00 AM or post evening 7:30 PM",
    scamWarning: "Beware of unauthorized 'Panda' guides claiming they can take you directly next to the chariot ropes or sanctum for ₹3,000 cash. Only temple sevayats have designated access; general rope pulling is open to everyone.",
    wikiQuery: "Ratha_Yatra_(Puri)",
    youtubeQuery: "Puri Jagannath Ratha Yatra documentary chariot",
    aiPlan: {
      summary: "In Puri, the deities come out of the temple to ride three giant wooden houses on wheels! Millions of people take hold of thick ropes and pull together with joyous cheers.",
      day1: "Arrive in Puri and stroll along the Golden Beach. Watch the carpenters finish building the magnificent colorful chariots on Grand Road.",
      day2: "Festival Day: Witness the majestic Pahandi procession where deities are carried to their chariots. Join the rhythmic conch blowing and devotional kirtan.",
      day3: "Visit the Gundicha Temple garden sanctuary where the deities rest. Taste the sacred Mahaprasad cooked in earthen pots over firewood.",
      familyTips: "Drink plenty of coconut water to stay hydrated in the coastal humidity and wear comfortable sandals.",
    },
  },
  {
    id: "onam",
    name: "Onam Festival & Vallam Kali",
    state: "Kerala",
    city: "Kochi / Alleppey",
    month: "August–September",
    category: "Seasonal Harvest",
    image: "https://media.base44.com/images/public/6a9bae9fd15b41c75cea5237/959546059_generated_d81ae176.jpg",
    timing: "Snake boat races begin at 1:30 PM; Pookkalam flower carpets made at dawn",
    dress: "Traditional Kerala Kasavu cream and gold attire or light cottons",
    rules: "Respect designated boat spectator pavilions; life jackets required on private houseboats",
    history:
      "A grand 10-day celebration welcoming the mythical King Mahabali, featuring 100-foot snake boats rowed by synchronized oarsmen, tiger dances (Pulikkali), and 26-dish feast on banana leaves.",
    crowdDensity: "Moderate to High",
    crowdRating: "3.5/5",
    bestVisitingHours: "Morning 8:00 AM – 11:00 AM for cultural events; 1:00 PM for boat races",
    scamWarning: "Watch out for unverified houseboat agents offering 'VIP Boat Race front-row mooring' without safety certificates. Book only through Kerala Tourism Development Corporation (KTDC).",
    wikiQuery: "Onam",
    youtubeQuery: "Onam festival Kerala snake boat race Vallam Kali",
    aiPlan: {
      summary: "Onam is Kerala's festival of joy, flowers, and rowing boats that look like sleek swimming snakes! Families make bright flower carpets on their doorsteps and eat a delicious giant feast.",
      day1: "Visit Thrikkakara Temple or Fort Kochi to see colorful flower carpets. Watch the Pulikkali performers painted like dancing tigers with bells around their bellies.",
      day2: "Head to the backwaters in Alleppey to witness the thunderous Nehru Trophy Snake Boat Race. Listen to the rhythmic Vanchipattu boat songs.",
      day3: "Enjoy the authentic 26-item Onasadya feast served fresh on a green banana leaf, including crispy banana chips and sweet payasam dessert.",
      familyTips: "Kids love the tiger dances and watching 100 oarsmen paddle in perfect sync like clockwork.",
    },
  },
  {
    id: "durga-puja",
    name: "Kolkata Durga Puja Festival",
    state: "West Bengal",
    city: "Kolkata",
    month: "October",
    category: "Sacred & Temple",
    image: "https://media.base44.com/images/public/6a9bae9fd15b41c75cea5237/2c3ba7130_generated_6bf653a0.jpg",
    timing: "Pandal hopping best between 8:00 PM and 4:00 AM; Dhunuchi dance at 7:00 PM",
    dress: "Traditional red-bordered Bengali saree, white kurta, or comfortable festive wear",
    rules: "Keep entry lines orderly; avoid carrying heavy backpacks inside crowded pandals",
    history:
      "UNESCO Intangible Cultural Heritage of Humanity: an enormous open-air public art gallery featuring thousands of thematic temporary temples housing statues of Goddess Durga defeating evil.",
    crowdDensity: "Very High (Entire city celebrates all night)",
    crowdRating: "4.5/5",
    bestVisitingHours: "Late night 11:00 PM – 3:30 AM (Cooler weather and illuminated pandals)",
    scamWarning: "Watch out for unmetered yellow taxis charging 4x regular fare outside major pandals. Use Kolkata Metro (which operates extended hours) or app-based rides like Uber/Ola.",
    wikiQuery: "Durga_Puja_in_Kolkata",
    youtubeQuery: "Kolkata Durga Puja pandal hopping celebration",
    aiPlan: {
      summary: "For five whole days, the whole city of Kolkata turns into the world's biggest art exhibition! Artists build castles, temples, and palaces out of bamboo, clay, and cloth with grand clay goddess statues.",
      day1: "Start in North Kolkata at Bagbazar and Kumartuli to see where master sculptors mold the idols. Walk through the traditional heritage bonedi bari pujas.",
      day2: "Explore South Kolkata's innovative mega-pandals like Ekdalia Evergreen and Maddox Square. Watch the energetic Dhunuchi dance performed with smoking clay pots.",
      day3: "Experience Vijaya Dashami where married women celebrate Sindoor Khela with red vermilion, followed by the grand immersion carnival at the Hooghly river.",
      familyTips: "Use the comfortable air-conditioned Kolkata Metro to bypass street traffic jams.",
    },
  },
  {
    id: "vizag-utsav",
    name: "Visakhapatnam Beach Utsav & Araku Tribal Dance",
    state: "Andhra Pradesh",
    city: "Visakhapatnam",
    month: "December–January",
    category: "Seasonal Harvest",
    image: "https://media.base44.com/images/public/6a9bae9fd15b41c75cea5237/55fca79b0_generated_image.png",
    timing: "Sunset to midnight across RK Beach & Rushikonda",
    dress: "Comfortable coastal resort wear, light woolens for Araku valley nights",
    rules: "Eco-friendly plastic-free beach zone; observe swimming safety flags",
    history:
      "A coastal celebration combining traditional Dhimsa tribal dances from Araku Valley, local Andhra cuisine, and sand sculpting contests against the Bay of Bengal.",
    crowdDensity: "Moderate (Family Friendly)",
    crowdRating: "3/5",
    bestVisitingHours: "4:30 PM – 9:00 PM along RK Beach Promenade",
    scamWarning: "Beware of unauthorized roadside water sports operators without safety permits at Rushikonda Beach. Book only at government AP Tourism counters.",
    wikiQuery: "Visakhapatnam_Utsav",
    youtubeQuery: "Visakhapatnam Beach Utsav Araku Dhimsa dance",
    aiPlan: {
      summary: "A breezy beach carnival on the sparkling Bay of Bengal! You can walk on the sandy beach, watch tribal dancers with colorful turbans hold hands in a snake line, and eat spicy Andhra snacks.",
      day1: "Stroll the RK Beach promenade. Visit the Submarine Museum INS Kursura and TU-142 Aircraft Museum right on the beach.",
      day2: "Watch master sand sculptors craft giant monuments on the beach. Enjoy the evening Araku Dhimsa dance troupe and live music under ocean breezes.",
      day3: "Take the glass-dome Vistadome train up the Eastern Ghat mountains to Araku Valley and explore the natural million-year-old Borra Caves.",
      familyTips: "Great for families with strollers and seniors because the beach promenade has flat paved walking paths.",
    },
  },
];

export default function Events() {
  const [events, setEvents] = useState(enrichedEvents);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // AI Planner Modal State
  const [aiModalEvent, setAiModalEvent] = useState(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customAnswer, setCustomAnswer] = useState("");
  const [isAskingAi, setIsAskingAi] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = () => {
      const coreList = [...enrichedEvents];
      try {
        const saved = localStorage.getItem("by-admin-entity-events");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach((e) => {
              const idx = coreList.findIndex(x => x.id === e.id || x.name.toLowerCase() === e.name.toLowerCase());
              const formatted = {
                id: e.id,
                name: e.name,
                state: e.state || "India",
                city: e.city || "",
                month: e.month || "Year-round",
                category: e.category || "Sacred & Temple",
                image: e.image || "https://images.unsplash.com/photo-1548013146-72479768bada?w=500&auto=format&fit=crop&q=80",
                timing: e.timing || "Check local schedule",
                dress: e.dress || "Modest smart casuals",
                rules: e.rules || "Follow local rules",
                history: e.history || e.description || "",
                crowdDensity: e.crowdDensity || "Moderate",
                crowdRating: e.crowdRating || "4/5",
                bestVisitingHours: e.bestVisitingHours || "Morning or Evening",
                scamWarning: e.scamWarning || "Be aware of local guides.",
                wikiQuery: e.wikiQuery || "",
                youtubeQuery: e.youtubeQuery || "",
                aiPlan: e.aiPlan || {
                  summary: e.description || "Exciting traditional celebration!",
                  day1: "Arrive and explore local attractions.",
                  day2: "Enjoy primary festival day activities.",
                  day3: "Savor local cuisine and purchase regional souvenirs.",
                  familyTips: "Keep hydrated and follow crowd pathways.",
                }
              };
              if (idx !== -1) {
                coreList[idx] = { ...coreList[idx], ...formatted };
              } else {
                coreList.unshift(formatted);
              }
            });
          }
        }
      } catch {}
      setEvents(coreList);
    };

    loadEvents();

    base44.entities.Event.list("-created_date", 100).then((list) => {
      if (list && list.length) {
        setEvents((prev) => {
          const ids = new Set(list.map((l) => l.id));
          const leftovers = prev.filter((p) => !ids.has(p.id));
          return [...list, ...leftovers];
        });
      }
    }).catch(() => {});

    window.addEventListener("by-events-updated", loadEvents);
    return () => window.removeEventListener("by-events-updated", loadEvents);
  }, []);

  const categories = [
    { id: "all", label: "All Celebrations" },
    { id: "Sacred & Temple", label: "Sacred & Temple Darshan" },
    { id: "Royal Heritage", label: "Royal & Fort Traditions" },
    { id: "Seasonal Harvest", label: "Seasonal & Coastal Utsav" },
  ];

  const filteredEvents = events.filter((e) => {
    const matchCat = selectedCategory === "all" || e.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.state.toLowerCase().includes(q) || (e.city && e.city.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const handleAskAi = (e) => {
    e.preventDefault();
    if (!customQuestion.trim() || !aiModalEvent) return;
    setIsAskingAi(true);

    setTimeout(() => {
      const q = customQuestion.toLowerCase();
      let ans = "";
      if (q.includes("child") || q.includes("kid") || q.includes("family")) {
        ans = `Yes, ${aiModalEvent.name} is memorable for children and families. Make sure to visit during safe morning hours (${aiModalEvent.bestVisitingHours}), carry identity tags, and drink plenty of bottled water.`;
      } else if (q.includes("food") || q.includes("eat") || q.includes("restaurant")) {
        ans = `During ${aiModalEvent.name}, try the traditional festive food like hot prasadam, fresh jalebis, and regional sweets from verified stalls. Avoid unboiled tap water.`;
      } else if (q.includes("hotel") || q.includes("stay")) {
        ans = `Book your hotel in ${aiModalEvent.city} at least 3 to 4 weeks in advance because festival rooms sell out fast. Prefer hotels near the main bus or railway terminal.`;
      } else {
        ans = `For ${aiModalEvent.name}, the best approach is to arrive a day before the main procession. Follow the crowd advisories, stick to well-lit main avenues, and enjoy the rich cultural music!`;
      }
      setCustomAnswer(ans);
      setIsAskingAi(false);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                Living Traditions, Festivals & Cultural Guides
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground mt-3 font-heading">
                Events & Cultural Celebrations
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
                Explore India's sacred gatherings, temple chariot processions, and royal festivals with AI travel planning, verified scam warnings, crowd density ratings, and direct Google Maps navigation.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
              >
                <Sparkles className="w-4 h-4" /> Open Trip Planner
              </Link>
            </div>
          </div>

          {/* Search & Filter bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search festivals by name, city, or state..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
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

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none text-xs">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === c.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-3xl border border-dashed border-border p-8">
            <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-lg font-semibold text-foreground">No festivals match your search</h3>
            <p className="text-sm text-muted-foreground mt-1">Try resetting the search keyword or filter category.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="mt-4 px-5 py-2 text-xs font-semibold rounded-full bg-primary text-primary-foreground"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredEvents.map((e) => {
            const city = e.city || e.state;
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.name + " " + city + " " + e.state)}`;
            const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(e.wikiQuery || e.name)}`;
            const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(e.youtubeQuery || (e.name + " festival celebration documentary"))}`;

            return (
              <div
                key={e.id}
                className="grid lg:grid-cols-12 gap-6 bg-card rounded-3xl overflow-hidden border border-border shadow-xs hover:border-primary/50 transition-all"
              >
                {/* Image Section */}
                <div className="lg:col-span-4 h-64 lg:h-auto overflow-hidden relative group">
                  <Image 
                    src={e.image} 
                    alt={e.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    fittingType="fill" 
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-900/80 text-amber-400 text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5 shadow-sm">
                    <MapPin className="w-3.5 h-3.5" /> {city}, {e.state}
                  </div>
                  {e.category && (
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md">
                      {e.category}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="lg:col-span-8 p-6 sm:p-7 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-primary">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {e.month} Celebration
                      </span>

                      {/* Crowd Density Badge */}
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border">
                        <Users className="w-3 h-3 text-amber-500" />
                        <span className="font-bold text-foreground">Crowd Density:</span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">{e.crowdDensity || "Moderate"}</span>
                      </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading">{e.name}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{e.history}</p>

                    {/* Best Hours & Timing */}
                    <div className="grid sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                      <div className="p-3 rounded-2xl bg-muted/40 border border-border">
                        <span className="font-bold text-foreground block mb-0.5">Recommended Quiet Visiting Hours:</span>
                        <span className="text-muted-foreground">{e.bestVisitingHours || "Early morning 5:30 AM – 8:00 AM"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-muted/40 border border-border">
                        <span className="font-bold text-foreground block mb-0.5">Daily Ritual Timings:</span>
                        <span className="text-muted-foreground">{e.timing}</span>
                      </div>
                    </div>

                    {/* Scam Warning Alert Banner */}
                    {e.scamWarning && (
                      <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/25 flex items-start gap-2.5 text-xs">
                        <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-destructive font-bold uppercase tracking-wider block text-[11px]">
                            Traveler Advisory & Scam Warning
                          </strong>
                          <p className="text-foreground/90 mt-0.5 leading-relaxed">{e.scamWarning}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* External Links & Action Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                    {/* Media & Research Links */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground font-bold flex items-center gap-1.5 transition-colors"
                        title="Search location on Google Maps"
                      >
                        <ExternalLink className="w-3 h-3 text-primary" /> Google Maps
                      </a>
                      <a
                        href={wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground font-bold flex items-center gap-1.5 transition-colors"
                        title="Read historical background on Wikipedia"
                      >
                        <BookOpen className="w-3 h-3 text-sky-500" /> Wikipedia
                      </a>
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground font-bold flex items-center gap-1.5 transition-colors"
                        title="Watch celebration footage on YouTube"
                      >
                        <Video className="w-3 h-3 text-rose-500" /> YouTube
                      </a>
                    </div>

                    {/* AI Planner and Trip Planner Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAiModalEvent(e);
                          setCustomQuestion("");
                          setCustomAnswer("");
                        }}
                        className="px-4 py-2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/25 transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Festival Planner
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/planner?destination=${encodeURIComponent(city)}&to=${encodeURIComponent(city)}&from=Delhi&event=${encodeURIComponent(e.name)}&month=${encodeURIComponent(e.month)}`);
                        }}
                        className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-90 transition-opacity flex items-center gap-1.5"
                      >
                        Plan Trip <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* AI FESTIVAL ITINERARY MODAL */}
      {aiModalEvent && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-0 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-lg text-foreground font-heading">
                    AI Festival Planner: {aiModalEvent.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Simple, family-friendly advice tailored for {aiModalEvent.city}, {aiModalEvent.state}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setAiModalEvent(null)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 text-xs text-foreground">
              {/* Simplified Overview */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                <strong className="text-amber-600 dark:text-amber-400 font-bold block text-sm">
                  What is this festival all about?
                </strong>
                <p className="text-foreground leading-relaxed">
                  {aiModalEvent.aiPlan?.summary || aiModalEvent.history}
                </p>
              </div>

              {/* 3-Day Simple Itinerary */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-primary" /> Recommended 3-Day Schedule
                </h4>
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
                    <strong className="text-primary font-bold block">Day 1: Arrival & Festival Atmosphere</strong>
                    <p className="text-muted-foreground leading-relaxed">
                      {aiModalEvent.aiPlan?.day1 || "Arrive early and check into your stay. Walk through the decorated markets and sample local festive treats."}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
                    <strong className="text-primary font-bold block">Day 2: Main Rituals & Celebrations</strong>
                    <p className="text-muted-foreground leading-relaxed">
                      {aiModalEvent.aiPlan?.day2 || "Wake up for the early morning temple prayers or chariot roll. Attend the evening illuminated music and prayer."}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
                    <strong className="text-primary font-bold block">Day 3: Heritage Sites & Local Crafts</strong>
                    <p className="text-muted-foreground leading-relaxed">
                      {aiModalEvent.aiPlan?.day3 || "Explore local heritage monuments and buy authentic certified handicrafts from local weaving clusters."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Family Safety Advice */}
              <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-1">
                <strong className="text-foreground font-bold block">Family & Child Safety Advice:</strong>
                <p className="text-muted-foreground leading-relaxed">
                  {aiModalEvent.aiPlan?.familyTips || "Keep children close by holding hands. Carry an identity slip with your mobile number in their pocket."}
                </p>
              </div>

              {/* Ask Custom Question to AI */}
              <form onSubmit={handleAskAi} className="p-4 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <label className="font-bold text-foreground">Ask AI Assistant a question about {aiModalEvent.name}:</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="e.g. 'Is it safe for young kids?' or 'What food should I eat?'..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isAskingAi}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" /> Ask
                  </button>
                </div>

                {customAnswer && (
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs leading-relaxed text-foreground animate-fadeIn">
                    <strong className="text-primary block mb-0.5">AI Answer:</strong>
                    <p>{customAnswer}</p>
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAiModalEvent(null)}
                className="px-4 py-2 rounded-full bg-muted text-foreground text-xs font-bold hover:bg-muted/80"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const ev = aiModalEvent;
                  setAiModalEvent(null);
                  navigate(`/planner?destination=${encodeURIComponent(ev.city || ev.state)}&to=${encodeURIComponent(ev.city || ev.state)}&from=Delhi&event=${encodeURIComponent(ev.name)}`);
                }}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 flex items-center gap-1.5 shadow-md"
              >
                Plan Trip with this Itinerary →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
