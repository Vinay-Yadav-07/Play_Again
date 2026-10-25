import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import { ItemCondition, AvailabilityStatus, SportCategory, ListingType } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { LoadingState } from '../components/LoadingState';

export const EditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [title, setTitle] = useState('');
  const [sport, setSport] = useState<SportCategory>('Cricket');
  const [listingType, setListingType] = useState<ListingType>('sale');
  const [condition, setCondition] = useState<ItemCondition>('Good');
  const [price, setPrice] = useState<string>('0');
  const [rentalRate, setRentalRate] = useState<string>('');
  const [rentalPeriod, setRentalPeriod] = useState<string>('per match day');
  const [desiredSwap, setDesiredSwap] = useState('');
  const [description, setDescription] = useState('');
  const [pickupArea, setPickupArea] = useState('');
  const [availability, setAvailability] = useState<AvailabilityStatus>('available');

  useEffect(() => {
    async function loadItem() {
      if (!id) return;
      try {
        const data = await api.listings.getById(id);
        const l = data.listing;
        setTitle(l.title);
        setSport(l.sport);
        setListingType(l.listingType);
        setCondition(l.condition);
        setPrice(String(l.price));
        setRentalRate(l.rentalRate ? String(l.rentalRate) : '');
        setRentalPeriod(l.rentalPeriod || 'per match day');
        setDesiredSwap(l.desiredSwap || '');
        setDescription(l.description);
        setPickupArea(l.pickupArea);
        setAvailability(l.availability);
      } catch (err: any) {
        error(err.message || 'Failed to load listing.');
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id, navigate, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    try {
      await api.listings.update(id, {
        title: title.trim(),
        description: description.trim(),
        sport,
        condition,
        price: listingType === 'sale' ? parseFloat(price) : 0,
        rentalRate: listingType === 'rent' ? parseFloat(rentalRate) : null,
        rentalPeriod: listingType === 'rent' ? rentalPeriod : null,
        desiredSwap: listingType === 'swap' ? desiredSwap.trim() : null,
        pickupArea: pickupArea.trim(),
        availability,
      });

      success('Listing updated successfully!');
      navigate(`/listings/${id}`);
    } catch (err: any) {
      error(err.message || 'Failed to update listing.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await api.listings.delete(id);
      success('Listing deleted.');
      navigate('/dashboard?tab=listings');
    } catch (err: any) {
      error(err.message || 'Failed to delete listing.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading listing details for editing..." className="py-32" />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-500 hover:text-navy-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            <Edit className="w-4 h-4" />
            Manage Listing
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Edit Equipment Listing
          </h1>
        </div>

        <button
          onClick={() => setDeleteConfirmOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-navy-100 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Availability Status Selector */}
        <div className="p-4 bg-navy-50/70 rounded-2xl border border-navy-100 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-700">
            Listing Availability Status
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setAvailability('available')}
              className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                availability === 'available'
                  ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500'
                  : 'border-navy-200 text-navy-600'
              }`}
            >
              Available
            </button>
            <button
              type="button"
              onClick={() => setAvailability('reserved')}
              className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                availability === 'reserved'
                  ? 'border-amber-500 bg-amber-50 text-amber-700 ring-1 ring-amber-500'
                  : 'border-navy-200 text-navy-600'
              }`}
            >
              Reserved
            </button>
            <button
              type="button"
              onClick={() => setAvailability('completed')}
              className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                availability === 'completed'
                  ? 'border-navy-500 bg-navy-100 text-navy-900 ring-1 ring-navy-500'
                  : 'border-navy-200 text-navy-600'
              }`}
            >
              Completed / Sold
            </button>
          </div>
          <p className="text-[11px] text-navy-500">
            {availability === 'available'
              ? 'Item is active and accepting new buyer enquiries in the marketplace.'
              : 'Item is not accepting new buyer enquiries.'}
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
            Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
            Condition *
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as ItemCondition)}
            className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm"
          >
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>

        {/* Dynamic Price */}
        {listingType === 'sale' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
              Price (₹) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm"
            />
          </div>
        )}

        {listingType === 'rent' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
                Rental Rate (₹) *
              </label>
              <input
                type="number"
                min="0"
                value={rentalRate}
                onChange={(e) => setRentalRate(e.target.value)}
                className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
                Rental Period
              </label>
              <select
                value={rentalPeriod}
                onChange={(e) => setRentalPeriod(e.target.value)}
                className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm"
              >
                <option value="per match day">per match day</option>
                <option value="per weekend">per weekend</option>
                <option value="per week">per week</option>
                <option value="per month">per month</option>
              </select>
            </div>
          </div>
        )}

        {listingType === 'swap' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
              Desired Swap Item
            </label>
            <input
              type="text"
              value={desiredSwap}
              onChange={(e) => setDesiredSwap(e.target.value)}
              className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm"
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
            Description *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm"
          />
        </div>

        {/* Pickup Area */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
            Campus Pickup Area *
          </label>
          <input
            type="text"
            required
            value={pickupArea}
            onChange={(e) => setPickupArea(e.target.value)}
            className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-navy-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-navy-600 hover:bg-navy-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm shadow-xs transition"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        title="Delete Equipment Listing?"
        message="Are you sure you want to delete this listing? All associated records will be removed."
        confirmLabel="Yes, Delete"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
};
