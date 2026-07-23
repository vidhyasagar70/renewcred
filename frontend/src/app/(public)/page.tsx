import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to the CMS Platform — explore our latest content.',
};

export default function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="animate-fade-in text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Welcome to{' '}
          <span className="text-primary-600">CMS Platform</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          A production-ready, headless Content Management System built with
          Next.js, Node.js, and MongoDB.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a href="/articles" className="btn-primary px-6 py-3 text-base">
            Browse Articles
          </a>
          <a href="/admin" className="btn-secondary px-6 py-3 text-base">
            Admin Dashboard →
          </a>
        </div>
      </div>
    </section>
  );
}
