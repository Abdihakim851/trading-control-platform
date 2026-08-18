#!/bin/bash
set -e

echo "🚀 Installing dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "✅ Setup complete!"
echo "To start the platform, run: npm run dev"
