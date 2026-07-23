import apiClient from './apiClient';
import type { ApiResponse, User, LoginCredentials, RegisterCredentials } from '@/types';

/**
 * Auth service — wraps all /api/auth calls.
 * Wire these methods into the Redux async thunks in authSlice.ts.
 */
const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string }> {
    const { data } = await apiClient.post<
      ApiResponse<{ user: User; token: string }>
    >('/auth/login', credentials);
    return data.data!;
  },

  async register(
    credentials: RegisterCredentials
  ): Promise<{ user: User; token: string }> {
    const { data } = await apiClient.post<
      ApiResponse<{ user: User; token: string }>
    >('/auth/register', credentials);
    return data.data!;
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
    return data.data!;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};

export default authService;
