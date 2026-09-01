# Trading Control Platform - Complete Setup & Launch Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available at supabase.com)
- OpenAI API key (for AI chart analysis)

### Installation

```bash
# Clone and setup
git clone https://github.com/Abdihakim851/trading-control-platform.git
cd trading-control-platform

# Run setup script
chmod +x start-dev.sh
./start-dev.sh
```

### Configuration

#### Backend Setup (.env)
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_random_secret_key_here

# Frontend
FRONTEND_URL=http://localhost:3000
```

#### Frontend Setup (.env.local)
```bash
cd frontend
```

Create/edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Start the Platform

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Platform
- 🌐 Frontend: http://localhost:3000
- 🔌 API Docs: http://localhost:5000/api-docs
- ⚙️ Health Check: http://localhost:5000/health

---

## 📚 Features Implemented

### ✅ Authentication
- User registration & login
- JWT token-based auth
- Supabase integration

### ✅ Trading Features (TradeSniper)
- Trade logging & journaling
- Manual trade entry
- P&L calculations
- Setup type classification
- Confidence scoring

### ✅ Analytics (TradeZella)
- Dashboard with KPIs
- Win rate calculations
- Profit factor metrics
- Trade statistics
- AI insights recommendations

### ✅ Chart Analysis (AI)
- Upload chart images
- GPT-4 Vision analysis
- Confluence detection
- Order block identification
- Liquidity sweep detection
- Confidence scoring

### ✅ Broker Integration
- Support for 500+ brokers (framework ready)
- Connected accounts management
- API key storage (encrypted in production)
- Trade sync capability

### ✅ Community Features
- Create trading spaces
- Post trades & discussions
- Share analysis & ideas
- Community engagement

### ✅ Backtesting
- Run strategy backtests
- Multiple symbol support
- Performance metrics
- Strategy comparison

### ✅ Mentorship System
- Request mentorship
- Mentor dashboards
- Accept/decline requests
- Guided learning

---

## 🗄️ Database Schema

Supabase tables created automatically:
- `users` - User profiles
- `trades` - Trade history
- `connected_accounts` - Broker connections
- `chart_markups` - Chart analysis data
- `ai_insights` - AI-generated insights
- `backtest_results` - Strategy backtests
- `trading_spaces` - Community spaces
- `community_posts` - Discussion posts
- `mentorships` - Mentor relationships

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login user

### Trades
- `GET /api/trades` - Get all trades
- `POST /api/trades` - Create new trade
- `GET /api/trades/:id` - Get specific trade

### Analytics
- `GET /api/analytics/dashboard` - Dashboard KPIs
- `GET /api/analytics/metrics` - Detailed metrics
- `GET /api/analytics/patterns` - Trade patterns
- `GET /api/analytics/ai-insights` - AI recommendations

### Charts & AI
- `POST /api/charts/analyze` - Analyze chart with AI
- `POST /api/charts/upload` - Upload chart
- `GET /api/charts/:id` - Get chart analysis

### Brokers
- `GET /api/brokers` - List supported brokers
- `POST /api/brokers/connect` - Connect broker
- `GET /api/brokers/accounts` - List accounts
- `POST /api/brokers/sync/:id` - Sync trades

### Backtesting
- `POST /api/backtest/run` - Run backtest
- `GET /api/backtest/results/:id` - Get results
- `POST /api/backtest/compare` - Compare strategies

### Community
- `GET /api/community/spaces` - List spaces
- `POST /api/community/spaces` - Create space
- `GET /api/community/spaces/:id/posts` - Get posts
- `POST /api/community/spaces/:id/posts` - Create post

### Mentorship
- `POST /api/mentorship/request` - Request mentor
- `GET /api/mentorship/requests` - Get requests
- `POST /api/mentorship/accept/:id` - Accept request

---

## 🎨 Frontend Pages

- `/` - Dashboard with KPIs
- `/charts` - AI chart analysis
- `/community` - Trading spaces & discussions
- `/auth/login` - User login
- `/auth/register` - New account signup

---

## 🚀 Production Deployment

### Backend (Heroku/Railway)
```bash
# Build
npm run build

# Start
npm start
```

### Frontend (Vercel)
```bash
# Deploy to Vercel
vercel deploy
```

### Environment Variables for Production
```
NODE_ENV=production
SUPABASE_URL=***
SUPABASE_ANON_KEY=***
JWT_SECRET=*** (generate strong key)
OPENAI_API_KEY=***
FRONTEND_URL=https://yourdomain.com
```

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong & unique
- [ ] API keys encrypted at rest
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced in production
- [ ] Secrets in .env (not committed)
- [ ] Regular security audits

---

## 📊 Tech Stack

**Backend:**
- Node.js + Express.js
- TypeScript
- PostgreSQL (via Supabase)
- JWT authentication
- Swagger API docs

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- Recharts (charts)
- Axios (API calls)
- Zustand (state management)

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Clear cache and reinstall
rm -rf backend/node_modules
rm backend/package-lock.json
cd backend && npm install
```

### Frontend not connecting to API
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Ensure backend is running on port 5000
- Check CORS settings in backend

### Supabase connection issues
- Verify credentials in `.env`
- Check Supabase project is active
- Ensure tables are created

---

## 📞 Support

For issues:
1. Check the logs in terminal
2. Review `.env` configuration
3. Verify Supabase connection
4. Check API documentation at `/api-docs`

---

## 📝 Next Steps

1. ✅ Setup & Launch
2. 🔐 Configure authentication
3. 📊 Connect Supabase database
4. 🤖 Add OpenAI API for AI features
5. 🔌 Implement broker API integrations
6. 🚀 Deploy to production

---

**Happy Trading! 🚀📈**
