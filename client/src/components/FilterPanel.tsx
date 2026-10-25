import React from 'react';
import { Search, Filter, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import { SportCategory, ListingType, ItemCondition } from '../types';

export interface FilterState {
  search: string;
  sport: SportCategory | 'All';
  listingType: ListingType | 'All';
  condition: ItemCondition | 'All';
  minPrice: string;
  maxPrice: string;
  sortBy: 'newest' | 'price_asc' | 'price_desc';
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

const SPORTS: (SportCategory | 'All')[] = [
  'All',
  'Cricket',
  'Football',
  'Badminton',
  'Basketball',
  'Tennis',
  'Fitness',
  'Other',
];

const TYPES: { label: string; value: ListingType | 'All' }[] = [
  { label: 'All Gear', value: 'All' },
  { label: 'For Sale', value: 'sale' },
  { label: 'For Swap', value: 'swap' },
  { label: 'For Rent', value: 'rent' },
];

const CONDITIONS: (ItemCondition | 'All')[] = ['All', 'Like New', 'Good', 'Fair'];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.sport !== 'All' ||
    filters.listingType !== 'All' ||
    filters.condition !== 'All' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '';

  return (
    <div className="space-y-4">
      {/* Search Bar & Primary Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-navy-100 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search equipment by name, brand, or sport (e.g., Cricket bat, Football, Racket)..."
            className="w-full pl-10 pr-10 py-2.5 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white transition"
            id="marketplace-search-input"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as any })}
            className="w-full sm:w-48 py-2.5 px-3 bg-white border border-navy-200 rounded-xl text-sm font-semibold text-navy-800 focus:outline-hidden focus:border-brand-500"
            id="marketplace-sort-select"
          >
            <option value="newest">Newest Listed</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="sm:hidden flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-navy-200 bg-navy-50 text-navy-800 text-sm font-bold shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Sport Category Pills Bar (Horizontal scroll on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {SPORTS.map((sport) => (
          <button
            key={sport}
            onClick={() => onChange({ sport })}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filters.sport === sport
                ? 'bg-brand-500 text-white shadow-xs scale-102'
                : 'bg-white border border-navy-200 text-navy-700 hover:border-brand-300 hover:bg-brand-50/50'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Desktop Filter Options Bar */}
      <div className="hidden sm:flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-navy-100 shadow-xs">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Listing Types Segmented Control */}
          <div className="flex items-center gap-1 bg-navy-50 p-1 rounded-xl">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => onChange({ listingType: t.value })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  filters.listingType === t.value
                    ? 'bg-white text-navy-900 shadow-xs'
                    : 'text-navy-500 hover:text-navy-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Condition Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-navy-500">Condition:</span>
            <select
              value={filters.condition}
              onChange={(e) => onChange({ condition: e.target.value as any })}
              className="py-1 px-2.5 bg-navy-50 border border-navy-200 rounded-lg text-xs font-medium text-navy-800 focus:outline-hidden"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Conditions' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Inputs */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-navy-500">Price (₹):</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              className="w-16 py-1 px-2 bg-navy-50 border border-navy-200 rounded-lg text-xs text-navy-800 focus:outline-hidden"
            />
            <span className="text-xs text-navy-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              className="w-16 py-1 px-2 bg-navy-50 border border-navy-200 rounded-lg text-xs text-navy-800 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Reset Filter Button */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-navy-500 font-medium">
            Showing <strong className="text-navy-900">{totalResults}</strong> items
          </span>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/40 backdrop-blur-xs sm:hidden">
          <div className="w-full max-w-xs bg-white h-full p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-navy-100">
                <h3 className="font-bold text-lg text-navy-900 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-brand-600" />
                  Filter Equipment
                </h3>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-navy-400 hover:text-navy-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-navy-500">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => onChange({ listingType: t.value })}
                      className={`p-2 rounded-xl text-xs font-bold text-center border ${
                        filters.listingType === t.value
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-navy-200 text-navy-600'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-navy-500">
                  Equipment Condition
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CONDITIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => onChange({ condition: c })}
                      className={`p-2 rounded-xl text-xs font-bold text-center border ${
                        filters.condition === c
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-navy-200 text-navy-600'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-navy-500">
                  Price Range (₹)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => onChange({ minPrice: e.target.value })}
                    className="w-full p-2 bg-navy-50 border border-navy-200 rounded-xl text-xs"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => onChange({ maxPrice: e.target.value })}
                    className="w-full p-2 bg-navy-50 border border-navy-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-navy-100 flex gap-2">
              <button
                onClick={() => {
                  onReset();
                  setMobileDrawerOpen(false);
                }}
                className="w-1/2 py-2.5 rounded-xl border border-navy-200 text-sm font-bold text-navy-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-bold shadow-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
