// AI Translation Service for Bharat Yatra
// Translates Heritage Site Descriptions, Historical Narratives, and Travel Journal Entries
// into Indian Regional Languages via server-side Gemini AI & resilient Google translation fallback.

export const INDIAN_REGIONAL_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", script: "Latin", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", script: "देवनागरी", flag: "🕉️" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", script: "తెలుగు", flag: "🛕" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", script: "தமிழ்", flag: "🏛️" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", script: "ಕನ್ನಡ", flag: "🏰" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", script: "বাংলা", flag: "🎨" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", script: "देवनागरी", flag: "🚩" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", script: "ગુજરાતી", flag: "🦁" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", script: "മലയാളം", flag: "🌴" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", script: "ਗੁਰਮੁਖੀ", flag: "🌾" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", script: "ଓଡ଼ିଆ", flag: "☀️" },
];

const CACHE_STORAGE_KEY = "by_translation_cache_v1";

// In-memory runtime cache
const memoryCache = new Map();

// Helper to get cache from localStorage
function getLocalCache() {
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Helper to persist in localStorage
function setLocalCache(key, value) {
  try {
    const cache = getLocalCache();
    // Evict oldest if exceeding 200 items to conserve storage
    const keys = Object.keys(cache);
    if (keys.length > 250) {
      delete cache[keys[0]];
    }
    cache[key] = value;
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
  } catch {}
}

/**
 * Hash string for compact cache key
 */
function makeCacheKey(text, targetLang) {
  let hash = 0;
  const str = `${targetLang}:${text}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `trans_${targetLang}_${Math.abs(hash)}`;
}

/**
 * Translates arbitrary text using the AI Translation endpoint
 * @param {string} text - The input text in English
 * @param {string} targetLang - Language code (e.g. 'hi', 'te', 'ta')
 * @returns {Promise<{ translatedText: string, pronunciation?: string, engine?: string }>}
 */
export async function translateText(text, targetLang = "hi") {
  if (!text || typeof text !== "string" || !text.trim()) {
    return { translatedText: "" };
  }

  // If target is English, return original
  if (targetLang === "en") {
    return { translatedText: text, engine: "original" };
  }

  const cacheKey = makeCacheKey(text.trim(), targetLang);

  // 1. Check in-memory cache
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  // 2. Check localStorage cache
  const localCache = getLocalCache();
  if (localCache[cacheKey]) {
    memoryCache.set(cacheKey, localCache[cacheKey]);
    return localCache[cacheKey];
  }

  // Find language config
  const langObj = INDIAN_REGIONAL_LANGUAGES.find((l) => l.code === targetLang) || { name: targetLang };

  try {
    const res = await fetch("/api/ai/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text.trim(),
        targetLang: langObj.name,
        sourceLang: "English",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const result = {
        translatedText: data.translatedText || text,
        pronunciation: data.pronunciation || "",
        culturalNote: data.culturalNote || "",
        engine: data.engine || "ai",
      };

      // Store in caches
      memoryCache.set(cacheKey, result);
      setLocalCache(cacheKey, result);

      return result;
    }
  } catch (err) {
    console.warn("[AI Translation Warning]:", err);
  }

  // Fallback if network is offline or service unavailable
  return {
    translatedText: text,
    engine: "fallback-original",
  };
}

/**
 * Translates an entire Heritage Site object (narrative, description, hidden aspect, advisories)
 * @param {object} site - Heritage Site object
 * @param {string} targetLang - Language code
 */
export async function translateHeritageSite(site, targetLang) {
  if (!site || targetLang === "en") return { ...site };

  const narrative = site.historicalNarrative || site.description || "";
  const hiddenAspect = site.hiddenAspect || "";
  const frequentScams = site.frequentScams || "";
  const safetyTips = site.safetyTips || "";

  // Perform translation
  const [narrativeRes, hiddenRes, scamsRes, tipsRes] = await Promise.all([
    narrative ? translateText(narrative, targetLang) : Promise.resolve({ translatedText: "" }),
    hiddenAspect ? translateText(hiddenAspect, targetLang) : Promise.resolve({ translatedText: "" }),
    frequentScams ? translateText(frequentScams, targetLang) : Promise.resolve({ translatedText: "" }),
    safetyTips ? translateText(safetyTips, targetLang) : Promise.resolve({ translatedText: "" }),
  ]);

  return {
    ...site,
    _translated: true,
    _targetLang: targetLang,
    historicalNarrative: narrativeRes.translatedText || narrative,
    description: narrativeRes.translatedText || site.description,
    hiddenAspect: hiddenRes.translatedText || hiddenAspect,
    frequentScams: scamsRes.translatedText || frequentScams,
    safetyTips: tipsRes.translatedText || safetyTips,
  };
}

/**
 * Translates a Travel Journal entry (notes, caption, title)
 * @param {object} entry - Journal Entry object
 * @param {string} targetLang - Language code
 */
export async function translateJournalEntry(entry, targetLang) {
  if (!entry || targetLang === "en") return { ...entry };

  const notes = entry.notes || "";
  const caption = entry.caption || "";
  const title = entry.title || entry.siteName || "";

  const [notesRes, captionRes, titleRes] = await Promise.all([
    notes ? translateText(notes, targetLang) : Promise.resolve({ translatedText: "" }),
    caption ? translateText(caption, targetLang) : Promise.resolve({ translatedText: "" }),
    title ? translateText(title, targetLang) : Promise.resolve({ translatedText: "" }),
  ]);

  return {
    ...entry,
    _translated: true,
    _targetLang: targetLang,
    notes: notesRes.translatedText || notes,
    caption: captionRes.translatedText || caption,
    title: titleRes.translatedText || title,
  };
}

/**
 * Clear cached translations
 */
export function clearTranslationCache() {
  memoryCache.clear();
  try {
    localStorage.removeItem(CACHE_STORAGE_KEY);
  } catch {}
}
