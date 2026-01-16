# Maker App - cPanel Deployment Guide

This repository is configured for deployment on cPanel with Node.js support.

## 📋 Prerequisites

- cPanel account with Node.js support (Node.js 18+ recommended)
- Git deployment enabled in cPanel
- MongoDB database (MongoDB Atlas or other)
- Domain or subdomain configured

## 🚀 Deployment Steps

### Step 1: Create Git Repository on GitHub/GitLab

1. Create a new repository on GitHub or GitLab
2. Push this code to the repository:

```bash
git remote add origin YOUR_REPOSITORY_URL
git add .
git commit -m "Initial commit for cPanel deployment"
git push -u origin main
```

### Step 2: Configure cPanel

#### A. Setup Node.js Application in cPanel

1. Log in to your cPanel
2. Go to **"Software" → "Setup Node.js App"**
3. Click **"Create Application"**
4. Configure as follows:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `/home/yourusername/maker-app` (or your preferred path)
   - **Application URL**: Your domain or subdomain
   - **Application startup file**: `server.js`
   - **Port**: Let cPanel assign (usually 3001 or similar)

5. Click **"Create"**

#### B. Setup Git Version Control

1. In cPanel, go to **"Git Version Control"**
2. Click **"Create"**
3. Configure:
   - **Clone URL**: Your repository URL
   - **Repository Path**: Same as application root
   - **Repository Name**: maker-app

4. Click **"Create"**

### Step 3: Configure Environment Variables

1. In the Node.js App setup page, find **"Environment Variables"** section
2. Add the following variables:

```
NODE_ENV=production
PORT=3001
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=your_database_name
SESSION_SECRET=your_secure_session_secret
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback

# Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Frontend URL for CORS
FRONTEND_URL=https://yourdomain.com
```

### Step 4: Install Dependencies

1. In cPanel, open **"Terminal"** or use SSH
2. Navigate to your application directory:

```bash
cd ~/maker-app
```

3. Install dependencies:

```bash
npm install --production
```

### Step 5: Start the Application

1. Go back to **"Setup Node.js App"** in cPanel
2. Find your application and click **"Edit"**
3. Click **"Start App"** or **"Restart App"**

## 🔄 Updating Your Application

### Method 1: Using cPanel Git Interface

1. Go to **"Git Version Control"** in cPanel
2. Find your repository
3. Click **"Update"** or **"Pull"**
4. Go to **"Setup Node.js App"** and restart your app

### Method 2: Using Terminal/SSH

```bash
cd ~/maker-app
git pull origin main
npm install --production
# Restart app via cPanel interface or PM2
```

## 🔧 Troubleshooting

### Application Won't Start

1. Check the error logs in cPanel Node.js App section
2. Verify all environment variables are set correctly
3. Ensure MongoDB connection string is correct
4. Check that the port is not already in use

### MongoDB Connection Issues

1. Verify your MongoDB connection string
2. Ensure your MongoDB service allows connections from your cPanel IP
3. Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)

### CORS Errors

1. Update the `FRONTEND_URL` environment variable
2. Ensure your domain is added to `allowedOrigins` in index.js
3. Restart the application after changes

### SSL/HTTPS Issues

1. Install SSL certificate via cPanel (Let's Encrypt)
2. Update Google OAuth callback URLs to use HTTPS
3. Update CORS origins to use HTTPS

## 📊 Monitoring

### View Application Logs

In cPanel Terminal:

```bash
cd ~/maker-app/logs
tail -f combined.log
```

### Check Application Status

```bash
cd ~/maker-app
# Run via cPanel interface or check PM2 status
```

## 🛠️ Additional Configuration

### Using PM2 (Process Manager)

If your cPanel supports PM2:

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Setting up .htaccess

The `.htaccess` file is already configured. Ensure it's in your public_html or web root directory to:
- Force HTTPS
- Proxy requests to Node.js app

## 📱 Frontend Deployment

For the frontend (React/Vite app):

### Option 1: Separate Static Hosting
Deploy the frontend on Vercel/Netlify and update CORS settings

### Option 2: Serve from Same cPanel
1. Build the frontend: `npm run build`
2. Copy the `dist` folder to public_html
3. Configure .htaccess to serve static files and proxy API requests

## 🔐 Security Checklist

- [ ] Change all default secrets in environment variables
- [ ] Enable HTTPS/SSL
- [ ] Restrict MongoDB IP access
- [ ] Use strong passwords
- [ ] Keep Node.js and dependencies updated
- [ ] Configure firewall rules
- [ ] Enable rate limiting (if needed)

## 📞 Support

If you encounter issues:
1. Check cPanel error logs
2. Review MongoDB connection status
3. Verify all environment variables
4. Contact your hosting provider for cPanel-specific issues

## 🔗 Useful Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# List installed packages
npm list --depth=0

# Check application status
ps aux | grep node

# Kill stuck processes (if needed)
pkill -f node
```

---

**Last Updated**: January 2026
**Compatible with**: cPanel with Node.js 18+
