import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { EditListingPage } from './pages/EditListingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SafetyPage } from './pages/SafetyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

function NotFound() {
  return (
    <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-3xl border border-navy-100 shadow-sm text-center space-y-4">
      <h2 className="text-4xl font-black text-navy-900">404</h2>
      <h3 className="text-lg font-bold text-navy-800">Page Not Found</h3>
      <p className="text-xs text-navy-500">
        The equipment or page you are looking for does not exist on PlayAgain.
      </p>
      <Link
        to="/"
        className="inline-block px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
      >
        Return to Home
      </Link>
    </div>
  );
}

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/listings/:id" element={<ListingDetailPage />} />
                <Route
                  path="/listings/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EditListingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-listing"
                  element={
                    <ProtectedRoute>
                      <CreateListingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/safety" element={<SafetyPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
