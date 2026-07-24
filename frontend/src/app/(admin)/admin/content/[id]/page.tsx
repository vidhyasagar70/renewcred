"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminContentById, clearSelectedItem } from '@/store/slices/contentSlice';
import ContentEditorForm from '@/components/ContentEditorForm';

export default function AdminEditContentPage() {
  const params = useParams();
  const id     = params.id as string;
  const dispatch = useAppDispatch();
  const { selectedItem, isLoading, error } = useAppSelector((s) => s.content);

  useEffect(() => {
    if (id) dispatch(fetchAdminContentById(id));
    return () => { dispatch(clearSelectedItem()); };
  }, [dispatch, id]);

  if (isLoading && !selectedItem) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin border-2 border-black border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-neutral-400">Loading article…</p>
        </div>
      </div>
    );
  }

  if (error && !selectedItem) {
    return (
      <div className="border border-black p-8 shadow-hard max-w-md">
        <p className="label-xs text-neutral-400 mb-2">Error</p>
        <h2 className="font-sans text-xl font-black text-black mb-2">Failed to Load</h2>
        <p className="text-sm text-neutral-500 mb-5">{error}</p>
        <button
          onClick={() => dispatch(fetchAdminContentById(id))}
          className="btn-primary text-xs"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <ContentEditorForm initialData={selectedItem} isEdit />
    </div>
  );
}
