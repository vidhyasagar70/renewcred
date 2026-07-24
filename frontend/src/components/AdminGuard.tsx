"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth } from '@/store/slices/authSlice';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('cms_token') : null;
    if (!isAuthenticated && token) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isMounted) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('cms_token') : null;
    const isLoginPage = pathname === '/admin/login';

    if (isLoading) return;

    if (!isAuthenticated && !token) {
      if (!isLoginPage) {
        router.replace('/admin/login');
      }
    } else if (isAuthenticated) {
      if (isLoginPage) {
        router.replace('/admin/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, isMounted]);

  // Loading screen (premium visual style)
  if ((isLoading && !isAuthenticated) || !isMounted) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-950 text-white">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-12 w-12 animate-ping rounded-full border-4 border-primary-500/20"></div>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-primary-600 border-r-transparent border-b-transparent border-l-transparent"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-400 tracking-wider">
          Verifying credentials...
        </p>
      </div>
    );
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('cms_token') : null;
  const isLoginPage = pathname === '/admin/login';

  if (!isAuthenticated && !isLoginPage && !token) {
    return null;
  }

  if (isAuthenticated && isLoginPage) {
    return null;
  }

  return <>{children}</>;
}
