import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  Flag,
  MapPin,
  Calendar,
  ShieldCheck,
  Send,
  Edit,
  Trash2,
  Tag,
  Repeat,
  CalendarClock,
  ArrowLeft,
  User as UserIcon,
} from 'lucide-react';
import { Listing } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DemoBadge } from '../components/DemoBadge';
import { ListingCard } from '../components/ListingCard';
import { EnquiryModal } from '../components/EnquiryModal';
import { ReportModal } from '../components/ReportModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { LoadingState } from '../components/LoadingState';
import { getSportImage, handleImageFallback } from '../services/imageHelper';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();

  const [listing, setListing] = useState<Listing | null>(null);
  const [similarListings, setSimilarListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [isFav, setIsFav] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadListing() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.listings.getById(id);
        setListing(data.listing);
        setSimilarListings(data.similarListings);
        setIsFav(data.listing.isFavourited || false);
      } catch (err: any) {
        error(err.message || 'Listing not found.');
      } finally {
        setLoading(false);
      }
    }
    loadListing();
  }, [id, error]);

  const handleToggleFavourite = async () => {
    if (!isAuthenticated) {
      info('Please log in to save items to your favourites.');
      return;
    }
    if (!listing) return;

    const next = !isFav;
    setIsFav(next);

    try {
      if (next) {
        await api.favourites.add(listing.id);
        success('Added to your saved favourites.');
      } else {
        await api.favourites.remove(listing.id);
        info('Removed from your saved favourites.');
      }
    } catch (err: any) {
      setIsFav(!next);
      error(err.message || 'Failed to update favourites.');
    }
  };

  const handleDeleteListing = async () => {
    if (!listing) return;
    setIsDeleting(true);
    try {
      await api.listings.delete(listing.id);
      success('Equipment listing removed successfully.');
      navigate('/dashboard?tab=listings');
    } catch (err: any) {
      error(err.message || 'Failed to delete listing.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Listing URL copied to clipboard! Share it with campus teammates.');
    }
  };

  if (loading) {
    return <LoadingState message="Loading equipment details..." className="py-32" />;
  }

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Listing Not Found</h2>
        <p className="text-sm text-navy-500 mb-6">
          This piece of equipment may have been removed or marked as completed.
        </p>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const isOwner = user && user.id === listing.ownerId;
  const isAvailable = listing.availability === 'available';

  const images = listing.images && listing.images.length > 0 ? listing.images : [];
  const currentImage = getSportImage(listing.sport, images[selectedImageIndex]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Link */}
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-500 hover:text-navy-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </Link>

      {/* Main Grid: Images + Key Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-4/3 w-full bg-navy-100 rounded-3xl overflow-hidden shadow-card border border-navy-100">
            <img
              src={currentImage}
              alt={listing.title}
              onError={(e) => handleImageFallback(e, listing.sport)}
              className="w-full h-full object-cover object-center text-transparent indent-[-9999px]"
            />

            {/* Badges Over Image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {listing.listingType === 'sale' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-brand-500 text-white shadow-sm">
                  <Tag className="w-3.5 h-3.5" />
                  For Sale
                </span>
              )}
              {listing.listingType === 'rent' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                  <CalendarClock className="w-3.5 h-3.5" />
                  For Rent
                </span>
              )}
              {listing.listingType === 'swap' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
                  <Repeat className="w-3.5 h-3.5" />
                  Direct Swap
                </span>
              )}
              {listing.isDemoListing && <DemoBadge />}
            </div>

            {/* Availability Watermark if not available */}
            {!isAvailable && (
              <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center">
                <span className="px-5 py-2.5 rounded-2xl text-sm font-extrabold uppercase tracking-widest bg-white text-navy-900 shadow-xl">
                  {listing.availability === 'reserved' ? 'Reserved by Buyer' : 'Exchanged / Sold'}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail list if multiple images */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition ${
                    selectedImageIndex === idx
                      ? 'border-brand-500 shadow-sm scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Listing Details & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Sport Category and Condition Tag */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-lg">
                {listing.sport}
              </span>

              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-navy-100 text-navy-800">
                Condition: {listing.condition}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-tight">
              {listing.title}
            </h1>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-white border border-navy-100 shadow-xs">
              {listing.listingType === 'sale' && (
                <div>
                  <span className="text-xs font-bold text-navy-400 uppercase tracking-wider block">
                    Selling Price
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-navy-900">
                      ₹{listing.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-navy-500 font-medium">peer-to-peer price</span>
                  </div>
                </div>
              )}

              {listing.listingType === 'rent' && (
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                    Rental Rate
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-amber-600">
                      ₹{listing.rentalRate?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-bold text-navy-600">
                      / {listing.rentalPeriod || 'day'}
                    </span>
                  </div>
                </div>
              )}

              {listing.listingType === 'swap' && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                    Direct Equipment Swap
                  </span>
                  <p className="text-sm font-semibold text-navy-800">
                    Owner is looking for:{' '}
                    <span className="text-blue-700">{listing.desiredSwap || 'Sports equipment'}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Pickup Location & Handover */}
            <div className="space-y-2 text-sm text-navy-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-navy-900">Pickup Area: </span>
                  <span>{listing.pickupArea}</span>
                  <p className="text-xs text-navy-400">
                    Campus public spot. Exact meeting time coordinated with seller.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-navy-400 pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Listed on{' '}
                  {new Date(listing.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="p-4 rounded-2xl bg-navy-50/70 border border-navy-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    listing.owner?.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      listing.owner?.name || 'Seller'
                    )}&background=10b981&color=fff`
                  }
                  alt={listing.owner?.name}
                  className="w-11 h-11 rounded-full object-cover border border-brand-200"
                />
                <div>
                  <h4 className="font-bold text-sm text-navy-900">{listing.owner?.name}</h4>
                  <p className="text-xs text-navy-500">
                    {listing.owner?.isDemoUser ? 'Campus Demo Account' : 'Verified Student Athlete'}
                  </p>
                </div>
              </div>

              {listing.owner?.isDemoUser && <DemoBadge label="Demo Seller" />}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-navy-100">
            {isOwner ? (
              // Owner Management Controls
              <div className="space-y-2">
                <div className="p-3 bg-brand-50 rounded-xl text-xs font-semibold text-brand-800 text-center border border-brand-200">
                  You are the owner of this equipment listing.
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/listings/${listing.id}/edit`}
                    className="w-1/2 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Listing
                  </Link>
                  <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="w-1/2 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm flex items-center justify-center gap-2 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              // Buyer Contact CTA
              <div className="space-y-2">
                {isAvailable ? (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        info('Please log in to contact the equipment owner.');
                        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                        return;
                      }
                      setEnquiryOpen(true);
                    }}
                    className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition transform hover:-translate-y-0.5"
                    id="listing-contact-seller-btn"
                  >
                    <Send className="w-4 h-4" />
                    {listing.listingType === 'rent'
                      ? 'Request Rental'
                      : listing.listingType === 'swap'
                      ? 'Propose Swap'
                      : 'Contact Seller / Make Offer'}
                  </button>
                ) : (
                  <div className="p-3.5 bg-navy-100 rounded-xl text-center text-xs font-bold text-navy-500">
                    This listing is marked as reserved or completed and is no longer accepting enquiries.
                  </div>
                )}
              </div>
            )}

            {/* Auxiliary Actions: Favourite & Share & Report */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={handleToggleFavourite}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  isFav
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-navy-200 text-navy-700 hover:bg-navy-50'
                }`}
                id="listing-favourite-toggle-btn"
              >
                <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                {isFav ? 'Saved' : 'Save Item'}
              </button>

              <button
                onClick={handleShare}
                className="flex-1 py-2 px-3 rounded-xl border border-navy-200 text-xs font-bold text-navy-700 hover:bg-navy-50 flex items-center justify-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    info('Please log in to submit a report.');
                    return;
                  }
                  setReportOpen(true);
                }}
                className="p-2 rounded-xl border border-navy-200 text-navy-400 hover:text-red-600 hover:bg-red-50 transition"
                title="Report Suspicious Listing"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Safety Guidelines Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-navy-100">
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-extrabold text-xl text-navy-900">Equipment Description</h3>
          <p className="text-sm text-navy-700 leading-relaxed whitespace-pre-line bg-white p-6 rounded-2xl border border-navy-100 shadow-xs">
            {listing.description}
          </p>
        </div>

        {/* Safety & Responsible Handover Box */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-brand-50/70 border border-brand-200/80 p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-sm text-brand-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Campus Handover & Inspection Rules
            </h4>
            <ul className="space-y-2 text-xs text-brand-900 leading-relaxed list-disc list-inside">
              <li>Meet in public campus areas (Sports pavilion, SAC, or student activity desks).</li>
              <li>Inspect item condition, strings, grips, or joints thoroughly before handing payment.</li>
              <li>Never wire advance deposits or reveal personal bank credentials.</li>
              <li>For rentals, take a photo together of existing scuffs to protect both parties.</li>
            </ul>
            <Link
              to="/safety"
              className="text-xs font-bold text-brand-700 hover:text-brand-800 inline-block pt-1"
            >
              Read Full Campus Safety Policy →
            </Link>
          </div>
        </div>
      </div>

      {/* Similar Listings Carousel / Grid */}
      {similarListings.length > 0 && (
        <div className="pt-8 border-t border-navy-100 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-navy-900">
              More {listing.sport} Equipment
            </h3>
            <Link
              to={`/marketplace?sport=${encodeURIComponent(listing.sport)}`}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              View All {listing.sport} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarListings.map((sim) => (
              <ListingCard key={sim.id} listing={sim} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <EnquiryModal
        listing={listing}
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        onSuccess={() => {
          // Optional callback
        }}
      />

      <ReportModal
        listingId={listing.id}
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />

      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        title="Delete Equipment Listing?"
        message="Are you sure you want to remove this equipment listing from PlayAgain? This action cannot be undone."
        confirmLabel="Yes, Delete Listing"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteListing}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
};
