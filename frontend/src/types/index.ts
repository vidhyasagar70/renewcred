// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// ─── Content ──────────────────────────────────────────────────────────────────

export type ContentStatus = 'draft' | 'published' | 'archived';
export type ContentType = 'article' | 'page' | 'media';

export interface Content {
  _id: string;
  title: string;
  slug: string;
  type: ContentType;
  status: ContentStatus;
  body?: string;
  excerpt?: string;
  tags: string[];
  author: User | string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentFilters {
  status: ContentStatus | 'all';
  type: ContentType | 'all';
  search: string;
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ContentState {
  items: Content[];
  selectedItem: Content | null;
  isLoading: boolean;
  error: string | null;
  pagination: Pagination;
  filters: ContentFilters;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}
