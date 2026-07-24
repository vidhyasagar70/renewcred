import type { Metadata } from 'next';
import AdminLayoutClient from '@/components/AdminLayoutClient';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Admin',
  },
  description: 'CMS Administration Dashboard',
  robots: 'noindex, nofollow', // Admin should never be indexed
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

