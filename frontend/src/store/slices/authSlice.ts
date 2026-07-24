import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types';
import authService from '@/services/authService';

// ── Initial state ─────────────────────────────────────────────────────────────
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ── Async thunks ──────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk<
  { user: User; token: string },
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cms_token', data.token);
    }
    return data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  { user: User; token: string },
  RegisterCredentials,
  { rejectValue: string }
>('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.register(credentials);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cms_token', data.token);
    }
    return data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout();
  } catch (err) {
    console.error('Logout error on server:', err);
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cms_token');
    }
  }
});

export const checkAuth = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('auth/check', async (_, { rejectWithValue }) => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('cms_token');
      if (!token) {
        return rejectWithValue('No session token found');
      }
    }
    const user = await authService.getMe();
    return user;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Session verification failed';
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cms_token');
    }
    return rejectWithValue(message);
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Manually set auth state (e.g. from persisted token on mount). */
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    /** Clear any current auth error. */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── loginUser ──────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'An unexpected error occurred';
      });

    // ── registerUser ───────────────────────────────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'An unexpected error occurred';
      });

    // ── checkAuth ──────────────────────────────────────────────────────────
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          state.token = localStorage.getItem('cms_token');
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    // ── logoutUser ─────────────────────────────────────────────────────────
    builder.addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { setCredentials, clearError } = authSlice.actions;
export default authSlice.reducer;

