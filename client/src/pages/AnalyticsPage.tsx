import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Layers,
  Users,
  MessageSquare,
  ShieldCheck,
  PackageCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import { AnalyticsData } from '../types';
import { api } from '../services/api';
import { LoadingState } from '../components/LoadingState';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const result = await api.analytics.getCounts();
      setData(result);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingState message="Querying live database records..." className="py-32" />;
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-navy-500">Failed to load platform metrics.</p>
        <button
          onClick={fetchAnalytics}
          className="mt-3 px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  const { totals, listingsBySport, listingsByType, enquiriesByStatus } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            <BarChart3 className="w-4 h-4" />
            Empirical Platform Counts
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Live Application & Database Metrics
          </h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Calculated directly from the active SQLite database. Demo and seeded records are clearly delineated.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-navy-200 text-xs font-bold text-navy-700 hover:bg-navy-50 shadow-xs transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-brand-600" />
          Refresh (Updated: {lastRefreshed})
        </button>
      </div>

      {/* Academic Disclosure Alert */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Assignment Integrity Disclosure (MDMIE03 Presentation 2):</strong>
          <p className="mt-1 text-blue-800">
            {data.note} These figures represent genuine database row counts from this running prototype. They do NOT represent audited real-world consumer transactions, revenue, or venture capital scale.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <PackageCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-navy-500 block">Total Gear Listed</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-900">{totals.totalListings}</span>
            <span className="text-[11px] font-bold text-emerald-600">
              {totals.availableListings} active
            </span>
          </div>
          <p className="text-[11px] text-navy-400">
            {totals.demoListingsCount} demo seeds, {totals.userListingsCount} organic
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-navy-500 block">Registered Users</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-900">{totals.totalUsers}</span>
            <span className="text-[11px] font-bold text-blue-600">accounts</span>
          </div>
          <p className="text-[11px] text-navy-400">
            {totals.demoUsersCount} demo profiles, {totals.realUsersCount} newly created
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-navy-500 block">Stored Enquiries</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-900">{totals.totalEnquiries}</span>
            <span className="text-[11px] font-bold text-amber-600">messages</span>
          </div>
          <p className="text-[11px] text-navy-400">Buyer requests delivered to sellers</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-navy-500 block">Saved Favourites</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-900">{totals.totalFavourites}</span>
            <span className="text-[11px] font-bold text-rose-600">bookmarked</span>
          </div>
          <p className="text-[11px] text-navy-400">Persisted in SQLite database</p>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Listings by Sport */}
        <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-navy-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            Listings Distributed by Sport
          </h3>
          <div className="space-y-3">
            {listingsBySport.map((item) => {
              const pct = totals.totalListings > 0 ? Math.round((item.count / totals.totalListings) * 100) : 0;
              return (
                <div key={item.sport} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-navy-800">
                    <span>{item.sport}</span>
                    <span>
                      {item.count} items ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-navy-100 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Listings by Transaction Type & Enquiries */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-navy-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              Listings by Transaction Model
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              {listingsByType.map((t) => (
                <div key={t.type} className="p-3 bg-navy-50 rounded-2xl">
                  <span className="text-xs uppercase font-extrabold text-navy-400 block">
                    {t.type}
                  </span>
                  <span className="text-2xl font-black text-navy-900">{t.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base text-navy-900">Enquiry Status Pipeline</h3>
            <div className="flex items-center justify-between gap-2 text-xs font-bold">
              {enquiriesByStatus.map((s) => (
                <div key={s.status} className="flex-1 p-2.5 rounded-xl bg-navy-50 text-center">
                  <span className="text-navy-500 text-[10px] block">{s.status}</span>
                  <span className="text-base text-navy-900">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
