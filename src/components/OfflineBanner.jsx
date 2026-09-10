import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { WifiOff, CheckCircle2, BookOpen, Compass, X } from "lucide-react";
import { getOfflineStats } from "@/components/lib/offlineStorage";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );
  const [stats, setStats] = useState(getOfflineStats);
  const [dismissed, setDismissed] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const on = () => {
      setOffline(false);
      setJustReconnected(true);
      setTimeout(() => setJustReconnected(false), 4000);
    };
    const off = () => {
      setOffline(true);
      setDismissed(false);
      setStats(getOfflineStats());
    };
    const onStorageUpdate = () => {
      setStats(getOfflineStats());
    };

    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    window.addEventListener("by-offline-storage-updated", onStorageUpdate);

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      window.removeEventListener("by-offline-storage-updated", onStorageUpdate);
    };
  }, []);

  if (justReconnected) {
    return (
      <div className="sticky top-16 z-40 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-center gap-2 shadow-md transition-all animate-fadeIn">
        <CheckCircle2 className="w-4 h-4" />
        Connection restored! Online AI models and live maps are active.
      </div>
    );
  }

  if (!offline || dismissed) return null;

  return (
    <div className="sticky top-16 z-40 bg-amber-600 text-white text-xs font-medium px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-200 shrink-0" />
        <span>
          <strong>Offline Mode Active:</strong> Service worker & local storage caching are preserving your access.
          {stats.journalCount > 0 && ` ${stats.journalCount} Travel Journals`}
          {stats.journalCount > 0 && stats.itineraryCount > 0 && ` · `}
          {stats.itineraryCount > 0 && `${stats.itineraryCount} Saved Itinerary Plans`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/profile?tab=journal"
          className="px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
        >
          <BookOpen className="w-3 h-3" /> Saved Journals
        </Link>
        <Link
          to="/profile?tab=bookings"
          className="px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
        >
          <Compass className="w-3 h-3" /> Itineraries
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white"
          title="Dismiss"
          aria-label="Dismiss offline banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}