import React from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Search,
  MessageSquare,
  CheckCircle,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: <Upload className="w-6 h-6 text-brand-600" />,
      title: 'List Equipment',
      desc: 'Take clear photos of your sports equipment from multiple angles. Disclose any cosmetic scuffs, string tension, or previous repairs. Choose whether you want to sell at a fixed price, propose a direct gear swap, or offer match-day rentals.',
    },
    {
      num: '02',
      icon: <Search className="w-6 h-6 text-blue-600" />,
      title: 'Discover Gear',
      desc: 'College athletes and amateur players search by sport category, condition, transaction type, and budget. Browse bats, boots, rackets, and fitness gear without retail markups.',
    },
    {
      num: '03',
      icon: <MessageSquare className="w-6 h-6 text-amber-600" />,
      title: 'Connect & Agree',
      desc: 'Interested buyers send a direct enquiry through PlayAgain with an optional counter-offer or specific rental dates. Both parties coordinate meeting time and terms securely.',
    },
    {
      num: '04',
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      title: 'Complete Handover',
      desc: 'Meet at a designated, well-lit campus sports facility (e.g., student pavilion, gymnasium reception, or tennis club). Inspect the gear in person before handing over payment.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
          <Sparkles className="w-3.5 h-3.5" />
          The Peer-to-Peer Playbook
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          How PlayAgain Works
        </h1>
        <p className="text-sm sm:text-base text-navy-600 leading-relaxed">
          Designed specifically for college sports enthusiasts to save money, find gear quickly, and keep athletic equipment in active play.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((s) => (
          <div
            key={s.num}
            className="bg-white p-7 rounded-3xl border border-navy-100 shadow-sm relative overflow-hidden space-y-3"
          >
            <span className="text-5xl font-black text-navy-100 absolute top-4 right-6 pointer-events-none select-none">
              {s.num}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-navy-50 flex items-center justify-center">
              {s.icon}
            </div>
            <h3 className="text-lg font-bold text-navy-900">{s.title}</h3>
            <p className="text-sm text-navy-600 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Platform Role & Responsibility Disclaimer */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2.5 text-amber-900 font-bold text-base">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          Platform Role & Neutrality Statement
        </div>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          <strong>PlayAgain facilitates peer-to-peer connections and discovery.</strong> The platform does not inspect, test, warrant, or physically warehouse equipment, nor do we verify the identity of every student member. All agreements, condition inspections, payments, and handovers are coordinated directly between the participating individuals.
        </p>
        <p className="text-xs text-amber-800 leading-relaxed">
          Always inspect items in person in broad daylight at campus sports grounds before completing any exchange.
        </p>
      </div>

      {/* Handover Tips Card */}
      <div className="bg-white rounded-3xl border border-navy-100 p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="font-extrabold text-xl text-navy-900">
            Want to learn how to inspect bats, rackets, and boots?
          </h3>
          <p className="text-xs text-navy-500 max-w-xl">
            Check out our community inspection guidelines and campus safety recommendations.
          </p>
        </div>
        <Link
          to="/safety"
          className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center gap-2 transition shrink-0"
        >
          <ShieldCheck className="w-4 h-4 text-brand-400" />
          View Campus Safety Guide
        </Link>
      </div>
    </div>
  );
};
