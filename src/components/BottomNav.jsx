import { Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, Landmark, Sparkles, Map as MapIcon, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

const items = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/heritage", icon: Landmark, label: "Heritage" },
  { to: "/planner", icon: Sparkles, label: "AI Plan", highlight: true },
  { to: "/map", icon: MapIcon, label: "Map" },
  { to: "/shop", icon: ShoppingBag, label: "Shop", showBadge: true },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { count } = useCart();

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border/70 backdrop-blur-xl bg-card/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(env(safe-area-inset-bottom,0px),0.25rem)]"
    >
      <div className="flex items-center justify-around h-15 px-2">
        {items.map((it) => {
          const active = it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
          const Icon = it.icon;

          return (
            <Link
              key={it.to}
              to={it.to}
              className={`relative flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl transition-all duration-200 active:scale-90 ${
                active 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              {/* Active subtle pill highlight */}
              <div 
                className={`relative flex items-center justify-center p-1.5 rounded-full transition-all duration-200 ${
                  active 
                    ? "bg-primary/15 text-primary scale-105" 
                    : it.highlight
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5 transition-transform" />
                
                {/* Cart Badge */}
                {it.showBadge && count > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-50">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </div>

              <span className={`text-[10px] tracking-tight mt-0.5 ${active ? "font-bold text-primary" : "font-medium"}`}>
                {it.label}
              </span>

              {/* Active Dot Indicator */}
              {active && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}