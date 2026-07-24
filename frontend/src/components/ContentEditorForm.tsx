"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { createContent, updateContent } from '@/store/slices/contentSlice';
import type { Content } from '@/types';
import MarkdownPreview from './MarkdownPreview';
import Link from 'next/link';

interface ContentEditorFormProps {
  initialData?: Content | null;
  isEdit?: boolean;
}

export default function ContentEditorForm({ initialData, isEdit = false }: ContentEditorFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Blog');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [slug, setSlug] = useState('');
  
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync initialData
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || 'Blog');
      setStatus(initialData.status || 'draft');
      setSummary(initialData.summary || '');
      setBody(initialData.body || '');
      setSlug(initialData.slug || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    if (!title || !category || !summary || !body) {
      setMessage({ type: 'error', text: 'Please fill in all required fields (Title, Category, Summary, Body).' });
      setIsSaving(false);
      return;
    }

    const payload = {
      title,
      category,
      status,
      summary,
      body,
      slug: slug.trim() || undefined,
    };

    try {
      let resultAction;
      if (isEdit && initialData?._id) {
        resultAction = await dispatch(updateContent({ id: initialData._id, data: payload }));
      } else {
        resultAction = await dispatch(createContent(payload));
      }

      if (createContent.fulfilled.match(resultAction) || updateContent.fulfilled.match(resultAction)) {
        setMessage({ type: 'success', text: isEdit ? 'Article updated successfully!' : 'Article created successfully!' });
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);
      } else {
        const errorMsg = resultAction.payload as string ?? 'Failed to save content.';
        setMessage({ type: 'error', text: errorMsg });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-gray-100">
      
      {/* ── Header Toolbar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? `Edit Article: ${initialData?.title}` : 'Create New Article'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Publish or save draft content to your API endpoints.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-all hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save & Close'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`rounded-lg border p-4 text-sm animate-fade-in ${
            message.type === 'success'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/20 bg-red-500/10 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ── Metadata Settings Section ── */}
      <div className="grid grid-cols-1 gap-6 rounded-xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-sm md:grid-cols-4">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Article Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:border-primary-500 focus:outline-none"
            placeholder="e.g., Einstein's Special Relativity"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-sm text-gray-300 focus:border-primary-500 focus:outline-none"
          >
            <option value="Documentation">Documentation</option>
            <option value="Blog">Blog</option>
            <option value="Page">Page</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Publish Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-sm text-gray-300 focus:border-primary-500 focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Slug */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Slug (URL Path)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:border-primary-500 focus:outline-none"
            placeholder="auto-generated-from-title-if-empty"
          />
        </div>

        {/* Summary */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Summary / Short Description *
          </label>
          <textarea
            required
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:border-primary-500 focus:outline-none"
            placeholder="A short introduction summary of this content..."
          />
        </div>
      </div>

      {/* ── Mobile Tab Navigation ── */}
      <div className="flex border-b border-gray-800 lg:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'editor' ? 'border-primary-500 text-white bg-gray-900/40' : 'border-transparent text-gray-400'
          }`}
        >
          Editor
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'preview' ? 'border-primary-500 text-white bg-gray-900/40' : 'border-transparent text-gray-400'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* ── Editor & Preview Split Workspace ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left pane: Editor (Hidden on mobile if tab is 'preview') */}
        <div className={`flex flex-col space-y-2 lg:flex ${activeTab === 'editor' ? 'block' : 'hidden'}`}>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Article Body (Markdown & LaTeX) *
          </label>
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write in Markdown. Markdown tables are supported. Math LaTeX equations can be written in $inline$ or $$display block$$ format."
            className="h-[500px] w-full rounded-lg border border-gray-800 bg-gray-950 p-4 font-mono text-sm text-gray-100 placeholder-gray-700 focus:border-primary-500 focus:outline-none resize-none"
          />
        </div>

        {/* Right pane: Preview (Hidden on mobile if tab is 'editor') */}
        <div className={`flex flex-col space-y-2 lg:flex ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Live Preview
          </label>
          <div className="h-[500px] w-full overflow-y-auto rounded-lg border border-gray-800 bg-gray-900 p-6">
            <MarkdownPreview content={body} />
          </div>
        </div>
      </div>
    </form>
  );
}
