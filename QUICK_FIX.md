# Quick Fix Guide - 500 Errors on cPanel

## 🚨 Most Common Issue: Missing .env File

### Quick Fix (Do This First!)

1. **SSH into your cPanel server**
2. **Navigate to your app directory:**

   ```bash
   cd ~/maker-app-cpanel  # or your app folder name
   ```

3. **Check if .env exists:**

   ```bash
   ls -la .env
   ```

4. **If .env doesn't exist, create it:**

   ```bash
   nano .env
   ```

   Paste this (replace with YOUR actual values):

   ```env
   # Database
   DB_HOST=localhost
   DB_USER=your_cpanel_db_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   DB_PORT=3306

   # Security
   JWT_SECRET=put-a-long-random-string-here-minimum-32-characters
   SESSION_SECRET=another-long-random-string-here

   # Cloudinary (for images)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret

   # Frontend (your Vercel domain)
   FRONTEND_URL=https://your-frontend.vercel.app

   # Environment
   NODE_ENV=production
   PORT=3001
   ```

   Save with: `Ctrl+X`, then `Y`, then `Enter`

5. **Restart your app:**

   ```bash
   pm2 restart all
   ```

6. **Test it:**
   ```bash
   curl http://localhost:3001/api/health
   ```

---

## 🔍 Run Diagnostic Script

I've created a diagnostic script that checks everything:

```bash
cd ~/maker-app-cpanel
./diagnose.sh
```

This will tell you exactly what's wrong!

---

## 🗄️ Database Issues

### If database doesn't exist:

1. Go to cPanel → MySQL® Databases
2. Create a new database
3. Create a database user
4. Add user to database with ALL PRIVILEGES
5. Update .env file with these credentials

### If tables don't exist:

```bash
cd ~/maker-app-cpanel
mysql -u your_db_user -p your_db_name < config/schema.sql
```

---

## 📊 Check Logs (Where the Real Error Is)

### View PM2 logs:

```bash
pm2 logs --lines 100
```

### View specific app logs:

```bash
pm2 logs maker-app --lines 50
```

### View errors only:

```bash
pm2 logs --err --lines 50
```

With my code updates, you'll now see detailed error messages like:

- `Database credentials not configured`
- `ER_ACCESS_DENIED_ERROR` (wrong password)
- `ER_BAD_DB_ERROR` (database doesn't exist)
- `Missing required fields` (from registration)

---

## 🔄 After Making Changes

**Always restart after changes:**

```bash
pm2 restart all
pm2 logs  # Watch the logs
```

---

## 🧪 Test Endpoints Manually

### Test database connection:

```bash
curl http://localhost:3001/api/health
```

### Test register endpoint:

```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "role": "customer"
  }'
```

### Test products endpoint:

```bash
curl http://localhost:3001/api/products
```

---

## ✅ Checklist

- [ ] `.env` file exists in app root
- [ ] Database credentials are correct in `.env`
- [ ] Database exists in cPanel
- [ ] Database tables exist (run schema.sql if needed)
- [ ] `JWT_SECRET` is set in `.env`
- [ ] App restarted after changes (`pm2 restart all`)
- [ ] Checked logs for errors (`pm2 logs`)

---

## 🆘 Still Not Working?

Run the diagnostic script and share the output:

```bash
./diagnose.sh > diagnostic-output.txt
cat diagnostic-output.txt
```

Also check the detailed logs:

```bash
pm2 logs --lines 200 > app-logs.txt
cat app-logs.txt
```

---

## 📝 What I Changed in Your Code

I updated these files to show better error messages:

1. **config/database.js** - Shows what's missing in database config
2. **controllers/mysql/authController.js** - Shows detailed registration errors
3. **controllers/mysql/productController.js** - Shows detailed product fetch errors

Now when you get a 500 error, the logs will tell you EXACTLY what's wrong!

---

## 🎯 Most Likely Root Cause

Based on your symptoms (both `/api/products` and `/api/register` failing), it's almost certainly:

**❌ No database connection = Missing or wrong .env file**

Fix the .env file and 99% chance your problem is solved! 🎉
