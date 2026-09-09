import { Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, Map as MapIcon, ShoppingBag, Sparkles, User } from "lucide-react";

const items = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/map", icon: MapIcon, label: "Map" },
  { to: "/planner", icon: Sparkles, label: "Plan" },
  { to: "/shop", icon: ShoppingBag, label: "Shop" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-border">
      <div className="flex items-center justify-around h-16">
        {items.map((it) => {
          const active = pathname === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <it.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}