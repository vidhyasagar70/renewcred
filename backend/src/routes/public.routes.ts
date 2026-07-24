import { Router } from 'express';
import { getPublicContent, getPublicContentBySlug } from '../controllers/content.controller';

const router = Router();

// GET /api/v1/public/content
router.get('/content', getPublicContent);

// GET /api/v1/public/content/:slug
router.get('/content/:slug', getPublicContentBySlug);

export default router;
