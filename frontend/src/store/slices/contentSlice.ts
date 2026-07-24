import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Content, ContentState, ContentFilters } from '@/types';
import contentService from '@/services/contentService';

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
  stats: {
    total: 0,
    published: 0,
    drafts: 0,
  },
};

// ── Async thunks ──────────────────────────────────────────────────────────────

export const fetchContent = createAsyncThunk<
  { items: Content[]; total: number; totalPages: number },
  ContentFilters | undefined,
  { rejectValue: string }
>('content/fetchAll', async (filters, { rejectWithValue }) => {
  try {
    return await contentService.getPublicList(filters);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch content';
    return rejectWithValue(message);
  }
});

export const fetchContentBySlug = createAsyncThunk<
  Content,
  string,
  { rejectValue: string }
>('content/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    return await contentService.getPublicBySlug(slug);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch content item';
    return rejectWithValue(message);
  }
});

export const fetchAdminContent = createAsyncThunk<
  { items: Content[]; total: number; totalPages: number },
  ContentFilters | undefined,
  { rejectValue: string }
>('content/fetchAdminAll', async (filters, { rejectWithValue }) => {
  try {
    return await contentService.adminGetAll(filters);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch admin content';
    return rejectWithValue(message);
  }
});

export const fetchAdminContentById = createAsyncThunk<
  Content,
  string,
  { rejectValue: string }
>('content/fetchAdminById', async (id, { rejectWithValue }) => {
  try {
    return await contentService.adminGetById(id);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch admin details';
    return rejectWithValue(message);
  }
});

export const createContent = createAsyncThunk<
  Content,
  Partial<Content>,
  { rejectValue: string }
>('content/create', async (data, { rejectWithValue }) => {
  try {
    return await contentService.adminCreate(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create content';
    return rejectWithValue(message);
  }
});

export const updateContent = createAsyncThunk<
  Content,
  { id: string; data: Partial<Content> },
  { rejectValue: string }
>('content/update', async (args, { rejectWithValue }) => {
  try {
    return await contentService.adminUpdate(args.id, args.data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update content';
    return rejectWithValue(message);
  }
});

export const deleteContent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('content/delete', async (id, { rejectWithValue }) => {
  try {
    await contentService.adminDelete(id);
    return id;
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

    // ── fetchContentBySlug ─────────────────────────────────────────────────
    builder
      .addCase(fetchContentBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContentBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchContentBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'An unexpected error occurred';
      });

    // ── fetchAdminContent ──────────────────────────────────────────────────
    builder
      .addCase(fetchAdminContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminContent.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.pagination.total = action.payload.total;
        state.pagination.totalPages = action.payload.totalPages;
        state.stats = action.payload.stats || state.stats;
      })
      .addCase(fetchAdminContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'An unexpected error occurred';
      });

    // ── fetchAdminContentById ──────────────────────────────────────────────
    builder
      .addCase(fetchAdminContentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminContentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchAdminContentById.rejected, (state, action) => {
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

