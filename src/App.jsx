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

const MainAppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
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
        <Route
          path="/admin"
          element={
            <ProtectedRoute unauthenticatedElement={<Navigate to="/login?returnTo=/admin" replace />}>
              <Admin />
            </ProtectedRoute>
          }
        />
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
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <MainAppRoutes />
            </Router>
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App