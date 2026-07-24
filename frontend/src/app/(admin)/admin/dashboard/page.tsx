"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminContent, deleteContent, updateContent, setFilters, setPage } from '@/store/slices/contentSlice';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { items, stats, pagination, filters, isLoading, error } = useAppSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchAdminContent({ ...filters, page: pagination.page }));
  }, [dispatch, filters.status, filters.type, filters.search, pagination.page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value }));
    dispatch(setPage(1));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ status: e.target.value as any }));
    dispatch(setPage(1));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ type: e.target.value as any }));
    dispatch(setPage(1));
  };

  const handleTogglePublish = async (id: string, currentStatus: 'published' | 'draft') => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    await dispatch(updateContent({ id, data: { status: nextStatus } }));
    dispatch(fetchAdminContent({ ...filters, page: pagination.page }));
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await dispatch(deleteContent(id));
      dispatch(fetchAdminContent({ ...filters, page: pagination.page }));
    }
  };

  const statsCards = [
    { label: 'Total Articles', value: stats?.total ?? 0, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Published', value: stats?.published ?? 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Drafts', value: stats?.drafts ?? 0, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-gray-100">
      
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">
            Monitor content lifecycle, views, and publish status.
          </p>
        </div>
        <Link 
          href="/admin/content/new"
          className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 hover:shadow-primary-500/35"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          New Content Block
        </Link>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statsCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400">{card.label}</span>
              <span className={`rounded-lg ${card.bg} px-2.5 py-1 text-xs font-semibold ${card.color}`}>
                Active
              </span>
            </div>
            <p className={`mt-4 text-3xl font-extrabold tracking-tight ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Controls / Filters ── */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by title, summary, or body..."
              value={filters.search ?? ''}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-gray-800 bg-gray-950 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <select
                value={filters.type ?? 'all'}
                onChange={handleCategoryChange}
                className="rounded-lg border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-sm text-gray-300 focus:border-primary-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Documentation">Documentation</option>
                <option value="Blog">Blog</option>
                <option value="Page">Page</option>
              </select>
            </div>

            <div>
              <select
                value={filters.status ?? 'all'}
                onChange={handleStatusChange}
                className="rounded-lg border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-sm text-gray-300 focus:border-primary-500 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Content Table ── */}
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-800 bg-gray-950">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/60 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-3">
                      <svg className="h-5 w-5 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading articles...
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No articles found matching filters.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-xs sm:max-w-sm md:max-w-md">
                        <p className="truncate font-semibold text-white">{item.title}</p>
                        <p className="truncate text-xs text-gray-400 mt-0.5">{item.summary}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${item.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {typeof item.author === 'object' ? item.author.name : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleTogglePublish(item._id, item.status)}
                          className={`rounded px-2.5 py-1 text-xs font-medium border transition-all ${
                            item.status === 'published'
                              ? 'border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                              : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {item.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <Link
                          href={`/admin/content/${item._id}`}
                          className="rounded border border-gray-700 bg-gray-800 hover:bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-300 hover:text-white transition-all"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id, item.title)}
                          className="rounded border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-400 transition-all"
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

        {/* ── Pagination Controls ── */}
        {pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-800/50 pt-4">
            <span className="text-xs text-gray-400">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} articles total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1 || isLoading}
                onClick={() => dispatch(setPage(pagination.page - 1))}
                className="rounded border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages || isLoading}
                onClick={() => dispatch(setPage(pagination.page + 1))}
                className="rounded border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800 disabled:opacity-50"
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
