import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'CMS Platform',
    template: '%s | CMS',
  },
  description: 'Discover and explore content from the CMS Platform.',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Public site header — implement in /components/layout/PublicHeader.tsx */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-xl font-bold text-primary-600">CMS Platform</span>
          <nav className="hidden gap-6 text-sm font-medium text-gray-600 sm:flex dark:text-gray-400">
            <a href="/" className="hover:text-primary-600">Home</a>
            <a href="/articles" className="hover:text-primary-600">Articles</a>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Public site footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">
        © {new Date().getFullYear()} CMS Platform. All rights reserved.
      </footer>
    </div>
  );
}
