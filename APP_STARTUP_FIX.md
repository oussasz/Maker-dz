# 🚨 URGENT: App Not Starting on cPanel

## Current Issue

Your environment variables are **correctly configured**, but the app itself is **not starting**.

Error message: **"Web application could not be started"**

## Why This Happens

Common causes:
1. **Missing dependencies** - node_modules not installed
2. **Wrong Node.js version** - App requires specific version
3. **Port binding issue** - App trying to use wrong port
4. **Syntax error** - Code has errors preventing startup
5. **Missing startup file** - cPanel can't find server.js or index.js
6. **Module type mismatch** - ES modules vs CommonJS

## How to Fix

### Step 1: Check cPanel Node.js App Configuration

1. Log into cPanel
2. Go to **Setup Node.js App**
3. Click on your application
4. Check these settings:

**Required Settings:**
- ✓ **Node.js version**: 18.x or higher (recommended: 20.x)
- ✓ **Application mode**: Production
- ✓ **Application root**: `/home/qqbmuabu/maker-app-cpanel` (or your path)
- ✓ **Application URL**: maker-dz.net
- ✓ **Application startup file**: `server.js`

### Step 2: Check the Error Log

In the Node.js App interface:
1. Scroll down to **"Open logs"** or **"Actions"**
2. Click to view error logs
3. Look for the startup error

Common errors you might see:
- `Cannot find module` - Missing dependencies
- `SyntaxError` - Code syntax error
- `Error: listen EADDRINUSE` - Port already in use
- `TypeError` - Wrong Node.js version

### Step 3: Reinstall Dependencies

Click **"Run NPM Install"** button in cPanel Node.js App interface

Or via SSH:
```bash
cd ~/maker-app-cpanel
rm -rf node_modules package-lock.json
npm install
```

### Step 4: Check package.json

Your package.json must have:
```json
{
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node server.js"
  }
}
```

### Step 5: Verify Startup File

Make sure `server.js` exists and imports from `index.js`:
```javascript
import app from "./index.js";
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 6: Check Node Version Compatibility

Some packages require specific Node.js versions:
- **argon2** requires Node.js 18+
- **sharp** requires Node.js 18+
- **mysql2** works with Node.js 18+

**Set Node.js version in cPanel:**
1. Setup Node.js App → Select your app
2. Change "Node.js version" to **20.x LTS** (recommended)
3. Click "Save"
4. Click "Run NPM Install"
5. Click "Restart"

## Quick Fix Commands (Via SSH)

```bash
# Navigate to app
cd ~/maker-app-cpanel

# Check current directory
pwd

# List files
ls -la

# Check if package.json exists
cat package.json | head -20

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for syntax errors
node --check server.js

# Try running locally to see error
node server.js
```

## Most Likely Issues

### Issue 1: Node.js Version Too Old
**Symptom:** App won't start, no clear error
**Fix:** 
1. cPanel → Setup Node.js App
2. Change to Node.js 20.x
3. Run NPM Install
4. Restart

### Issue 2: Dependencies Not Installed
**Symptom:** "Cannot find module" errors
**Fix:**
1. Click "Run NPM Install" in cPanel
2. Wait for completion
3. Click "Restart"

### Issue 3: Wrong Startup File
**Symptom:** App won't start immediately
**Fix:**
1. Application startup file should be: `server.js`
2. Make sure server.js exists in application root
3. Restart app

### Issue 4: Port Configuration
**Symptom:** Port binding errors
**Fix:**
Your server.js should use `process.env.PORT`:
```javascript
const PORT = process.env.PORT || 3001;
```
cPanel automatically sets the PORT variable.

### Issue 5: ES Modules Not Configured
**Symptom:** "Cannot use import statement"
**Fix:**
Ensure package.json has:
```json
{
  "type": "module"
}
```

## Check Your Current Setup

Run these checks via SSH:

```bash
# 1. Check Node version
node --version  # Should be v18+ or v20+

# 2. Check if app files exist
ls -la ~/maker-app-cpanel/server.js
ls -la ~/maker-app-cpanel/index.js
ls -la ~/maker-app-cpanel/package.json

# 3. Check if node_modules exists
ls ~/maker-app-cpanel/node_modules | wc -l  # Should show many packages

# 4. Try to start app manually
cd ~/maker-app-cpanel
node server.js
# Press Ctrl+C to stop

# 5. Check for syntax errors
node --check server.js
node --check index.js
```

## Restart Checklist

After making changes:

1. ✓ Save changes in cPanel Node.js App
2. ✓ Click "Run NPM Install" (if dependencies changed)
3. ✓ Click "Restart" button
4. ✓ Wait 30 seconds
5. ✓ Test: `curl https://maker-dz.net/api/health`

## If Still Not Working

**Get the actual error:**

Via SSH:
```bash
cd ~/maker-app-cpanel
node server.js 2>&1 | tee startup-error.log
```

Then share the `startup-error.log` content.

**Or check cPanel logs:**
1. Setup Node.js App → Your app
2. Click "Open logs"
3. Look for the error message
4. Share that error

## Expected Behavior When Working

When your app starts successfully, you should see in logs:
```
🚀 Server running on port 3001
📍 Environment: production
✅ MySQL database connected successfully
```

And this URL should work:
- https://maker-dz.net/api/health

## Next Steps

1. **Check Node.js version** in cPanel (should be 20.x)
2. **Click "Run NPM Install"** in cPanel
3. **Click "Restart"**
4. **Check logs** for specific error
5. **Share the error message** if still not working

---

**Quick Fix:** Most likely you need to click "Run NPM Install" and ensure Node.js version is 18+ or 20+.
