#!/bin/bash
# Deployment script for cPanel
# Run this on cPanel server after git pull

echo "🚀 Starting deployment..."

# Copy all files from Maker-dz/public to public_html
echo "📦 Copying files to public_html..."
cp -rf /home/qqbmuabu/Maker-dz/public/* /home/qqbmuabu/public_html/

echo "✅ Deployment complete!"
echo "🔄 Please hard refresh your browser (Ctrl+Shift+R)"
