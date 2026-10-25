import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Repeat, Tag, CalendarClock, Shield } from 'lucide-react';
import { Listing } from '../types';
import { DemoBadge } from './DemoBadge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { getSportImage, handleImageFallback } from '../services/imageHelper';

interface ListingCardProps {
  listing: Listing;
  onFavouriteChange?: (id: string, isFav: boolean) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onFavouriteChange }) => {
  const { isAuthenticated } = useAuth();
  const { info, error } = useToast();
  const [isFav, setIsFav] = useState(listing.isFavourited || false);

  const primaryImage =
    listing.images && listing.images.length > 0 ? listing.images[0] : null;

  const imageSrc = getSportImage(listing.sport, primaryImage);

  const handleToggleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      info('Please log in or sign up to save favourites.');
      return;
    }

    const nextState = !isFav;
    setIsFav(nextState);

    try {
      if (nextState) {
        await api.favourites.add(listing.id);
      } else {
        await api.favourites.remove(listing.id);
      }
      onFavouriteChange?.(listing.id, nextState);
    } catch (err: any) {
      setIsFav(!nextState); // Rollback
      error(err.message || 'Failed to update favourites.');
    }
  };

  const getConditionStyle = (condition: string) => {
    switch (condition) {
      case 'Like New':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Good':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Fair':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-navy-50 text-navy-700 border-navy-200';
    }
  };

  return (
    <div className="sports-card group relative bg-white rounded-2xl border border-navy-100 shadow-card hover:shadow-card-hover overflow-hidden flex flex-col transition-all">
      {/* Top Media Container */}
      <Link to={`/listings/${listing.id}`} className="relative block aspect-4/3 w-full bg-navy-100 overflow-hidden">
        <img
          src={imageSrc}
          alt={listing.title}
          onError={(e) => handleImageFallback(e, listing.sport)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 text-transparent indent-[-9999px]"
          loading="lazy"
        />

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          {/* Listing Type Badge */}
          {listing.listingType === 'sale' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-500 text-white shadow-xs">
              <Tag className="w-3 h-3" />
              For Sale
            </span>
          )}
          {listing.listingType === 'rent' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
              <CalendarClock className="w-3 h-3" />
              For Rent
            </span>
          )}
          {listing.listingType === 'swap' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
              <Repeat className="w-3 h-3" />
              Swap Only
            </span>
          )}

          {listing.isDemoListing && <DemoBadge />}
        </div>

        {/* Favourite Button */}
        <button
          onClick={handleToggleFavourite}
          aria-label={isFav ? 'Remove from favourites' : 'Save to favourites'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFav
              ? 'bg-rose-50 text-rose-600 shadow-md scale-105'
              : 'bg-white/80 backdrop-blur-xs text-navy-400 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Availability Overlays */}
        {listing.availability !== 'available' && (
          <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white text-navy-900 shadow-lg">
              {listing.availability === 'reserved' ? 'Reserved' : 'Exchanged / Sold'}
            </span>
          </div>
        )}
      </Link>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Condition tags */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
              {listing.sport}
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getConditionStyle(
                listing.condition
              )}`}
            >
              {listing.condition}
            </span>
          </div>

          {/* Title */}
          <Link to={`/listings/${listing.id}`}>
            <h3 className="font-bold text-base text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-1.5">
              {listing.title}
            </h3>
          </Link>

          {/* Pricing / Terms */}
          <div className="mb-3">
            {listing.listingType === 'sale' && (
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-navy-900">
                  ₹{listing.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-navy-400 font-medium">fixed price</span>
              </div>
            )}
            {listing.listingType === 'rent' && (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-amber-600">
                  ₹{listing.rentalRate?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-navy-500 font-medium">
                  / {listing.rentalPeriod || 'day'}
                </span>
              </div>
            )}
            {listing.listingType === 'swap' && (
              <div className="text-xs font-semibold text-blue-700 bg-blue-50/80 p-2 rounded-lg line-clamp-2 border border-blue-100/80">
                <span className="text-navy-500 font-normal">Wants: </span>
                {listing.desiredSwap || 'Open to sports gear swaps'}
              </div>
            )}
          </div>
        </div>

        {/* Footer info: Location & Handover */}
        <div className="pt-3 border-t border-navy-50 flex items-center justify-between text-xs text-navy-500">
          <div className="flex items-center gap-1 truncate max-w-[200px]" title={listing.pickupArea}>
            <MapPin className="w-3.5 h-3.5 text-navy-400 shrink-0" />
            <span className="truncate">{listing.pickupArea}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-navy-400 font-medium shrink-0">
            <Shield className="w-3 h-3 text-brand-500" />
            Campus
          </div>
        </div>
      </div>
    </div>
  );
};
