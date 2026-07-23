import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types';

// ── Initial state ─────────────────────────────────────────────────────────────
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ── Async thunks (implement API calls in /services) ───────────────────────────

export const loginUser = createAsyncThunk<
  { user: User; token: string },
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (_credentials, { rejectWithValue }) => {
  try {
    // TODO: call authService.login(_credentials) when service layer is built
    return rejectWithValue('Not implemented yet');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  { user: User; token: string },
  RegisterCredentials,
  { rejectValue: string }
>('auth/register', async (_credentials, { rejectWithValue }) => {
  try {
    // TODO: call authService.register(_credentials) when service layer is built
    return rejectWithValue('Not implemented yet');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  // TODO: call authService.logout() to invalidate server-side session
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

    // ── logoutUser ─────────────────────────────────────────────────────────
    builder.addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { setCredentials, clearError } = authSlice.actions;
export default authSlice.reducer;
