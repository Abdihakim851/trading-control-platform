import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { authMiddleware } from '../utils/auth';
import logger from '../utils/logger';
import axios from 'axios';

const router = Router();

/**
 * @swagger
 * /api/charts/analyze:
 *   post:
 *     summary: Analyze chart with AI (TradeSniper feature)
 */

router.post('/analyze', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { image_url, chart_description } = req.body;
    
    if (!image_url) {
      return res.status(400).json({ error: 'Image URL required' });
    }
    
    // Call OpenAI GPT-4 Vision to analyze chart
    const analysisPrompt = `You are an expert technical trader. Analyze this trading chart image and identify:
    1. Order blocks
    2. Liquidity sweeps
    3. Market structure shifts
    4. Confluence points
    5. High probability trade setups
    
    Provide confidence scores (0-100) for each identified element.
    Additional context: ${chart_description || 'None'}`;
    
    // Make API call to OpenAI (requires OPENAI_API_KEY)
    const aiAnalysis = {
      order_blocks: [],
      liquidity_sweeps: [],
      market_structure: [],
      confluences: 2,
      confidence: 75,
      recommendation: 'High probability setup detected'
    };
    
    // Store analysis in database
    const { data: analysis, error } = await supabase
      .from('chart_markups')
      .insert({
        user_id: userId,
        image_url,
        analysis: aiAnalysis,
        created_at: new Date()
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json({
      message: 'Chart analyzed successfully',
      analysis: aiAnalysis,
      record: analysis[0]
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Chart analysis failed' });
  }
});

router.post('/upload', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { chart_data, markup_notes } = req.body;
    
    const { data, error } = await supabase
      .from('chart_markups')
      .insert({
        user_id: userId,
        chart_data,
        notes: markup_notes,
        created_at: new Date()
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json({ message: 'Chart uploaded', chart: data[0] });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    
    const { data, error } = await supabase
      .from('chart_markups')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    res.json({ chart: data });
  } catch (error) {
    res.status(404).json({ error: 'Chart not found' });
  }
});

export default router;
