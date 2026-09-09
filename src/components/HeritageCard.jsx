import { MapPin, ExternalLink, Youtube, ShieldAlert, AlertTriangle } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { getLocalizedPlace } from "@/lib/itemTranslations";

export default function HeritageCard({ site: rawSite }) {
  const navigate = useNavigate();
  const { lang } = useI18n();
  const site = getLocalizedPlace(rawSite, lang);

  const handleCardClick = () => {
    navigate(`/heritage?id=${site.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/heritage?id=${site.id}`);
    }
  };

  const safetyNote = site.safetyTips || (site.frequentScams ? `Advisory: ${site.frequentScams.slice(0, 65)}…` : "Advisory: Verify licensed ASI guides & follow temple attire.");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="group block rounded-2xl overflow-hidden bg-card shadow-sm ring-1 ring-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-left"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={site.image}
          alt={site.name}
          className="w-full h-full"
          fittingType="fill"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 text-primary text-[11px] font-semibold uppercase tracking-wide">
          {site.tag}
        </span>
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-destructive/85 text-destructive-foreground text-[10px] font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm">
          <ShieldAlert className="w-3 h-3" /> Safety Verified
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          {site.state}
        </div>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {site.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
          {site.description}
        </p>

        {/* Safety Precaution Strip */}
        <div className="mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span className="line-clamp-1">{safetyNote}</span>
        </div>

        <div className="flex gap-3 mt-3 pt-3 border-t border-border">
          <a
            href={site.wiki}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Wiki
          </a>
          <a
            href={site.youtube}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <Youtube className="w-3.5 h-3.5" /> YouTube
          </a>
        </div>
      </div>
    </div>
  );
}