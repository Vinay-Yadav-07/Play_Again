import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Eye,
  MapPin,
  Lock,
  Flag,
  Sparkles,
} from 'lucide-react';

export const SafetyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Campus Community Guidelines
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Safety & Responsible Use
        </h1>
        <p className="text-sm sm:text-base text-navy-600 leading-relaxed">
          PlayAgain thrives when college athletes support one another with honesty, transparent gear disclosures, and safe in-person exchanges.
        </p>
      </div>

      {/* Core Safety Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-navy-900">Public Campus Handovers</h3>
          <p className="text-xs text-navy-600 leading-relaxed">
            Always meet at public, staffed university locations: the sports complex lobby, cafeteria atrium, or varsity pavilion. Never invite strangers to private dorm rooms or off-campus residences.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-navy-900">Inspect Before Paying</h3>
          <p className="text-xs text-navy-600 leading-relaxed">
            Take 5 minutes to hold, test, and closely examine the gear in daylight. Check racket frames for hairline cracks, bat toes for moisture damage, and football bladders for air leaks before concluding.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-navy-900">Zero Financial Secrets</h3>
          <p className="text-xs text-navy-600 leading-relaxed">
            Never share bank OTPs, debit card PINs, or UPI passwords. PlayAgain will never contact you requesting account credentials or advance wire fees to unlock listings.
          </p>
        </div>
      </div>

      {/* Equipment Inspection Checklist by Sport */}
      <div id="checklist" className="bg-white rounded-3xl border border-navy-100 p-6 sm:p-10 shadow-sm space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            <Sparkles className="w-4 h-4" />
            Field Verification Tips
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900">
            Pre-Exchange Equipment Checklist
          </h2>
          <p className="text-xs text-navy-500 mt-1">
            Use these sport-specific inspection criteria during in-person handovers:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cricket */}
          <div className="p-5 rounded-2xl bg-surface-muted border border-navy-100 space-y-3">
            <h4 className="font-extrabold text-sm text-navy-900 flex items-center gap-2">
              <span>🏏</span> Cricket Bats & Pads
            </h4>
            <ul className="space-y-1.5 text-xs text-navy-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Check bat handle for loosening or cane splintering.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Examine the toe and edges for moisture swelling or deep horizontal cracks.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Ensure batting pad velcro straps and knee bolsters are firm.</span>
              </li>
            </ul>
          </div>

          {/* Football */}
          <div className="p-5 rounded-2xl bg-surface-muted border border-navy-100 space-y-3">
            <h4 className="font-extrabold text-sm text-navy-900 flex items-center gap-2">
              <span>⚽</span> Football & Boots
            </h4>
            <ul className="space-y-1.5 text-xs text-navy-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Inspect ball valve and seams for air retention.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Examine boot outsoles for sole separation or worn studs.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Check ankle padding in shin guards for intact foam cushion.</span>
              </li>
            </ul>
          </div>

          {/* Badminton & Tennis */}
          <div className="p-5 rounded-2xl bg-surface-muted border border-navy-100 space-y-3">
            <h4 className="font-extrabold text-sm text-navy-900 flex items-center gap-2">
              <span>🏸</span> Badminton & Tennis Rackets
            </h4>
            <ul className="space-y-1.5 text-xs text-navy-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Look along the head frame at eye level for subtle hairline stress cracks.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Press string bed to verify tension and inspect grommets for cutting.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Gently flex the shaft to detect hidden structural fatigue.</span>
              </li>
            </ul>
          </div>

          {/* Fitness & Gym */}
          <div className="p-5 rounded-2xl bg-surface-muted border border-navy-100 space-y-3">
            <h4 className="font-extrabold text-sm text-navy-900 flex items-center gap-2">
              <span>🏋️</span> Fitness & Weights
            </h4>
            <ul className="space-y-1.5 text-xs text-navy-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Test dumbbell spinlock collars to confirm threads lock securely.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Check resistance bands for white stress marks or micro-tears.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Confirm total plate weights and barbell integrity.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reporting and Incident Handling */}
      <div className="bg-red-50/60 border border-red-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-700 font-bold text-base">
            <Flag className="w-5 h-5 text-red-600" />
            Notice Suspicious Gear or Behavior?
          </div>
          <p className="text-xs text-red-900 max-w-xl leading-relaxed">
            Every listing page includes a <strong>Report Listing</strong> flag icon. If an item appears stolen, falsely described, or violates campus community standards, click the flag to trigger administrative review.
          </p>
        </div>
      </div>
    </div>
  );
};
