import { useState } from "react";
import { Star, MapPin, ShoppingBag, Check, Eye } from "lucide-react";
import { Image } from "@/components/ui/image";
import { addToCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { getLocalizedProduct } from "@/lib/itemTranslations";

export default function ProductCard({ product: rawProduct, onSelect }) {
  const { lang, t } = useI18n();
  const product = getLocalizedProduct(rawProduct, lang);

  const [added, setAdded] = useState(false);
  const name = product.name || product.title || "Handcrafted Heritage Artifact";
  const origin = product.origin || product.craft_origin || "Handicraft Cooperative";
  const rawPrice = Number(product.price) || 0;
  const rawMrp = Number(product.mrp) || Math.round(rawPrice * 1.3);
  const rating = Number(product.rating) || 4.8;
  const discount = rawMrp > rawPrice ? Math.round(((rawMrp - rawPrice) / rawMrp) * 100) : 0;

  function handleAdd(e) {
    e.stopPropagation();
    addToCart({ ...product, name, price: rawPrice, mrp: rawMrp });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div 
      onClick={() => onSelect && onSelect(product)}
      className="group flex flex-col rounded-3xl overflow-hidden bg-card shadow-xs ring-1 ring-border hover:ring-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-52 overflow-hidden bg-muted">
        <Image 
          src={product.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80"} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          fittingType="fill" 
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
            {discount}% OFF
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(product);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 hover:bg-background text-foreground grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-xs"
          title="Inspect craft story and ratings"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {origin}
            </span>
            <span className="flex items-center gap-1 font-bold text-foreground">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              {rating.toFixed(1)}
            </span>
          </div>

          <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors font-heading">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
            {product.description || "Authentic GI-recognized handloom craft directly sourced from verified master artisans."}
          </p>
        </div>

        <div className="pt-4 mt-2 border-t border-border">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">
                ₹{rawPrice.toLocaleString("en-IN")}
              </span>
              {rawMrp > rawPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{rawMrp.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              GI Certified
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95 ${
                added
                  ? "bg-emerald-500 text-white"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added to cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to cart
                </>
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect && onSelect(product);
              }}
              className="px-3.5 py-2.5 rounded-full bg-muted hover:bg-muted/80 text-foreground text-xs font-bold border border-border transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
