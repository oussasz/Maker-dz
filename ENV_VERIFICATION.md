# ✅ Environment Variables Verification

## Current Configuration Status

### ✅ Database Configuration

- **DB_HOST**: localhost ✓
- **DB_USER**: qqbmuabu_admin ✓
- **DB_PASSWORD**: Set ✓
- **DB_NAME**: qqbmuabu_maker_dz ✓
- **DB_PORT**: 3306 ✓

### ✅ Security

- **JWT_SECRET**: Set (64 characters) ✓
- **SESSION_SECRET**: Set ✓

### ✅ URLs

- **BACKEND_URL**: https://maker-dz.net ✓
- **FRONTEND_URL**: https://maker-dz.net ✓

### ✅ Google OAuth

- **GOOGLE_CLIENT_ID**: Set ✓
- **GOOGLE_CLIENT_SECRET**: Set ✓
- **GOOGLE_CALLBACK_URL**: https://maker-dz.net/api/auth/google/callback ✓

### ⚠️ Missing (Required for Image Uploads)

You need to add these to cPanel Node.js App Environment Variables:

- **CLOUDINARY_CLOUD_NAME**: (Get from https://cloudinary.com/console)
- **CLOUDINARY_API_KEY**: (Get from Cloudinary dashboard)
- **CLOUDINARY_API_SECRET**: (Get from Cloudinary dashboard)

## How to Test Your Setup

### 1. Test Database Connection

Open in browser:

```
https://maker-dz.net/api/health
```

**Expected Response:**

```json
{
  "status": "OK",
  "database": "qqbmuabu_maker_dz",
  "mysqlVersion": "8.0.x"
}
```

### 2. Test Product Listing

```
https://maker-dz.net/api/products
```

**Expected Response:**

```json
{
  "products": [],
  "pagination": {...}
}
```

### 3. Test User Registration

Use your frontend or:

```bash
curl -X POST https://maker-dz.net/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "role": "customer"
  }'
```

## Common Issues & Solutions

### Issue: Still Getting 500 Errors

**Check Server Logs:**
In cPanel Node.js App:

1. Click on your app
2. Scroll to "Actions"
3. Click "View Logs"

With the enhanced logging I added, you'll now see detailed errors like:

- "Missing required fields: password"
- "ER_ACCESS_DENIED_ERROR: Access denied for user..."
- "CLOUDINARY_CLOUD_NAME is not defined"

### Issue: Can't Upload Images

**Cause:** Missing Cloudinary credentials

**Fix:** Add to cPanel Node.js App → Environment Variables:

1. Go to Setup Node.js App
2. Click on your app
3. Scroll to "Environment Variables"
4. Add:
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
5. Click "Save"
6. Click "Restart" button

### Issue: CORS Errors from Frontend

**Check:** Make sure frontend is accessing the correct URL:

- Frontend should call: `https://maker-dz.net/api/...`
- Not: `http://localhost:3001/api/...`

Your FRONTEND_URL is correctly set to `https://maker-dz.net`, so the backend will allow requests from that domain.

## Restart Your App

After adding Cloudinary credentials (if needed):

**In cPanel:**

1. Go to Setup Node.js App
2. Click on your app
3. Click "Restart" button

**Or via SSH:**

```bash
cd ~/maker-app-cpanel
pm2 restart all
pm2 logs  # Check logs
```

## Database Tables Check

If `/api/products` returns 500 error, verify tables exist:

**Via phpMyAdmin:**

1. cPanel → phpMyAdmin
2. Select database: `qqbmuabu_maker_dz`
3. Check if these tables exist:
   - users
   - products
   - categories
   - product_variants
   - product_categories
   - orders
   - carts
   - wishlists

**If tables don't exist:**

```bash
mysql -u qqbmuabu_admin -p qqbmuabu_maker_dz < config/schema.sql
```

## Next Steps

1. ✅ **Environment variables are set** (except Cloudinary)
2. 🔍 **Test the health endpoint**: https://maker-dz.net/api/health
3. 🔍 **Test products endpoint**: https://maker-dz.net/api/products
4. 🔍 **Check logs** if you get 500 errors
5. ➕ **Add Cloudinary credentials** for image uploads
6. 🔄 **Restart app** after adding Cloudinary

## Your Configuration Summary

```env
# Database: ✅ Configured
Database: qqbmuabu_maker_dz @ localhost:3306
User: qqbmuabu_admin

# Authentication: ✅ Configured
JWT & Session secrets are set

# URLs: ✅ Configured
Backend: https://maker-dz.net
Frontend: https://maker-dz.net

# Google OAuth: ✅ Configured
Client ID & Secret are set

# Cloudinary: ⚠️ MISSING
Need to add cloud_name, api_key, api_secret
```

## Testing URLs

- Health Check: https://maker-dz.net/api/health
- Products: https://maker-dz.net/api/products
- Register: https://maker-dz.net/api/register (POST)
- Login: https://maker-dz.net/api/login (POST)
- Categories: https://maker-dz.net/api/categories

## If Everything Works

✅ You should be able to:

- Register users
- Login
- Fetch products
- Create products (sellers)
- Add to cart
- Place orders

⚠️ You won't be able to:

- Upload product images (needs Cloudinary)
- Upload user avatars (needs Cloudinary)

---

**Status:** Your configuration looks good! Test the endpoints and add Cloudinary credentials for full functionality. 🚀
