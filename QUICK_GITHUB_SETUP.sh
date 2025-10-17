#!/bin/bash

# Quick GitHub Setup Script for Sonora Internacional
# This script helps you push your code to GitHub and set up automatic deployment

echo "🎵 Sonora Internacional - GitHub Setup"
echo "======================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

echo "📝 Please enter your GitHub username:"
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

REPO_URL="https://github.com/$GITHUB_USERNAME/sonora-internacional.git"

echo ""
echo "🔧 Setting up Git repository..."
echo ""

# Initialize git if not already done
if [ ! -d .git ]; then
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Add all files
git add .
echo "✅ Files staged"

# Create commit
git commit -m "Initial commit: Sonora Internacional Payroll Calculator

Features:
- French interface with authentication
- Payroll calculation with automatic fees
- Instrument rentals between musicians
- PDF export functionality
- GitHub Actions deployment
- Ready for GitHub Pages
"
echo "✅ Commit created"

# Add remote
git remote remove origin 2>/dev/null
git remote add origin $REPO_URL
echo "✅ Remote added: $REPO_URL"

# Rename branch to main
git branch -M main
echo "✅ Branch renamed to main"

echo ""
echo "📤 Ready to push to GitHub!"
echo ""
echo "⚠️  IMPORTANT: Before pushing, make sure you have:"
echo "   1. Created the repository 'sonora-internacional' on GitHub"
echo "   2. Set it to Private (recommended)"
echo ""
echo "To create the repository, visit:"
echo "   https://github.com/new"
echo ""
read -p "Have you created the repository on GitHub? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Pushing to GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo ""
        echo "📋 Next steps:"
        echo "   1. Go to: https://github.com/$GITHUB_USERNAME/sonora-internacional"
        echo "   2. Click Settings → Pages"
        echo "   3. Set Source to 'GitHub Actions'"
        echo "   4. Wait for deployment (~2-3 minutes)"
        echo "   5. Your site will be at: https://$GITHUB_USERNAME.github.io/sonora-internacional/"
        echo ""
        echo "🔐 IMPORTANT: Change the default password!"
        echo "   Edit: src/app/services/auth.service.ts"
        echo "   Current password: sonora2025"
        echo ""
        echo "📖 See GITHUB_DEPLOYMENT.md for complete instructions"
    else
        echo ""
        echo "❌ Push failed. Make sure:"
        echo "   1. Repository exists on GitHub"
        echo "   2. You have push access"
        echo "   3. You're logged in (gh auth login or git credential helper)"
    fi
else
    echo ""
    echo "⏸️  Paused. Create the repository first, then run:"
    echo "   git push -u origin main"
    echo ""
    echo "Or run this script again."
fi

echo ""
echo "🎉 Setup complete!"
