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
    if (slug) {
      dispatch(fetchContentBySlug(slug));
    }
    return () => {
      dispatch(clearSelectedItem());
    };
  }, [dispatch, slug]);

  if (isLoading && !selectedItem) {
    return (
      <div className="bg-gray-950 flex h-screen items-center justify-center text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm">Fetching article content...</span>
        </div>
      </div>
    );
  }

  if (error && !selectedItem) {
    return (
      <div className="bg-gray-950 min-h-screen py-24 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-400">
          <h3 className="text-lg font-bold">Article Not Found</h3>
          <p className="mt-2 text-sm">{error}</p>
          <div className="mt-6">
            <Link
              href="/articles"
              className="rounded-lg bg-red-500/20 px-5 py-2.5 text-xs font-bold hover:bg-red-500/30 text-white"
            >
              ← Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedItem) return null;

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <Link 
          href="/articles" 
          className="inline-flex items-center text-sm font-semibold text-primary-400 hover:text-primary-350 transition-colors mb-8"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Articles
        </Link>

        {/* Article Meta Header */}
        <header className="space-y-4 border-b border-gray-900 pb-8 mb-10">
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary-950 text-primary-400 border border-primary-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider">
              {selectedItem.category}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {selectedItem.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-3xl">
            {selectedItem.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2">
            <div className="flex items-center gap-2 border-r border-gray-800 pr-4">
              <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white uppercase text-[10px]">
                {typeof selectedItem.author === 'object' ? selectedItem.author.name.slice(0,2) : 'AD'}
              </div>
              <span className="font-semibold text-gray-300">
                {typeof selectedItem.author === 'object' ? selectedItem.author.name : 'Admin'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>{new Date(selectedItem.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Rich Article Content */}
        <article className="prose prose-invert max-w-none">
          <MarkdownPreview content={selectedItem.body || ''} />
        </article>

      </div>
    </div>
  );
}
