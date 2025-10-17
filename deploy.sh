#!/bin/bash

# Quick Deployment Script for Sonora Internacional
# This script builds and deploys the application to your VPS

# CONFIGURATION - Update these values
VPS_USER="your-username"
VPS_HOST="your-vps-ip"
VPS_PATH="/var/www/sonora-internacional"

echo "🎵 Deploying Sonora Internacional..."

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Deploy to VPS
echo "📤 Uploading to VPS..."
rsync -avz --delete --progress \
    dist/sonora-internacional/browser/ \
    ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your application should now be live!"
else
    echo "❌ Deployment failed!"
    exit 1
fi

