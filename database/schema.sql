-- Supabase SQL Migration
-- Create all necessary tables for Trading Control Platform

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Connected Accounts (brokers)
CREATE TABLE connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  broker_id VARCHAR(100) NOT NULL,
  api_key VARCHAR(500) NOT NULL,
  secret_key VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  connected_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, broker_id)
);

-- Trades table
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(20) NOT NULL,
  entry_price DECIMAL(15,2) NOT NULL,
  exit_price DECIMAL(15,2) NOT NULL,
  quantity DECIMAL(15,2) NOT NULL,
  profit DECIMAL(15,2),
  pnl_percentage DECIMAL(10,2),
  setup_type VARCHAR(100),
  notes TEXT,
  confidence INTEGER,
  entry_time TIMESTAMP,
  status VARCHAR(50) DEFAULT 'closed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chart Markups
CREATE TABLE chart_markups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  chart_data JSONB,
  analysis JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Insights
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  insight_type VARCHAR(100),
  confidence INTEGER,
  recommendation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trade Patterns
CREATE TABLE trade_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pattern_type VARCHAR(100),
  description TEXT,
  success_rate DECIMAL(5,2),
  trade_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Backtest Results
CREATE TABLE backtest_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(20),
  strategy TEXT,
  start_date DATE,
  end_date DATE,
  initial_capital DECIMAL(15,2),
  results JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trading Spaces (community)
CREATE TABLE trading_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Community Posts
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES trading_spaces(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  trade_data JSONB,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Mentorships
CREATE TABLE mentorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  UNIQUE(mentor_id, mentee_id)
);

-- Indexes for performance
CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_entry_time ON trades(entry_time);
CREATE INDEX idx_chart_markups_user_id ON chart_markups(user_id);
CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_community_posts_space_id ON community_posts(space_id);
CREATE INDEX idx_mentorships_mentor_id ON mentorships(mentor_id);
CREATE INDEX idx_mentorships_mentee_id ON mentorships(mentee_id);