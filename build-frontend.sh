#!/bin/bash
# Build script for frontend

echo "📦 Building frontend..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
fi

# Build the frontend
echo "🔨 Building React app..."
npm run build

# Copy build to public folder
echo "📋 Copying build to public folder..."
cd ..
rm -rf public
cp -r frontend/dist public

echo "✅ Frontend build complete!"
echo "📁 Frontend files are in ./public"
