import { Star, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useI18n } from "@/lib/i18n";
import { getLocalizedFood } from "@/lib/itemTranslations";
import ThreeDTiltCard from "@/components/ui/ThreeDTiltCard";

export default function FoodCard({ food: rawFood }) {
  const { lang } = useI18n();
  const food = getLocalizedFood(rawFood, lang);
  return (
    <ThreeDTiltCard
      maxTilt={10}
      scale={1.03}
      glare={true}
      depth="15px"
      className="rounded-2xl overflow-hidden bg-card shadow-sm ring-1 ring-border hover:shadow-xl hover:ring-amber-500/40 transition-all duration-300 h-full"
    >
      <div className="relative h-40 overflow-hidden rounded-t-2xl">
        <Image src={food.image} alt={food.name} className="w-full h-full" fittingType="fill" />
        <span
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-card/90 text-foreground text-xs font-semibold shadow-md backdrop-blur-xs"
          style={{ transform: "translateZ(25px)" }}
        >
          <Star className="w-3 h-3 fill-primary text-primary" />
          {food.rating}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <MapPin className="w-3 h-3 text-primary" />
          {food.state}
        </div>
        <h3
          className="font-semibold text-foreground font-heading"
          style={{ transform: "translateZ(15px)" }}
        >
          {food.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
          {food.description}
        </p>
      </div>
    </ThreeDTiltCard>
  );
}
