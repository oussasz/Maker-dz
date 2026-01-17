# Complete cPanel Deployment Guide

## Prerequisites

- cPanel account with Node.js support (v18+)
- MySQL database
- Domain pointing to cPanel

## Step-by-Step Deployment

### 1. Database Setup

#### Create MySQL Database
1. Login to cPanel
2. Go to **MySQL Databases**
3. Create database: `qqbmuabu_maker_dz`
4. Create user: `qqbmuabu_admin` with a strong password
5. Add user to database with **ALL PRIVILEGES**

#### Import Database Schema
1. Go to **phpMyAdmin**
2. Select database `qqbmuabu_maker_dz`
3. Click **SQL** tab
4. Copy contents of `config/schema.sql`
5. Paste and click **Go**

### 2. Node.js Application Setup

1. Go to cPanel → **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `/home/yourusername/public_html`
   - **Application URL**: `https://maker-dz.net`
   - **Application startup file**: `index.js`
   - **Passenger log file**: Leave default
4. Click **Create**

### 3. Clone Repository

In cPanel Terminal or SSH:
```bash
cd ~/public_html
rm -f .htaccess index.html  # Remove default files
git clone https://github.com/oussasz/Maker-dz-deploy.git .
```

### 4. Configure Environment

Create `.env` file in `/public_html/`:

```bash
nano .env
```

Paste this content (replace values):

```env
NODE_ENV=production
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=qqbmuabu_admin
DB_PASSWORD=YOUR_ACTUAL_DB_PASSWORD
DB_NAME=qqbmuabu_maker_dz

JWT_SECRET=GENERATE_RANDOM_STRING_HERE
SESSION_SECRET=GENERATE_ANOTHER_RANDOM_STRING

FRONTEND_URL=https://maker-dz.net
BACKEND_URL=https://maker-dz.net

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_CALLBACK_URL=https://maker-dz.net/api/auth/google/callback
```

Save with `CTRL+O`, `ENTER`, `CTRL+X`

### 5. Deploy Application

```bash
chmod +x build-frontend.sh deploy-cpanel.sh
./deploy-cpanel.sh
```

### 6. Restart Application

1. Go to cPanel → **Setup Node.js App**
2. Click **Restart** button
3. Wait for "Running" status

### 7. Verify Deployment

Visit these URLs:
- `https://maker-dz.net` → Should show the website
- `https://maker-dz.net/api/health` → Should show `{"status":"OK"}`

## Updating the Application

When you push changes to GitHub:

```bash
cd ~/public_html
./deploy-cpanel.sh
```

Then restart in cPanel.

## Troubleshooting

### "Cannot GET /"
- Check if `public/index.html` exists
- Rebuild frontend: `./build-frontend.sh`
- Restart app

### Database Connection Error
- Verify credentials in `.env`
- Check user has database access in cPanel MySQL Databases
- Verify database name includes prefix

### "Module not found"
- Run `npm install` in `/public_html`
- Check Node.js version is 18+
- Restart app

### API Returns 500 Error
- Check error log in cPanel (check with support how to access)
- Verify environment variables are set
- Check database tables exist

### Frontend Shows Old Version
- Run `./build-frontend.sh`
- Clear browser cache
- Restart app

## Security Checklist

- [ ] Strong database password set
- [ ] JWT_SECRET is random and secure
- [ ] `.env` file is not in git (already in `.gitignore`)
- [ ] Google OAuth credentials are correct
- [ ] Cloudinary API keys are set

## Performance Tips

- Images are automatically optimized via Cloudinary
- Frontend is pre-built and served as static files
- MySQL indexes are already configured in schema
- Consider adding Redis for session storage (advanced)

## Support

For issues, check the error logs and verify all environment variables are correctly set.
