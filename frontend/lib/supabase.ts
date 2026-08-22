import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TradingAccount = {
  id: string;
  user_id: string;
  name: string;
  broker: string;
  broker_account_id: string | null;
  account_type: string | null;
  balance: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Trade = {
  id: string;
  account_id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  entry_price: number;
  exit_price: number | null;
  quantity: number;
  pnl: number | null;
  pnl_percent: number | null;
  entry_time: string;
  exit_time: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

export type RiskSettings = {
  id: string;
  account_id: string;
  max_daily_loss: number | null;
  max_weekly_loss: number | null;
  max_open_positions: number;
  risk_per_trade: number;
  stop_loss_atr_multiplier: number;
  created_at: string;
  updated_at: string;
};
