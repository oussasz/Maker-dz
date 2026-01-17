# 🚀 Quick Reference - cPanel Deployment

## ✅ What's Already Done

- ✅ **GitHub Repository**: https://github.com/oussasz/Maker-dz-deploy
- ✅ **Code Pushed**: All backend code is on GitHub
- ✅ **Environment File**: `.env` created with your credentials
- ✅ **JWT Secrets**: Automatically generated secure keys
- ✅ **Google OAuth**: Configured with your credentials
- ✅ **Cloudinary**: Configured with your credentials

## ⚠️ What You Need to Update

### In `.env` file (locally):

```bash
# Update these values in your .env file:
FRONTEND_URL=https://your-actual-domain.com
GOOGLE_CALLBACK_URL=https://your-actual-domain.com/api/auth/google/callback

# Your MySQL database is already configured
# All other credentials are already set
```

## 📋 Your Environment Variables (for cPanel)

**IMPORTANT**: All your credentials are stored in the `.env` file. 
**DO NOT share this file publicly!**

To add environment variables to cPanel:
1. Open the `.env` file in this directory
2. Copy each variable (name and value)
3. Add them one by one in cPanel's "Setup Node.js App" → "Environment variables" section

Your `.env` file contains:
- ✅ MySQL database credentials (already configured)
- ✅ JWT secrets (secure random strings)
- ✅ Google OAuth credentials
- ✅ Cloudinary credentials

**You still need to update:**
- `FRONTEND_URL` - Change to your actual cPanel domain
- `GOOGLE_CALLBACK_URL` - Change to your actual cPanel domain

### Template for environment variables:

```
NODE_ENV=production
PORT=3001

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# JWT Secrets (from your .env file)
JWT_SECRET=<copy from .env>
JWT_REFRESH_SECRET=<copy from .env>
SESSION_SECRET=<copy from .env>

# Google OAuth (from your .env file)
GOOGLE_CLIENT_ID=<copy from .env>
GOOGLE_CLIENT_SECRET=<copy from .env>
GOOGLE_CALLBACK_URL=https://your-actual-domain.com/api/auth/google/callback

# Cloudinary (from your .env file)
CLOUDINARY_CLOUD_NAME=<copy from .env>
CLOUDINARY_API_KEY=<copy from .env>
CLOUDINARY_API_SECRET=<copy from .env>

# Frontend URL
FRONTEND_URL=https://your-actual-domain.com
```

## 🔗 Important Links

- **Repository**: https://github.com/oussasz/Maker-dz-deploy
- **Cloudinary Dashboard**: https://cloudinary.com/console
- **Google Cloud Console**: https://console.cloud.google.com
- **Your Environment Variables**: See `.env` file in this directory

## 📝 cPanel Setup - Quick Steps

1. **Node.js App Setup**:
   - Application root: `/home/yourusername/maker-app`
   - Startup file: `server.js`
   - Node.js version: 18+

2. **Git Repository**:
   - Clone URL: `https://github.com/oussasz/Maker-dz-deploy.git`
   - Path: `/home/yourusername/maker-app`

3. **Install Dependencies**:

   ```bash
   cd ~/maker-app
   npm install --production
   ```

4. **Start Application**: Use cPanel interface to start/restart

## 🧪 Test URLs (Replace with your domain)

- Base: `https://yourdomain.com`
- Health: `https://yourdomain.com/api/health`
- Categories: `https://yourdomain.com/api/categories`

## ⚡ Next Immediate Actions

1. ✅ ~~Create GitHub repository~~ **DONE**
2. ✅ ~~Push code~~ **DONE**
3. ✅ ~~MySQL database configured~~ **DONE**
4. 📝 Update `.env` with your actual domain URLs
5. 📝 Log into cPanel
6. 📝 Setup Node.js App
7. 📝 Connect Git repository
8. 📝 Copy all environment variables from `.env` to cPanel
9. 📝 Install dependencies
10. 📝 Start application

## 📞 Support

Full guide: See [START_HERE.md](START_HERE.md)

---

Generated: January 17, 2026
