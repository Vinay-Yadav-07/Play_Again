import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, Sparkles, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      error('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      success('Welcome back to PlayAgain!');
      navigate(redirect);
    } catch (err: any) {
      error(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Demo123!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white shadow-md shadow-brand-500/20 mb-2">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Log in to PlayAgain
          </h1>
          <p className="text-xs text-navy-500">
            Access your campus equipment marketplace account
          </p>
        </div>

        {/* Demo Fast Login Box */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Quick Demo Accounts (1-Click Fill)
          </div>
          <p className="text-[11px] text-amber-800 leading-tight">
            Select a demo profile to test buyer or seller workflows immediately:
          </p>
          <div className="flex flex-col gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleQuickLogin('demo.seller@playagain.campus')}
              className="text-left px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-semibold text-navy-800 hover:bg-amber-100/60 transition flex items-center justify-between"
            >
              <span>Demo Seller (Rohan Verma)</span>
              <span className="text-[10px] text-navy-400">Owner of Cricket & Gym gear</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('demo.buyer@playagain.campus')}
              className="text-left px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-semibold text-navy-800 hover:bg-amber-100/60 transition flex items-center justify-between"
            >
              <span>Demo Buyer (Aarav Sharma)</span>
              <span className="text-[10px] text-navy-400">Student Buyer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('badminton.club@playagain.campus')}
              className="text-left px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-semibold text-navy-800 hover:bg-amber-100/60 transition flex items-center justify-between"
            >
              <span>Demo Sports Club (Badminton Assoc)</span>
              <span className="text-[10px] text-navy-400">Campus Club Gear</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-navy-100 shadow-sm p-6 sm:p-8 space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@campus.edu or demo.seller@playagain.campus"
              className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white"
              id="login-email-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 pr-10 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white"
                id="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 mt-2"
            id="login-submit-btn"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Logging In...' : 'Log In'}
          </button>

          <div className="text-center pt-2 text-xs text-navy-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
