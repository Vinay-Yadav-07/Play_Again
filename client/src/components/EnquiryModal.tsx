import React, { useState } from 'react';
import { Send, X, ShieldCheck } from 'lucide-react';
import { Listing } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

interface EnquiryModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [message, setMessage] = useState(
    listing.listingType === 'rent'
      ? `Hi! I would like to rent your "${listing.title}" for an upcoming campus match. Is it available for inspection?`
      : listing.listingType === 'swap'
      ? `Hi! I saw you are looking to swap your "${listing.title}". I have gear available and would love to connect.`
      : `Hi! I am interested in purchasing your "${listing.title}". Is it still available to inspect on campus?`
  );
  const [proposedOffer, setProposedOffer] = useState<string>(
    listing.listingType === 'sale' && listing.price > 0 ? String(listing.price) : ''
  );
  const [rentalDates, setRentalDates] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 5) {
      error('Please write a message with at least 5 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.enquiries.create(listing.id, {
        message: message.trim(),
        proposedOffer: proposedOffer ? parseFloat(proposedOffer) : undefined,
        rentalDates: rentalDates.trim() || undefined,
      });

      success('Enquiry delivered to seller! You can monitor responses in your dashboard.');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      error(err.message || 'Failed to submit enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-navy-100 max-w-lg w-full p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-navy-100">
          <div>
            <h3 className="font-extrabold text-lg text-navy-900">Contact Seller</h3>
            <p className="text-xs text-navy-500 truncate max-w-xs">{listing.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-navy-400 hover:text-navy-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Your Message *
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about gear condition, pickup time, or handover location..."
              className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white transition"
              id="enquiry-message-input"
            />
          </div>

          {listing.listingType === 'sale' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
                Proposed Offer (₹) <span className="text-navy-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                min="0"
                value={proposedOffer}
                onChange={(e) => setProposedOffer(e.target.value)}
                placeholder={`Listed price: ₹${listing.price}`}
                className="w-full p-2.5 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white transition"
                id="enquiry-offer-input"
              />
            </div>
          )}

          {listing.listingType === 'rent' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
                Requested Rental Dates / Duration
              </label>
              <input
                type="text"
                value={rentalDates}
                onChange={(e) => setRentalDates(e.target.value)}
                placeholder="e.g., Saturday afternoon match (2 PM - 6 PM)"
                className="w-full p-2.5 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white transition"
                id="enquiry-dates-input"
              />
            </div>
          )}

          {/* Safety Reminder */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-50 border border-brand-100 text-brand-900 text-xs">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <p>
              <strong>Campus Safety Note:</strong> Never share sensitive bank passwords or personal home addresses. Plan to inspect gear at designated campus sports facilities during daylight hours.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-navy-600 hover:bg-navy-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-xs transition disabled:opacity-50"
              id="enquiry-submit-btn"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
