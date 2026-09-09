import { Star, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useI18n } from "@/lib/i18n";
import { getLocalizedFood } from "@/lib/itemTranslations";

export default function FoodCard({ food: rawFood }) {
  const { lang } = useI18n();
  const food = getLocalizedFood(rawFood, lang);
  return (
    <div className="rounded-2xl overflow-hidden bg-card shadow-sm ring-1 ring-border hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-40 overflow-hidden">
        <Image src={food.image} alt={food.name} className="w-full h-full" fittingType="fill" />
        <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-card/90 text-foreground text-xs font-semibold">
          <Star className="w-3 h-3 fill-primary text-primary" />
          {food.rating}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <MapPin className="w-3 h-3 text-primary" />
          {food.state}
        </div>
        <h3 className="font-semibold text-foreground">{food.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
          {food.description}
        </p>
      </div>
    </div>
  );
}