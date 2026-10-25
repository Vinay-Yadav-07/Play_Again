import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  ShieldCheck,
  Repeat,
  Tag,
  CalendarClock,
  ArrowRight,
  TrendingUp,
  Leaf,
  Users,
  Search,
} from 'lucide-react';
import { Listing } from '../types';
import { api } from '../services/api';
import { ListingCard } from '../components/ListingCard';
import { LoadingState } from '../components/LoadingState';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await api.listings.getAll({ limit: 6, availability: 'available' });
        setFeaturedListings(data.listings);
      } catch (err) {
        console.error('Failed to load featured equipment:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      navigate('/marketplace');
    }
  };

  const sportsCategories = [
    { name: 'Cricket', count: 'Bats, Pads, Balls', icon: '🏏', path: '/marketplace?sport=Cricket' },
    { name: 'Football', count: 'Boots, Balls, Shins', icon: '⚽', path: '/marketplace?sport=Football' },
    { name: 'Badminton', count: 'Rackets, Kits, Shoes', icon: '🏸', path: '/marketplace?sport=Badminton' },
    { name: 'Basketball', count: 'Balls, Hoops, Gear', icon: '🏀', path: '/marketplace?sport=Basketball' },
    { name: 'Tennis', count: 'Rackets, Balls, Grips', icon: '🎾', path: '/marketplace?sport=Tennis' },
    { name: 'Fitness', count: 'Dumbbells, Mats, Bands', icon: '🏋️', path: '/marketplace?sport=Fitness' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-12 bg-gradient-to-b from-brand-50/60 via-surface-muted to-surface-muted">
        {/* Subtle decorative athletic grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 shadow-xs text-xs sm:text-sm font-bold text-brand-700 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              Give Sports Gear a Second Game
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.1]">
              Good Gear Deserves <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-400">
                Another Game.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-navy-600 leading-relaxed max-w-2xl mx-auto">
              The student-first peer-to-peer sports marketplace. Buy, sell, exchange, and rent pre-owned cricket bats, football boots, badminton rackets, and fitness equipment at fair student budgets.
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleQuickSearch} className="max-w-xl mx-auto pt-2">
              <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-navy-100 p-2 sm:p-2.5">
                <Search className="w-5 h-5 text-navy-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="What sport gear are you looking for today?..."
                  className="w-full px-3 py-2 text-sm text-navy-800 bg-transparent focus:outline-hidden"
                  id="hero-quick-search-input"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition shadow-xs shrink-0"
                  id="hero-quick-search-btn"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition transform hover:-translate-y-0.5"
                id="hero-btn-explore"
              >
                <Compass className="w-4 h-4 text-brand-400" />
                Explore Equipment
              </Link>
              <Link
                to="/create-listing"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-navy-50 text-navy-900 border border-navy-200 font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition"
                id="hero-btn-list"
              >
                <PlusCircle className="w-4 h-4 text-brand-600" />
                List Your Gear
              </Link>
            </div>
          </div>

          {/* Highlights Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-navy-100 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-900">Student Affordable</h4>
                <p className="text-xs text-navy-500">Save 40–70% compared to new gear retail prices</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-navy-100 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-900">Flexible Options</h4>
                <p className="text-xs text-navy-500">Buy, sell, direct gear swap, or match-day rentals</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-navy-100 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-900">Safe Campus Handover</h4>
                <p className="text-xs text-navy-500">Inspect equipment in-person at college sports hubs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Browse by Sport
            </h2>
            <p className="text-sm text-navy-500">Find gear tailored to your game</p>
          </div>
          <Link
            to="/marketplace"
            className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            All Sports
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {sportsCategories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="group p-5 bg-white rounded-2xl border border-navy-100 shadow-xs hover:shadow-card-hover hover:border-brand-300 transition-all text-center flex flex-col items-center justify-center"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <h3 className="font-bold text-sm text-navy-900 group-hover:text-brand-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-navy-400 mt-0.5">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Equipment Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Verified College Listings
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Featured Gear Available Now
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-navy-200 text-sm font-bold text-navy-700 hover:border-brand-400 hover:text-brand-600 transition bg-white"
          >
            View Full Marketplace
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Loading latest equipment listings..." />
        ) : featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-navy-200">
            <p className="text-navy-500 font-medium">No listings found. Be the first to list sports equipment!</p>
            <Link
              to="/create-listing"
              className="mt-3 inline-block px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs"
            >
              List Equipment
            </Link>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="bg-navy-900 text-white py-16 sm:py-20 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden">
        <div className="relative z-10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Simple & Safe Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How PlayAgain Works
            </h2>
            <p className="text-sm text-navy-300">
              Peer-to-peer sports equipment sharing simplified into 4 campus-friendly steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-extrabold text-lg">
                1
              </div>
              <h3 className="font-bold text-lg text-white">List Equipment</h3>
              <p className="text-sm text-navy-300 leading-relaxed">
                Upload clear gear photos, condition details, and specify if you want to sell, swap, or rent.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-extrabold text-lg">
                2
              </div>
              <h3 className="font-bold text-lg text-white">Discover Gear</h3>
              <p className="text-sm text-navy-300 leading-relaxed">
                Filter by sport, condition, and price to find the exact bats, rackets, or gear you need.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-extrabold text-lg">
                3
              </div>
              <h3 className="font-bold text-lg text-white">Connect & Agree</h3>
              <p className="text-sm text-navy-300 leading-relaxed">
                Submit an enquiry to the gear owner, agree on terms or offers, and coordinate an inspection.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-extrabold text-lg">
                4
              </div>
              <h3 className="font-bold text-lg text-white">Safe Handover</h3>
              <p className="text-sm text-navy-300 leading-relaxed">
                Meet at a designated campus sports pavilion, inspect the gear thoroughly, and complete the exchange.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300"
            >
              Read Full Walkthrough & Safety Disclosures
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sustainability & Reuse Philosophy (Honest, no unsupported stats) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-navy-100 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Leaf className="w-3.5 h-3.5" />
              Circular Sports Economy
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Giving Sports Gear a Purpose Beyond The Closet
            </h2>
            <p className="text-sm text-navy-600 leading-relaxed">
              Every college semester, graduating seniors and busy students leave behind quality cricket bats, tennis rackets, and football kit that have seasons of play left in them.
            </p>
            <p className="text-sm text-navy-600 leading-relaxed">
              PlayAgain keeps equipment in active play on campus courts and pitches, avoiding premature landfill disposal while dramatically lowering financial barriers for freshmen and amateur players joining college sports teams.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link
                to="/safety"
                className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                Inspection Guide & Standards
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-surface-muted border border-navy-100 space-y-2">
              <Users className="w-6 h-6 text-brand-600" />
              <h4 className="font-bold text-base text-navy-900">Peer Direct</h4>
              <p className="text-xs text-navy-500">
                Connect directly with fellow students without middleman markups.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-surface-muted border border-navy-100 space-y-2">
              <Repeat className="w-6 h-6 text-blue-600" />
              <h4 className="font-bold text-base text-navy-900">Gear Swaps</h4>
              <p className="text-xs text-navy-500">
                Trade your badminton racket for a football without spending cash.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-surface-muted border border-navy-100 space-y-2">
              <CalendarClock className="w-6 h-6 text-amber-600" />
              <h4 className="font-bold text-base text-navy-900">Short Rentals</h4>
              <p className="text-xs text-navy-500">
                Rent pads or tournament gear for single matches or weekends.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-surface-muted border border-navy-100 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h4 className="font-bold text-base text-navy-900">Campus Trust</h4>
              <p className="text-xs text-navy-500">
                Community accountability within your verified university environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 to-emerald-500 text-white p-8 sm:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Have Unused Equipment in Your Hostel Room?
            </h2>
            <p className="text-sm text-emerald-100 max-w-xl">
              List it in less than two minutes. Help a college peer play their favorite sport while putting cash in your wallet.
            </p>
          </div>
          <Link
            to="/create-listing"
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-brand-800 font-extrabold text-sm shadow-md transition transform hover:-translate-y-0.5 shrink-0"
            id="home-cta-list-gear"
          >
            List Equipment Now
          </Link>
        </div>
      </section>
    </div>
  );
};
