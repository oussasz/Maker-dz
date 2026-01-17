# 🚨 EXPERIENCING 500 ERRORS? START HERE! 🚨

## Quick Fix (Most Common Issue)

Your app is returning 500 errors because the **`.env` file is missing or has wrong database credentials**.

### Fix it in 3 steps:

1. **SSH into cPanel and navigate to your app:**
   ```bash
   cd ~/maker-app-cpanel
   ```

2. **Run the setup script:**
   ```bash
   ./setup-cpanel.sh
   ```
   
   This will guide you through configuration.

3. **Check if it's working:**
   ```bash
   pm2 logs
   ```
   You should see: ✅ MySQL database connected successfully

## Alternative: Quick Manual Fix

If you prefer to do it manually:

```bash
# 1. Create .env file
nano .env

# 2. Add these lines (replace with YOUR values):
DB_HOST=localhost
DB_USER=your_cpanel_mysql_user
DB_PASSWORD=your_password
DB_NAME=your_database_name
JWT_SECRET=your-long-random-secret-here
SESSION_SECRET=another-secret-here
FRONTEND_URL=https://maker-dz.vercel.app
NODE_ENV=production

# 3. Save (Ctrl+X, Y, Enter)

# 4. Restart
pm2 restart all

# 5. Check logs
pm2 logs
```

## Diagnostic Tools

### Run Full Diagnostics
```bash
./diagnose.sh
```
This checks everything and tells you exactly what's wrong.

### View Detailed Logs
```bash
pm2 logs --lines 100
```
With my updates, you'll see detailed error messages showing the exact problem.

## Documentation

- **[FIX_SUMMARY.md](FIX_SUMMARY.md)** - Complete overview of what was fixed
- **[QUICK_FIX.md](QUICK_FIX.md)** - Step-by-step quick fixes
- **[CPANEL_DEBUG_CHECKLIST.md](CPANEL_DEBUG_CHECKLIST.md)** - Full troubleshooting guide

## What Was Fixed

I enhanced your code to show detailed error logging:

1. **Database connection errors** - Shows which credentials are missing
2. **Registration errors** - Shows exactly why registration failed
3. **Product fetch errors** - Shows SQL errors and query details

Now instead of generic "500 error", you'll see messages like:
- ❌ "Database credentials not configured. Please check .env file."
- ❌ "ER_ACCESS_DENIED_ERROR: Access denied for user..."
- ❌ "Missing required fields: password"

## Still Not Working?

1. Run diagnostics: `./diagnose.sh`
2. Check logs: `pm2 logs --lines 200`
3. The detailed error messages will tell you exactly what's wrong!

---

**TL;DR: Missing .env file with database credentials. Run `./setup-cpanel.sh` to fix it! 🚀**
