import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    default: 'CMS Platform',
    template: '%s | CMS',
  },
  description: 'Discover and explore content from the CMS Platform.',
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-black">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          {/* Wordmark */}
          <Link href="/" className="font-sans text-lg font-black tracking-tighter text-black uppercase">
            CMS<span className="font-light">·</span>Platform
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-neutral-600 hover:text-black transition-colors tracking-wide"
            >
              Home
            </Link>
            <Link
              href="/articles"
              className="text-sm font-semibold text-neutral-600 hover:text-black transition-colors tracking-wide"
            >
              Articles
            </Link>
            <Link
              href="/admin/login"
              className="text-sm font-semibold bg-black text-white px-4 py-1.5 border border-black hover:bg-white hover:text-black transition-all tracking-wide"
            >
              Admin →
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Page Content ───────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-sans text-sm font-black tracking-tighter text-black uppercase">
            CMS·Platform
          </span>
          <p className="text-xs text-neutral-400 tracking-wide">
            © {new Date().getFullYear()} CMS Platform. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-xs text-neutral-500 hover:text-black transition-colors">Home</Link>
            <Link href="/articles" className="text-xs text-neutral-500 hover:text-black transition-colors">Articles</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
