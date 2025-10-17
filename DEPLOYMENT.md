# 🚀 Deployment Guide - Sonora Internacional

This guide explains how to deploy the Sonora Internacional payroll calculator to your VPS (same server as resaprivee).

## 📋 Prerequisites

- Access to your VPS via SSH
- Nginx installed on your VPS
- A domain or subdomain pointing to your VPS (e.g., `sonora.yourdomain.com`)
- Node.js installed locally to build the application

## 🔐 Default Password

The default password is: **sonora2025**

To change it, edit the file:
```
src/app/services/auth.service.ts
```

Find the line:
```typescript
private readonly VALID_PASSWORD = 'sonora2025';
```

Change it to your desired password, then rebuild the application.

## 🏗️ Step 1: Build the Application

On your local machine, navigate to the project directory and run:

```bash
# Make the build script executable
chmod +x build-production.sh

# Run the build script
./build-production.sh
```

Or build manually:
```bash
npm run build
```

The production files will be in: `dist/sonora-internacional/browser/`

## 📦 Step 2: Upload to Your VPS

### Option A: Using SCP (Secure Copy)

```bash
# Replace with your VPS details
scp -r dist/sonora-internacional/browser/* user@your-vps-ip:/tmp/sonora-build/
```

### Option B: Using rsync (Recommended)

```bash
# Replace with your VPS details
rsync -avz --progress dist/sonora-internacional/browser/ user@your-vps-ip:/tmp/sonora-build/
```

### Option C: Using Git (if you have a private repository)

```bash
# On VPS
cd /opt/
git clone your-repository-url sonora-internacional
cd sonora-internacional
npm install
npm run build
```

## 🔧 Step 3: Configure the VPS

SSH into your VPS:

```bash
ssh user@your-vps-ip
```

### Create the Web Directory

```bash
sudo mkdir -p /var/www/sonora-internacional
sudo mv /tmp/sonora-build/* /var/www/sonora-internacional/
sudo chown -R www-data:www-data /var/www/sonora-internacional
sudo chmod -R 755 /var/www/sonora-internacional
```

## 🌐 Step 4: Configure Nginx

### Copy the Nginx Configuration

Create a new nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/sonora
```

Paste the contents of `nginx-sonora.conf` (provided in this project), but **update the `server_name`** line with your actual domain:

```nginx
server_name sonora.yourdomain.com;
```

### Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/sonora /etc/nginx/sites-enabled/
```

### Test Nginx Configuration

```bash
sudo nginx -t
```

If the test is successful, reload Nginx:

```bash
sudo systemctl reload nginx
```

## 🔒 Step 5: Set Up SSL (HTTPS)

Install Certbot if not already installed:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

Get an SSL certificate:

```bash
sudo certbot --nginx -d sonora.yourdomain.com
```

Follow the prompts. Certbot will automatically configure SSL and redirect HTTP to HTTPS.

## 🎵 Step 6: Access Your Application

Open your browser and navigate to:
```
https://sonora.yourdomain.com
```

You should see the login page. Enter the password: **sonora2025**

## 🔄 Updating the Application

When you make changes and need to redeploy:

### 1. Build Locally

```bash
./build-production.sh
```

### 2. Upload to VPS

```bash
rsync -avz --delete dist/sonora-internacional/browser/ user@your-vps-ip:/var/www/sonora-internacional/
```

### 3. Clear Browser Cache

After updating, users may need to clear their browser cache or do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R).

## 🔐 Security Considerations

### 1. Change the Default Password

**IMPORTANT**: Change the default password before deploying to production!

Edit `src/app/services/auth.service.ts`:
```typescript
private readonly VALID_PASSWORD = 'your-secure-password';
```

### 2. IP Whitelisting (Optional)

For extra security, you can restrict access to specific IP addresses in Nginx:

```nginx
location / {
    allow 1.2.3.4;        # Your IP
    allow 5.6.7.8;        # Another allowed IP
    deny all;             # Block everyone else
    
    try_files $uri $uri/ /index.html;
}
```

### 3. HTTP Basic Auth (Additional Layer)

Add an extra layer of authentication with nginx:

```bash
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd sonora
```

Then in your nginx config, add:
```nginx
location / {
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
    try_files $uri $uri/ /index.html;
}
```

## 🆘 Troubleshooting

### Site Not Loading

1. Check nginx status:
```bash
sudo systemctl status nginx
```

2. Check nginx error logs:
```bash
sudo tail -f /var/log/nginx/sonora-error.log
```

3. Verify file permissions:
```bash
ls -la /var/www/sonora-internacional/
```

### 404 Errors on Refresh

Make sure your nginx config has:
```nginx
try_files $uri $uri/ /index.html;
```

### Password Not Working

- Clear browser cache and localStorage
- Check browser console for errors (F12)
- Verify the password in `auth.service.ts`

### SSL Issues

Renew certificates manually:
```bash
sudo certbot renew
```

Check certificate expiry:
```bash
sudo certbot certificates
```

## 📊 Monitoring

### View Access Logs

```bash
sudo tail -f /var/log/nginx/sonora-access.log
```

### View Error Logs

```bash
sudo tail -f /var/log/nginx/sonora-error.log
```

### Check Disk Space

```bash
df -h
```

## 🔄 Automatic SSL Renewal

Certbot sets up automatic renewal. Test it with:

```bash
sudo certbot renew --dry-run
```

## 📱 Using a Subdomain with Same VPS

If you're using the same VPS as resaprivee, you can:

1. Use a subdomain: `sonora.yourdomain.com`
2. Both apps can coexist with different nginx configurations
3. Each has its own configuration file in `/etc/nginx/sites-available/`

Example structure:
```
/etc/nginx/sites-available/
├── resaprivee          # Your existing app
└── sonora              # New Sonora Internacional app

/var/www/
├── resaprivee/         # Existing app files
└── sonora-internacional/  # New app files
```

## 🎯 Quick Reference

| Item | Value |
|------|-------|
| Default Password | sonora2025 |
| App Directory | /var/www/sonora-internacional |
| Nginx Config | /etc/nginx/sites-available/sonora |
| Access Log | /var/log/nginx/sonora-access.log |
| Error Log | /var/log/nginx/sonora-error.log |

## ✅ Checklist

- [ ] Built application locally
- [ ] Uploaded files to VPS
- [ ] Created web directory with correct permissions
- [ ] Configured nginx
- [ ] Tested nginx configuration
- [ ] Reloaded nginx
- [ ] Set up SSL certificate
- [ ] Changed default password
- [ ] Tested login functionality
- [ ] Verified calculator works correctly
- [ ] Documented password securely

---

Need help? Check the error logs or contact your system administrator.

