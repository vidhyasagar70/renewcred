"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownPreviewProps {
  content: string;
  /** When true, applies dark background (editor preview pane) */
  dark?: boolean;
}

export default function MarkdownPreview({ content, dark = false }: MarkdownPreviewProps) {
  if (dark) {
    // Admin editor preview — dark surface, invert table headers
    return (
      <div className="prose prose-sm max-w-none
        prose-headings:font-sans prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
        prose-p:font-sans prose-p:text-neutral-200 prose-p:leading-relaxed
        prose-strong:text-white prose-strong:font-bold
        prose-a:text-white prose-a:underline prose-a:underline-offset-2
        prose-li:text-neutral-200 prose-li:font-sans
        prose-blockquote:border-l-2 prose-blockquote:border-white prose-blockquote:text-neutral-300 prose-blockquote:italic
        prose-code:bg-neutral-800 prose-code:text-white prose-code:text-xs prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-none prose-code:border prose-code:border-neutral-600
        prose-pre:bg-black prose-pre:text-white prose-pre:border prose-pre:border-neutral-700 prose-pre:rounded-none
        prose-table:w-full prose-table:border-collapse
        prose-thead:bg-white prose-th:text-black prose-th:border prose-th:border-neutral-500 prose-th:p-2.5 prose-th:text-xs prose-th:font-bold prose-th:uppercase prose-th:tracking-wide
        prose-td:border prose-td:border-neutral-700 prose-td:p-2.5 prose-td:text-neutral-300 prose-td:text-sm
        prose-hr:border-neutral-700">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {content || '*Start writing in the editor pane. Markdown, tables and LaTeX equations (e.g. $E = mc^2$) will render here in real time.*'}
        </ReactMarkdown>
      </div>
    );
  }

  // Public page — white surface, high-contrast editorial typography
  return (
    <div className="prose prose-neutral max-w-none
      prose-headings:font-sans prose-headings:font-black prose-headings:text-black prose-headings:tracking-tight prose-headings:leading-tight
      prose-h1:text-4xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-neutral-200 prose-h2:pb-2
      prose-p:font-serif prose-p:text-neutral-700 prose-p:leading-relaxed prose-p:text-[1.0625rem]
      prose-strong:text-black prose-strong:font-bold
      prose-a:text-black prose-a:underline prose-a:underline-offset-3 prose-a:decoration-neutral-400 hover:prose-a:decoration-black
      prose-li:font-sans prose-li:text-neutral-700 prose-li:text-sm
      prose-ul:my-4 prose-ol:my-4
      prose-blockquote:border-l-[3px] prose-blockquote:border-black prose-blockquote:bg-neutral-50 prose-blockquote:py-2 prose-blockquote:pl-4 prose-blockquote:text-neutral-600 prose-blockquote:italic prose-blockquote:not-italic
      prose-code:bg-neutral-100 prose-code:text-black prose-code:text-xs prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-none prose-code:border prose-code:border-neutral-200 prose-code:font-mono
      prose-pre:bg-black prose-pre:text-neutral-100 prose-pre:border prose-pre:border-black prose-pre:rounded-none prose-pre:shadow-hard-sm
      prose-table:w-full prose-table:border-collapse prose-table:text-sm
      prose-thead:bg-black
      prose-th:text-white prose-th:border prose-th:border-black prose-th:px-4 prose-th:py-3 prose-th:text-xs prose-th:font-bold prose-th:uppercase prose-th:tracking-widest prose-th:text-left
      prose-td:border prose-td:border-neutral-200 prose-td:px-4 prose-td:py-3 prose-td:text-neutral-700 prose-td:align-top
      prose-hr:border-neutral-200 prose-hr:my-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}
