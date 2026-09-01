import { Router, Request, Response } from 'express';
import { supabase } from '../index';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import logger from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Register in Supabase
    const { data, error } = await supabase.auth.signUpWithPassword({
      email,
      password
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    const userId = data.user?.id;
    
    // Create user profile
    await supabase.from('users').insert({
      id: userId,
      email,
      name,
      created_at: new Date()
    });
    
    const token = generateToken(userId!);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: userId, email, name },
      token
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const userId = data.user?.id;
    const token = generateToken(userId!);
    
    res.json({
      message: 'Login successful',
      user: { id: userId, email },
      token
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
