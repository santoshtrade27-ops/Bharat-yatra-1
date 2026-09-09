import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from '@/lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from '@/lib/theme';
import { I18nProvider } from '@/lib/i18n';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
// Add page imports here

import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Heritage from '@/pages/Heritage';
import Planner from '@/pages/Planner';
import Shop from '@/pages/Shop';
import MapPage from '@/pages/MapPage';
import Events from '@/pages/Events';
import Stories from '@/pages/Stories';
import Guides from '@/pages/Guides';
import Safety from '@/pages/Safety';
import EventPlanner from '@/pages/EventPlanner';
import SurprisePlanner from '@/pages/SurprisePlanner';
import Translator from '@/pages/Translator';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<ErrorBoundary><Layout /></ErrorBoundary>}>
          <Route path="/" element={<Home />} />
          <Route path="/heritage" element={<Heritage />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/event-planner" element={<EventPlanner />} />
          <Route path="/surprise-planner" element={<SurprisePlanner />} />
          <Route path="/translate" element={<Translator />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ThemeProvider>
          <I18nProvider>
            <Router>
              <ScrollToTop />
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App