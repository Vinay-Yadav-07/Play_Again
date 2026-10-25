import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
    if (!email.includes('@')) errors.email = 'Please enter a valid email address.';
    if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      error('Please fix the registration form errors.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });

      success('Welcome to PlayAgain! Your campus sports account is ready.');
      navigate('/dashboard');
    } catch (err: any) {
      error(err.message || 'Registration failed.');
      if (err.details && Array.isArray(err.details)) {
        const mapped: Record<string, string> = {};
        err.details.forEach((d: any) => {
          mapped[d.field] = d.message;
        });
        setFieldErrors(mapped);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white shadow-md shadow-brand-500/20 mb-2">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Join PlayAgain
          </h1>
          <p className="text-xs text-navy-500">
            Create an account to buy, sell, swap, and rent campus sports equipment
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-navy-100 shadow-sm p-6 sm:p-8 space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vinay Kumar"
              className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white"
              id="register-name-input"
            />
            {fieldErrors.name && (
              <p className="text-xs text-red-600 font-semibold mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@campus.edu"
              className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white"
              id="register-email-input"
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-600 font-semibold mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Password (min 6 chars) *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 pr-10 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white"
                id="register-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-red-600 font-semibold mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Confirm Password *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-500 focus:bg-white"
              id="register-confirm-password-input"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-red-600 font-semibold mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <p className="text-[11px] text-navy-400 leading-tight pt-1">
            By signing up, you agree to inspect gear in-person and adhere to college sports safety rules.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 mt-2"
            id="register-submit-btn"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center pt-2 text-xs text-navy-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
