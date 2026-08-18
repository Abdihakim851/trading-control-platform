# Trading Control Platform - Deployment Guide

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 16+
- Redis 7+

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/Abdihakim851/trading-control-platform.git
cd trading-control-platform
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trading_platform

# JWT
JWT_SECRET=your_secret_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Broker APIs
FUNDEDNEXT_CLIENT_ID=...
FUNDEDNEXT_CLIENT_SECRET=...
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Services with Docker

```bash
# Start PostgreSQL and Redis
npm run docker:up

# Initialize database
psql -U postgres -d trading_platform -f database/schema.sql
```

### 5. Run Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2: Frontend
cd frontend
npm run dev
# Runs on http://localhost:3000
```

## Production Deployment

### Option 1: Docker Compose (Recommended)

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Option 2: Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create trading-control-platform

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0 --app trading-control-platform

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key --app trading-control-platform
heroku config:set STRIPE_SECRET_KEY=sk_... --app trading-control-platform

# Deploy
git push heroku main
```

### Option 3: AWS/DigitalOcean/Linode

1. Create a VPS instance
2. Install Docker and Docker Compose
3. Clone the repository
4. Configure environment variables
5. Run `docker-compose up -d`

## Database Migrations

```bash
# Apply migrations
psql -U postgres -d trading_platform -f database/migrations/001_initial_schema.sql
```

## Monitoring

```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
cd frontend && npm run dev

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## API Documentation

### Authentication

```bash
POST /api/auth/register
Body: { email, password, name }

POST /api/auth/login
Body: { email, password }

POST /api/auth/refresh
Body: { token }
```

### Accounts

```bash
GET /api/accounts
GET /api/accounts/:accountId
POST /api/accounts
PUT /api/accounts/:accountId
DELETE /api/accounts/:accountId
```

### Trades

```bash
GET /api/trades/account/:accountId
POST /api/trades
GET /api/trades/analytics/:accountId
```

### Subscriptions

```bash
GET /api/subscriptions
POST /api/subscriptions/create
POST /api/subscriptions/cancel
```

### Integrations

```bash
POST /api/integrations/fundednext/connect
GET /api/integrations/fundednext/accounts/:integrationId
POST /api/integrations/fundednext/sync/:integrationId

POST /api/integrations/ftmo/connect
GET /api/integrations/ftmo/accounts/:integrationId
POST /api/integrations/ftmo/import-csv/:integrationId
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string
echo $DATABASE_URL
```

### Redis Connection Error

```bash
# Check Redis is running
redis-cli ping

# Check Redis connection string
echo $REDIS_URL
```

## Support

For issues and questions, please create an issue on GitHub.
