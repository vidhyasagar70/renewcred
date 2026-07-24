"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAdminContent, deleteContent, updateContent, setFilters, setPage,
} from '@/store/slices/contentSlice';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { items, stats, pagination, filters, isLoading, error } = useAppSelector((s) => s.content);

  useEffect(() => {
    dispatch(fetchAdminContent({ ...filters, page: pagination.page }));
  }, [dispatch, filters.status, filters.type, filters.search, pagination.page]);

  const handleSearch  = (e: React.ChangeEvent<HTMLInputElement>) => { dispatch(setFilters({ search: e.target.value })); dispatch(setPage(1)); };
  const handleStatus  = (e: React.ChangeEvent<HTMLSelectElement>) => { dispatch(setFilters({ status: e.target.value as any })); dispatch(setPage(1)); };
  const handleCat     = (e: React.ChangeEvent<HTMLSelectElement>) => { dispatch(setFilters({ type: e.target.value as any })); dispatch(setPage(1)); };

  const handleToggle = async (id: string, cur: 'published' | 'draft') => {
    await dispatch(updateContent({ id, data: { status: cur === 'published' ? 'draft' : 'published' } }));
    dispatch(fetchAdminContent({ ...filters, page: pagination.page }));
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await dispatch(deleteContent(id));
    dispatch(fetchAdminContent({ ...filters, page: pagination.page }));
  };

  const STATS = [
    { label: 'Total Articles', value: stats?.total     ?? 0 },
    { label: 'Published',      value: stats?.published ?? 0 },
    { label: 'Drafts',         value: stats?.drafts    ?? 0 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="label-xs text-neutral-400 mb-1">Admin Console</p>
          <h1 className="font-sans text-3xl font-black text-black tracking-tight">Dashboard</h1>
        </div>
        <Link href="/admin/content/new" className="btn-primary text-sm">
          + New Article
        </Link>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map((s, i) => (
          <div key={s.label} className={`bg-white border p-6 ${i === 0 ? 'border-black shadow-hard' : 'border-neutral-200'}`}>
            <p className="label-xs text-neutral-400 mb-3">{s.label}</p>
            <p className="font-sans text-4xl font-black text-black">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Content Panel ───────────────────────────────────────────── */}
      <div className="bg-white border border-neutral-200">

        {/* Toolbar */}
        <div className="border-b border-neutral-200 p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search articles…"
              value={filters.search ?? ''}
              onChange={handleSearch}
              className="w-full border border-neutral-300 bg-white pl-9 pr-4 py-2 text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={filters.type ?? 'all'}
              onChange={handleCat}
              className="border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 focus:border-black focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Documentation">Documentation</option>
              <option value="Blog">Blog</option>
              <option value="Page">Page</option>
            </select>
            <select
              value={filters.status ?? 'all'}
              onChange={handleStatus}
              className="border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 focus:border-black focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black bg-black text-white">
                {['Title / Summary', 'Category', 'Status', 'Author', 'Date', 'Actions'].map((h) => (
                  <th key={h} className={`px-5 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap ${h === 'Actions' ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-neutral-400 text-sm">
                      <div className="h-5 w-5 animate-spin border-2 border-black border-t-transparent" />
                      Loading articles…
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-neutral-400">
                    No articles match the current filters.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="hover:bg-neutral-50 transition-colors">
                    {/* Title */}
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-semibold text-black truncate">{item.title}</p>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">{item.summary}</p>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="label-xs border border-neutral-300 px-2 py-0.5 bg-neutral-50">
                        {item.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {item.status === 'published' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-black">
                          <span className="h-1.5 w-1.5 bg-black rounded-full" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400">
                          <span className="h-1.5 w-1.5 border border-neutral-400 rounded-full" />
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Author */}
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {typeof item.author === 'object' ? item.author.name : '—'}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-xs text-neutral-400 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(item._id, item.status)}
                          className="border border-neutral-300 bg-white text-xs font-semibold text-neutral-600 px-2.5 py-1.5 hover:bg-black hover:text-white hover:border-black transition-all"
                        >
                          {item.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <Link
                          href={`/admin/content/${item._id}`}
                          className="border border-neutral-300 bg-white text-xs font-semibold text-neutral-600 px-2.5 py-1.5 hover:bg-black hover:text-white hover:border-black transition-all"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id, item.title)}
                          className="border border-red-200 bg-white text-xs font-semibold text-red-600 px-2.5 py-1.5 hover:bg-red-700 hover:text-white hover:border-red-700 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-neutral-200 px-5 py-4 flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1 || isLoading}
                onClick={() => dispatch(setPage(pagination.page - 1))}
                className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-black hover:text-white hover:border-black disabled:opacity-30 transition-all"
              >
                ← Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages || isLoading}
                onClick={() => dispatch(setPage(pagination.page + 1))}
                className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-black hover:text-white hover:border-black disabled:opacity-30 transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="border border-black bg-black text-white text-xs font-semibold px-4 py-3">
          Error: {error}
        </div>
      )}
    </div>
  );
}
