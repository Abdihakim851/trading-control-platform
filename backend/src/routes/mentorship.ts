import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../utils/auth';
import logger from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/mentorship/request:
 *   post:
 *     summary: Request mentorship (TradeZella feature)
 */

router.post('/request', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { mentor_id, message } = req.body;
    
    if (!mentor_id) {
      return res.status(400).json({ error: 'Mentor ID required' });
    }
    
    const { data, error } = await supabase
      .from('mentorships')
      .insert({
        mentee_id: userId,
        mentor_id,
        message,
        status: 'pending',
        requested_at: new Date()
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json({ message: 'Mentorship request sent', request: data[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send request' });
  }
});

router.get('/requests', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const { data: requests, error } = await supabase
      .from('mentorships')
      .select('*')
      .eq('mentor_id', userId)
      .eq('status', 'pending');
    
    if (error) throw error;
    
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

router.post('/accept/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    
    const { data, error } = await supabase
      .from('mentorships')
      .update({ status: 'active', accepted_at: new Date() })
      .eq('id', id)
      .eq('mentor_id', userId)
      .select();
    
    if (error) throw error;
    
    res.json({ message: 'Mentorship request accepted', mentorship: data[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

export default router;
