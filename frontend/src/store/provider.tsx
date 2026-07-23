'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

interface StoreProviderProps {
  children: React.ReactNode;
}

/**
 * Client-side Redux Provider wrapper for use in the Next.js App Router.
 * Must be used inside a Server Component layout that renders the children
 * as client components.
 *
 * Usage:
 *   <StoreProvider>
 *     {children}
 *   </StoreProvider>
 */
export function StoreProvider({ children }: StoreProviderProps) {
  // Use a ref to ensure the store instance is stable across re-renders
  // when used inside the RSC/Client boundary
  const storeRef = useRef(store);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
