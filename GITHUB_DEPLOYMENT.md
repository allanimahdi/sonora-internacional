# 🚀 GitHub Deployment Guide

## Overview

This guide explains how to deploy Sonora Internacional to GitHub Pages using GitHub Actions for automatic builds and deployments.

## 📋 Prerequisites

- GitHub account
- Git installed locally
- Project ready (already done ✅)

## 🔧 Step-by-Step Setup

### 1. Create GitHub Repository

#### Option A: Via GitHub Website
1. Go to https://github.com/new
2. Repository name: `sonora-internacional`
3. Description: "Calculateur de Répartition des Cachets pour Sonora Internacional"
4. Set to **Private** (recommended for sensitive payroll data)
5. **Do NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

#### Option B: Via GitHub CLI (if installed)
```bash
gh repo create sonora-internacional --private --source=. --remote=origin
```

### 2. Initialize Git and Push Code

Run these commands in your project directory:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Sonora Internacional Payroll Calculator

Features:
- French interface with authentication
- Payroll calculation with automatic fees
- Instrument rentals between musicians
- PDF export functionality
- VPS deployment ready
"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/sonora-internacional.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under "Build and deployment":
   - Source: **GitHub Actions**
5. Click **Save**

### 4. Verify Deployment

1. Go to **Actions** tab in your repository
2. You should see the workflow "Deploy to GitHub Pages" running
3. Wait for it to complete (usually 2-3 minutes)
4. Once complete, your site will be available at:
   ```
   https://YOUR_USERNAME.github.io/sonora-internacional/
   ```

## 🌐 Accessing Your Site

### Public URL
```
https://YOUR_USERNAME.github.io/sonora-internacional/
```

### Login
- Password: `sonora2025` (remember to change this!)

## 🔄 Automatic Deployments

Every time you push to the `main` branch, GitHub Actions will:
1. ✅ Install dependencies
2. ✅ Build the Angular application
3. ✅ Deploy to GitHub Pages
4. ✅ Make it live automatically

### Manual Deployment

You can also trigger deployment manually:
1. Go to **Actions** tab
2. Click "Deploy to GitHub Pages"
3. Click "Run workflow"
4. Select branch (main)
5. Click "Run workflow"

## 📝 Making Updates

After making changes to your code:

```bash
# Save changes
git add .
git commit -m "Description of your changes"
git push

# GitHub Actions will automatically build and deploy
```

## 🔐 Security Considerations

### Change the Default Password

**IMPORTANT**: Before sharing the link, change the password!

1. Edit `src/app/services/auth.service.ts`
2. Change line 12:
   ```typescript
   private readonly VALID_PASSWORD = 'your-secure-password';
   ```
3. Commit and push:
   ```bash
   git add src/app/services/auth.service.ts
   git commit -m "Update default password"
   git push
   ```

### Private Repository

Consider keeping the repository **private** to protect:
- Your payroll calculation logic
- Band member information
- Authentication system

### Environment Variables (Future Enhancement)

For better security, you could:
1. Store password in GitHub Secrets
2. Inject it during build
3. Never commit the actual password

## 🛠️ GitHub Actions Workflow

The workflow (`.github/workflows/deploy.yml`) does:

```yaml
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (npm ci)
4. Build with GitHub Pages base-href
5. Upload build artifacts
6. Deploy to GitHub Pages
```

### Build Command
```bash
npm run build -- --base-href=/sonora-internacional/
```

This ensures all assets load correctly on GitHub Pages.

## 📊 Monitoring Deployments

### View Build Status

1. Go to **Actions** tab
2. Click on any workflow run
3. View logs for each step
4. Check for errors

### Build Badge (Optional)

Add this to your README.md to show build status:

```markdown
![Deploy Status](https://github.com/YOUR_USERNAME/sonora-internacional/actions/workflows/deploy.yml/badge.svg)
```

## 🐛 Troubleshooting

### Build Fails

1. Check the **Actions** tab for error messages
2. Common issues:
   - Dependencies not installing → Check package.json
   - Build errors → Test locally first with `npm run build`
   - TypeScript errors → Run `npm run build` locally

### 404 Error After Deployment

1. Check that GitHub Pages source is set to "GitHub Actions"
2. Verify the workflow completed successfully
3. Wait a few minutes for DNS propagation

### Assets Not Loading

1. Check that `--base-href=/sonora-internacional/` is in the build command
2. Verify in `.github/workflows/deploy.yml`

### Login Not Working

1. Check browser console for errors
2. Clear browser cache
3. Try incognito/private mode

## 🔄 Updating Your Deployment

### Add New Features

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push

# Automatic deployment starts
```

### Rollback to Previous Version

```bash
# Find the commit hash you want to rollback to
git log

# Rollback
git revert <commit-hash>
git push

# Or force rollback (use with caution)
git reset --hard <commit-hash>
git push --force
```

## 📱 Custom Domain (Optional)

To use your own domain instead of github.io:

1. Buy a domain
2. In repository **Settings** → **Pages**
3. Add custom domain
4. Update DNS records:
   ```
   Type: CNAME
   Name: sonora (or @)
   Value: YOUR_USERNAME.github.io
   ```
5. Wait for DNS propagation (up to 48h)

## 💾 Local Development

### Test Locally
```bash
npm start
# Visit http://localhost:4200
```

### Build for GitHub Pages Locally
```bash
npm run build -- --base-href=/sonora-internacional/

# Test the build
cd dist/sonora-internacional/browser
python3 -m http.server 8080
# Visit http://localhost:8080
```

## 📊 Analytics (Optional)

Add Google Analytics or similar:

1. Get tracking ID
2. Add to `src/index.html`
3. Commit and push

## 🔒 Repository Settings Recommendations

### Branch Protection (Optional)
1. **Settings** → **Branches**
2. Add rule for `main` branch
3. Require pull request reviews
4. Require status checks to pass

### Secrets Management
If you add environment variables:
1. **Settings** → **Secrets and variables** → **Actions**
2. Add secrets (passwords, API keys, etc.)
3. Use in workflow with `${{ secrets.SECRET_NAME }}`

## 📞 Support

### Check Workflow Status
```bash
# View recent runs
https://github.com/YOUR_USERNAME/sonora-internacional/actions
```

### View Deployment
```bash
# Your live site
https://YOUR_USERNAME.github.io/sonora-internacional/
```

### Issues?
1. Check Actions tab for errors
2. Review workflow logs
3. Test build locally
4. Check GitHub Pages settings

## ✅ Deployment Checklist

Before going live:

- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] GitHub Pages enabled with GitHub Actions
- [ ] Workflow completed successfully
- [ ] Site accessible at GitHub Pages URL
- [ ] Login works with password
- [ ] Calculator functions correctly
- [ ] PDF download works
- [ ] **Default password changed** (IMPORTANT!)
- [ ] Tested on mobile
- [ ] Shared URL with band members

## 🎉 You're Live!

Your Sonora Internacional calculator is now:
- ✅ Hosted on GitHub Pages
- ✅ Automatically deployed on every push
- ✅ Accessible via HTTPS
- ✅ Free hosting forever
- ✅ Fully backed up on GitHub

Enjoy! 🎵

---

**GitHub Pages URL**: `https://YOUR_USERNAME.github.io/sonora-internacional/`  
**Password**: Remember to change from default!  
**Documentation**: All MD files in repository

