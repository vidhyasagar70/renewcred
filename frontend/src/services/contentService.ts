import apiClient from './apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  Content,
  ContentFilters,
} from '@/types';

/**
 * Content service — wraps all public and admin content calls.
 * Wire these methods into the Redux async thunks in contentSlice.ts.
 */
const contentService = {
  // ── Public Routes ──────────────────────────────────────────────────────────
  async getPublicList(filters?: Partial<ContentFilters>): Promise<{
    items: Content[];
    total: number;
    totalPages: number;
  }> {
    const params: any = { ...filters };
    if (filters?.type && filters.type !== 'all') {
      params.category = filters.type;
    }
    delete params.type;

    const { data } = await apiClient.get<PaginatedResponse<Content>>(
      '/public/content',
      { params }
    );
    return {
      items: data.data ?? [],
      total: data.pagination.total,
      totalPages: data.pagination.totalPages,
    };
  },

  async getPublicBySlug(slug: string): Promise<Content> {
    const { data } = await apiClient.get<ApiResponse<Content>>(
      `/public/content/${slug}`
    );
    return data.data!;
  },

  // ── Admin Routes ───────────────────────────────────────────────────────────
  async adminGetAll(filters?: Partial<ContentFilters>): Promise<{
    items: Content[];
    total: number;
    totalPages: number;
    stats?: { total: number; published: number; drafts: number };
  }> {
    const params: any = { ...filters };
    if (filters?.type && filters.type !== 'all') {
      params.category = filters.type;
    }
    delete params.type;

    const { data } = await apiClient.get<any>(
      '/admin/content',
      { params }
    );
    return {
      items: data.data ?? [],
      total: data.pagination.total,
      totalPages: data.pagination.totalPages,
      stats: data.stats,
    };
  },

  async adminGetById(id: string): Promise<Content> {
    const { data } = await apiClient.get<ApiResponse<Content>>(
      `/admin/content/${id}`
    );
    return data.data!;
  },


  async adminCreate(payload: Partial<Content>): Promise<Content> {
    const { data } = await apiClient.post<ApiResponse<Content>>(
      '/admin/content',
      payload
    );
    return data.data!;
  },

  async adminUpdate(id: string, payload: Partial<Content>): Promise<Content> {
    const { data } = await apiClient.put<ApiResponse<Content>>(
      `/admin/content/${id}`,
      payload
    );
    return data.data!;
  },

  async adminDelete(id: string): Promise<void> {
    await apiClient.delete(`/admin/content/${id}`);
  },
};

export default contentService;

