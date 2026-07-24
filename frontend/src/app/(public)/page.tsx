"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContent } from '@/store/slices/contentSlice';
import Link from 'next/link';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchContent({ status: 'published' }));
  }, [dispatch]);

  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-3xl">
            <p className="label-xs mb-6">Headless Content Platform</p>
            <h1 className="font-sans text-5xl sm:text-7xl font-black text-black leading-none tracking-tighter">
              Content,<br />
              <span className="font-serif italic font-normal">rendered precisely.</span>
            </h1>
            <p className="mt-8 text-lg text-neutral-500 leading-relaxed max-w-xl font-sans">
              A production-ready headless CMS. Write rich Markdown, mathematical equations, and nested
              documentation — published instantly to your public site.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/articles" className="btn-primary text-sm px-8 py-3">
                Browse Articles →
              </Link>
              <Link href="/admin/login" className="btn-secondary text-sm px-8 py-3">
                Admin Console
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Articles ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-baseline justify-between border-b border-black pb-4 mb-12">
          <h2 className="font-sans text-2xl font-black tracking-tight text-black uppercase">
            Latest Articles
          </h2>
          <Link href="/articles" className="text-xs font-semibold text-neutral-500 hover:text-black transition-colors uppercase tracking-widest">
            View All →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin border-2 border-black border-t-transparent" />
          </div>
        ) : error ? (
          <div className="border border-black p-6">
            <p className="text-sm font-semibold text-black">Failed to load articles.</p>
            <p className="text-xs text-neutral-500 mt-1">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-neutral-300 py-20 text-center">
            <p className="text-sm text-neutral-400">
              No published articles yet.{' '}
              <Link href="/admin/login" className="underline text-black">
                Sign in to create one →
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-px bg-neutral-200 border border-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 6).map((item) => (
              <article
                key={item._id}
                className="flex flex-col bg-white p-8 group transition-all hover:-translate-y-0.5 hover:shadow-hard duration-150"
              >
                {/* Category */}
                <p className="label-xs text-neutral-400 mb-4">{item.category}</p>

                {/* Title */}
                <h3 className="font-sans text-xl font-bold text-black leading-snug mb-3 group-hover:underline underline-offset-2">
                  <Link href={`/content/${item.slug}`}>{item.title}</Link>
                </h3>

                {/* Summary */}
                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 font-sans flex-1">
                  {item.summary}
                </p>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
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
      </section>

      {/* ── CTA Strip ────────────────────────────────────────────────────── */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-sans text-2xl font-black text-black">Ready to publish?</h2>
            <p className="text-sm text-neutral-500 mt-1">Sign in to the admin console and start creating.</p>
          </div>
          <Link href="/admin/login" className="btn-primary text-sm px-8 py-3 shrink-0">
            Go to Admin Console →
          </Link>
        </div>
      </section>

    </div>
  );
}
