import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../utils/auth';
import logger from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/backtest/run:
 *   post:
 *     summary: Run backtest on strategy (TradeZella feature)
 */

router.post('/run', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { strategy_code, symbol, start_date, end_date, initial_capital } = req.body;
    
    // Simulate backtest (in production, use real backtesting library)
    const backtestResults = {
      total_trades: Math.floor(Math.random() * 100) + 10,
      winning_trades: Math.floor(Math.random() * 50) + 5,
      losing_trades: Math.floor(Math.random() * 50) + 5,
      profit_factor: (Math.random() * 2 + 1).toFixed(2),
      max_drawdown: (Math.random() * 20 + 5).toFixed(2),
      roi: (Math.random() * 100 + 10).toFixed(2),
      win_rate: (Math.random() * 60 + 30).toFixed(2),
      avg_win: (Math.random() * 500 + 100).toFixed(2),
      avg_loss: (Math.random() * 300 + 50).toFixed(2)
    };
    
    const { data, error } = await supabase
      .from('backtest_results')
      .insert({
        user_id: userId,
        symbol,
        strategy: strategy_code,
        start_date,
        end_date,
        initial_capital,
        results: backtestResults,
        created_at: new Date()
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json({
      message: 'Backtest completed',
      results: backtestResults,
      backtest: data[0]
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Backtest failed' });
  }
});

router.get('/results/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    
    const { data, error } = await supabase
      .from('backtest_results')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    res.json({ results: data });
  } catch (error) {
    res.status(404).json({ error: 'Backtest not found' });
  }
});

router.post('/compare', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { backtest_ids } = req.body;
    
    const { data: results, error } = await supabase
      .from('backtest_results')
      .select('*')
      .in('id', backtest_ids)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    res.json({ comparison: results });
  } catch (error) {
    res.status(500).json({ error: 'Comparison failed' });
  }
});

export default router;
