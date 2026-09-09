import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, MapPin, Clock, Users, Sparkles, Star, 
  ExternalLink, Youtube, BookOpen, Compass, AlertTriangle, CheckCircle2 
} from "lucide-react";

export default function HeritageDetailModal({ site, onClose }) {
  const navigate = useNavigate();

  if (!site) return null;

  const handlePlanTrip = () => {
    onClose();
    // Navigate to planner with pre-selected destination
    const destination = site.city || site.name;
    navigate(`/planner?destination=${encodeURIComponent(destination)}&state=${encodeURIComponent(site.state || "")}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl my-8 bg-card text-card-foreground rounded-3xl shadow-2xl border border-border overflow-hidden">
        {/* Header Image with gradient overlay */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img 
            src={site.image} 
            alt={site.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary text-primary-foreground">
                {site.tag || "Heritage"}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-white/20 backdrop-blur-md text-white flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {site.city ? `${site.city}, ` : ""}{site.state}
              </span>
              {site.rating && (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/90 text-white flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> {site.rating} ({site.reviewsCount || 100}+ reviews)
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{site.name}</h2>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
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
              <Compass className="w-4 h-4" /> Plan Trip to {site.city || site.name.split(" ")[0]}
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-muted/60 border border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium mb-1">
                <Clock className="w-3.5 h-3.5 text-primary" /> Timings
              </span>
              <p className="font-semibold text-foreground">{site.timings || "09:00 AM - 05:30 PM"}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/60 border border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium mb-1">
                <Users className="w-3.5 h-3.5 text-blue-500" /> Crowd Density
              </span>
              <p className="font-semibold text-foreground">{site.crowdDensity || "Moderate on weekdays"}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/60 border border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Dress Code
              </span>
              <p className="font-semibold text-foreground">{site.dressCode || "Modest respectful attire"}</p>
            </div>
          </div>

          {/* Historical Narrative */}
          <div>
            <h3 className="text-base font-semibold flex items-center gap-2 text-foreground mb-2">
              <BookOpen className="w-4 h-4 text-primary" /> Archaeological & Historical Narrative
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {site.historicalNarrative || site.description}
            </p>
          </div>

          {/* The Hidden Aspect (Secret Tunnels / Chambers / Acoustics) */}
          {site.hiddenAspect && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> The Hidden Aspect (Unrevealed Marvels)
              </h3>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {site.hiddenAspect}
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
              {site.frequentScams || "Unauthorized freelance touts charging exorbitant guide fees. Always verify government-issued ASI holographic photo identification before paying."}
            </p>
            {site.safetyTips && (
              <p className="text-xs text-muted-foreground pt-1 border-t border-destructive/20">
                <span className="font-semibold text-foreground">Safety Tip: </span>
                {site.safetyTips}
              </p>
            )}
          </div>

          {/* Address & Official External Links */}
          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span><strong>Address: </strong>{site.address || `${site.name}, ${site.state}, India`}</span>
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {site.mapsUrl && (
                <a 
                  href={site.mapsUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-muted/80 flex items-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Open in Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {site.wiki && (
                <a 
                  href={site.wiki} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-muted/80 flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" /> Wikipedia Archive <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {site.youtube && (
                <a 
                  href={site.youtube} 
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
          {site.reviews && site.reviews.length > 0 && (
            <div className="pt-2 border-t border-border">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Verified Traveler Reviews</h4>
              <div className="space-y-2">
                {site.reviews.map((r, i) => (
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
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-border text-xs font-semibold hover:bg-muted"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
