import { Router } from 'express';
import {
  adminGetAllContent,
  adminCreateContent,
  adminUpdateContent,
  adminDeleteContent,
  adminGetContentById,
} from '../controllers/content.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// Apply admin protection to all routes in this router
router.use(authenticate);
router.use(authorize('admin'));

// GET    /api/v1/admin/content/      — Fetch all items (drafts + published)
router.get('/', adminGetAllContent);

// GET    /api/v1/admin/content/:id   — Fetch single item by ID
router.get('/:id', adminGetContentById);

// POST   /api/v1/admin/content/      — Create a new content block
router.post('/', adminCreateContent);

// PUT    /api/v1/admin/content/:id  — Update content block
router.put('/:id', adminUpdateContent);

// DELETE /api/v1/admin/content/:id  — Delete content block
router.delete('/:id', adminDeleteContent);

export default router;

