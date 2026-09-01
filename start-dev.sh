#!/bin/bash
echo "🚀 Starting Trading Control Platform..."

# Install dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Start both servers
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Configure .env files in backend/ and frontend/ folders"
echo "2. Set up your Supabase database and update .env"
echo "3. Run 'npm run dev' in both backend/ and frontend/ folders (in separate terminals)"
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
