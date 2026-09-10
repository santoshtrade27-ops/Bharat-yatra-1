import { MapPin, ExternalLink, Youtube } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { getLocalizedPlace } from "@/lib/itemTranslations";
import ThreeDTiltCard from "@/components/ui/ThreeDTiltCard";

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
    <ThreeDTiltCard
      maxTilt={12}
      scale={1.03}
      glare={true}
      depth="15px"
      onClick={handleCardClick}
      className="group block rounded-2xl overflow-hidden bg-card shadow-sm ring-1 ring-border hover:shadow-2xl hover:ring-amber-500/40 transition-all duration-300 text-left h-full"
    >
      <div
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="h-full flex flex-col justify-between"
      >
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          <Image
            src={site.image}
            alt={site.name}
            className="w-full h-full transform group-hover:scale-105 transition-transform duration-500"
            fittingType="fill"
          />
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/85 text-primary text-[11px] font-semibold uppercase tracking-wide shadow-md backdrop-blur-xs"
            style={{ transform: "translateZ(30px)" }}
          >
            {site.tag}
          </span>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {site.state}
            </div>
            <h3
              className="font-semibold text-foreground group-hover:text-primary transition-colors font-heading"
              style={{ transform: "translateZ(20px)" }}
            >
              {site.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
              {site.description}
            </p>
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
    </ThreeDTiltCard>
  );
}
