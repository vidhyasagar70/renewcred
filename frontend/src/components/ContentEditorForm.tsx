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
  const router   = useRouter();
  const dispatch = useAppDispatch();

  // ── Local form state (not in Redux — transient per-session) ──────────────
  const [title,    setTitle]    = useState('');
  const [category, setCategory] = useState('Blog');
  const [status,   setStatus]   = useState<'draft' | 'published'>('draft');
  const [summary,  setSummary]  = useState('');
  const [body,     setBody]     = useState('');
  const [slug,     setSlug]     = useState('');

  const [activeTab,  setActiveTab]  = useState<'editor' | 'preview'>('editor');
  const [isSaving,   setIsSaving]   = useState(false);
  const [message,    setMessage]    = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title    || '');
      setCategory(initialData.category || 'Blog');
      setStatus(initialData.status  || 'draft');
      setSummary(initialData.summary || '');
      setBody(initialData.body      || '');
      setSlug(initialData.slug      || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    if (!title || !category || !summary || !body) {
      setMessage({ type: 'error', text: 'Please fill in all required fields: Title, Category, Summary, and Body.' });
      setIsSaving(false);
      return;
    }

    const payload = { title, category, status, summary, body, slug: slug.trim() || undefined };

    try {
      let result;
      if (isEdit && initialData?._id) {
        result = await dispatch(updateContent({ id: initialData._id, data: payload }));
      } else {
        result = await dispatch(createContent(payload));
      }

      if (createContent.fulfilled.match(result) || updateContent.fulfilled.match(result)) {
        setMessage({ type: 'success', text: isEdit ? 'Article updated.' : 'Article created.' });
        setTimeout(() => router.push('/admin/dashboard'), 1200);
      } else {
        setMessage({ type: 'error', text: (result.payload as string) || 'Failed to save.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">

      {/* ── Header toolbar ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-5">
        <div>
          <p className="label-xs text-neutral-400 mb-1">{isEdit ? 'Editing Article' : 'New Article'}</p>
          <h1 className="font-sans text-2xl font-black text-black tracking-tight">
            {isEdit ? (initialData?.title ?? 'Edit Article') : 'Create New Article'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="btn-secondary text-xs px-5 py-2.5"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary text-xs px-5 py-2.5"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin border-2 border-white border-t-transparent" />
                Saving…
              </span>
            ) : 'Save & Close'}
          </button>
        </div>
      </div>

      {/* ── Status message ──────────────────────────────────────────── */}
      {message && (
        <div className={`border text-sm px-4 py-3 font-semibold animate-fade-in ${
          message.type === 'success'
            ? 'bg-black text-white border-black'
            : 'bg-white text-black border-black'
        }`}>
          {message.type === 'success' ? '✓ ' : '⚠ '}
          {message.text}
        </div>
      )}

      {/* ── Metadata grid ───────────────────────────────────────────── */}
      <div className="border border-neutral-200 bg-white p-6 grid grid-cols-1 gap-5 md:grid-cols-4">

        {/* Title */}
        <div className="md:col-span-2">
          <label className="form-label">Article Title *</label>
          <input
            type="text" required value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Einstein's Special Relativity"
            className="form-input"
          />
        </div>

        {/* Category */}
        <div>
          <label className="form-label">Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input">
            <option value="Documentation">Documentation</option>
            <option value="Blog">Blog</option>
            <option value="Page">Page</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="form-label">Status *</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="form-input">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Slug */}
        <div className="md:col-span-2">
          <label className="form-label">URL Slug</label>
          <input
            type="text" value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated-from-title-if-empty"
            className="form-input font-mono text-xs"
          />
        </div>

        {/* Summary */}
        <div className="md:col-span-2">
          <label className="form-label">Summary *</label>
          <textarea
            required rows={2} value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A one or two sentence description…"
            className="form-input resize-none"
          />
        </div>
      </div>

      {/* ── Mobile tab switcher ─────────────────────────────────────── */}
      <div className="flex border-b border-neutral-200 lg:hidden">
        {(['editor', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeTab === tab
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            {tab === 'editor' ? 'Editor' : 'Live Preview'}
          </button>
        ))}
      </div>

      {/* ── Split workspace ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Left — Editor */}
        <div className={`flex flex-col gap-2 ${activeTab === 'editor' ? 'block' : 'hidden'} lg:flex`}>
          <label className="form-label">Body (Markdown + LaTeX) *</label>
          <textarea
            required value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`Write in Markdown. Support examples:\n\n## Headings\n- Lists / Nested lists\n| Table | Header |\n|-------|--------|\n\nInline math: $E = mc^2$\nBlock math:\n$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$`}
            className="h-[520px] w-full border border-neutral-300 bg-neutral-50 p-4 font-mono text-sm text-black placeholder-neutral-300 focus:border-black focus:outline-none focus:ring-1 focus:ring-black resize-none transition-colors"
          />
        </div>

        {/* Right — Preview */}
        <div className={`flex flex-col gap-2 ${activeTab === 'preview' ? 'block' : 'hidden'} lg:flex`}>
          <div className="flex items-center justify-between">
            <label className="form-label">Live Preview</label>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              Markdown + KaTeX
            </span>
          </div>
          <div className="h-[520px] w-full overflow-y-auto border border-neutral-200 bg-neutral-950 p-6">
            <MarkdownPreview content={body} dark />
          </div>
        </div>
      </div>
    </form>
  );
}
