import { Schema, model, Document, Types } from 'mongoose';

export type ContentStatus = 'draft' | 'published' | 'archived';
export type ContentType = 'article' | 'page' | 'media';

export interface IContent extends Document {
  title: string;
  slug: string;
  type: ContentType;
  status: ContentStatus;
  body?: string;
  excerpt?: string;
  tags: string[];
  author: Types.ObjectId;
  publishedAt?: Date;
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
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },
    type: {
      type: String,
      enum: ['article', 'page', 'media'] as ContentType[],
      default: 'article',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'] as ContentStatus[],
      default: 'draft',
    },
    body: {
      type: String,
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    publishedAt: {
      type: Date,
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

// ── Indexes ───────────────────────────────────────────────────────────────────
ContentSchema.index({ status: 1 });
ContentSchema.index({ type: 1 });
ContentSchema.index({ author: 1 });
ContentSchema.index({ tags: 1 });
ContentSchema.index({ createdAt: -1 });

export const Content = model<IContent>('Content', ContentSchema);
