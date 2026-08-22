/*
# Trading Control Platform — Core Schema

Creates three tables for a multi-user, auth-gated trading platform.
Each user's data is isolated via Row Level Security using auth.uid().

1. New Tables
   - `trading_accounts`: broker accounts owned by a user
       id, user_id (defaults to auth.uid()), name, broker,
       broker_account_id, account_type, balance, status, timestamps
   - `trades`: individual trade records linked to an account
       id, account_id, symbol, direction (BUY/SELL), entry/exit price,
       quantity, pnl, pnl_percent, entry/exit time, notes, status, created_at
   - `risk_settings`: per-account risk config (one row per account)
       id, account_id, max_daily_loss, max_weekly_loss,
       max_open_positions, risk_per_trade, stop_loss_atr_multiplier, timestamps

2. Security
   - RLS enabled on all three tables.
   - trading_accounts: CRUD scoped to authenticated owner (user_id = auth.uid()).
   - trades + risk_settings: CRUD scoped through parent account ownership via EXISTS subquery.
   - user_id on trading_accounts defaults to auth.uid() so the client does NOT need to pass it.
*/

-- =============================================
-- trading_accounts
-- =============================================
CREATE TABLE IF NOT EXISTS trading_accounts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    broker text NOT NULL,
    broker_account_id text,
    account_type text,
    balance numeric(15,2) DEFAULT 0,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE trading_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_accounts" ON trading_accounts;
CREATE POLICY "select_own_accounts" ON trading_accounts FOR SELECT
    TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_accounts" ON trading_accounts;
CREATE POLICY "insert_own_accounts" ON trading_accounts FOR INSERT
    TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_accounts" ON trading_accounts;
CREATE POLICY "update_own_accounts" ON trading_accounts FOR UPDATE
    TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_accounts" ON trading_accounts;
CREATE POLICY "delete_own_accounts" ON trading_accounts FOR DELETE
    TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_trading_accounts_user_id ON trading_accounts(user_id);

-- =============================================
-- trades
-- =============================================
CREATE TABLE IF NOT EXISTS trades (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid NOT NULL REFERENCES trading_accounts(id) ON DELETE CASCADE,
    symbol text NOT NULL,
    direction text NOT NULL CHECK (direction IN ('BUY', 'SELL')),
    entry_price numeric(15,8) NOT NULL,
    exit_price numeric(15,8),
    quantity numeric(15,8) NOT NULL,
    pnl numeric(15,2),
    pnl_percent numeric(10,4),
    entry_time timestamptz NOT NULL DEFAULT now(),
    exit_time timestamptz,
    notes text,
    status text DEFAULT 'closed',
    created_at timestamptz DEFAULT now()
);

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_trades" ON trades;
CREATE POLICY "select_own_trades" ON trades FOR SELECT
    TO authenticated USING (
        EXISTS (
            SELECT 1 FROM trading_accounts
            WHERE trading_accounts.id = trades.account_id
              AND trading_accounts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "insert_own_trades" ON trades;
CREATE POLICY "insert_own_trades" ON trades FOR INSERT
    TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM trading_accounts
            WHERE trading_accounts.id = trades.account_id
              AND trading_accounts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "update_own_trades" ON trades;
CREATE POLICY "update_own_trades" ON trades FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM trading_accounts
            WHERE trading_accounts.id = trades.account_id
              AND trading_accounts.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM trading_accounts
            WHERE trading_accounts.id = trades.account_id
              AND trading_accounts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "delete_own_trades" ON trades;
CREATE POLICY "delete_own_trades" ON trades FOR DELETE
    TO authenticated USING (
        EXISTS (
            SELECT 1 FROM trading_accounts
            WHERE trading_accounts.id = trades.account_id
              AND trading_accounts.user_id = auth.uid()
        )
    );

CREATE INDEX IF NOT EXISTS idx_trades_account_id ON trades(account_id);
CREATE INDEX IF NOT EXISTS idx_trades_entry_time ON trades(entry_time DESC);
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON trades(symbol);

-- =============================================
-- risk_settings
-- =============================================
CREATE TABLE IF NOT EXISTS risk_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid UNIQUE NOT NULL REFERENCES trading_accounts(id) ON DELETE CASCADE,
    max_daily_loss numeric(15,2),
    max_weekly_loss numeric(15,2),
    max_open_positions integer DEFAULT 5,
    risk_per_trade numeric(5,2) DEFAULT 2,
    stop_loss_atr_multiplier numeric(5,2) DEFAULT 2,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE risk_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_risk_settings" ON risk_settings;
CREATE POLICY "select_own_risk_settings" ON risk_settings FOR SELECT
    TO authenticated USING (
        EXISTS (
            SELECT 1 FROM trading_accounts
            WHERE trading_accounts.id = risk_settings.account_id
              AND trading_accounts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "insert_own_risk_settings" ON risk_settings;
CREATE POLICY "insert_own_risk_settings" ON risk_settings FOR INSERT
    TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM trading_accounts
            WHERE trading_accounts.id = risk_settings.account_id
              AND trading_accounts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "update_own_risk_settings" ON risk_settings;
CREATE POLICY "update_own_risk_settings" ON risk_settings FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM trading_accounts
            WHERE trading_accounts.id = risk_settings.account_id
              AND trading_accounts.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM trading_accounts
            WHERE trading_accounts.id = risk_settings.account_id
              AND trading_accounts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "delete_own_risk_settings" ON risk_settings;
CREATE POLICY "delete_own_risk_settings" ON risk_settings FOR DELETE
    TO authenticated USING (
        EXISTS (
            SELECT 1 FROM trading_accounts
            WHERE trading_accounts.id = risk_settings.account_id
              AND trading_accounts.user_id = auth.uid()
        )
    );

CREATE INDEX IF NOT EXISTS idx_risk_settings_account_id ON risk_settings(account_id);
