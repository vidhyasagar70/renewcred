"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminContentById, clearSelectedItem } from '@/store/slices/contentSlice';
import ContentEditorForm from '@/components/ContentEditorForm';

export default function AdminEditContentPage() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { selectedItem, isLoading, error } = useAppSelector((state) => state.content);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminContentById(id));
    }
    return () => {
      dispatch(clearSelectedItem());
    };
  }, [dispatch, id]);

  if (isLoading && !selectedItem) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-400">
        <svg className="mr-3 h-6 w-6 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading article details...
      </div>
    );
  }

  if (error && !selectedItem) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6 text-red-400">
        <h3 className="text-lg font-bold">Error Loading Article</h3>
        <p className="mt-2 text-sm">{error}</p>
        <button
          onClick={() => dispatch(fetchAdminContentById(id))}
          className="mt-4 rounded bg-red-600/30 hover:bg-red-600/50 border border-red-500/30 px-4 py-2 text-xs font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <ContentEditorForm initialData={selectedItem} isEdit={true} />
    </div>
  );
}
