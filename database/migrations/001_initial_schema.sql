-- Migration: 001_initial_schema
-- Description: Create initial database schema
-- Up
\i schema.sql

-- Down
DROP TABLE IF EXISTS payment_transactions;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS account_balance_history;
DROP TABLE IF EXISTS revenge_trading_logs;
DROP TABLE IF EXISTS risk_settings;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS trades;
DROP TABLE IF EXISTS broker_integrations;
DROP TABLE IF EXISTS trading_accounts;
DROP TABLE IF EXISTS users;
