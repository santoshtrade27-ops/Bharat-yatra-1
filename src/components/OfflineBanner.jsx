import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!offline) return null;
  return (
    <div className="sticky top-16 z-40 bg-teal text-white text-xs font-medium px-4 py-1.5 flex items-center justify-center gap-2">
      <WifiOff className="w-3.5 h-3.5" />
      You're offline — saved plans & phrasebook still work.
    </div>
  );
}