-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Trading accounts table
CREATE TABLE IF NOT EXISTS trading_accounts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    broker VARCHAR(100) NOT NULL,
    broker_account_id VARCHAR(255),
    account_type VARCHAR(50),
    balance DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_broker (broker),
    INDEX idx_status (status)
);

-- Broker integrations table
CREATE TABLE IF NOT EXISTS broker_integrations (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    broker VARCHAR(100) NOT NULL,
    broker_account_id VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    credentials TEXT,
    platform VARCHAR(50),
    status VARCHAR(50) DEFAULT 'connected',
    last_synced TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_broker (broker)
);

-- Trades table
CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES trading_accounts(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    entry_price DECIMAL(15,8) NOT NULL,
    exit_price DECIMAL(15,8),
    quantity DECIMAL(15,8) NOT NULL,
    pnl DECIMAL(15,2),
    pnl_percent DECIMAL(10,4),
    entry_time TIMESTAMP NOT NULL,
    exit_time TIMESTAMP,
    duration INTERVAL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'closed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_account_id (account_id),
    INDEX idx_symbol (symbol),
    INDEX idx_entry_time (entry_time),
    INDEX idx_status (status)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(50) DEFAULT 'free',
    stripe_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_tier (tier),
    INDEX idx_status (status)
);

-- Risk management settings table
CREATE TABLE IF NOT EXISTS risk_settings (
    id UUID PRIMARY KEY,
    account_id UUID UNIQUE NOT NULL REFERENCES trading_accounts(id) ON DELETE CASCADE,
    max_daily_loss DECIMAL(15,2),
    max_weekly_loss DECIMAL(15,2),
    max_open_positions INT DEFAULT 5,
    risk_per_trade DECIMAL(5,2) DEFAULT 2,
    stop_loss_atr_multiplier DECIMAL(5,2) DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_account_id (account_id)
);

-- Revenge trading prevention logs
CREATE TABLE IF NOT EXISTS revenge_trading_logs (
    id UUID PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES trading_accounts(id) ON DELETE CASCADE,
    consecutive_losses INT DEFAULT 0,
    total_daily_loss DECIMAL(15,2) DEFAULT 0,
    trading_paused BOOLEAN DEFAULT FALSE,
    pause_until TIMESTAMP,
    triggered_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_account_id (account_id),
    INDEX idx_trading_paused (trading_paused)
);

-- Daily account balance history
CREATE TABLE IF NOT EXISTS account_balance_history (
    id UUID PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES trading_accounts(id) ON DELETE CASCADE,
    balance DECIMAL(15,2) NOT NULL,
    equity DECIMAL(15,2),
    drawdown_percent DECIMAL(10,4),
    daily_pnl DECIMAL(15,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_account_id (account_id),
    INDEX idx_recorded_at (recorded_at)
);

-- Compliance and audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_transaction_id VARCHAR(255),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_stripe_transaction_id (stripe_transaction_id),
    INDEX idx_status (status)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trades_account_entry ON trades(account_id, entry_time DESC);
CREATE INDEX IF NOT EXISTS idx_balance_account_recorded ON account_balance_history(account_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user_created ON audit_logs(user_id, created_at DESC);
