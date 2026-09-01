import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../utils/auth';
import logger from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/trades:
 *   get:
 *     summary: Get all trades for user
 *   post:
 *     summary: Create new trade
 */

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('entry_time', { ascending: false });
    
    if (error) throw error;
    
    res.json({ trades: data });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { symbol, entry_price, exit_price, quantity, setup_type, notes, confidence } = req.body;
    
    const profit = (exit_price - entry_price) * quantity;
    const pnl_percentage = ((exit_price - entry_price) / entry_price) * 100;
    
    const { data, error } = await supabase
      .from('trades')
      .insert({
        user_id: userId,
        symbol,
        entry_price,
        exit_price,
        quantity,
        profit,
        pnl_percentage,
        setup_type,
        notes,
        confidence,
        entry_time: new Date(),
        status: 'closed'
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json({ message: 'Trade created', trade: data[0] });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Failed to create trade' });
  }
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    res.json({ trade: data });
  } catch (error) {
    res.status(404).json({ error: 'Trade not found' });
  }
});

export default router;
