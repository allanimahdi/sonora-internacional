#!/bin/bash

# Production Build Script for Sonora Internacional
# This script builds the Angular application for production deployment

echo "🎵 Building Sonora Internacional for production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output is in: dist/sonora-internacional/browser"
    echo ""
    echo "Next steps:"
    echo "1. Upload the dist/sonora-internacional/browser directory to your VPS"
    echo "2. Configure nginx as described in DEPLOYMENT.md"
    echo "3. Access your application at your domain"
else
    echo "❌ Build failed!"
    exit 1
fi

