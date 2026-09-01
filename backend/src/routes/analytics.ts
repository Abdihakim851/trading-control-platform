import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../utils/auth';
import logger from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get analytics dashboard data
 */

router.get('/dashboard', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const { data: trades } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId);
    
    if (!trades) return res.json({ dashboard: {} });
    
    const totalTrades = trades.length;
    const winningTrades = trades.filter((t: any) => t.profit > 0).length;
    const losingTrades = trades.filter((t: any) => t.profit < 0).length;
    const totalProfit = trades.reduce((sum: number, t: any) => sum + (t.profit || 0), 0);
    const avgWinSize = winningTrades > 0 
      ? trades.filter((t: any) => t.profit > 0).reduce((sum: number, t: any) => sum + t.profit, 0) / winningTrades
      : 0;
    const avgLossSize = losingTrades > 0
      ? Math.abs(trades.filter((t: any) => t.profit < 0).reduce((sum: number, t: any) => sum + t.profit, 0) / losingTrades)
      : 0;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100) : 0;
    const profitFactor = avgLossSize > 0 ? avgWinSize / avgLossSize : 0;
    
    res.json({
      dashboard: {
        totalTrades,
        winningTrades,
        losingTrades,
        totalProfit,
        avgWinSize,
        avgLossSize,
        winRate,
        profitFactor,
        trades
      }
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

router.get('/metrics', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { period = '7d' } = req.query;
    
    const { data: trades } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId);
    
    res.json({ metrics: { period, trades } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

router.get('/patterns', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const { data: patterns } = await supabase
      .from('trade_patterns')
      .select('*')
      .eq('user_id', userId);
    
    res.json({ patterns });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patterns' });
  }
});

router.get('/ai-insights', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const { data: insights } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI insights' });
  }
});

export default router;
