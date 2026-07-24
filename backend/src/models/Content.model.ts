import { Schema, model, Document, Types } from 'mongoose';
import { slugify } from '../utils/helpers';

export type ContentStatus = 'draft' | 'published';

export interface IContent extends Document {
  title: string;
  slug: string;
  category: string; // e.g., 'Documentation', 'Blog', 'Page'
  status: ContentStatus;
  summary: string;
  body: string; // Stores Markdown/JSON string supporting LaTeX, tables, nested lists, etc.
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'Blog',
    },
    status: {
      type: String,
      enum: ['draft', 'published'] as ContentStatus[],
      default: 'draft',
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      maxlength: [500, 'Summary cannot exceed 500 characters'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
      default: '',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        (ret as Record<string, unknown>).__v = undefined;
        return ret;
      },
    },
  }
);

// ── Pre-validate hook: auto-generate slug from title if empty ─────────────
ContentSchema.pre<IContent>('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title);
  }
  next();
});

// ── Indexes ───────────────────────────────────────────────────────────────────
ContentSchema.index({ status: 1 });
ContentSchema.index({ category: 1 });
ContentSchema.index({ author: 1 });
ContentSchema.index({ createdAt: -1 });
// Full-text search index for the admin search feature
ContentSchema.index({ title: 'text', summary: 'text', body: 'text' });

export const Content = model<IContent>('Content', ContentSchema);

