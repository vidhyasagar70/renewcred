import apiClient from './apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  Content,
  ContentFilters,
} from '@/types';

/**
 * Content service — wraps all /api/content calls.
 * Wire these methods into the Redux async thunks in contentSlice.ts.
 */
const contentService = {
  async getAll(filters?: Partial<ContentFilters>): Promise<{
    items: Content[];
    total: number;
    totalPages: number;
  }> {
    const { data } = await apiClient.get<PaginatedResponse<Content>>(
      '/content',
      { params: filters }
    );
    return {
      items: data.data ?? [],
      total: data.pagination.total,
      totalPages: data.pagination.totalPages,
    };
  },

  async getById(id: string): Promise<Content> {
    const { data } = await apiClient.get<ApiResponse<Content>>(
      `/content/${id}`
    );
    return data.data!;
  },

  async create(payload: Partial<Content>): Promise<Content> {
    const { data } = await apiClient.post<ApiResponse<Content>>(
      '/content',
      payload
    );
    return data.data!;
  },

  async update(id: string, payload: Partial<Content>): Promise<Content> {
    const { data } = await apiClient.put<ApiResponse<Content>>(
      `/content/${id}`,
      payload
    );
    return data.data!;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/content/${id}`);
  },
};

export default contentService;
