"use client";

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please enter your email and password.');
      return;
    }

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      router.push('/admin/dashboard');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-in">

        {/* Wordmark */}
        <div className="mb-12 text-center">
          <p className="font-sans text-3xl font-black tracking-tighter text-black uppercase">
            CMS·Platform
          </p>
          <p className="mt-1 text-xs text-neutral-400 uppercase tracking-widest">Admin Console</p>
        </div>

        {/* Card */}
        <div className="border border-black shadow-hard p-8">

          <h1 className="font-sans text-xl font-black text-black mb-6 tracking-tight">Sign In</h1>

          {displayError && (
            <div className="border border-black bg-black text-white p-3 mb-6 text-xs font-semibold animate-fade-in">
              ⚠ {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="form-input"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="form-input"
              />
            </div>

            {/* Hint */}
            <p className="text-[11px] text-neutral-400 font-mono">
              Demo: admin@example.com / Admin@123456
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-sm mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin border-2 border-white border-t-transparent" />
                  Authenticating…
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-400">
          Not an administrator?{' '}
          <a href="/" className="underline text-black">Return to site</a>
        </p>
      </div>
    </div>
  );
}
