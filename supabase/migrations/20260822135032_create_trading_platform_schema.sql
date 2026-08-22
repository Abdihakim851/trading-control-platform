/*
# Trading Control Platform — Initial Schema

1. Purpose
   Creates the core tables for a multi-user trading account management platform.
   Each user manages their own trading accounts, trades, and risk settings.
   Data is isolated per user via Row Level Security policies.

2. New Tables
   - `trading_accounts`: A trading account from a broker (e.g. FundedNext, FTMO).
     Columns: id, user_id, name, broker, broker_account_id, account_type, balance, status, created_at, updated_at.
   - `trades`: A single trade record belonging to a trading account.
     Columns: id, account_id, symbol, direction, entry_price, exit_price, quantity, pnl, pnl_percent, entry_time, exit_time, notes, status, created_at.
   - `risk_settings`: Risk management configuration for a trading account.
     Columns: id, account_id, max_daily_loss, max_weekly_loss, max_open_positions, risk_per_trade, stop_loss_atr_multiplier, created_at, updated_at.

3. Security
   - RLS enabled on all tables.
   - `trading_accounts`: owner-scoped CRUD (user_id = auth.uid()).
   - `trades`: scoped through parent account ownership.
   - `risk_settings`: scoped through parent account ownership.
   - All owner columns default to auth.uid() so inserts work even when the client omits the user_id.

4. Important Notes
   - `trading_accounts.user_id` defaults to `auth.uid()` so frontend inserts don't need to pass it.
   - Child tables (`trades`, `risk_settings`) are scoped via EXISTS subquery on the parent account's ownership.
   - Indexes added for common query patterns (account_id, entry_time, symbol).
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
    TO authenticated USING (
        EXISTS (
            SELECT 1 FROM trading_accounts
            WHERE trading_accounts.id = trades.account_id
            AND trading_accounts.user_id = auth.uid()
        )
    ) WITH CHECK (
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
    account_id uuid NOT NULL REFERENCES trading_accounts(id) ON DELETE CASCADE,
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
    TO authenticated USING (
        EXISTS (
            SELECT 1 FROM trading_accounts
            WHERE trading_accounts.id = risk_settings.account_id
            AND trading_accounts.user_id = auth.uid()
        )
    ) WITH CHECK (
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