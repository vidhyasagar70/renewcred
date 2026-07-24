"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import AdminGuard from './AdminGuard';
import Link from 'next/link';

const NAV_ITEMS = [
  {
    href:  '/admin/dashboard',
    label: 'Dashboard',
    icon:  (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M3 7h6v6H3zm0 8h6v4H3zm8-8h10v4H11zm0 8h10v4H11z" />
      </svg>
    ),
  },
  {
    href:  '/admin/content/new',
    label: 'New Article',
    icon:  (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const dispatch   = useAppDispatch();
  const { user }   = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace('/admin/login');
  };

  const isLogin = pathname === '/admin/login';

  return (
    <AdminGuard>
      {isLogin ? (
        // Login page — no shell
        <>{children}</>
      ) : (
        <div className="flex h-screen overflow-hidden bg-neutral-50 font-sans">

          {/* ── Mobile overlay ────────────────────────────────────────── */}
          {open && (
            <div
              className="fixed inset-0 z-20 bg-black/40 lg:hidden"
              onClick={() => setOpen(false)}
            />
          )}

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside
            className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-white border-r border-black
              transform transition-transform duration-200
              ${open ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
          >
            {/* Sidebar header */}
            <div className="flex h-14 items-center justify-between border-b border-black px-5">
              <Link href="/admin/dashboard" className="font-sans text-base font-black tracking-tighter text-black uppercase">
                CMS<span className="font-light">·</span>Admin
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="lg:hidden p-1 text-neutral-400 hover:text-black"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
              <p className="label-xs px-3 mb-3 text-neutral-300">Navigation</p>
              {NAV_ITEMS.map(({ href, label, icon }) => {
                const active = pathname === href || (href !== '/admin/content/new' && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all duration-100 border ${
                      active
                        ? 'bg-black text-white border-black shadow-hard-sm'
                        : 'bg-white text-neutral-600 border-transparent hover:border-black hover:text-black hover:bg-neutral-50'
                    }`}
                  >
                    {icon}
                    {label}
                  </Link>
                );
              })}

              {/* Public site link */}
              <div className="pt-4 mt-4 border-t border-neutral-100">
                <p className="label-xs px-3 mb-3 text-neutral-300">External</p>
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-neutral-500 hover:text-black transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Public Site ↗
                </Link>
              </div>
            </nav>

            {/* User / Logout */}
            <div className="border-t border-black p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 bg-black flex items-center justify-center text-white text-xs font-black uppercase shrink-0">
                  {user?.name?.slice(0, 2) ?? 'AU'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-black truncate">{user?.name ?? 'Administrator'}</p>
                  <p className="text-[11px] text-neutral-400 truncate">{user?.email ?? ''}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full border border-neutral-300 bg-white text-neutral-600 text-xs font-semibold px-3 py-2 hover:bg-black hover:text-white hover:border-black transition-all"
              >
                Sign Out
              </button>
            </div>
          </aside>

          {/* ── Main area ─────────────────────────────────────────────── */}
          <div className="flex flex-1 flex-col overflow-hidden">

            {/* Top bar */}
            <div className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6">
              {/* Mobile burger */}
              <button
                onClick={() => setOpen(true)}
                className="lg:hidden p-1 text-neutral-500 hover:text-black"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Breadcrumb */}
              <div className="hidden lg:flex items-center gap-2 text-xs text-neutral-400 font-sans">
                <span>Admin</span>
                <span>/</span>
                <span className="text-black font-semibold capitalize">
                  {pathname.split('/').pop()?.replace('-', ' ') ?? 'Dashboard'}
                </span>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-3 ml-auto">
                <Link
                  href="/admin/content/new"
                  className="hidden sm:inline-flex btn-primary text-xs px-4 py-2"
                >
                  + New Article
                </Link>
                <div className="h-7 w-7 bg-black flex items-center justify-center text-white text-[10px] font-black uppercase">
                  {user?.name?.slice(0, 2) ?? 'AU'}
                </div>
              </div>
            </div>

            {/* Page content */}
            <main className="flex-1 overflow-y-auto bg-neutral-50 p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      )}
    </AdminGuard>
  );
}
