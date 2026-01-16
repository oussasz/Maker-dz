#!/bin/bash

# Maker App - Quick Setup Script for cPanel

echo "🚀 Maker App - cPanel Setup Assistant"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please edit it with your configuration:"
    echo "   nano .env"
    echo ""
else
    echo "✅ .env file exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs
echo "✅ Logs directory ready"

echo ""
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Edit your .env file with actual values:"
echo "   nano .env"
echo ""
echo "2. Verify MongoDB connection:"
echo "   node scripts/testConnection.js"
echo ""
echo "3. Start the server:"
echo "   npm start"
echo ""
echo "📚 For detailed deployment instructions, see:"
echo "   CPANEL_DEPLOYMENT.md"
echo ""
