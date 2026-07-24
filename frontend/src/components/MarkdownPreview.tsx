"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-primary-400 prose-strong:text-white prose-table:border-collapse prose-table:w-full prose-th:border prose-th:border-gray-800 prose-th:p-2.5 prose-td:border prose-td:border-gray-800 prose-td:p-2.5 prose-thead:bg-gray-900/60">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content || '*No content written yet. Use the editor on the left to write Markdown and LaTeX mathematical equations (e.g. $E = mc^2$).*'}
      </ReactMarkdown>
    </div>
  );
}
