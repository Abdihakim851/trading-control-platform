import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import logger from './utils/logger';

// Routes
import authRoutes from './routes/auth';
import tradesRoutes from './routes/trades';
import analyticsRoutes from './routes/analytics';
import brokerRoutes from './routes/brokers';
import chartsRoutes from './routes/charts';
import backtestRoutes from './routes/backtest';
import communityRoutes from './routes/community';
import mentorshipRoutes from './routes/mentorship';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Swagger Documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trading Control Platform API',
      version: '1.0.0',
      description: 'Complete trading platform with TradeSniper & TradeZella features'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Initialize Supabase
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/brokers', brokerRoutes);
app.use('/api/charts', chartsRoutes);
app.use('/api/backtest', backtestRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/mentorship', mentorshipRoutes);

// 404 Handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});
