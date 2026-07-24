"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContentBySlug, clearSelectedItem } from '@/store/slices/contentSlice';
import MarkdownPreview from '@/components/MarkdownPreview';
import Link from 'next/link';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useAppDispatch();
  const { selectedItem, isLoading, error } = useAppSelector((state) => state.content);

  useEffect(() => {
    if (slug) dispatch(fetchContentBySlug(slug));
    return () => { dispatch(clearSelectedItem()); };
  }, [dispatch, slug]);

  /* ── Loading ────────────────────────────────────────────────────────── */
  if (isLoading && !selectedItem) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin border-2 border-black border-t-transparent" />
          <span className="text-xs text-neutral-400 font-sans tracking-widest uppercase">Loading…</span>
        </div>
      </div>
    );
  }

  /* ── Error ──────────────────────────────────────────────────────────── */
  if (error && !selectedItem) {
    return (
      <div className="min-h-[60vh] bg-white flex items-center justify-center px-6">
        <div className="max-w-sm w-full border border-black p-8 shadow-hard">
          <p className="label-xs mb-3 text-neutral-400">Error</p>
          <h2 className="font-sans text-2xl font-black text-black mb-2">Article Not Found</h2>
          <p className="text-sm text-neutral-500 mb-6">{error}</p>
          <Link href="/articles" className="btn-secondary text-xs">
            ← Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  if (!selectedItem) return null;

  return (
    <div className="bg-white">

      {/* ── Article Header ────────────────────────────────────────────── */}
      <div className="border-b border-neutral-200">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">

          {/* Back link */}
          <Link
            href="/articles"
            className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors mb-10"
          >
            ← Back to Articles
          </Link>

          {/* Category + status */}
          <div className="flex items-center gap-3 mb-6">
            <span className="label-xs text-neutral-500">{selectedItem.category}</span>
            {selectedItem.status === 'published' && (
              <span className="badge-published text-[10px]">Published</span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-sans text-4xl sm:text-5xl font-black text-black leading-tight tracking-tighter">
            {selectedItem.title}
          </h1>

          {/* Summary */}
          <p className="mt-5 text-lg text-neutral-500 leading-relaxed font-sans max-w-2xl">
            {selectedItem.summary}
          </p>

          {/* Meta */}
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-neutral-400 font-sans">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-black flex items-center justify-center text-white text-[10px] font-bold uppercase">
                {typeof selectedItem.author === 'object' ? selectedItem.author.name.slice(0, 2) : 'AU'}
              </div>
              <span className="font-medium text-neutral-700">
                {typeof selectedItem.author === 'object' ? selectedItem.author.name : 'Author'}
              </span>
            </div>
            <span>
              {new Date(selectedItem.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* ── Article Body ──────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <article>
          <MarkdownPreview content={selectedItem.body || ''} />
        </article>

        {/* End divider */}
        <div className="mt-20 pt-8 border-t border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-neutral-400 font-sans uppercase tracking-widest">End of Article</p>
          <Link href="/articles" className="btn-secondary text-xs px-6 py-2">
            ← Back to Articles
          </Link>
        </div>
      </div>

    </div>
  );
}
