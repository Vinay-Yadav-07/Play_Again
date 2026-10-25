import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, ShieldCheck, Tag, Repeat, CalendarClock } from 'lucide-react';
import { SportCategory, ListingType, ItemCondition } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const SPORTS: SportCategory[] = [
  'Cricket',
  'Football',
  'Badminton',
  'Basketball',
  'Tennis',
  'Fitness',
  'Other',
];

const PRESET_IMAGES: Record<SportCategory, string> = {
  Cricket: '/gear/cricket_bat.jpg',
  Football: '/gear/football.jpg',
  Badminton: '/gear/badminton_racket.jpg',
  Basketball: '/gear/basketball.jpg',
  Tennis: '/gear/tennis_racket.jpg',
  Fitness: '/gear/dumbbells.jpg',
  Other: '/gear/backpack.jpg',
};

export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [sport, setSport] = useState<SportCategory>('Cricket');
  const [listingType, setListingType] = useState<ListingType>('sale');
  const [condition, setCondition] = useState<ItemCondition>('Good');
  const [price, setPrice] = useState<string>('500');
  const [rentalRate, setRentalRate] = useState<string>('100');
  const [rentalPeriod, setRentalPeriod] = useState<string>('per match day');
  const [desiredSwap, setDesiredSwap] = useState('');
  const [description, setDescription] = useState('');
  const [pickupArea, setPickupArea] = useState('Campus Sports Complex');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES['Cricket']);
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Auto-update default preset image if user changes sport and hasn't typed custom url
  const handleSportChange = (newSport: SportCategory) => {
    setSport(newSport);
    if (!useCustomUrl) {
      setImageUrl(PRESET_IMAGES[newSport]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      error('File size exceeds 5MB limit.');
      return;
    }

    setUploading(true);
    try {
      const url = await api.listings.uploadImage(file);
      setImageUrl(url);
      setUseCustomUrl(true);
      success('Image uploaded successfully!');
    } catch (err: any) {
      error(err.message || 'Image upload failed. Please verify format.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (title.trim().length < 3) errors.title = 'Title must be at least 3 characters.';
    if (description.trim().length < 10) errors.description = 'Description must be at least 10 characters.';
    if (pickupArea.trim().length < 2) errors.pickupArea = 'Pickup area is required.';
    if (!imageUrl.trim()) errors.imageUrl = 'An image or image URL is required.';

    if (listingType === 'sale' && (isNaN(Number(price)) || Number(price) < 0)) {
      errors.price = 'Price must be a valid non-negative number.';
    }
    if (listingType === 'rent' && (isNaN(Number(rentalRate)) || Number(rentalRate) < 0)) {
      errors.rentalRate = 'Rental rate must be non-negative.';
    }
    if (listingType === 'swap' && !desiredSwap.trim()) {
      errors.desiredSwap = 'Please describe what gear you wish to receive in exchange.';
    }
    if (!termsAccepted) {
      errors.termsAccepted = 'You must acknowledge the campus safety and gear condition terms.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      error('Please correct the highlighted form errors.');
      return;
    }

    setSubmitting(true);
    try {
      const newListing = await api.listings.create({
        title: title.trim(),
        description: description.trim(),
        sport,
        listingType,
        condition,
        price: listingType === 'sale' ? parseFloat(price) : 0,
        rentalRate: listingType === 'rent' ? parseFloat(rentalRate) : null,
        rentalPeriod: listingType === 'rent' ? rentalPeriod : null,
        desiredSwap: listingType === 'swap' ? desiredSwap.trim() : null,
        images: [imageUrl.trim()],
        pickupArea: pickupArea.trim(),
        termsAccepted,
      });

      success('Equipment listing published successfully to the marketplace!');
      navigate(`/listings/${newListing.id}`);
    } catch (err: any) {
      error(err.message || 'Failed to publish listing.');
      if (err.details && Array.isArray(err.details)) {
        const mapped: Record<string, string> = {};
        err.details.forEach((d: any) => {
          mapped[d.field] = d.message;
        });
        setFieldErrors(mapped);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
          <PlusCircle className="w-4 h-4" />
          Give Gear a Second Game
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
          List Sports Equipment
        </h1>
        <p className="text-sm text-navy-500 mt-1">
          Share unused cricket, football, badminton, or fitness equipment with your fellow college players.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-navy-100 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
            Equipment Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., SS Kashmir Willow Cricket Bat (Size 6, Oiled)"
            className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white transition"
            id="create-title-input"
          />
          {fieldErrors.title && (
            <p className="text-xs text-red-600 font-semibold mt-1">{fieldErrors.title}</p>
          )}
        </div>

        {/* Sport Category and Condition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
              Sport Category *
            </label>
            <select
              value={sport}
              onChange={(e) => handleSportChange(e.target.value as SportCategory)}
              className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm font-semibold text-navy-800 focus:outline-hidden focus:border-brand-500"
              id="create-sport-select"
            >
              {SPORTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
              Equipment Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ItemCondition)}
              className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm font-semibold text-navy-800 focus:outline-hidden focus:border-brand-500"
              id="create-condition-select"
            >
              <option value="Like New">Like New (Mint / Barely played)</option>
              <option value="Good">Good (Minor cosmetic wear, fully playable)</option>
              <option value="Fair">Fair (Noticeable court wear, functional)</option>
            </select>
          </div>
        </div>

        {/* Listing Type Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-700">
            How Would You Like to Offer This? *
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setListingType('sale')}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                listingType === 'sale'
                  ? 'border-brand-500 bg-brand-50/60 text-brand-800 shadow-xs ring-1 ring-brand-500'
                  : 'border-navy-200 text-navy-600 hover:bg-navy-50'
              }`}
            >
              <Tag className="w-5 h-5 text-brand-600" />
              <span className="text-xs font-extrabold">For Sale</span>
              <span className="text-[10px] text-navy-400">Fixed peer price</span>
            </button>

            <button
              type="button"
              onClick={() => setListingType('rent')}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                listingType === 'rent'
                  ? 'border-amber-500 bg-amber-50/60 text-amber-800 shadow-xs ring-1 ring-amber-500'
                  : 'border-navy-200 text-navy-600 hover:bg-navy-50'
              }`}
            >
              <CalendarClock className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-extrabold">For Rent</span>
              <span className="text-[10px] text-navy-400">Day/week rate</span>
            </button>

            <button
              type="button"
              onClick={() => setListingType('swap')}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                listingType === 'swap'
                  ? 'border-blue-500 bg-blue-50/60 text-blue-800 shadow-xs ring-1 ring-blue-500'
                  : 'border-navy-200 text-navy-600 hover:bg-navy-50'
              }`}
            >
              <Repeat className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-extrabold">Direct Swap</span>
              <span className="text-[10px] text-navy-400">Trade for gear</span>
            </button>
          </div>
        </div>

        {/* Dynamic Pricing / Swap Fields */}
        {listingType === 'sale' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
              Sale Price (₹) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 650"
              className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white"
              id="create-price-input"
            />
            {fieldErrors.price && (
              <p className="text-xs text-red-600 font-semibold mt-1">{fieldErrors.price}</p>
            )}
          </div>
        )}

        {listingType === 'rent' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
                Rental Rate (₹) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={rentalRate}
                onChange={(e) => setRentalRate(e.target.value)}
                placeholder="e.g. 120"
                className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white"
              />
              {fieldErrors.rentalRate && (
                <p className="text-xs text-red-600 font-semibold mt-1">{fieldErrors.rentalRate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
                Rental Period
              </label>
              <select
                value={rentalPeriod}
                onChange={(e) => setRentalPeriod(e.target.value)}
                className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm font-semibold text-navy-800"
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
              Desired Swap Item Description *
            </label>
            <input
              type="text"
              required
              value={desiredSwap}
              onChange={(e) => setDesiredSwap(e.target.value)}
              placeholder="e.g., Looking to swap for a Yonex Astrox racket or Size 9 football boots"
              className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white"
            />
            {fieldErrors.desiredSwap && (
              <p className="text-xs text-red-600 font-semibold mt-1">{fieldErrors.desiredSwap}</p>
            )}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
            Detailed Description *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the condition, usage duration, brand, string tension, size, or accessories included..."
            className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white"
            id="create-description-input"
          />
          {fieldErrors.description && (
            <p className="text-xs text-red-600 font-semibold mt-1">{fieldErrors.description}</p>
          )}
        </div>

        {/* Image Selection / Upload */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-700">
            Equipment Photo *
          </label>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-32 h-28 rounded-2xl bg-navy-100 overflow-hidden border border-navy-200 shrink-0">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 space-y-2 w-full">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUseCustomUrl(false);
                    setImageUrl(PRESET_IMAGES[sport]);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                    !useCustomUrl
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-navy-200 text-navy-600 hover:bg-navy-50'
                  }`}
                >
                  Use High-Res {sport} Photo
                </button>

                <label className="cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold border border-navy-200 text-navy-700 hover:bg-navy-50 flex items-center gap-1.5 transition">
                  <Upload className="w-3.5 h-3.5 text-brand-600" />
                  {uploading ? 'Uploading...' : 'Upload Local Image'}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setUseCustomUrl(true);
                }}
                placeholder="Or paste external image URL (https://...)"
                className="w-full p-2.5 bg-navy-50/70 border border-navy-200 rounded-xl text-xs text-navy-800"
              />
            </div>
          </div>
          {fieldErrors.imageUrl && (
            <p className="text-xs text-red-600 font-semibold mt-1">{fieldErrors.imageUrl}</p>
          )}
        </div>

        {/* General Pickup Area */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
            General Campus Handover Location *
          </label>
          <input
            type="text"
            required
            value={pickupArea}
            onChange={(e) => setPickupArea(e.target.value)}
            placeholder="e.g., Campus Sports Pavilion, SAC Atrium, Hostel Block 4 Common Room"
            className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white"
            id="create-pickup-input"
          />
          <p className="text-xs text-navy-400 mt-1">
            Always choose a public, well-lit campus area. Do not provide a private room address.
          </p>
          {fieldErrors.pickupArea && (
            <p className="text-xs text-red-600 font-semibold mt-1">{fieldErrors.pickupArea}</p>
          )}
        </div>

        {/* Terms & Safety Acknowledgement Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 rounded-sm text-brand-600 border-navy-300 focus:ring-brand-500"
              id="create-terms-checkbox"
            />
            <span className="text-xs text-navy-600 leading-relaxed">
              I certify that this sports equipment is legally mine to sell, swap, or rent. I have accurately stated its condition and agree to follow all <strong>Campus Safety Guidelines</strong> during handover.
            </span>
          </label>
          {fieldErrors.termsAccepted && (
            <p className="text-xs text-red-600 font-semibold mt-1">{fieldErrors.termsAccepted}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-navy-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-navy-600 hover:bg-navy-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            id="create-submit-btn"
          >
            {submitting ? 'Publishing Gear...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};
