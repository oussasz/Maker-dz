# 500 Error Fix Summary

## Problem

Your Maker app on cPanel is returning 500 errors for:

- `GET /api/products`
- `POST /api/register`

## Root Cause (99% Probability)

**Missing or incorrectly configured `.env` file with database credentials**

Your app uses MySQL but can't connect to the database because environment variables are not set.

## What I Fixed

### 1. Enhanced Error Logging

Updated three critical files to show detailed error information:

#### [config/database.js](config/database.js)

- Now shows which database credentials are missing
- Logs full connection details (host, port, user, database)
- Displays MySQL error codes (ER_ACCESS_DENIED, ER_BAD_DB_ERROR, etc.)

#### [controllers/mysql/authController.js](controllers/mysql/authController.js)

- Logs each step of user registration
- Shows SQL errors with details
- Validates required fields before processing

#### [controllers/mysql/productController.js](controllers/mysql/productController.js)

- Logs query parameters and filters
- Shows SQL errors with details
- Displays count of products found

### 2. Created Diagnostic Tools

#### [diagnose.sh](diagnose.sh) - Automated Diagnostics

Checks:

- ✓ .env file exists
- ✓ Database credentials are set
- ✓ MySQL connection works
- ✓ Database tables exist
- ✓ JWT_SECRET is configured
- ✓ Node.js version
- ✓ Dependencies installed
- ✓ PM2 process running

**Usage:**

```bash
./diagnose.sh
```

#### [setup-cpanel.sh](setup-cpanel.sh) - Interactive Setup

Guides you through:

- Creating .env file
- Entering database credentials
- Generating JWT secrets
- Testing database connection
- Creating database tables
- Installing dependencies
- Starting PM2

**Usage:**

```bash
./setup-cpanel.sh
```

### 3. Created Documentation

#### [QUICK_FIX.md](QUICK_FIX.md)

- Step-by-step quick fixes
- Most common issues and solutions
- Command examples
- Testing procedures

#### [CPANEL_DEBUG_CHECKLIST.md](CPANEL_DEBUG_CHECKLIST.md)

- Comprehensive troubleshooting guide
- All possible issues and solutions
- Database setup instructions
- PM2 configuration

## How to Fix Your App

### Option 1: Quick Manual Fix (5 minutes)

1. **SSH into your cPanel server**

2. **Navigate to your app:**

   ```bash
   cd ~/maker-app-cpanel
   ```

3. **Create .env file:**

   ```bash
   nano .env
   ```

4. **Paste this (with YOUR actual values):**

   ```env
   DB_HOST=localhost
   DB_USER=your_cpanel_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   DB_PORT=3306

   JWT_SECRET=your-long-random-secret-at-least-32-chars
   SESSION_SECRET=another-long-random-secret

   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret

   FRONTEND_URL=https://maker-dz.vercel.app
   NODE_ENV=production
   PORT=3001
   ```

5. **Save** (Ctrl+X, Y, Enter)

6. **Restart app:**

   ```bash
   pm2 restart all
   ```

7. **Check logs:**
   ```bash
   pm2 logs --lines 50
   ```

### Option 2: Automated Setup (10 minutes)

```bash
cd ~/maker-app-cpanel
./setup-cpanel.sh
```

This script will:

- Guide you through .env creation
- Test database connection
- Create tables if needed
- Install dependencies
- Start the app with PM2

### Option 3: Run Diagnostics First

```bash
cd ~/maker-app-cpanel
./diagnose.sh
```

This will tell you exactly what's wrong, then fix based on the output.

## Verification Steps

### 1. Test Database Connection

```bash
curl http://localhost:3001/api/health
```

**Expected response:**

```json
{
  "status": "OK",
  "database": "your_db_name",
  "mysqlVersion": "8.0.x"
}
```

### 2. Test Register Endpoint

```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test123!","role":"customer"}'
```

**Expected response:**

```json
{
  "message": "User registered successfully"
}
```

### 3. Test Products Endpoint

```bash
curl http://localhost:3001/api/products
```

**Expected response:**

```json
{
  "products": [],
  "pagination": {...}
}
```

## Common Issues & Solutions

### Issue: ER_ACCESS_DENIED_ERROR

**Cause:** Wrong database username or password  
**Fix:** Update DB_USER and DB_PASSWORD in .env

### Issue: ER_BAD_DB_ERROR

**Cause:** Database doesn't exist  
**Fix:** Create database in cPanel → MySQL® Databases

### Issue: ECONNREFUSED

**Cause:** MySQL not running or wrong host  
**Fix:** Use "localhost" for DB_HOST (not 127.0.0.1)

### Issue: Table doesn't exist

**Cause:** Schema not loaded  
**Fix:** Run `mysql -u user -p database < config/schema.sql`

### Issue: JWT_SECRET not defined

**Cause:** Missing in .env  
**Fix:** Add JWT_SECRET to .env file

## Where to Find Database Credentials

### In cPanel:

1. Log into cPanel
2. Go to **MySQL® Databases**
3. You'll see:
   - **Current Databases** (your DB_NAME)
   - **Current Users** (your DB_USER)
   - Password: You set this when creating the user
4. Make sure to **Add User to Database** with ALL PRIVILEGES

## View Live Logs

The enhanced logging now shows detailed errors. View them with:

```bash
# View all logs
pm2 logs

# View last 100 lines
pm2 logs --lines 100

# View only errors
pm2 logs --err

# Follow logs in real-time
pm2 logs --lines 0
```

## What You'll See in Logs Now

### Before (unclear):

```
Error registering user: [Object]
```

### After (detailed):

```
Registering user with data: { username: 'test', email: 'test@test.com', role: 'customer' }
Checking if email exists...
Checking if username exists...
Creating user...
❌ MySQL connection error: Access denied for user 'wrong_user'@'localhost'
Error code: ER_ACCESS_DENIED_ERROR
```

## Files Modified

1. ✓ [config/database.js](config/database.js) - Better connection logging
2. ✓ [controllers/mysql/authController.js](controllers/mysql/authController.js) - Detailed registration logging
3. ✓ [controllers/mysql/productController.js](controllers/mysql/productController.js) - Detailed product logging

## Files Created

1. ✓ [diagnose.sh](diagnose.sh) - Diagnostic script
2. ✓ [setup-cpanel.sh](setup-cpanel.sh) - Interactive setup
3. ✓ [QUICK_FIX.md](QUICK_FIX.md) - Quick reference
4. ✓ [CPANEL_DEBUG_CHECKLIST.md](CPANEL_DEBUG_CHECKLIST.md) - Full guide
5. ✓ [FIX_SUMMARY.md](FIX_SUMMARY.md) - This file

## Next Steps

1. **Choose your fix method** (Quick Manual / Automated / Diagnostics)
2. **Follow the steps** for that method
3. **Check the logs** to see detailed errors
4. **Test the endpoints** to verify it works
5. **If still issues**, share the log output for specific help

## Quick Commands Cheat Sheet

```bash
# Setup
./setup-cpanel.sh          # Interactive setup

# Diagnostics
./diagnose.sh              # Check everything

# Restart
pm2 restart all            # Restart application

# Logs
pm2 logs                   # View live logs
pm2 logs --lines 100       # Last 100 lines
pm2 logs --err             # Errors only

# Test
curl http://localhost:3001/api/health      # Test DB connection
curl http://localhost:3001/api/products    # Test products

# PM2 Management
pm2 status                 # Check status
pm2 stop all              # Stop app
pm2 start ecosystem.config.js  # Start app
pm2 save                  # Save configuration
```

## Success Indicators

✅ Logs show: "MySQL database connected successfully"  
✅ `/api/health` returns database info  
✅ `/api/products` returns products array  
✅ `/api/register` creates user successfully  
✅ No 500 errors in browser console

## Need More Help?

If after following these steps you still have issues:

1. Run `./diagnose.sh > output.txt`
2. Run `pm2 logs --lines 200 > logs.txt`
3. Share both outputs

The detailed logging will show the exact error! 🎯
