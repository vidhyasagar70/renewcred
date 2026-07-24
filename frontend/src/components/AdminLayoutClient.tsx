"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import AdminGuard from './AdminGuard';
import Link from 'next/link';

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await dispatch(logoutUser());
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z' },
    { label: 'Write Article', href: '/admin/content/new', icon: 'M12 4v16m8-8H4' },
  ];

  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-100">
        
        {/* ── Desktop Sidebar ─────────────────────────────────────────────────── */}
        <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-gray-800 bg-gray-900 lg:flex">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
            <div className="h-6 w-6 rounded bg-primary-600 animate-pulse" />
            <span className="text-lg font-bold tracking-tight text-white">CMS Console</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                      </svg>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-800 p-4 bg-gray-900/50">
            <div className="flex items-center gap-3 rounded-lg bg-gray-800/40 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 font-bold text-white uppercase text-sm">
                {user?.name?.slice(0, 2) || 'AD'}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium text-white">{user?.name || 'Admin User'}</p>
                <p className="truncate text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Mobile Sidebar Overlay ─────────────────────────────────────────── */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`fixed bottom-0 top-0 left-0 z-50 flex w-64 flex-col border-r border-gray-800 bg-gray-900 transition-transform duration-300 lg:hidden ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary-600" />
              <span className="text-lg font-bold tracking-tight text-white">CMS Console</span>
            </div>
            <button 
              className="text-gray-400 hover:text-white"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                      </svg>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-gray-800 p-4 bg-gray-900/50">
            <div className="flex items-center gap-3 rounded-lg bg-gray-800/40 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 font-bold text-white uppercase text-sm">
                {user?.name?.slice(0, 2) || 'AD'}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium text-white">{user?.name || 'Admin User'}</p>
                <p className="truncate text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main content area ────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900 px-6">
            <div className="flex items-center gap-4">
              {/* Mobile Burger Button */}
              <button
                className="text-gray-400 hover:text-white lg:hidden"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <h2 className="hidden text-sm font-medium text-gray-400 sm:block">
                Content Management System Control
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/" target="_blank" className="text-xs text-primary-400 hover:underline">
                View Public Site ↗
              </Link>
              {pathname !== '/admin/login' && (
                <button 
                  onClick={handleSignOut}
                  className="rounded bg-gray-800 hover:bg-gray-700 px-3.5 py-1.5 text-xs font-semibold text-gray-200 border border-gray-700 transition-all hover:text-white" 
                  id="admin-logout-btn"
                >
                  Sign out
                </button>
              )}
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-950">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
