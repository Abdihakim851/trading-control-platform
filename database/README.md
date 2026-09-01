# Database Setup Instructions

## Option 1: Supabase (Recommended - Free)

1. **Create Supabase Project**
   - Go to https://app.supabase.com
   - Click "New Project"
   - Choose organization, set password, select region
   - Wait for project to initialize (~2 mins)

2. **Create Tables**
   - Go to SQL Editor in Supabase dashboard
   - Click "New Query"
   - Copy entire content from `database/schema.sql`
   - Paste and click "Run"
   - Tables created ✅

3. **Get Credentials**
   - Go to Project Settings → API
   - Copy:
     - `Project URL` → `SUPABASE_URL`
     - `anon public` key → `SUPABASE_ANON_KEY`
     - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`
   - Paste into `backend/.env`

## Option 2: PostgreSQL Local

```bash
# Install PostgreSQL
# macOS
brew install postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql-15

# Start PostgreSQL
pg_ctl -D /usr/local/var/postgres start

# Create database
creatdb trading_platform

# Run schema
psql trading_platform < database/schema.sql

# Update .env
DATABASE_URL=postgresql://username:password@localhost:5432/trading_platform
```

## Verify Setup

```bash
# Test connection
psql -d trading_platform -c "\dt"

# Should show all tables created
```