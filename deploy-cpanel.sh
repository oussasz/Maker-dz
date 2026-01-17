#!/bin/bash
# Deployment script for cPanel

echo "🚀 Starting cPanel deployment..."

# Pull latest changes
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Build frontend
echo "🎨 Building frontend..."
./build-frontend.sh

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Go to cPanel → Setup Node.js App"
echo "2. Click 'Restart' button"
echo "3. Visit https://maker-dz.net"
