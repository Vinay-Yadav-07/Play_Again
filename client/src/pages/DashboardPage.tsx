import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Package,
  Heart,
  MessageSquare,
  Send,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Listing, Favourite, Enquiry, AvailabilityStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { DemoBadge } from '../components/DemoBadge';
import { getSportImage, handleImageFallback } from '../services/imageHelper';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'listings';

  const [loading, setLoading] = useState(true);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [receivedEnquiries, setReceivedEnquiries] = useState<Enquiry[]>([]);
  const [sentEnquiries, setSentEnquiries] = useState<Enquiry[]>([]);

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status updating state for enquiries
  const [respondingEnquiryId, setRespondingEnquiryId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [profileData, favData, receivedData, sentData] = await Promise.all([
        api.users.getMe(),
        api.favourites.getAll(),
        api.enquiries.getReceived(),
        api.enquiries.getSent(),
      ]);

      setMyListings(profileData.listings || []);
      setFavourites(favData || []);
      setReceivedEnquiries(receivedData || []);
      setSentEnquiries(sentData || []);
    } catch (err: any) {
      error(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  const handleQuickAvailabilityChange = async (
    listingId: string,
    nextStatus: AvailabilityStatus
  ) => {
    try {
      await api.listings.update(listingId, { availability: nextStatus });
      setMyListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, availability: nextStatus } : l))
      );
      success(`Listing marked as ${nextStatus}.`);
    } catch (err: any) {
      error(err.message || 'Failed to update availability.');
    }
  };

  const confirmDelete = async () => {
    if (!listingToDelete) return;
    setIsDeleting(true);
    try {
      await api.listings.delete(listingToDelete);
      setMyListings((prev) => prev.filter((l) => l.id !== listingToDelete));
      success('Listing removed from your account.');
    } catch (err: any) {
      error(err.message || 'Failed to delete listing.');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setListingToDelete(null);
    }
  };

  const handleRemoveFavourite = async (listingId: string) => {
    try {
      await api.favourites.remove(listingId);
      setFavourites((prev) => prev.filter((f) => f.listing.id !== listingId));
      success('Removed from saved favourites.');
    } catch (err: any) {
      error(err.message || 'Failed to remove favourite.');
    }
  };

  const handleUpdateEnquiryStatus = async (
    enquiryId: string,
    newStatus: 'New' | 'Responded' | 'Closed',
    reply?: string
  ) => {
    try {
      await api.enquiries.updateStatus(enquiryId, {
        status: newStatus,
        response: reply,
      });
      setReceivedEnquiries((prev) =>
        prev.map((e) =>
          e.id === enquiryId
            ? { ...e, status: newStatus, response: reply || e.response }
            : e
        )
      );
      setRespondingEnquiryId(null);
      setResponseText('');
      success(`Enquiry marked as ${newStatus}.`);
    } catch (err: any) {
      error(err.message || 'Failed to update enquiry status.');
    }
  };

  if (loading) {
    return <LoadingState message="Loading your dashboard and campus activities..." className="py-32" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-navy-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={
              user?.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || 'User'
              )}&background=10b981&color=fff`
            }
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-navy-900">{user?.name}</h1>
              {user?.isDemoUser && <DemoBadge label="Demo Account" />}
            </div>
            <p className="text-xs text-navy-500">{user?.email}</p>
            <div className="flex items-center gap-2 text-xs text-brand-600 font-semibold mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified College Member
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 self-stretch sm:self-auto border-t sm:border-t-0 sm:border-l border-navy-100 pt-4 sm:pt-0 sm:pl-6 text-center">
          <div>
            <span className="block text-xl font-extrabold text-navy-900">
              {myListings.length}
            </span>
            <span className="text-[11px] font-medium text-navy-500">Listings</span>
          </div>
          <div>
            <span className="block text-xl font-extrabold text-navy-900">
              {favourites.length}
            </span>
            <span className="text-[11px] font-medium text-navy-500">Saved</span>
          </div>
          <div>
            <span className="block text-xl font-extrabold text-navy-900">
              {receivedEnquiries.length}
            </span>
            <span className="text-[11px] font-medium text-navy-500">Received</span>
          </div>
          <div>
            <span className="block text-xl font-extrabold text-navy-900">
              {sentEnquiries.length}
            </span>
            <span className="text-[11px] font-medium text-navy-500">Sent</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-navy-200">
        <button
          onClick={() => handleTabChange('listings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition -mb-[2px] ${
            activeTab === 'listings'
              ? 'border-brand-500 text-brand-700 bg-white'
              : 'border-transparent text-navy-600 hover:text-navy-900'
          }`}
          id="dashboard-tab-listings"
        >
          <Package className="w-4 h-4" />
          My Gear Listings ({myListings.length})
        </button>

        <button
          onClick={() => handleTabChange('favourites')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition -mb-[2px] ${
            activeTab === 'favourites'
              ? 'border-brand-500 text-brand-700 bg-white'
              : 'border-transparent text-navy-600 hover:text-navy-900'
          }`}
          id="dashboard-tab-favourites"
        >
          <Heart className="w-4 h-4" />
          Saved Favourites ({favourites.length})
        </button>

        <button
          onClick={() => handleTabChange('enquiries-received')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition -mb-[2px] ${
            activeTab === 'enquiries-received'
              ? 'border-brand-500 text-brand-700 bg-white'
              : 'border-transparent text-navy-600 hover:text-navy-900'
          }`}
          id="dashboard-tab-received"
        >
          <MessageSquare className="w-4 h-4" />
          Received Enquiries ({receivedEnquiries.length})
        </button>

        <button
          onClick={() => handleTabChange('enquiries-sent')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition -mb-[2px] ${
            activeTab === 'enquiries-sent'
              ? 'border-brand-500 text-brand-700 bg-white'
              : 'border-transparent text-navy-600 hover:text-navy-900'
          }`}
          id="dashboard-tab-sent"
        >
          <Send className="w-4 h-4" />
          Sent Enquiries ({sentEnquiries.length})
        </button>
      </div>

      {/* Tab 1: My Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-900">Manage Your Equipment</h2>
            <Link
              to="/create-listing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 transition shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              List New Equipment
            </Link>
          </div>

          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-navy-100 shadow-sm p-4 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={getSportImage(item.sport, item.images?.[0])}
                        alt={item.title}
                        onError={(e) => handleImageFallback(e, item.sport)}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-navy-50 text-transparent indent-[-9999px]"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                          {item.sport} • {item.listingType.toUpperCase()}
                        </span>
                        <h3 className="font-bold text-sm text-navy-900 truncate">{item.title}</h3>
                        <p className="text-xs font-semibold text-navy-700 mt-0.5">
                          {item.listingType === 'sale'
                            ? `₹${item.price.toLocaleString('en-IN')}`
                            : item.listingType === 'rent'
                            ? `₹${item.rentalRate} / ${item.rentalPeriod}`
                            : 'Swap Requested'}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-navy-50">
                      <span className="text-navy-500">Status:</span>
                      <select
                        value={item.availability}
                        onChange={(e) =>
                          handleQuickAvailabilityChange(item.id, e.target.value as AvailabilityStatus)
                        }
                        className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-hidden ${
                          item.availability === 'available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.availability === 'reserved'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-navy-100 text-navy-700 border-navy-200'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="completed">Completed / Sold</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-navy-100">
                    <Link
                      to={`/listings/${item.id}`}
                      className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-navy-700 bg-navy-50 hover:bg-navy-100 text-center flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </Link>
                    <Link
                      to={`/listings/${item.id}/edit`}
                      className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 text-center flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setListingToDelete(item.id);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Equipment Listed Yet"
              description="Do you have sports gear sitting idle? Put it to good use and earn extra funds by listing it on PlayAgain."
              actionText="List Your First Gear"
              onAction={() => window.location.assign('/create-listing')}
            />
          )}
        </div>
      )}

      {/* Tab 2: Favourites */}
      {activeTab === 'favourites' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-navy-900">Saved Equipment</h2>
          {favourites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.map((fav) => (
                <div
                  key={fav.id}
                  className="bg-white rounded-2xl border border-navy-100 shadow-sm p-4 flex items-center justify-between gap-4"
                >
                  <Link
                    to={`/listings/${fav.listing.id}`}
                    className="flex items-center gap-3 min-w-0 flex-1 group"
                  >
                    <img
                      src={getSportImage(fav.listing.sport, fav.listing.images?.[0])}
                      alt={fav.listing.title}
                      onError={(e) => handleImageFallback(e, fav.listing.sport)}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 text-transparent indent-[-9999px]"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                        {fav.listing.sport}
                      </span>
                      <h4 className="font-bold text-sm text-navy-900 group-hover:text-brand-600 transition truncate">
                        {fav.listing.title}
                      </h4>
                      <p className="text-xs font-semibold text-navy-700">
                        {fav.listing.listingType === 'sale'
                          ? `₹${fav.listing.price}`
                          : fav.listing.listingType === 'rent'
                          ? `₹${fav.listing.rentalRate} / ${fav.listing.rentalPeriod}`
                          : 'Swap'}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleRemoveFavourite(fav.listing.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition shrink-0"
                    title="Remove from saved"
                  >
                    <Heart className="w-5 h-5 fill-rose-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Saved Favourites"
              description="Click the heart icon on any gear card in the marketplace to save equipment for later inspection."
              actionText="Explore Marketplace"
              onAction={() => window.location.assign('/marketplace')}
            />
          )}
        </div>
      )}

      {/* Tab 3: Received Enquiries */}
      {activeTab === 'enquiries-received' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-navy-900">Enquiries from Interested Buyers</h2>
          {receivedEnquiries.length > 0 ? (
            <div className="space-y-4">
              {receivedEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="bg-white rounded-2xl border border-navy-100 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          enq.buyer?.avatarUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            enq.buyer?.name || 'Buyer'
                          )}&background=10b981&color=fff`
                        }
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-navy-900">{enq.buyer?.name}</h4>
                        <p className="text-xs text-navy-400">
                          Regarding:{' '}
                          <Link
                            to={`/listings/${enq.listing.id}`}
                            className="text-brand-600 hover:underline font-semibold"
                          >
                            {enq.listing.title}
                          </Link>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          enq.status === 'New'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : enq.status === 'Responded'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-navy-100 text-navy-700 border border-navy-200'
                        }`}
                      >
                        {enq.status}
                      </span>
                      <span className="text-xs text-navy-400">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="p-3.5 bg-navy-50/70 rounded-xl space-y-2 text-sm">
                    <p className="text-navy-800 leading-relaxed">{enq.message}</p>
                    {enq.proposedOffer && (
                      <p className="text-xs font-bold text-brand-700">
                        Proposed Offer: ₹{enq.proposedOffer.toLocaleString('en-IN')}
                      </p>
                    )}
                    {enq.rentalDates && (
                      <p className="text-xs font-bold text-amber-700">
                        Requested Dates: {enq.rentalDates}
                      </p>
                    )}
                  </div>

                  {/* Existing Response if any */}
                  {enq.response && (
                    <div className="p-3 bg-brand-50/60 border border-brand-100 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-brand-900">Your Response:</span>
                      <p className="text-brand-800">{enq.response}</p>
                    </div>
                  )}

                  {/* Reply Action Drawer / Form */}
                  {respondingEnquiryId === enq.id ? (
                    <div className="space-y-3 pt-2">
                      <textarea
                        rows={2}
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Write meeting time, accepted offer, or handover coordinates..."
                        className="w-full p-2.5 bg-white border border-navy-200 rounded-xl text-xs"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleUpdateEnquiryStatus(enq.id, 'Responded', responseText)
                          }
                          className="px-4 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold"
                        >
                          Send Response
                        </button>
                        <button
                          onClick={() => setRespondingEnquiryId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-navy-600 hover:bg-navy-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setRespondingEnquiryId(enq.id);
                            setResponseText(enq.response || '');
                          }}
                          className="text-xs font-bold text-brand-600 hover:text-brand-700 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 transition"
                        >
                          {enq.response ? 'Edit Response' : 'Reply to Buyer'}
                        </button>
                        {enq.status !== 'Closed' && (
                          <button
                            onClick={() => handleUpdateEnquiryStatus(enq.id, 'Closed')}
                            className="text-xs font-medium text-navy-500 hover:text-navy-800 px-2.5 py-1.5 rounded-lg hover:bg-navy-50"
                          >
                            Mark Closed
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Inquiries Received Yet"
              description="When other campus members enquire about your equipment, their messages and proposed offers will show here."
            />
          )}
        </div>
      )}

      {/* Tab 4: Sent Enquiries */}
      {activeTab === 'enquiries-sent' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-navy-900">Your Sent Enquiries to Sellers</h2>
          {sentEnquiries.length > 0 ? (
            <div className="space-y-4">
              {sentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="bg-white rounded-2xl border border-navy-100 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-navy-400">To Seller: </span>
                      <span className="text-xs font-bold text-navy-800">
                        {enq.seller?.name || 'Equipment Owner'}
                      </span>
                      <h4 className="font-bold text-sm text-navy-900 mt-0.5">
                        <Link
                          to={`/listings/${enq.listing.id}`}
                          className="hover:text-brand-600 underline"
                        >
                          {enq.listing.title}
                        </Link>
                      </h4>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        enq.status === 'New'
                          ? 'bg-blue-50 text-blue-700'
                          : enq.status === 'Responded'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-navy-100 text-navy-700'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  <div className="p-3 bg-navy-50/70 rounded-xl text-xs text-navy-700">
                    <p>{enq.message}</p>
                    {enq.proposedOffer && (
                      <p className="font-bold text-brand-700 mt-1">
                        Your Offer: ₹{enq.proposedOffer}
                      </p>
                    )}
                  </div>

                  {enq.response && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-emerald-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Seller's Response:
                      </span>
                      <p className="text-emerald-800">{enq.response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Sent Enquiries"
              description="You have not contacted any gear sellers yet. Browse the marketplace and reach out whenever you need sports equipment."
              actionText="Browse Marketplace"
              onAction={() => window.location.assign('/marketplace')}
            />
          )}
        </div>
      )}

      {/* Confirmation Modal for Listing Deletion */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Remove Listing?"
        message="Are you sure you want to remove this equipment listing from PlayAgain? This will also remove any active enquiries linked to it."
        confirmLabel="Yes, Remove"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setListingToDelete(null);
        }}
      />
    </div>
  );
};
