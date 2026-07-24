"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContent, setFilters, setPage } from '@/store/slices/contentSlice';
import Link from 'next/link';

const CATEGORIES = ['all', 'Documentation', 'Blog', 'Page'];

export default function ArticlesPage() {
  const dispatch = useAppDispatch();
  const { items, pagination, filters, isLoading, error } = useAppSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchContent({ ...filters, status: 'published', page: pagination.page }));
  }, [dispatch, filters.type, filters.search, pagination.page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value }));
    dispatch(setPage(1));
  };

  const handleCategory = (cat: string) => {
    dispatch(setFilters({ type: cat }));
    dispatch(setPage(1));
  };

  const activeType = filters.type ?? 'all';
  const searchVal  = filters.search ?? '';

  return (
    <div className="bg-white min-h-screen">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="border-b border-black">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="label-xs mb-3">All Articles</p>
          <h1 className="font-sans text-4xl sm:text-5xl font-black text-black tracking-tighter leading-none">
            The Archive
          </h1>
          <p className="mt-3 text-sm text-neutral-500 font-sans max-w-md">
            Browse documentation guides, blog posts, and pages — all rendered with rich text, tables, and math.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* ── Filters ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-6 mb-10">

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map((cat) => {
              const active = activeType === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border transition-all duration-150 ${
                    active
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-neutral-500 border-neutral-300 hover:border-black hover:text-black'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchVal}
              onChange={handleSearch}
              className="w-full border border-neutral-300 bg-white pl-9 pr-4 py-2 text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
            />
          </div>
        </div>

        {/* ── Article Grid ─────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin border-2 border-black border-t-transparent" />
          </div>
        ) : error ? (
          <div className="border border-black p-6">
            <p className="font-semibold text-black">Error: {error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-neutral-300 py-24 text-center">
            <p className="text-sm text-neutral-400">No articles found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-px bg-neutral-200 border border-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item._id}
                className="flex flex-col bg-white p-8 group hover:-translate-y-0.5 hover:shadow-hard transition-all duration-150"
              >
                <p className="label-xs text-neutral-400 mb-4">{item.category}</p>

                <h2 className="font-sans text-xl font-bold text-black leading-snug mb-3 group-hover:underline underline-offset-2">
                  <Link href={`/content/${item.slug}`}>{item.title}</Link>
                </h2>

                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 font-sans flex-1">
                  {item.summary}
                </p>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-black flex items-center justify-center text-white text-[10px] font-bold uppercase">
                      {typeof item.author === 'object' ? item.author.name.slice(0, 2) : 'AU'}
                    </div>
                    <span className="text-xs font-medium text-neutral-600">
                      {typeof item.author === 'object' ? item.author.name : 'Author'}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ── Pagination ───────────────────────────────────────────────── */}
        {pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-between border-t border-neutral-200 pt-6">
            <span className="text-xs text-neutral-400 font-sans">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} articles)
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1 || isLoading}
                onClick={() => dispatch(setPage(pagination.page - 1))}
                className="border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-black hover:text-white hover:border-black disabled:opacity-30 transition-all"
              >
                ← Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages || isLoading}
                onClick={() => dispatch(setPage(pagination.page + 1))}
                className="border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-black hover:text-white hover:border-black disabled:opacity-30 transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
