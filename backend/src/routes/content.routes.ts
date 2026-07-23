import { Router } from 'express';
import {
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
} from '../controllers/content.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// GET  /api/content         — public listing
router.get('/', getAllContent);

// GET  /api/content/:id     — public single item
router.get('/:id', getContentById);

// POST /api/content         — admin / editor only
router.post('/', authenticate, authorize('admin', 'editor'), createContent);

// PUT  /api/content/:id     — admin / editor only
router.put('/:id', authenticate, authorize('admin', 'editor'), updateContent);

// DELETE /api/content/:id   — admin only
router.delete('/:id', authenticate, authorize('admin'), deleteContent);

export default router;
