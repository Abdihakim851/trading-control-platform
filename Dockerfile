# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install root dependencies
RUN npm install

# Copy source code
COPY . .

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Build backend
RUN npm run build

# Go back to root
WORKDIR /app

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install

# Build frontend
RUN npm run build

# Go back to root
WORKDIR /app

# Expose ports
EXPOSE 5000 3000

# Start both servers
CMD ["sh", "-c", "cd backend && npm start & cd frontend && npm start"]
