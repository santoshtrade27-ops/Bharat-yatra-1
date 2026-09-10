// Offline Storage Caching Engine for Bharat Yatra
// Ensures Saved Travel Journals and Itinerary Plans are reliably accessible 100% offline
// with localStorage fallback and Service Worker synchronization.

const JOURNALS_KEY = "by-travel-journal";
const ITINERARIES_KEY = "by-saved-itineraries";
const BOOKINGS_KEY = "by-user-bookings";
const META_KEY = "by-offline-meta";

export const DEFAULT_OFFLINE_ITINERARY = {
  id: "OFFLINE-EXP-1",
  to: "Hampi & Vijayanagara Heritage",
  from: "Bengaluru",
  days: 3,
  budget: 18500,
  food: "South Indian Vegetarian & Satvik",
  transport: "Vande Bharat Express (SBC - UBL)",
  hotel: {
    name: "Evolve Back Kamalapura Palace",
    location: "Kamalapura, Hampi",
    contact: "+91 83942 41100",
  },
  guide: {
    name: "Raghavendra Rao (ASI-KA-118)",
    phone: "+91 94480 33211",
  },
  savedAt: new Date().toISOString(),
  offlineAvailable: true,
  itinerary: [
    {
      day: 1,
      title: "Virupaksha Temple & Hampi Bazaar",
      desc: "Sunrise darshan at Virupaksha Temple, walk along the Tungabhadra River, Hemakuta Hill sunset boulders.",
      tips: "Carry water & remove shoes at temple entrances.",
    },
    {
      day: 2,
      title: "Vijaya Vittala Temple & Stone Chariot",
      desc: "Marvel at the 56 musical pillars, Garuda stone chariot, King's Balance & Royal Enclosure step-wells.",
      tips: "Electric buggies available for seniors from main parking.",
    },
    {
      day: 3,
      title: "Zenana Enclosure, Lotus Mahal & Departure",
      desc: "Explore Indo-Islamic Queen's Palace, Elephant Stables, craft shopping for stone carvings & return train.",
      tips: "Keep offline voucher ready for station entry.",
    },
  ],
};

/**
 * Get offline storage metadata
 */
export function getOfflineMeta() {
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : { lastSync: new Date().toISOString(), totalCached: 0 };
  } catch {
    return { lastSync: new Date().toISOString(), totalCached: 0 };
  }
}

/**
 * Save an itinerary plan to offline storage
 */
export function saveItineraryOffline(plan) {
  if (!plan) return false;
  try {
    const existing = getOfflineItineraries();
    const id = plan.id || `ITIN-${Date.now()}`;
    const enriched = {
      ...plan,
      id,
      savedAt: plan.savedAt || new Date().toISOString(),
      offlineAvailable: true,
    };

    // Filter out duplicate if updating
    const updated = [enriched, ...existing.filter((item) => item.id !== id)];
    localStorage.setItem(ITINERARIES_KEY, JSON.stringify(updated));

    // Also mirror to bookings if confirmed
    if (plan.status === "Confirmed" || plan.booked_at) {
      try {
        const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
        const updatedBookings = [enriched, ...bookings.filter((b) => b.id !== id)];
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
      } catch {}
    }

    notifyStorageUpdate();
    return true;
  } catch (err) {
    console.error("Failed to save itinerary offline:", err);
    return false;
  }
}

/**
 * Retrieve all itineraries stored for offline viewing
 */
export function getOfflineItineraries() {
  try {
    const raw = localStorage.getItem(ITINERARIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    // Check bookings as secondary source
    const rawBookings = localStorage.getItem(BOOKINGS_KEY);
    if (rawBookings) {
      const parsedBookings = JSON.parse(rawBookings);
      if (Array.isArray(parsedBookings) && parsedBookings.length > 0) {
        return parsedBookings;
      }
    }

    // Default sample if completely fresh
    return [DEFAULT_OFFLINE_ITINERARY];
  } catch {
    return [DEFAULT_OFFLINE_ITINERARY];
  }
}

/**
 * Save a travel journal entry to offline storage
 */
export function saveJournalOffline(entry) {
  if (!entry) return false;
  try {
    const raw = localStorage.getItem(JOURNALS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const id = entry.id || `JRNL-${Date.now()}`;
    const enriched = {
      ...entry,
      id,
      savedAt: entry.savedAt || new Date().toISOString(),
      offlineAvailable: true,
    };

    const updated = [enriched, ...existing.filter((item) => item.id !== id)];
    localStorage.setItem(JOURNALS_KEY, JSON.stringify(updated));

    notifyStorageUpdate();
    return true;
  } catch (err) {
    console.error("Failed to save journal entry offline:", err);
    return false;
  }
}

/**
 * Retrieve all travel journals stored for offline viewing
 */
export function getOfflineJournals() {
  try {
    const raw = localStorage.getItem(JOURNALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Summary of items stored offline
 */
export function getOfflineStats() {
  const journals = getOfflineJournals();
  const itineraries = getOfflineItineraries();
  return {
    journalCount: journals.length,
    itineraryCount: itineraries.length,
    isOffline: typeof navigator !== "undefined" ? !navigator.onLine : false,
    lastSync: getOfflineMeta().lastSync,
  };
}

/**
 * Emit event across tabs and components
 */
function notifyStorageUpdate() {
  try {
    const stats = getOfflineStats();
    localStorage.setItem(
      META_KEY,
      JSON.stringify({ lastSync: new Date().toISOString(), totalCached: stats.journalCount + stats.itineraryCount })
    );
    window.dispatchEvent(new CustomEvent("by-offline-storage-updated", { detail: stats }));
  } catch {}
}
