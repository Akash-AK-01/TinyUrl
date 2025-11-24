import express from 'express';
import {
  createLink,
  getLinkByCode,
  getAllLinks,
  deleteLinkByCode,
  codeExists
} from '../models/Link.js';
import { validateCreateLink } from '../middleware/validation.js';

const router = express.Router();

/**
 * POST /api/links
 * Create a new short link
 */
router.post('/', validateCreateLink, async (req, res, next) => {
  try {
    const { target_url, code } = req.body;
    
    // Check if custom code already exists
    if (code) {
      const exists = await codeExists(code);
      if (exists) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    }
    
    const link = await createLink(target_url, code);
    
    res.status(201).json({
      code: link.code,
      target_url: link.target_url,
      total_clicks: link.total_clicks,
      last_clicked: link.last_clicked,
      created_at: link.created_at
    });
  } catch (error) {
    // Handle Prisma unique constraint violation (duplicate code)
    if (error.code === 'DUPLICATE_CODE' || error.code === 'P2002') {
      return res.status(409).json({ error: 'Code already exists' });
    }
    next(error);
  }
});

/**
 * GET /api/links
 * Get all links
 */
router.get('/', async (req, res, next) => {
  try {
    const links = await getAllLinks();
    
    res.json(links.map(link => ({
      code: link.code,
      target_url: link.target_url,
      total_clicks: link.total_clicks,
      last_clicked: link.last_clicked,
      created_at: link.created_at
    })));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/links/:code
 * Get stats for a specific link
 */
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const link = await getLinkByCode(code);
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json({
      code: link.code,
      target_url: link.target_url,
      total_clicks: link.total_clicks,
      last_clicked: link.last_clicked,
      created_at: link.created_at
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/links/:code
 * Delete a link
 */
router.delete('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const link = await deleteLinkByCode(code);
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.status(200).json({ message: 'Link deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;


