import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

let realClient = null;
if (appId) {
  try {
    realClient = createClient({
      appId,
      token,
      functionsVersion,
      serverUrl: '',
      appBaseUrl,
    });
  } catch (err) {
    console.warn('[AI Studio] Could not initialize real Base44 client:', err);
  }
}

// In-memory / localStorage mock store for offline/standalone operation
const STORAGE_PREFIX = 'by_entity_';

function getStoredList(entityName) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + entityName);
    if (raw) return JSON.parse(raw);
  } catch {}
  if (entityName === 'User') {
    return [
      { id: 'usr_1', email: 'yatri@bharatyatra.in', full_name: 'Yatri Explorer', role: 'admin', created_date: new Date().toISOString() },
      { id: 'usr_2', email: 'ravi.guide@bharatyatra.in', full_name: 'Ravi Sharma (Senior Heritage Guide)', role: 'guide', created_date: new Date().toISOString() },
    ];
  }
  if (entityName === 'Booking') {
    return [
      {
        id: 'bk_1',
        title: 'Varanasi Ghats & Sarnath Walk',
        destination: 'Varanasi, Uttar Pradesh',
        status: 'confirmed',
        assigned_guide_id: 'usr_2',
        created_date: new Date().toISOString(),
      },
    ];
  }
  return [];
}

function saveStoredList(entityName, list) {
  try {
    localStorage.setItem(STORAGE_PREFIX + entityName, JSON.stringify(list));
  } catch {}
}

const mockEntities = new Proxy({}, {
  get: (_, entityName) => {
    return {
      list: async (_sort, _limit) => {
        if (realClient?.entities?.[entityName]?.list) {
          try {
            return await realClient.entities[entityName].list(_sort, _limit);
          } catch {}
        }
        return getStoredList(entityName);
      },
      create: async (data) => {
        if (realClient?.entities?.[entityName]?.create) {
          try {
            return await realClient.entities[entityName].create(data);
          } catch {}
        }
        const list = getStoredList(entityName);
        const newItem = {
          id: 'item_' + Math.random().toString(36).substring(2, 9),
          created_date: new Date().toISOString(),
          ...data,
        };
        list.unshift(newItem);
        saveStoredList(entityName, list);
        return newItem;
      },
      update: async (id, data) => {
        if (realClient?.entities?.[entityName]?.update) {
          try {
            return await realClient.entities[entityName].update(id, data);
          } catch {}
        }
        const list = getStoredList(entityName);
        const idx = list.findIndex((x) => x.id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...data, updated_date: new Date().toISOString() };
          saveStoredList(entityName, list);
          return list[idx];
        }
        return { id, ...data };
      },
      delete: async (id) => {
        if (realClient?.entities?.[entityName]?.delete) {
          try {
            return await realClient.entities[entityName].delete(id);
          } catch {}
        }
        const list = getStoredList(entityName).filter((x) => x.id !== id);
        saveStoredList(entityName, list);
        return { success: true };
      },
    };
  },
});

export const base44 = {
  app: {
    getPublicSettings: async () => {
      if (realClient?.app?.getPublicSettings) {
        try {
          return await realClient.app.getPublicSettings();
        } catch {}
      }
      return {
        id: appId || 'bharat-yatra',
        public_settings: {
          auth_required: false,
        },
      };
    },
  },
  auth: {
    me: async () => {
      if (realClient?.auth?.me) {
        try {
          return await realClient.auth.me();
        } catch {}
      }
      try {
        const stored = localStorage.getItem('by_user');
        if (stored) return JSON.parse(stored);
      } catch {}
      return {
        id: 'yatri_admin',
        full_name: 'Yatri Explorer',
        email: 'yatri@bharatyatra.in',
        role: 'admin',
      };
    },
    loginViaEmailPassword: async (email) => {
      if (realClient?.auth?.loginViaEmailPassword) {
        try {
          return await realClient.auth.loginViaEmailPassword(email);
        } catch {}
      }
      const user = {
        id: 'usr_' + Date.now(),
        email: email || 'yatri@bharatyatra.in',
        full_name: (email ? email.split('@')[0] : 'Yatri Explorer').replace(/\b\w/g, (l) => l.toUpperCase()),
        role: 'admin',
      };
      try {
        localStorage.setItem('by_user', JSON.stringify(user));
        localStorage.setItem('base44_access_token', 'demo_token_' + Date.now());
        localStorage.removeItem('by_logged_out');
      } catch {}
      return user;
    },
    loginWithProvider: (provider, returnTo) => {
      if (realClient?.auth?.loginWithProvider) {
        try {
          return realClient.auth.loginWithProvider(provider, returnTo);
        } catch {}
      }
      const user = {
        id: 'google_usr_' + Date.now(),
        email: 'explorer.google@bharatyatra.in',
        full_name: 'Google Yatri',
        role: 'admin',
      };
      try {
        localStorage.setItem('by_user', JSON.stringify(user));
        localStorage.setItem('base44_access_token', 'demo_google_token');
        localStorage.removeItem('by_logged_out');
      } catch {}
      window.location.href = returnTo || '/';
    },
    register: async ({ email }) => {
      if (realClient?.auth?.register) {
        try {
          return await realClient.auth.register({ email });
        } catch {}
      }
      return { success: true };
    },
    verifyOtp: async ({ email }) => {
      if (realClient?.auth?.verifyOtp) {
        try {
          return await realClient.auth.verifyOtp({ email });
        } catch {}
      }
      const tokenVal = 'demo_otp_token_' + Date.now();
      try {
        localStorage.setItem('base44_access_token', tokenVal);
        localStorage.removeItem('by_logged_out');
      } catch {}
      return { access_token: tokenVal };
    },
    resendOtp: async () => ({ success: true }),
    resetPassword: async () => ({ success: true }),
    resetPasswordRequest: async () => ({ success: true }),
    setToken: (t) => {
      try {
        if (t) localStorage.setItem('base44_access_token', t);
      } catch {}
    },
    logout: (returnTo) => {
      try {
        localStorage.removeItem('by_user');
        localStorage.removeItem('base44_access_token');
        localStorage.removeItem('token');
        localStorage.setItem('by_logged_out', 'true');
      } catch {}
      if (returnTo) {
        window.location.href = returnTo;
      }
    },
    redirectToLogin: (returnTo) => {
      window.location.href = '/login' + (returnTo ? '?returnTo=' + encodeURIComponent(returnTo) : '');
    },
  },
  entities: mockEntities,
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        if (realClient?.integrations?.Core?.UploadFile) {
          try {
            return await realClient.integrations.Core.UploadFile({ file });
          } catch {}
        }
        return { file_url: URL.createObjectURL(file) };
      },
      InvokeLLM: async (params) => {
        // First priority: Use server-side Google Gemini endpoint
        try {
          const res = await fetch('/api/ai/invoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
          });
          if (res.ok) {
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              return await res.json();
            }
            return await res.text();
          }
        } catch {
          // Fall through to local intelligent fallback if server is unreachable
        }

        if (realClient?.integrations?.Core?.InvokeLLM) {
          try {
            return await realClient.integrations.Core.InvokeLLM(params);
          } catch {}
        }
        const prompt = params?.prompt || '';

        // Planner structured itinerary schema response
        if (params?.response_json_schema?.properties?.itinerary) {
          const daysMatch = prompt.match(/(\d+)-day/i);
          const days = daysMatch ? parseInt(daysMatch[1], 10) : 3;
          const toMatch = prompt.match(/going to ([^,]+)/i);
          const destination = toMatch ? toMatch[1].trim() : 'India';

          const itinerary = [];
          for (let i = 1; i <= days; i++) {
            if (i === 1) {
              itinerary.push({
                title: `Day 1: Arrival & Heritage Landmarks of ${destination}`,
                desc: `Discover the monumental architecture, royal gateways, and authentic culinary street corners.`,
              });
            } else if (i === 2) {
              itinerary.push({
                title: `Day 2: Living Crafts & Ancient Temples`,
                desc: `Visit local artisanal handloom weavers, master pottery studios, and sacred stone-carved shrines.`,
              });
            } else if (i === 3) {
              itinerary.push({
                title: `Day 3: Scenic Ghats & Cultural Performances`,
                desc: `Enjoy an evocative dawn boat ride or heritage promenade followed by traditional folk dance and classical music.`,
              });
            } else {
              itinerary.push({
                title: `Day ${i}: Hidden Gems & Rural Art Villages`,
                desc: `Explore timeless village workshops, historic stepwells, and community spice gardens with local storytellers.`,
              });
            }
          }
          return {
            itinerary,
            summary: `A personalized ${days}-day cultural itinerary in ${destination} celebrating authentic living traditions, regional crafts, and ancient monuments.`,
          };
        }

        // Translation prompt
        if (prompt.includes('Translate the following English text')) {
          const textMatch = prompt.match(/"([^"]+)"/);
          const textToTranslate = textMatch ? textMatch[1] : 'Namaste';
          if (prompt.includes('Hindi')) {
            return `नमस्ते (${textToTranslate})`;
          } else if (prompt.includes('Telugu')) {
            return `నమస్కారం (${textToTranslate})`;
          }
          return `Namaste — ${textToTranslate}`;
        }

        // AI Travel Assistant
        return `Welcome to Bharat Yatra! Indian heritage spans over five millennia of living art, sacred monuments, and cultural traditions. Whether you seek ancient temples, royal forts, GI-tagged crafts, or regional gastronomy, I am here to guide your journey.`;
      },
    },
  },
};
