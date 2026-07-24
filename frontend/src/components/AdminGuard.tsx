"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth } from '@/store/slices/authSlice';

interface AdminGuardProps { children: React.ReactNode; }

export default function AdminGuard({ children }: AdminGuardProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('cms_token') : null;
    if (!isAuthenticated && token) dispatch(checkAuth());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!mounted) return;
    const token      = typeof window !== 'undefined' ? localStorage.getItem('cms_token') : null;
    const isLoginPg  = pathname === '/admin/login';
    if (isLoading) return;

    if (!isAuthenticated && !token && !isLoginPg) {
      router.replace('/admin/login');
    } else if (isAuthenticated && isLoginPg) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, pathname, router, mounted]);

  // Loading spinner — B&W
  if ((isLoading && !isAuthenticated) || !mounted) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin border-2 border-black border-t-transparent mb-4" />
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Verifying session…
        </p>
      </div>
    );
  }

  const token      = typeof window !== 'undefined' ? localStorage.getItem('cms_token') : null;
  const isLoginPg  = pathname === '/admin/login';

  if (!isAuthenticated && !isLoginPg && !token) return null;
  if (isAuthenticated && isLoginPg) return null;

  return <>{children}</>;
}
