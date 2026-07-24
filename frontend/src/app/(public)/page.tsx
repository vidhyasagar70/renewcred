"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContent } from '@/store/slices/contentSlice';
import Link from 'next/link';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.content);

  useEffect(() => {
    // Fetch only published content
    dispatch(fetchContent({ status: 'published' }));
  }, [dispatch]);

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100">
      
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-b border-gray-900">
        <div className="animate-fade-in text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/5 px-3 py-1 text-xs font-medium text-primary-400">
            <span className="flex h-2 w-2 rounded-full bg-primary-400 animate-ping" />
            Headless CMS Platform
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Modern Content, <span className="text-primary-500">Rendered Instantly</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-400">
            A production-ready headless CMS. Create rich markdown articles, math formulas, and nested documentation in a unified workspace.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center pt-4">
            <Link href="/articles" className="rounded-lg bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 hover:shadow-primary-500/35">
              Browse Articles
            </Link>
            <Link href="/admin/login" className="rounded-lg border border-gray-800 bg-gray-900/50 px-6 py-3.5 text-sm font-semibold text-gray-300 transition-all hover:bg-gray-800 hover:text-white">
              Admin Console →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Latest Published Articles</h2>
            <p className="mt-1 text-sm text-gray-400">Explore documentation, blog posts, and pages.</p>
          </div>
          <Link href="/articles" className="text-sm font-semibold text-primary-400 hover:text-primary-350">
            View All →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-gray-400">
            <svg className="mr-3 h-6 w-6 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading articles...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400 text-center">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-xl bg-gray-900/10">
            No published articles found. Run the seed script inside the backend to populate contents.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 6).map((item) => (
              <article 
                key={item._id} 
                className="flex flex-col justify-between rounded-2xl border border-gray-800 bg-gray-900/20 p-6 transition-all hover:border-gray-700 hover:bg-gray-900/40 hover:-translate-y-1 duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-primary-950 text-primary-400 border border-primary-500/10 px-2 py-0.5 text-xs font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-2 hover:text-primary-400 transition-colors">
                      <Link href={`/content/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-2.5 text-sm text-gray-400 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-800/80 pt-4 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white uppercase text-[10px]">
                      {typeof item.author === 'object' ? item.author.name.slice(0,2) : 'AD'}
                    </div>
                    <span className="font-medium text-gray-400">
                      {typeof item.author === 'object' ? item.author.name : 'Admin'}
                    </span>
                  </div>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
