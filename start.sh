#!/bin/bash
set -e

echo "Starting Trading Control Platform..."

# Wait for database to be ready
echo "Waiting for database..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

# Run migrations
echo "Running database migrations..."
psql $DATABASE_URL < database/schema.sql || true

# Start backend
echo "Starting backend server..."
cd backend
npm run build
node dist/index.js &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm run build
npm start &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
