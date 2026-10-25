import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Sparkles } from 'lucide-react';
import { Listing, SportCategory, ListingType, ItemCondition } from '../types';
import { api } from '../services/api';
import { ListingCard } from '../components/ListingCard';
import { FilterPanel, FilterState } from '../components/FilterPanel';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';

export const MarketplacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL query parameters
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    sport: (searchParams.get('sport') as SportCategory) || 'All',
    listingType: (searchParams.get('type') as ListingType) || 'All',
    condition: (searchParams.get('condition') as ItemCondition) || 'All',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: (searchParams.get('sort') as any) || 'newest',
  });

  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state to URL search parameters
  const updateUrlParams = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.sport !== 'All') params.set('sport', newFilters.sport);
    if (newFilters.listingType !== 'All') params.set('type', newFilters.listingType);
    if (newFilters.condition !== 'All') params.set('condition', newFilters.condition);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.sortBy !== 'newest') params.set('sort', newFilters.sortBy);
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listings.getAll({
        search: filters.search || undefined,
        sport: filters.sport !== 'All' ? filters.sport : undefined,
        listingType: filters.listingType !== 'All' ? filters.listingType : undefined,
        condition: filters.condition !== 'All' ? filters.condition : undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        sortBy: filters.sortBy,
        page,
        limit: 12,
      });

      setListings(data.listings);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error('Error fetching marketplace listings:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFilterChange = (partial: Partial<FilterState>) => {
    const next = { ...filters, ...partial };
    setFilters(next);
    setPage(1);
    updateUrlParams(next);
  };

  const handleResetFilters = () => {
    const initial: FilterState = {
      search: '',
      sport: 'All',
      listingType: 'All',
      condition: 'All',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
    };
    setFilters(initial);
    setPage(1);
    updateUrlParams(initial);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            <Compass className="w-4 h-4" />
            Campus Sports Exchange
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Browse Sports Equipment
          </h1>
          <p className="text-sm text-navy-500 mt-1">
            Find cricket bats, football boots, badminton sets, and fitness gear available for sale, swap, or rent.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-navy-200 text-navy-700 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            Direct Peer Exchanges
          </span>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <FilterPanel
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={total}
      />

      {/* Listings Grid or Empty State */}
      {loading ? (
        <LoadingState message="Fetching active gear in your college community..." />
      ) : listings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                onFavouriteChange={(id, isFav) => {
                  setListings((prev) =>
                    prev.map((l) => (l.id === id ? { ...l, isFavourited: isFav } : l))
                  );
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-navy-200 text-navy-700 disabled:opacity-40 hover:bg-navy-50 transition"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-navy-600 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-navy-200 text-navy-700 disabled:opacity-40 hover:bg-navy-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No Equipment Matched Your Filters"
          description="Try broadening your sports category, loosening price limits, or resetting your search keywords."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
};
