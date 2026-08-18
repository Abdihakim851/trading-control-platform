# Trading Control Platform - Quick Start Guide

## 🚀 Fastest Way to Get Running

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone repository
git clone https://github.com/Abdihakim851/trading-control-platform.git
cd trading-control-platform

# 2. Copy environment file
cp .env.example .env

# 3. Run with Docker
docker-compose up

# 4. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/api/health
```

### Option 2: Cloud Deploy (No Local Setup Needed)

#### Deploy to Railway (Easiest)
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "Create New Project"
4. Select "Deploy from GitHub repo"
5. Choose `Abdihakim851/trading-control-platform`
6. Railway auto-deploys everything
7. Get live URL in 2-3 minutes

#### Deploy to Vercel (For Frontend)
1. Go to https://vercel.com
2. Import your GitHub repo
3. Vercel handles deployment automatically
4. Get live link instantly

#### Deploy to Heroku
1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Run:
```bash
heroku login
heroku create trading-control-platform
git push heroku main
heroku open
```

### Option 3: Manual Setup (Advanced)

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Terminal 3 - Database (if using locally)
docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
```

## 🔑 First Login

After setup, create a new account:
1. Go to http://localhost:3000/register
2. Enter any email and password
3. Click "Sign Up"
4. You're logged in!

## 📝 Environment Variables

Copy `.env.example` to `.env` and update:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trading_platform

# JWT Secret (generate random string)
JWT_SECRET=your_random_secret_key_here_12345

# Stripe (optional - for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎨 Troubleshooting

### Docker won't start
```bash
# Make sure Docker Desktop is running, then:
docker-compose restart
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Database connection error
```bash
# Check if PostgreSQL is running
psql -U postgres -d trading_platform -c "SELECT 1"

# If not, start with Docker:
docker-compose up postgres
```

### "npm not found"
- Install Node.js: https://nodejs.org/
- Verify: `node --version`

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Setup Guide](./docs/SETUP.md)

## 🚶 Next Steps

1. ✅ Get the platform running
2. Create your account
3. Add a trading account
4. Connect FundedNext or FTMO
5. Start tracking trades!

## 💬 Need Help?

Check the docs or create an issue on GitHub.
