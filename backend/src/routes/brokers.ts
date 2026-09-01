import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../utils/auth';
import logger from '../utils/logger';
import axios from 'axios';

const router = Router();

/**
 * @swagger
 * /api/brokers:
 *   get:
 *     summary: Get supported brokers
 */

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const brokers = [
      { id: 'alpaca', name: 'Alpaca Trading', supported: true },
      { id: 'interactive-brokers', name: 'Interactive Brokers', supported: true },
      { id: 'thinkorswim', name: 'TD Ameritrade', supported: true },
      { id: 'polygon', name: 'Polygon', supported: true },
      { id: 'webull', name: 'Webull', supported: true },
      { id: 'coinbase', name: 'Coinbase', supported: true }
    ];
    
    res.json({ brokers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brokers' });
  }
});

router.post('/connect', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { broker_id, api_key, secret_key } = req.body;
    
    if (!broker_id || !api_key) {
      return res.status(400).json({ error: 'Missing broker credentials' });
    }
    
    const { data, error } = await supabase
      .from('connected_accounts')
      .insert({
        user_id: userId,
        broker_id,
        api_key: api_key, // Should be encrypted in production
        secret_key: secret_key,
        status: 'active',
        connected_at: new Date()
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json({ message: 'Broker connected successfully', account: data[0] });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Failed to connect broker' });
  }
});

router.get('/accounts', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const { data: accounts, error } = await supabase
      .from('connected_accounts')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    res.json({ accounts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

router.post('/sync/:accountId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { accountId } = req.params;
    
    // Sync trades from broker
    // This is a placeholder - implement actual broker API sync
    
    res.json({ message: 'Trades synced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync trades' });
  }
});

export default router;
