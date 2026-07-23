import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Content, ContentState, ContentFilters } from '@/types';

// ── Initial state ─────────────────────────────────────────────────────────────
const initialState: ContentState = {
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    status: 'all',
    type: 'all',
    search: '',
  },
};

// ── Async thunks (implement API calls in /services) ───────────────────────────

export const fetchContent = createAsyncThunk<
  { items: Content[]; total: number; totalPages: number },
  ContentFilters | undefined,
  { rejectValue: string }
>('content/fetchAll', async (_filters, { rejectWithValue }) => {
  try {
    // TODO: call contentService.getAll(_filters) when service layer is built
    return rejectWithValue('Not implemented yet');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch content';
    return rejectWithValue(message);
  }
});

export const fetchContentById = createAsyncThunk<
  Content,
  string,
  { rejectValue: string }
>('content/fetchById', async (_id, { rejectWithValue }) => {
  try {
    // TODO: call contentService.getById(_id)
    return rejectWithValue('Not implemented yet');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch content item';
    return rejectWithValue(message);
  }
});

export const createContent = createAsyncThunk<
  Content,
  Partial<Content>,
  { rejectValue: string }
>('content/create', async (_data, { rejectWithValue }) => {
  try {
    // TODO: call contentService.create(_data)
    return rejectWithValue('Not implemented yet');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create content';
    return rejectWithValue(message);
  }
});

export const updateContent = createAsyncThunk<
  Content,
  { id: string; data: Partial<Content> },
  { rejectValue: string }
>('content/update', async (_args, { rejectWithValue }) => {
  try {
    // TODO: call contentService.update(_args.id, _args.data)
    return rejectWithValue('Not implemented yet');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update content';
    return rejectWithValue(message);
  }
});

export const deleteContent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('content/delete', async (_id, { rejectWithValue }) => {
  try {
    // TODO: call contentService.delete(_id)
    return rejectWithValue('Not implemented yet');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete content';
    return rejectWithValue(message);
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────
const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<Content | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ContentFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchContent ───────────────────────────────────────────────────────
    builder
      .addCase(fetchContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.pagination.total = action.payload.total;
        state.pagination.totalPages = action.payload.totalPages;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'An unexpected error occurred';
      });

    // ── fetchContentById ───────────────────────────────────────────────────
    builder
      .addCase(fetchContentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchContentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'An unexpected error occurred';
      });

    // ── createContent ──────────────────────────────────────────────────────
    builder
      .addCase(createContent.pending, (state) => { state.isLoading = true; })
      .addCase(createContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'An unexpected error occurred';
      });

    // ── updateContent ──────────────────────────────────────────────────────
    builder
      .addCase(updateContent.pending, (state) => { state.isLoading = true; })
      .addCase(updateContent.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'An unexpected error occurred';
      });

    // ── deleteContent ──────────────────────────────────────────────────────
    builder
      .addCase(deleteContent.pending, (state) => { state.isLoading = true; })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((i) => i._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedItem?._id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'An unexpected error occurred';
      });
  },
});

export const { setSelectedItem, setFilters, setPage, clearError, clearSelectedItem } =
  contentSlice.actions;
export default contentSlice.reducer;
