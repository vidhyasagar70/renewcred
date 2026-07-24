import { Request, Response, NextFunction } from 'express';
import { Content, ContentStatus } from '../models/Content.model';

// ── PUBLIC CONTENT CONTROLLERS ──────────────────────────────────────────────

/**
 * Fetch all published content blocks with optional category filtering and pagination.
 */
export const getPublicContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '10', 10);
    const category = req.query.category as string;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { status: 'published' };
    if (category && category !== 'all') {
      query.category = category;
    }

    const total = await Content.countDocuments(query);
    const items = await Content.find(query)
      .populate('author', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch a single published content item by slug.
 */
export const getPublicContentBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const content = await Content.findOne({ slug, status: 'published' })
      .populate('author', 'name email role');

    if (!content) {
      res.status(404).json({ success: false, message: 'Content not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

// ── ADMIN CMS CONTROLLERS ───────────────────────────────────────────────────

/**
 * Fetch all content items (drafts + published) with pagination, category/status filtering, and search.
 */
export const adminGetAllContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '10', 10);
    const status = req.query.status as string;
    const category = req.query.category as string;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Content.countDocuments(query);
    const items = await Content.find(query)
      .populate('author', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Dynamic stats computation for the whole database
    const totalArticles = await Content.countDocuments({});
    const publishedArticles = await Content.countDocuments({ status: 'published' });
    const draftArticles = await Content.countDocuments({ status: 'draft' });

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: totalArticles,
        published: publishedArticles,
        drafts: draftArticles,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new content block.
 */
export const adminCreateContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, category, status, summary, body, slug } = req.body;
    
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorised' });
      return;
    }

    const newContent = new Content({
      title,
      category,
      status: status || 'draft',
      summary,
      body,
      slug, // Hook will auto-generate if empty
      author: req.user.id,
    });

    await newContent.save();
    
    const populated = await Content.findById(newContent._id).populate('author', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: populated,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Slug or Title already exists' });
      return;
    }
    next(error);
  }
};

/**
 * Update content block.
 */
export const adminUpdateContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, category, status, summary, body, slug } = req.body;

    const content = await Content.findById(id);
    if (!content) {
      res.status(404).json({ success: false, message: 'Content not found' });
      return;
    }

    content.title = title ?? content.title;
    content.category = category ?? content.category;
    content.status = (status as ContentStatus) ?? content.status;
    content.summary = summary ?? content.summary;
    content.body = body ?? content.body;
    if (slug !== undefined) {
      content.slug = slug;
    }

    await content.save();

    const populated = await Content.findById(content._id).populate('author', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: populated,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Slug or Title already exists' });
      return;
    }
    next(error);
  }
};

/**
 * Delete content block.
 */
export const adminDeleteContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const content = await Content.findByIdAndDelete(id);

    if (!content) {
      res.status(404).json({ success: false, message: 'Content not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully',
      data: id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch a single content item by ID (Admin only).
 */
export const adminGetContentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id).populate('author', 'name email role');

    if (!content) {
      res.status(404).json({ success: false, message: 'Content not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
};


