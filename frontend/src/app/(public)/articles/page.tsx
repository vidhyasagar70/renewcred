"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContent, setFilters, setPage } from '@/store/slices/contentSlice';
import Link from 'next/link';

export default function ArticlesPage() {
  const dispatch = useAppDispatch();
  const { items, pagination, filters, isLoading, error } = useAppSelector((state) => state.content);

  useEffect(() => {
    // Fetch only published content with active filters
    dispatch(fetchContent({ ...filters, status: 'published', page: pagination.page }));
  }, [dispatch, filters.type, filters.search, pagination.page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value }));
    dispatch(setPage(1));
  };

  const handleCategoryClick = (category: string) => {
    dispatch(setFilters({ type: category as any }));
    dispatch(setPage(1));
  };

  const categories = ['all', 'Documentation', 'Blog', 'Page'];

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Articles</h1>
          <p className="mt-2 text-sm text-gray-400">
            Browse through documentation guides, updates, and deep dives.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-800 pb-6">
          {/* Categories Tab */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isSelected = (filters.type ?? 'all') === cat || (cat === 'all' && (filters.type ?? 'all') === 'all');
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                      : 'border border-gray-850 bg-gray-900/60 text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search articles..."
              value={filters.search ?? ''}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-gray-800 bg-gray-950 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Article Grid */}
        {isLoading ? (
          <div className="flex h-60 items-center justify-center text-gray-400">
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
          <div className="text-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-2xl bg-gray-900/10">
            No published articles found matching the current filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article 
                key={item._id} 
                className="flex flex-col justify-between rounded-2xl border border-gray-800 bg-gray-900/20 p-6 transition-all hover:border-gray-700 hover:bg-gray-900/40 hover:-translate-y-1 duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-primary-950 text-primary-400 border border-primary-500/10 px-2.5 py-0.5 text-xs font-semibold">
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-800/60 pt-6">
            <span className="text-xs text-gray-400">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} articles total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1 || isLoading}
                onClick={() => dispatch(setPage(pagination.page - 1))}
                className="rounded border border-gray-800 bg-gray-900 px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages || isLoading}
                onClick={() => dispatch(setPage(pagination.page + 1))}
                className="rounded border border-gray-800 bg-gray-900 px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
