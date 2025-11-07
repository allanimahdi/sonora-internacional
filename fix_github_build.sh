#!/bin/bash

echo "🔧 Fixing GitHub Actions build..."
echo ""

# Add the updated .gitignore and package-lock.json
git add .gitignore package-lock.json

# Commit
git commit -m "Fix GitHub Actions: Add package-lock.json for npm ci"

# Push
git push

echo ""
echo "✅ Fixed! GitHub Actions should now build successfully."
echo "   Check: https://github.com/YOUR_USERNAME/sonora-internacional/actions"
