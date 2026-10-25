import React, { useState } from 'react';
import { Flag, X, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

interface ReportModalProps {
  listingId: string;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  'Inaccurate or misleading gear condition',
  'Prohibited or non-sports item',
  'Suspicious or fraudulent behavior',
  'Unresponsive or suspicious contact info',
  'Copyrighted stock photo without actual product',
  'Other campus guideline violation',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  listingId,
  isOpen,
  onClose,
}) => {
  const { success, error } = useToast();
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.reports.create(listingId, {
        reason,
        details: details.trim() || undefined,
      });

      success('Report logged for moderation. Thank you for protecting the sports community!');
      onClose();
    } catch (err: any) {
      error(err.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-navy-100 max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-navy-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-navy-900">Report Listing</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-navy-400 hover:text-navy-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Reason for Reporting *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500"
            >
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explain any specific safety, defect, or compliance issue..."
              className="w-full p-2.5 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500"
            />
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition disabled:opacity-50"
            >
              <Flag className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
