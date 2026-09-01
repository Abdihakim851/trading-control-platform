import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../utils/auth';
import logger from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/community/spaces:
 *   get:
 *     summary: Get trading spaces (community feature)
 */

router.get('/spaces', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { data: spaces, error } = await supabase
      .from('trading_spaces')
      .select('*, members:trading_space_members(count)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({ spaces });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spaces' });
  }
});

router.post('/spaces', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, description, is_private } = req.body;
    
    const { data, error } = await supabase
      .from('trading_spaces')
      .insert({
        creator_id: userId,
        name,
        description,
        is_private: is_private || false,
        created_at: new Date()
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json({ message: 'Space created', space: data[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create space' });
  }
});

router.get('/spaces/:id/posts', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { data: posts, error } = await supabase
      .from('community_posts')
      .select('*')
      .eq('space_id', id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/spaces/:id/posts', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id: space_id } = req.params;
    const { content, trade_data } = req.body;
    
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        space_id,
        author_id: userId,
        content,
        trade_data,
        created_at: new Date()
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json({ message: 'Post created', post: data[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

export default router;
