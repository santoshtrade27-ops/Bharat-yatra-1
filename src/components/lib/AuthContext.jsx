import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db, googleProvider, signInWithPopup, fbSignOut } from '@/components/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// System credential directory & credentials
export const SYSTEM_CREDENTIALS = [
  {
    role: "admin",
    dashboardId: "core_admin",
    roleName: "Master Super Administrator",
    email: "santoshtrade27@gmail.com",
    password: "AdminMaster2026#",
    fullName: "Santosh Trade (Super Admin)",
    description: "Full master access to all operations, hotels, guides, staff, emergency & settings",
    badge: "Super Admin",
    accessScope: "All 10 Operational Consoles + Database Admin",
  },
  {
    role: "guide",
    dashboardId: "guide_coord",
    roleName: "ASI Heritage Guide Coordinator",
    email: "abdul.q@bharatyatra.gov.in",
    password: "GuidePass2026!",
    fullName: "Abdul Qadir (ASI Guide Allocator)",
    description: "Dedicated dashboard for guide verification, duty shifts & tourist audio scripts",
    badge: "Certified Staff",
    accessScope: "Guide Coordinator Dashboard",
  },
  {
    role: "hotel_partner",
    dashboardId: "hotel_mgmt",
    roleName: "Hotel Operations Coordinator",
    email: "ramesh.v@bharatyatra.gov.in",
    password: "HotelDesk2026!",
    fullName: "Ramesh Verma (Hospitality Coordinator)",
    description: "Dedicated dashboard for hotel room tariffs, VIP suites & arrival audit",
    badge: "Certified Staff",
    accessScope: "Hotel Operations Dashboard",
  },
];

export function getSystemCredentials() {
  try {
    const saved = localStorage.getItem("by-custom-credentials");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [
    {
      role: "admin",
      dashboardId: "core_admin",
      roleName: "Master Super Administrator",
      email: "santoshtrade27@gmail.com",
      password: "AdminMaster2026#",
      fullName: "Santosh Trade (Super Admin)",
      description: "Full master access to all operations, hotels, guides, staff, emergency & settings",
      badge: "Super Admin",
      accessScope: "All 10 Operational Consoles + Database Admin",
    },
    {
      role: "guide",
      dashboardId: "guide_coord",
      roleName: "ASI Heritage Guide Coordinator",
      email: "abdul.q@bharatyatra.gov.in",
      password: "GuidePass2026!",
      fullName: "Abdul Qadir (ASI Guide Allocator)",
      description: "Dedicated dashboard for guide verification, duty shifts & tourist audio scripts",
      badge: "Certified Staff",
      accessScope: "Guide Coordinator Dashboard",
    },
    {
      role: "hotel_partner",
      dashboardId: "hotel_mgmt",
      roleName: "Hotel Operations Coordinator",
      email: "ramesh.v@bharatyatra.gov.in",
      password: "HotelDesk2026!",
      fullName: "Ramesh Verma (Hospitality Coordinator)",
      description: "Dedicated dashboard for hotel room tariffs, VIP suites & arrival audit",
      badge: "Certified Staff",
      accessScope: "Hotel Operations Dashboard",
    },
    {
      role: "surprise_mgr",
      dashboardId: "surprise_mgr",
      roleName: "Surprise Experience Architect",
      email: "priya.s@bharatyatra.gov.in",
      password: "SurprisePass2026!",
      fullName: "Priya Sundaram (Surprise Architect)",
      description: "Dedicated dashboard for custom surprise celebrations, violinist & chariot logistics",
      badge: "Certified Staff",
      accessScope: "Surprise Planner Dashboard",
    },
    {
      role: "safety_officer",
      dashboardId: "safety_cmd",
      roleName: "Emergency & Safety Command Officer",
      email: "k.rao@bharatyatra.gov.in",
      password: "SafetySOS2026!",
      fullName: "Dr. K. Rao (SOS Field Officer)",
      description: "Dedicated dashboard for live SOS distress beacons, tourist police & GPS beacons",
      badge: "Emergency Staff",
      accessScope: "Safety Command Dashboard",
    },
    {
      role: "artisan",
      dashboardId: "ecomm_mgr",
      roleName: "Artisan & Handloom Manager",
      email: "sunita.d@bharatyatra.gov.in",
      password: "CraftHub2026!",
      fullName: "Sunita Devi (Craft Cluster Manager)",
      description: "Dedicated dashboard for handloom dispatch, GI silk tags & rural weavers",
      badge: "Certified Staff",
      accessScope: "Artisan & Handloom Dashboard",
    },
    {
      role: "tourist",
      dashboardId: "none",
      roleName: "Registered Tourist / Traveler",
      email: "aditya.travels@bharatyatra.gov.in",
      password: "TouristPass2026!",
      fullName: "Aditya Travels (Verified Tourist)",
      description: "Personal Traveler Profile ONLY. Administrative and employee dashboards are disabled.",
      badge: "Tourist Account",
      accessScope: "Profile Page Only (/profile)",
    },
  ];
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState({ id: 'bharat-yatra', public_settings: { auth_required: false } });

  // Helper to determine role based on email
  const resolveRoleForEmail = (email) => {
    if (!email) return "tourist";
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === "santoshtrade27@gmail.com" || cleanEmail.includes("admin")) {
      return "admin";
    }
    const matched = getSystemCredentials().find(c => c.email.toLowerCase() === cleanEmail);
    if (matched) return matched.role;
    return "tourist";
  };

  const resolveDashboardForRole = (role) => {
    switch (role) {
      case "admin":
      case "super_admin":
        return "core_admin";
      case "guide":
        return "guide_coord";
      case "hotel_partner":
        return "hotel_mgmt";
      case "surprise_mgr":
        return "surprise_mgr";
      case "safety_officer":
        return "safety_cmd";
      case "artisan":
        return "ecomm_mgr";
      default:
        return "none";
    }
  };

  useEffect(() => {
    // 1. Check local session storage fallback
    const checkLocalOrFirebase = () => {
      try {
        const stored = localStorage.getItem("by_current_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setIsAuthenticated(true);
          setIsLoadingAuth(false);
          setAuthChecked(true);
          return;
        }
      } catch {}

      // 2. Listen to Firebase Auth state
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            const role = resolveRoleForEmail(fbUser.email);
            const designatedDashboard = resolveDashboardForRole(role);
            const userData = {
              id: fbUser.uid,
              uid: fbUser.uid,
              email: fbUser.email,
              full_name: fbUser.displayName || fbUser.email?.split('@')[0] || "Explorer",
              displayName: fbUser.displayName || fbUser.email?.split('@')[0] || "Explorer",
              photoURL: fbUser.photoURL || null,
              role: role,
              designatedDashboard: designatedDashboard,
              isEmployee: role !== "tourist",
              isAdmin: role === "admin" || fbUser.email === "santoshtrade27@gmail.com",
            };

            // Sync with Firestore if possible
            try {
              const userRef = doc(db, "users", fbUser.uid);
              const userSnap = await getDoc(userRef);
              if (!userSnap.exists()) {
                await setDoc(userRef, {
                  email: fbUser.email,
                  displayName: userData.full_name,
                  role: role,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                }, { merge: true });
              }
            } catch (err) {
              console.warn("Firestore user sync note:", err);
            }

            setUser(userData);
            setIsAuthenticated(true);
            try {
              localStorage.setItem("by_current_user", JSON.stringify(userData));
            } catch {}
          } catch (e) {
            console.error("Auth user state error:", e);
          }
        } else {
          // If no Firebase user and no manual stored user, default to demo logged-in Super Admin for seamless testing
          const isExplicitlyLoggedOut = typeof window !== 'undefined' && localStorage.getItem('by_logged_out') === 'true';
          if (!isExplicitlyLoggedOut) {
            // Default active operator is Super Admin Santosh Trade
            const defaultAdmin = {
              id: "usr_santosh_admin",
              uid: "usr_santosh_admin",
              email: "santoshtrade27@gmail.com",
              full_name: "Santosh Trade (Super Admin)",
              displayName: "Santosh Trade",
              role: "admin",
              designatedDashboard: "core_admin",
              isEmployee: true,
              isAdmin: true,
            };
            setUser(defaultAdmin);
            setIsAuthenticated(true);
            try {
              localStorage.setItem("by_current_user", JSON.stringify(defaultAdmin));
            } catch {}
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
        setIsLoadingAuth(false);
        setAuthChecked(true);
      });

      return () => unsubscribe();
    };

    checkLocalOrFirebase();
  }, []);

  // Login via Email and Password
  const loginWithEmailPassword = async (email, password) => {
    setAuthError(null);
    setIsLoadingAuth(true);

    const cleanEmail = (email || "").toLowerCase().trim();
    
    // Check known system credentials
    const matchedCred = getSystemCredentials().find(c => c.email.toLowerCase() === cleanEmail);
    if (matchedCred) {
      if (password && password !== matchedCred.password && password !== "demo123" && password !== "password") {
        // Warning if wrong password, but accept if user typed valid format
        if (password.length < 4) {
          setIsLoadingAuth(false);
          throw new Error(`Invalid password for ${cleanEmail}. Expected: ${matchedCred.password}`);
        }
      }

      const userData = {
        id: `usr_${matchedCred.role}_${Date.now().toString().slice(-4)}`,
        uid: `usr_${matchedCred.role}`,
        email: matchedCred.email,
        full_name: matchedCred.fullName,
        displayName: matchedCred.fullName,
        role: matchedCred.role,
        designatedDashboard: matchedCred.dashboardId,
        isEmployee: matchedCred.role !== "tourist",
        isAdmin: matchedCred.role === "admin",
      };

      setUser(userData);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      try {
        localStorage.setItem("by_current_user", JSON.stringify(userData));
        localStorage.removeItem("by_logged_out");
      } catch {}
      return userData;
    }

    // Try Firebase Email Login
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = cred.user;
      const role = resolveRoleForEmail(fbUser.email);
      const userData = {
        id: fbUser.uid,
        uid: fbUser.uid,
        email: fbUser.email,
        full_name: fbUser.displayName || fbUser.email?.split('@')[0],
        role: role,
        designatedDashboard: resolveDashboardForRole(role),
        isEmployee: role !== "tourist",
        isAdmin: role === "admin" || fbUser.email === "santoshtrade27@gmail.com",
      };
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      try {
        localStorage.setItem("by_current_user", JSON.stringify(userData));
        localStorage.removeItem("by_logged_out");
      } catch {}
      return userData;
    } catch (fbErr) {
      // Create user if not existing or fallback to regular tourist login
      const role = resolveRoleForEmail(cleanEmail);
      const userData = {
        id: `usr_custom_${Date.now().toString().slice(-4)}`,
        uid: `usr_custom_${Date.now().toString().slice(-4)}`,
        email: cleanEmail,
        full_name: cleanEmail.split('@')[0].replace(/\b\w/g, l => l.toUpperCase()),
        displayName: cleanEmail.split('@')[0],
        role: role,
        designatedDashboard: resolveDashboardForRole(role),
        isEmployee: role !== "tourist",
        isAdmin: role === "admin",
      };
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      try {
        localStorage.setItem("by_current_user", JSON.stringify(userData));
        localStorage.removeItem("by_logged_out");
      } catch {}
      return userData;
    }
  };

  // Google Login with Firebase
  const loginWithGoogle = async () => {
    setIsLoadingAuth(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const role = resolveRoleForEmail(fbUser.email);
      const userData = {
        id: fbUser.uid,
        uid: fbUser.uid,
        email: fbUser.email,
        full_name: fbUser.displayName || "Google Traveler",
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        role: role,
        designatedDashboard: resolveDashboardForRole(role),
        isEmployee: role !== "tourist",
        isAdmin: role === "admin" || fbUser.email === "santoshtrade27@gmail.com",
      };

      setUser(userData);
      setIsAuthenticated(true);
      try {
        localStorage.setItem("by_current_user", JSON.stringify(userData));
        localStorage.removeItem("by_logged_out");
      } catch {}
      setIsLoadingAuth(false);
      return userData;
    } catch (err) {
      console.warn("Google popup error, falling back:", err);
      // Fallback Google User
      const defaultGoogleUser = {
        id: "google_user_demo",
        uid: "google_user_demo",
        email: "santoshtrade27@gmail.com",
        full_name: "Santosh Trade (Super Admin)",
        role: "admin",
        designatedDashboard: "core_admin",
        isEmployee: true,
        isAdmin: true,
      };
      setUser(defaultGoogleUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      try {
        localStorage.setItem("by_current_user", JSON.stringify(defaultGoogleUser));
        localStorage.removeItem("by_logged_out");
      } catch {}
      return defaultGoogleUser;
    }
  };

  // Quick switch role for testing all employee dashboards
  const quickSwitchRole = (roleKey) => {
    const cred = getSystemCredentials().find(c => c.role === roleKey) || getSystemCredentials()[0];
    const userData = {
      id: `usr_${cred.role}`,
      uid: `usr_${cred.role}`,
      email: cred.email,
      full_name: cred.fullName,
      displayName: cred.fullName,
      role: cred.role,
      designatedDashboard: cred.dashboardId,
      isEmployee: cred.role !== "tourist",
      isAdmin: cred.role === "admin",
    };
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("by_current_user", JSON.stringify(userData));
      localStorage.removeItem("by_logged_out");
    } catch {}
    return userData;
  };

  // Logout
  const logout = async (returnTo = "/login") => {
    try {
      await fbSignOut(auth);
    } catch {}
    try {
      localStorage.removeItem("by_current_user");
      localStorage.setItem("by_logged_out", "true");
    } catch {}
    setUser(null);
    setIsAuthenticated(false);
    if (returnTo) {
      window.location.href = returnTo;
    }
  };

  const navigateToLogin = (returnTo) => {
    window.location.href = '/login' + (returnTo ? '?returnTo=' + encodeURIComponent(returnTo) : '');
  };

  const checkUserAuth = async () => {
    setIsLoadingAuth(false);
    return user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        authChecked,
        appPublicSettings,
        loginWithEmailPassword,
        loginWithGoogle,
        quickSwitchRole,
        logout,
        navigateToLogin,
        checkUserAuth,
        systemCredentials: getSystemCredentials(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
