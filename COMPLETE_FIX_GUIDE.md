# 🎯 COMPLETE FIX GUIDE - maker-dz.net Not Starting

## Current Status

✅ **Environment variables**: Correctly configured  
❌ **App status**: Not starting - shows "Web application could not be started"  
🎯 **Goal**: Get the app running

## The Real Problem

Your app configuration is correct, but the Node.js application itself won't start. This is typically because:

1. **Dependencies not installed** in cPanel environment
2. **Node.js version mismatch**
3. **Startup error** (check logs)

## SOLUTION: 3-Step Fix

### Step 1: Access cPanel Node.js App Manager

1. Log into cPanel (cpanel.maker-dz.net or similar)
2. Find **"Setup Node.js App"** (under Software section)
3. Click on your application

### Step 2: Verify These Settings

**Must have these exact settings:**

| Setting | Value |
|---------|-------|
| **Node.js version** | 20.19.0 or 18.x (NOT 14.x or 16.x) |
| **Application mode** | Production |
| **Application root** | Full path to your app (e.g., `/home/qqbmuabu/maker-app-cpanel`) |
| **Application URL** | maker-dz.net |
| **Application startup file** | `server.js` |

### Step 3: Install Dependencies & Restart

1. Click **"Stop App"** (if running)
2. Click **"Run NPM Install"** button
3. Wait for it to complete (may take 2-5 minutes)
4. Click **"Restart"** button
5. Wait 30 seconds
6. Test: Open https://maker-dz.net/api/health in browser

---

## Detailed Troubleshooting

### Check 1: Node.js Version

**Your app requires Node.js 18+ or 20+**

Why? These packages need modern Node:
- `argon2`: requires Node 18+
- `sharp`: requires Node 18+
- `mysql2`: works best with Node 18+

**How to change:**
1. In Node.js App interface
2. Find "Node.js version" dropdown
3. Select **20.19.0 LTS** or **18.x**
4. Click "Save"
5. Click "Run NPM Install" (important!)
6. Click "Restart"

### Check 2: View Error Logs

To see the ACTUAL error:

**Option A: In cPanel**
1. Setup Node.js App → Your app
2. Scroll to "Actions" or "Logs" section
3. Click "Open logs" or "Show log"
4. Look for red error messages

**Option B: Via SSH**
```bash
cd ~/maker-app-cpanel
tail -100 ~/logs/*.log  # or wherever logs are
```

**Common errors and fixes:**

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module 'argon2'` | Dependencies not installed | Click "Run NPM Install" |
| `Error: Cannot find module` | node_modules missing | Click "Run NPM Install" |
| `node: /lib64/libstdc++.so.6: version GLIBCXX not found` | Node version too old | Change to Node 20.x |
| `SyntaxError: Unexpected token 'import'` | ES modules issue | Check "type": "module" in package.json |
| `Error: listen EADDRINUSE` | Port already used | Restart app in cPanel |

### Check 3: Application Root Path

The "Application root" must be the FULL path to where your files are.

**Find your full path:**
```bash
# SSH into cPanel
cd ~
find . -name "server.js" -type f 2>/dev/null
```

This will show paths like:
- `/home/qqbmuabu/maker-app-cpanel/server.js`

Your **Application root** should be:
- `/home/qqbmuabu/maker-app-cpanel`

### Check 4: Files Exist

Make sure these files exist in Application root:

```bash
ls -la ~/maker-app-cpanel/
```

Must have:
- ✓ `server.js` (startup file)
- ✓ `index.js` (main app)
- ✓ `package.json` (dependencies)
- ✓ `node_modules/` folder (after npm install)

### Check 5: Reinstall Dependencies

Sometimes node_modules get corrupted.

**Via cPanel:**
1. Click "Stop App"
2. Click "Run NPM Install" 
3. Click "Restart"

**Via SSH:**
```bash
cd ~/maker-app-cpanel
rm -rf node_modules package-lock.json
npm install
```

Then restart in cPanel.

---

## Testing

### Test 1: Health Check
```bash
curl https://maker-dz.net/api/health
```

**If working, returns:**
```json
{
  "status": "OK",
  "database": "qqbmuabu_maker_dz",
  "mysqlVersion": "8.0.x"
}
```

**If not working, returns:**
```html
<!doctype html>
<html>...Web application could not be started...
```

### Test 2: Products Endpoint
```bash
curl https://maker-dz.net/api/products
```

**Should return:**
```json
{
  "products": [],
  "pagination": {...}
}
```

### Test 3: Manual Start (SSH)

To see the exact error:
```bash
cd ~/maker-app-cpanel

# Set environment variables
export DB_HOST=localhost
export DB_USER=qqbmuabu_admin
export DB_PASSWORD=')]*I2*aHSCIKBbwG'
export DB_NAME=qqbmuabu_maker_dz
export JWT_SECRET=619c0f4a5efaeadac6d18dcbf12d622a1ab6750eceb4eaf0eba9de342a7cdbd2

# Try to start
node server.js
```

This will show you the exact error!

---

## Common Scenarios

### Scenario 1: "Cannot find module" errors

**Cause:** Dependencies not installed  
**Fix:**
```bash
cd ~/maker-app-cpanel
npm install
```
Then restart in cPanel.

### Scenario 2: App starts but immediately crashes

**Cause:** Database connection issue  
**Check:** Environment variables are set in cPanel Node.js App (you already did this ✓)  
**Test:** SSH and run:
```bash
mysql -h localhost -u qqbmuabu_admin -p qqbmuabu_maker_dz
# Enter password: )]*I2*aHSCIKBbwG
```

### Scenario 3: Port binding errors

**Cause:** App trying to use wrong port  
**Fix:** Your server.js already uses `process.env.PORT` correctly ✓  
cPanel automatically assigns the port.

### Scenario 4: Wrong Node.js version

**Symptom:** Argon2 or Sharp errors  
**Fix:** Change to Node.js 20.x in cPanel

---

## Step-by-Step Video Guide Equivalent

**Do this in exact order:**

1. ✅ Login to cPanel
2. ✅ Click "Setup Node.js App"
3. ✅ Click on your application
4. ✅ **Verify Node.js version = 20.x or 18.x**
5. ✅ **Verify Application startup file = server.js**
6. ✅ **Verify Application root = full path** (e.g., `/home/qqbmuabu/maker-app-cpanel`)
7. ✅ Click "Stop App"
8. ✅ **Click "Run NPM Install"** ⬅️ MOST IMPORTANT
9. ✅ Wait for "NPM Install Complete"
10. ✅ **Click "Restart"**
11. ✅ Wait 30-60 seconds
12. ✅ Open browser: https://maker-dz.net/api/health
13. ✅ Should see database status JSON

---

## Expected Success Messages

**In cPanel logs after restart:**
```
🚀 Server running on port 3001
📍 Environment: production
Initializing MySQL connection pool...
DB Config: {
  host: 'localhost',
  user: 'qqbmuabu_admin',
  database: 'qqbmuabu_maker_dz',
  password: '***set***'
}
Testing database connection...
✅ MySQL database connected successfully
```

**In browser when visiting /api/health:**
```json
{
  "status": "OK",
  "database": "qqbmuabu_maker_dz",
  "mysqlVersion": "8.0.x",
  "host": "localhost",
  "dbUser": "qqbmuabu_admin",
  "dbName": "qqbmuabu_maker_dz"
}
```

---

## If STILL Not Working

Share these details:

1. **Node.js version** from cPanel Node.js App interface
2. **Error log** from cPanel (click "Open logs")
3. **Result of manual start:**
```bash
cd ~/maker-app-cpanel
node server.js 2>&1 | head -50
```

4. **Check node_modules:**
```bash
ls ~/maker-app-cpanel/node_modules | wc -l
# Should be > 100
```

---

## Quick Checklist

- [ ] Node.js version is 18.x or 20.x (NOT 14.x or 16.x)
- [ ] Application startup file is `server.js`
- [ ] Application root path is correct and full path
- [ ] Environment variables are set (you already did this ✓)
- [ ] Clicked "Run NPM Install" and waited for completion
- [ ] Clicked "Restart" after NPM install
- [ ] Waited 60 seconds after restart
- [ ] Checked error logs for specific errors

---

## 99% Solution

**The most common fix:**

1. Change Node.js version to **20.x**
2. Click **"Run NPM Install"**
3. Click **"Restart"**
4. Wait 60 seconds
5. Test https://maker-dz.net/api/health

That's it! 🚀
