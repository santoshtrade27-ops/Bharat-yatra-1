import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, MapPin, Clock, Users, Sparkles, Star, 
  ExternalLink, Youtube, BookOpen, Compass, AlertTriangle, CheckCircle2,
  Volume2, RefreshCw
} from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { translateHeritageSite, INDIAN_REGIONAL_LANGUAGES } from "@/components/lib/aiTranslationService";

export default function HeritageDetailModal({ site: rawSite, onClose }) {
  const navigate = useNavigate();
  const { lang: globalLang } = useI18n();

  const [activeLang, setActiveLang] = useState(globalLang || "en");
  const [siteData, setSiteData] = useState(rawSite);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [translationEngine, setTranslationEngine] = useState("");

  // Sync when rawSite or activeLang changes
  useEffect(() => {
    if (!rawSite) return;

    if (activeLang === "en") {
      setSiteData(rawSite);
      setTranslationEngine("");
      return;
    }

    let isMounted = true;
    setIsTranslating(true);

    translateHeritageSite(rawSite, activeLang)
      .then((translated) => {
        if (isMounted) {
          setSiteData(translated);
          setTranslationEngine(translated._engine || "Gemini AI");
          setIsTranslating(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSiteData(rawSite);
          setIsTranslating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [rawSite, activeLang]);

  // Speech narration of the narrative
  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = siteData.historicalNarrative || siteData.description || "";
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const langObj = INDIAN_REGIONAL_LANGUAGES.find((l) => l.code === activeLang);
    utterance.lang = activeLang === "en" ? "en-IN" : `${activeLang}-IN`;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Add Escape key listener and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const [imageFit, setImageFit] = useState("cover"); // "cover" or "contain"

  if (!rawSite) return null;

  const currentLangObj = INDIAN_REGIONAL_LANGUAGES.find((l) => l.code === activeLang) || INDIAN_REGIONAL_LANGUAGES[0];

  const handlePlanTrip = () => {
    onClose();
    // Navigate to planner with pre-selected destination
    const destination = rawSite.city || rawSite.name;
    navigate(`/planner?destination=${encodeURIComponent(destination)}&state=${encodeURIComponent(rawSite.state || "")}`);
  };

  const handleClose = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-3xl my-auto bg-card text-card-foreground rounded-3xl shadow-2xl border border-border/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image with gradient overlay */}
        <div className="relative min-h-[260px] max-h-[380px] w-full bg-stone-950 overflow-hidden flex items-center justify-center group">
          <img 
            src={rawSite.image} 
            alt={rawSite.name} 
            className={`w-full transition-all duration-300 ${
              imageFit === "contain" 
                ? "max-h-[380px] object-contain py-2 bg-stone-950" 
                : "h-64 sm:h-80 object-cover object-center"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
          
          {/* Top Control Bar: Easy-to-click Close & Image Aspect Toggle */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
            <button
              onClick={() => setImageFit(prev => prev === "cover" ? "contain" : "cover")}
              className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5"
              title="Toggle Full Image Fit"
            >
              <span>{imageFit === "cover" ? "Fit Full Photo" : "Fill Header"}</span>
            </button>

            <button 
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xl backdrop-blur-md transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 border border-white/30"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4 stroke-[3]" />
              <span>Close</span>
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white pointer-events-none">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary text-primary-foreground">
                {rawSite.tag || "Heritage"}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-white/20 backdrop-blur-md text-white flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {rawSite.city ? `${rawSite.city}, ` : ""}{rawSite.state}
              </span>
              {rawSite.rating && (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/90 text-white flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> {rawSite.rating} ({rawSite.reviewsCount || 100}+ reviews)
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight drop-shadow-md">{siteData.name}</h2>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* AI Language Translation Bar */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-primary/10 to-amber-500/5 border border-primary/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
              <div>
                <span className="text-xs font-bold text-foreground">AI Regional Language Translator</span>
                <p className="text-[11px] text-muted-foreground">
                  {activeLang === "en" ? (
                    "Translate archaeological narratives, hidden aspects & advisories into 10 Indian languages."
                  ) : (
                    <span>
                      Translated into <strong>{currentLangObj.nativeName} ({currentLangObj.name})</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageToggle
                selectedLang={activeLang}
                onSelectLang={setActiveLang}
                isTranslating={isTranslating}
              />
              {activeLang !== "en" && (
                <button
                  onClick={() => setActiveLang("en")}
                  className="px-2.5 py-1 text-xs rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors"
                  title="Show English Original"
                >
                  Show Original (EN)
                </button>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-primary/10 border border-primary/20">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">Official Heritage Itinerary</p>
              <p className="text-sm text-foreground font-medium">Ready to explore this destination with verified local hotels & transport?</p>
            </div>
            <button
              onClick={handlePlanTrip}
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:opacity-90 flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4" /> Plan Trip to {rawSite.city || rawSite.name.split(" ")[0]}
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-muted/60 border border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium mb-1">
                <Clock className="w-3.5 h-3.5 text-primary" /> Timings
              </span>
              <p className="font-semibold text-foreground">{rawSite.timings || "09:00 AM - 05:30 PM"}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/60 border border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium mb-1">
                <Users className="w-3.5 h-3.5 text-blue-500" /> Crowd Density
              </span>
              <p className="font-semibold text-foreground">{rawSite.crowdDensity || "Moderate on weekdays"}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/60 border border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Dress Code
              </span>
              <p className="font-semibold text-foreground">{rawSite.dressCode || "Modest respectful attire"}</p>
            </div>
          </div>

          {/* Historical Narrative */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold flex items-center gap-2 text-foreground">
                <BookOpen className="w-4 h-4 text-primary" /> Archaeological & Historical Narrative
              </h3>
              <button
                onClick={handleSpeak}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                  isSpeaking
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted hover:bg-muted/80 text-foreground border-border"
                }`}
                title={isSpeaking ? "Stop listening" : "Listen in selected language"}
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "animate-pulse" : ""}`} />
                <span>{isSpeaking ? "Stop Voice" : "Listen"}</span>
              </button>
            </div>

            {isTranslating ? (
              <div className="p-6 rounded-2xl bg-muted/30 border border-border flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                <span>Translating narrative into {currentLangObj.name} with AI...</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {siteData.historicalNarrative || siteData.description}
              </p>
            )}
          </div>

          {/* The Hidden Aspect (Secret Tunnels / Chambers / Acoustics) */}
          {(siteData.hiddenAspect || rawSite.hiddenAspect) && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> The Hidden Aspect (Unrevealed Marvels)
              </h3>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {siteData.hiddenAspect || rawSite.hiddenAspect}
              </p>
            </div>
          )}

          {/* Frequent Scams & Safety Alerts */}
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/25 space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" /> Frequent Scam Warnings & Traveler Advisories
            </h3>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
              <span className="font-semibold text-destructive">Watch out for: </span>
              {siteData.frequentScams || rawSite.frequentScams || "Unauthorized freelance touts charging exorbitant guide fees. Always verify government-issued ASI holographic photo identification before paying."}
            </p>
            {(siteData.safetyTips || rawSite.safetyTips) && (
              <p className="text-xs text-muted-foreground pt-1 border-t border-destructive/20">
                <span className="font-semibold text-foreground">Safety Tip: </span>
                {siteData.safetyTips || rawSite.safetyTips}
              </p>
            )}
          </div>

          {/* Address & Official External Links */}
          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span><strong>Address: </strong>{rawSite.address || `${rawSite.name}, ${rawSite.state}, India`}</span>
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {rawSite.mapsUrl && (
                <a 
                  href={rawSite.mapsUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-muted/80 flex items-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Open in Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {rawSite.wiki && (
                <a 
                  href={rawSite.wiki} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-muted/80 flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" /> Wikipedia Archive <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {rawSite.youtube && (
                <a 
                  href={rawSite.youtube} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-muted/80 flex items-center gap-1.5 transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-500" /> YouTube Documentary <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Traveler Reviews */}
          {rawSite.reviews && rawSite.reviews.length > 0 && (
            <div className="pt-2 border-t border-border">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Verified Traveler Reviews</h4>
              <div className="space-y-2">
                {rawSite.reviews.map((r, i) => (
                  <div key={i} className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground">{r.user}</span>
                      <span className="flex text-amber-500">{"★".repeat(r.rating)}</span>
                    </div>
                    <p className="text-muted-foreground italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-muted/40 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Ministry of Tourism & ASI Verified</span>
          <button 
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              onClose();
            }}
            className="px-4 py-2 rounded-full border border-border text-xs font-semibold hover:bg-muted"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
