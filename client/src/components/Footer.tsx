import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-navy-300 pt-16 pb-12 border-t border-navy-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-navy-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center text-white">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Play<span className="text-brand-400">Again</span>
              </span>
            </Link>
            <p className="text-sm text-navy-400 leading-relaxed">
              Give Sports Gear a Second Game. A college-first peer-to-peer equipment exchange helping student athletes access affordable gear sustainably.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-semibold bg-brand-950/60 border border-brand-800/40 px-3 py-1.5 rounded-lg w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Academic MVP Prototype
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              Explore Sports
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/marketplace?sport=Cricket" className="hover:text-brand-400 transition">
                  Cricket Bats & Gear
                </Link>
              </li>
              <li>
                <Link to="/marketplace?sport=Football" className="hover:text-brand-400 transition">
                  Football & Boots
                </Link>
              </li>
              <li>
                <Link to="/marketplace?sport=Badminton" className="hover:text-brand-400 transition">
                  Badminton Rackets & Kits
                </Link>
              </li>
              <li>
                <Link to="/marketplace?sport=Basketball" className="hover:text-brand-400 transition">
                  Basketball Gear
                </Link>
              </li>
              <li>
                <Link to="/marketplace?sport=Fitness" className="hover:text-brand-400 transition">
                  Fitness & Dumbbells
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              Platform & Safety
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/how-it-works" className="hover:text-brand-400 transition">
                  How It Works (4 Steps)
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-brand-400 transition">
                  Campus Handover Safety
                </Link>
              </li>
              <li>
                <Link to="/safety#checklist" className="hover:text-brand-400 transition">
                  Equipment Inspection Checklist
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-brand-400 transition">
                  Live Database Metrics
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Assessment Note */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              Academic Context
            </h4>
            <p className="text-xs text-navy-400 leading-relaxed">
              Developed for Course <strong>MDMIE03</strong> (Presentation 2: MVP & Scale-Up Strategy Pitch).
            </p>
            <p className="text-xs text-navy-400 leading-relaxed">
              All demonstration accounts and seeded items are explicitly marked. No fake external transactions, payments, or simulated users are presented as verified traction.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-navy-500 gap-4">
          <p>© {new Date().getFullYear()} PlayAgain — Give Sports Gear a Second Game. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500" /> for campus athletes
          </p>
        </div>
      </div>
    </footer>
  );
};
