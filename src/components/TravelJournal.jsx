import React, { useState, useEffect } from "react";
import { 
  Camera, Sparkles, MapPin, Calendar, Trash2, Download, 
  Search, Layers, RefreshCw, Eye, Mic, Palette, X,
  WifiOff, CheckCircle2, Globe, Volume2
} from "lucide-react";
import VoiceToTextInput from "@/components/ui/VoiceToTextInput";
import LanguageToggle from "@/components/LanguageToggle";
import { 
  ARTISTIC_STYLES,
  findMatchingVisual 
} from "@/components/lib/heritageVisualData";
import { 
  getOfflineJournals, 
  saveJournalOffline 
} from "@/components/lib/offlineStorage";
import { 
  translateJournalEntry, 
  INDIAN_REGIONAL_LANGUAGES 
} from "@/components/lib/aiTranslationService";

const INITIAL_JOURNAL_ENTRIES = [
  {
    id: "jrn-init-1",
    title: "Hampi Vijayanagara Stone Chariot",
    category: "Heritage Site",
    state: "Karnataka",
    style: "Photorealistic Golden Hour",
    imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000&auto=format&fit=crop&q=80",
    caption: "Carved from granite blocks disguised as monolithic stone, this shrine dedicated to Garuda in Vittala Temple embodies the pinnacle of 16th-century Vijayanagara architectural genius.",
    notes: "Explored during sunrise. The revolving stone wheels and floral carvings on the plinth are breathtaking.",
    isAiGenerated: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "jrn-init-2",
    title: "Mithila Madhubani Folk Art",
    category: "Local Craft",
    state: "Bihar",
    style: "Traditional Indian Miniature",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000&auto=format&fit=crop&q=80",
    caption: "Centuries-old matrimonial wall and scroll painting rendered using natural rice paste, turmeric, and indigo dyes, characterized by dense geometric line-work and sacred cosmic motifs.",
    notes: "Researched the Bharni style with natural plant dyes. Learned how women of Jitwarpur preserve this heritage.",
    isAiGenerated: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "jrn-init-3",
    title: "Amber Fort & Sheesh Mahal",
    category: "Heritage Site",
    state: "Rajasthan",
    style: "Photorealistic Golden Hour",
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80",
    caption: "Perched atop the rugged Aravalli crest, the historic royal palaces showcase delicate Belgian mirror inlays, Persian water systems, and timeless Rajput craftsmanship.",
    notes: "A single candle reflects thousands of stars in the convex mirror ceiling.",
    isAiGenerated: true,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  }
];

const PRESET_TOPICS = [
  { title: "Konark Sun Temple Ratha", category: "Heritage Site", state: "Odisha" },
  { title: "Meenakshi Amman Temple Gopuram", category: "Heritage Site", state: "Tamil Nadu" },
  { title: "Kashmiri Pashmina Handloom", category: "Local Craft", state: "Jammu & Kashmir" },
  { title: "Jaipur Glazed Blue Pottery", category: "Local Craft", state: "Rajasthan" },
  { title: "Bidriware Silver Inlay Metalwork", category: "Local Craft", state: "Karnataka" },
  { title: "Varanasi Subah-e-Banaras Ghats", category: "Heritage Site", state: "Uttar Pradesh" },
  { title: "Channapatna Lacquerware Toys", category: "Local Craft", state: "Karnataka" },
  { title: "Thanjavur Gold Foil Painting", category: "Local Craft", state: "Tamil Nadu" },
];

export default function TravelJournal({ onAskAssistant }) {
  const [entries, setEntries] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all"); // 'all' | 'Heritage Site' | 'Local Craft'
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeZoomEntry, setActiveZoomEntry] = useState(null);
  const [notification, setNotification] = useState("");

  // Generator form state
  const [genTitle, setGenTitle] = useState("");
  const [genCategory, setGenCategory] = useState("Heritage Site");
  const [genState, setGenState] = useState("Rajasthan");
  const [genStyle, setGenStyle] = useState("photorealistic");
  const [genNotes, setGenNotes] = useState("");

  // Regional Language Translation & Offline State
  const [journalLang, setJournalLang] = useState("en");
  const [translatedMap, setTranslatedMap] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );
  const [speakingEntryId, setSpeakingEntryId] = useState(null);

  // Monitor network status
  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // Load entries from persistent offlineStorage
  useEffect(() => {
    try {
      const saved = getOfflineJournals();
      if (saved && saved.length > 0) {
        setEntries(saved);
      } else {
        setEntries(INITIAL_JOURNAL_ENTRIES);
        saveJournalOffline(INITIAL_JOURNAL_ENTRIES);
      }
    } catch {
      setEntries(INITIAL_JOURNAL_ENTRIES);
    }
  }, []);

  function saveJournal(updated) {
    setEntries(updated);
    saveJournalOffline(updated);
  }

  // Handle translating entries when journalLang changes
  useEffect(() => {
    if (journalLang === "en") return;

    let isMounted = true;
    setIsTranslating(true);

    Promise.all(
      entries.map((entry) => translateJournalEntry(entry, journalLang))
    )
      .then((translatedList) => {
        if (!isMounted) return;
        const newMap = {};
        translatedList.forEach((t) => {
          newMap[t.id] = t;
        });
        setTranslatedMap(newMap);
        setIsTranslating(false);
      })
      .catch(() => {
        if (isMounted) setIsTranslating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [journalLang, entries]);

  // Audio Readout for a journal card
  function handleReadout(entry) {
    if (!("speechSynthesis" in window)) return;
    if (speakingEntryId === entry.id) {
      window.speechSynthesis.cancel();
      setSpeakingEntryId(null);
      return;
    }

    const displayEntry = (journalLang !== "en" && translatedMap[entry.id]) || entry;
    const textToSpeak = `${displayEntry.title}. ${displayEntry.caption}. ${displayEntry.notes || ""}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = journalLang === "en" ? "en-IN" : `${journalLang}-IN`;
    utterance.onend = () => setSpeakingEntryId(null);
    utterance.onerror = () => setSpeakingEntryId(null);

    setSpeakingEntryId(entry.id);
    window.speechSynthesis.speak(utterance);
  }

  function handleVoicePromptForGen(text) {
    // If text contains keywords, set title and notes
    setGenNotes((prev) => (prev ? `${prev} ${text}` : text));
    if (!genTitle) {
      // Try to match a monument or craft
      for (const p of PRESET_TOPICS) {
        if (text.toLowerCase().includes(p.title.toLowerCase().split(" ")[0])) {
          setGenTitle(p.title);
          setGenCategory(p.category);
          setGenState(p.state);
          return;
        }
      }
      setGenTitle(text.slice(0, 45));
    }
  }

  async function handleGenerateEntry(e) {
    if (e) e.preventDefault();
    if (!genTitle.trim()) {
      setNotification("Please enter a heritage site or craft name to visualize.");
      setTimeout(() => setNotification(""), 3500);
      return;
    }

    setIsGenerating(true);
    setNotification("Invoking AI Visual Studio... synthesizing architectural lighting & details...");

    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: genTitle,
          category: genCategory,
          state: genState,
          prompt: genNotes,
          style: genStyle,
        }),
      });

      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();

      const newEntry = {
        id: data.id || `jrn-${Date.now()}`,
        title: data.title || genTitle,
        category: data.category || genCategory,
        state: data.state || genState,
        style: data.style || genStyle,
        imageUrl: data.imageUrl,
        caption: data.caption,
        notes: genNotes || `Researched and generated visual entry for ${genTitle}.`,
        isAiGenerated: true,
        createdAt: data.createdAt || new Date().toISOString(),
      };

      const updated = [newEntry, ...entries];
      saveJournal(updated);
      setShowModal(false);
      setGenTitle("");
      setGenNotes("");
      setNotification("Visual Travel Journal entry created successfully!");
      setTimeout(() => setNotification(""), 4000);
    } catch (err) {
      // Fallback to local high-resolution visual registry
      const localVisual = findMatchingVisual(genTitle, genCategory);
      const fallbackEntry = {
        id: `jrn-${Date.now()}`,
        title: genTitle,
        category: genCategory,
        state: genState,
        style: genStyle,
        imageUrl: localVisual.image,
        caption: localVisual.caption || `A celebrated emblem of ${genCategory.toLowerCase()} from ${genState}, India.`,
        notes: genNotes || `Field research and visual journal study of ${genTitle}.`,
        isAiGenerated: true,
        createdAt: new Date().toISOString(),
      };

      const updated = [fallbackEntry, ...entries];
      saveJournal(updated);
      setShowModal(false);
      setGenTitle("");
      setGenNotes("");
      setNotification("Created travel visual entry from Bharat Yatra heritage library!");
      setTimeout(() => setNotification(""), 4000);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleDelete(id) {
    const updated = entries.filter((e) => e.id !== id);
    saveJournal(updated);
    setNotification("Journal entry removed.");
    setTimeout(() => setNotification(""), 3000);
  }

  function handleDownloadCard(entry) {
    // Create an anchor and download
    const link = document.createElement("a");
    link.href = entry.imageUrl;
    link.download = `bharat-yatra-${entry.title.toLowerCase().replace(/\s+/g, "-")}.jpg`;
    link.target = "_blank";
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filtered list
  const filteredEntries = entries.filter((item) => {
    const matchesCat = filterCategory === "all" || item.category === filterCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.state.toLowerCase().includes(q) ||
      (item.notes && item.notes.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header with Call to Action & Stats */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Camera className="w-4 h-4" /> AI Heritage Visual Studio
              </span>
              {isOffline ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-semibold flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> Offline Mode (Local Storage Active)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Offline Caching Active
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
              Visual Travel Journal
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Curate and visualize the heritage monuments, temple architectures, and GI-tagged artisan crafts you are researching with generative AI, microphone voice input, and offline caching.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/95 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" /> Generate New Visual Entry
            </button>
          </div>
        </div>

        {/* AI Regional Language Translation Bar for Travel Journal */}
        <div className="p-3.5 rounded-2xl bg-muted/60 border border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary shrink-0" />
            <div>
              <span className="text-xs font-bold text-foreground">AI Translation for Travel Journal</span>
              <p className="text-[11px] text-muted-foreground">
                {journalLang === "en"
                  ? "Translate your journal captions & architectural research into 10 Indian regional languages."
                  : `Currently translated into ${INDIAN_REGIONAL_LANGUAGES.find((l) => l.code === journalLang)?.nativeName || journalLang}.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle
              selectedLang={journalLang}
              onSelectLang={setJournalLang}
              isTranslating={isTranslating}
            />
            {journalLang !== "en" && (
              <button
                onClick={() => setJournalLang("en")}
                className="px-2.5 py-1 text-xs rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors"
                title="Reset to English"
              >
                Original (EN)
              </button>
            )}
          </div>
        </div>

        {/* Search, Filter & Quick Presets */}
        <div className="pt-4 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border text-xs font-semibold">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterCategory === "all"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({entries.length})
              </button>
              <button
                onClick={() => setFilterCategory("Heritage Site")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterCategory === "Heritage Site"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Heritage Sites
              </button>
              <button
                onClick={() => setFilterCategory("Local Craft")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterCategory === "Local Craft"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Local Crafts
              </button>
            </div>
          </div>

          {/* Search bar with Voice Input */}
          <div className="flex items-center gap-2 w-full md:w-80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search monuments or crafts..."
                className="w-full pl-9 pr-10 py-2 rounded-xl bg-muted/60 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
              <VoiceToTextInput
                variant="compact"
                onTranscript={(txt) => setSearchQuery(txt)}
                className="absolute right-1 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-muted-foreground font-medium shrink-0 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Quick Visualize:
          </span>
          {PRESET_TOPICS.map((preset) => (
            <button
              key={preset.title}
              onClick={() => {
                setGenTitle(preset.title);
                setGenCategory(preset.category);
                setGenState(preset.state);
                setShowModal(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors shrink-0 whitespace-nowrap"
            >
              + {preset.title.split(" ")[0]} ({preset.state})
            </button>
          ))}
        </div>
      </div>

      {/* Notification toast */}
      {notification && (
        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold flex items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification("")} className="hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Gallery Cards Grid */}
      {filteredEntries.length === 0 ? (
        <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-muted grid place-items-center text-muted-foreground">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-foreground text-base">No visual journal entries found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Start building your visual journal by generating AI imagery for heritage temples or traditional crafts from across India.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" /> Create First Entry
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => {
            const displayEntry = (journalLang !== "en" && translatedMap[entry.id]) || entry;
            const isSpeakingThis = speakingEntryId === entry.id;

            return (
              <div
                key={entry.id}
                className="group rounded-3xl bg-card border border-border overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Image Container with Referrer Policy & Overlay */}
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  <img
                    src={entry.imageUrl}
                    alt={displayEntry.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                      {entry.category === "Local Craft" ? (
                        <Palette className="w-3 h-3 text-amber-400" />
                      ) : (
                        <MapPin className="w-3 h-3 text-emerald-400" />
                      )}
                      {entry.category}
                    </span>
                    {entry.state && (
                      <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-medium">
                        {entry.state}
                      </span>
                    )}
                  </div>

                  {/* AI Badge & Lightbox Trigger */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {entry.isAiGenerated && (
                      <span className="px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5" /> AI Visual
                      </span>
                    )}
                    <button
                      onClick={() => setActiveZoomEntry(entry)}
                      className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                      title="Expand Fullscreen"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {journalLang !== "en" && translatedMap[entry.id] && (
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>AI Translated ({INDIAN_REGIONAL_LANGUAGES.find((l) => l.code === journalLang)?.nativeName})</span>
                      </div>
                    )}

                    <h3 className="font-bold text-base text-foreground font-heading group-hover:text-primary transition-colors">
                      {displayEntry.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {displayEntry.caption}
                    </p>

                    {displayEntry.notes && (
                      <div className="p-2.5 rounded-xl bg-muted/60 text-xs text-foreground/90 font-medium italic border border-border/50">
                        "{displayEntry.notes}"
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleReadout(entry)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          isSpeakingThis
                            ? "bg-primary text-primary-foreground border-primary"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground border-transparent"
                        }`}
                        title={isSpeakingThis ? "Stop audio" : "Listen in selected language"}
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isSpeakingThis ? "animate-pulse" : ""}`} />
                      </button>
                      <button
                        onClick={() => handleDownloadCard(entry)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="Download image"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Generator Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-7 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground font-heading">
                  AI Heritage & Craft Visualizer
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateEntry} className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "Heritage Site", label: "Heritage Site / Monument", icon: MapPin },
                    { id: "Local Craft", label: "Local Craft / Handloom", icon: Palette },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = genCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setGenCategory(cat.id)}
                        className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-muted text-muted-foreground hover:text-foreground border-border"
                        }`}
                      >
                        <Icon className="w-4 h-4" /> {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Input with Voice dictation */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Monument or Artisan Craft Name
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={genTitle}
                    onChange={(e) => setGenTitle(e.target.value)}
                    placeholder="e.g. Hampi Stone Chariot, Madhubani Art, Tanjore Painting..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-muted/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    required
                  />
                  <VoiceToTextInput
                    variant="compact"
                    onTranscript={(txt) => setGenTitle(txt)}
                  />
                </div>
              </div>

              {/* State & Style in 2 cols */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    State / Region
                  </label>
                  <select
                    value={genState}
                    onChange={(e) => setGenState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/60 border border-border text-xs text-foreground focus:outline-none"
                  >
                    {[
                      "Andhra Pradesh", "Assam", "Bihar", "Delhi NCR", "Gujarat", 
                      "Himachal Pradesh", "Jammu & Kashmir", "Karnataka", "Kerala", 
                      "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", 
                      "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
                    ].map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Visual Style
                  </label>
                  <select
                    value={genStyle}
                    onChange={(e) => setGenStyle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/60 border border-border text-xs text-foreground focus:outline-none"
                  >
                    {ARTISTIC_STYLES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Voice-Enabled Research Notes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Travel Notes & Research Prompt
                  </label>
                  <span className="text-[11px] text-primary flex items-center gap-1 font-medium">
                    <Mic className="w-3 h-3" /> Voice-to-Text Dictation
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={genNotes}
                    onChange={(e) => setGenNotes(e.target.value)}
                    placeholder="Describe specific architectural details, artisan techniques, or travel reflections (or click the microphone to speak)..."
                    className="w-full p-3 pr-12 rounded-xl bg-muted/60 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <VoiceToTextInput
                    variant="compact"
                    onTranscript={handleVoicePromptForGen}
                    className="absolute right-2 bottom-3"
                  />
                </div>
              </div>

              {/* Submit / Generate Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md hover:bg-primary/95 flex items-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Generating AI Visual...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate & Save to Journal
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Zoom Lightbox Modal */}
      {activeZoomEntry && (() => {
        const displayZoomEntry = (journalLang !== "en" && translatedMap[activeZoomEntry.id]) || activeZoomEntry;
        const isSpeakingThis = speakingEntryId === activeZoomEntry.id;

        return (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
            <div className="relative max-w-4xl w-full bg-card rounded-3xl border border-border overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <button
                onClick={() => {
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setActiveZoomEntry(null);
                }}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-16/10 sm:aspect-16/9 bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={activeZoomEntry.imageUrl}
                  alt={displayZoomEntry.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 space-y-4 overflow-y-auto bg-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                      <span>{activeZoomEntry.category}</span>
                      <span>•</span>
                      <span>{activeZoomEntry.state}</span>
                      {journalLang !== "en" && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold text-[10px]">
                          AI Translated ({INDIAN_REGIONAL_LANGUAGES.find((l) => l.code === journalLang)?.nativeName})
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold font-heading text-foreground mt-0.5">
                      {displayZoomEntry.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReadout(activeZoomEntry)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isSpeakingThis
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted hover:bg-muted/80 text-foreground border-border"
                      }`}
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isSpeakingThis ? "animate-pulse" : ""}`} />
                      {isSpeakingThis ? "Stop Audio" : "Listen"}
                    </button>
                    <button
                      onClick={() => handleDownloadCard(activeZoomEntry)}
                      className="px-3 py-1.5 rounded-xl bg-muted text-xs font-semibold text-foreground hover:bg-muted/80 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Save Image
                    </button>
                  </div>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed">
                  {displayZoomEntry.caption}
                </p>

                {displayZoomEntry.notes && (
                  <div className="p-3 rounded-2xl bg-muted text-xs text-foreground/80 font-medium">
                    <strong>Traveler Notes:</strong> {displayZoomEntry.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
