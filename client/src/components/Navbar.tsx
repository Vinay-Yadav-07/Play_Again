import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  RefreshCw,
  PlusCircle,
  Heart,
  MessageSquare,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  BarChart3,
  ShieldCheck,
  Compass,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    success('Logged out successfully.');
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-navy-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-hidden"
            id="nav-brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-sm shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <RefreshCw className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-navy-900 group-hover:text-brand-600 transition-colors">
                Play<span className="text-brand-500">Again</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-navy-400 -mt-1">
                Sports Gear Exchange
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/marketplace"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                isActive('/marketplace')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
              }`}
              id="nav-link-marketplace"
            >
              <Compass className="w-4 h-4" />
              Explore Gear
            </Link>
            <Link
              to="/how-it-works"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                isActive('/how-it-works')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
              }`}
              id="nav-link-how-it-works"
            >
              <Layers className="w-4 h-4" />
              How It Works
            </Link>
            <Link
              to="/safety"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                isActive('/safety')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
              }`}
              id="nav-link-safety"
            >
              <ShieldCheck className="w-4 h-4" />
              Campus Safety
            </Link>
            <Link
              to="/analytics"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                isActive('/analytics')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
              }`}
              id="nav-link-metrics"
            >
              <BarChart3 className="w-4 h-4" />
              Live Counts
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* List Gear Primary CTA */}
            <Link
              to="/create-listing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-hidden"
              id="nav-btn-list-gear"
            >
              <PlusCircle className="w-4 h-4" />
              List Equipment
            </Link>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-navy-200 hover:border-brand-400 bg-white transition focus:outline-hidden"
                  id="nav-user-menu-btn"
                >
                  <img
                    src={
                      user.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&background=10b981&color=fff`
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-brand-200"
                  />
                  <span className="text-sm font-semibold text-navy-800 max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-navy-100 py-2 z-40 animate-fade-in">
                      <div className="px-4 py-2 border-b border-navy-100">
                        <p className="text-xs text-navy-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-navy-900 truncate">{user.name}</p>
                        <p className="text-xs text-navy-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard?tab=listings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-navy-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
                        >
                          <UserIcon className="w-4 h-4 text-navy-400" />
                          My Account & Listings
                        </Link>
                        <Link
                          to="/dashboard?tab=favourites"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-navy-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
                        >
                          <Heart className="w-4 h-4 text-navy-400" />
                          Saved Favourites
                        </Link>
                        <Link
                          to="/dashboard?tab=enquiries-received"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-navy-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
                        >
                          <MessageSquare className="w-4 h-4 text-navy-400" />
                          Received Enquiries
                        </Link>
                      </div>

                      <div className="border-t border-navy-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-bold text-navy-700 hover:text-brand-600 transition"
                  id="nav-btn-login"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl text-sm font-bold bg-navy-900 hover:bg-navy-800 text-white transition shadow-xs"
                  id="nav-btn-register"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/create-listing"
              className="p-2 rounded-lg bg-brand-500 text-white"
              title="List Equipment"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-navy-600 hover:text-navy-900 hover:bg-navy-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-navy-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-navy-800 hover:bg-brand-50"
            >
              Explore Equipment
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-navy-800 hover:bg-brand-50"
            >
              How It Works
            </Link>
            <Link
              to="/safety"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-navy-800 hover:bg-brand-50"
            >
              Campus Safety & Rules
            </Link>
            <Link
              to="/analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-navy-800 hover:bg-brand-50"
            >
              Live Counts & Metrics
            </Link>
          </div>

          <div className="border-t border-navy-100 pt-3">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-xs text-navy-400">Signed in as</p>
                  <p className="text-sm font-bold text-navy-900">{user.name}</p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-navy-700 hover:bg-navy-50"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-navy-800 bg-navy-100 hover:bg-navy-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white bg-brand-500 hover:bg-brand-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
