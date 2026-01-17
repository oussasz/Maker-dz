# 🔧 SIMPLE FIX INSTRUCTIONS

## Your Problem
500 errors on `/api/products` and `/api/register`

## The Cause
Your database tables don't exist yet.

---

## STEP 1: Create Database Tables (2 minutes)

1. **Login to cPanel** (your hosting control panel)

2. **Go to File Manager**
   - Click on "File Manager" in cPanel
   
3. **Upload the setup file**
   - Navigate to where your app files are (same folder as `server.js`)
   - Or go to `public_html` folder
   - Click "Upload"
   - Upload the file: `setup-database.php` (I created this file)
   
4. **Run the setup**
   - Open your browser
   - Go to: `https://maker-dz.net/setup-database.php`
   - Wait for green checkmarks ✅
   - You should see "Setup Complete!"

5. **DELETE the file** (important for security!)
   - Go back to File Manager
   - Right-click on `setup-database.php`
   - Click "Delete"

---

## STEP 2: Upload Updated Code (2 minutes)

I've updated these files with better error handling. Upload them to your cPanel:

- `config/database.js`
- `controllers/mysql/authController.js`
- `controllers/mysql/productController.js`
- `index.js`

**How to upload:**
1. In cPanel File Manager, navigate to your app folder
2. Upload each file, replacing the old version

---

## STEP 3: Restart Your App (1 minute)

1. In cPanel, go to **"Setup Node.js App"**
2. Find your app and click on it
3. Click **"Restart"** button
4. Wait 30 seconds

---

## STEP 4: Test (30 seconds)

Open these URLs in your browser:

1. **Test server is running:**
   ```
   https://maker-dz.net/api/ping
   ```
   Should show: `{"status":"OK","message":"Server is running"...}`

2. **Test database connection:**
   ```
   https://maker-dz.net/api/health
   ```
   Should show: `{"status":"OK","database":"qqbmuabu_maker_dz"...}`

3. **Test products:**
   ```
   https://maker-dz.net/api/products
   ```
   Should show: `{"products":[],"pagination":{...}}`

---

## If It Still Doesn't Work

### Check if Node.js version is correct:
1. Go to "Setup Node.js App" in cPanel
2. Your Node.js version should be **18.x or 20.x** (NOT 14 or 16)
3. If it's wrong, change it and click "Run NPM Install"
4. Then click "Restart"

### Check if dependencies are installed:
1. In "Setup Node.js App"
2. Click **"Run NPM Install"** button
3. Wait for it to complete
4. Click "Restart"

---

## Missing Cloudinary (Optional - for images)

You're missing Cloudinary settings. Add these to your cPanel Node.js App environment variables:

| Name | Value |
|------|-------|
| CLOUDINARY_CLOUD_NAME | (get from cloudinary.com) |
| CLOUDINARY_API_KEY | (get from cloudinary.com) |
| CLOUDINARY_API_SECRET | (get from cloudinary.com) |

Without these, you can't upload product images, but everything else will work.

---

## Summary

1. ✅ Upload `setup-database.php` to cPanel
2. ✅ Open `https://maker-dz.net/setup-database.php` in browser
3. ✅ Delete `setup-database.php` after it runs
4. ✅ Upload the updated code files
5. ✅ Restart your Node.js app in cPanel
6. ✅ Test `https://maker-dz.net/api/health`

That's it! Your app should work now. 🚀
