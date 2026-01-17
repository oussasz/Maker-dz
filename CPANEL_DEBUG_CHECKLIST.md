# cPanel Debug Checklist - 500 Errors Fix

## Current Issues
- `/api/products` returning 500 error
- `/api/register` returning 500 error

## Most Likely Causes & Solutions

### 1. **Missing or Incorrect .env File** (MOST LIKELY)
Your cPanel deployment likely doesn't have a `.env` file or has incorrect database credentials.

**How to check on cPanel:**
```bash
# SSH into your cPanel
cd ~/your-app-folder
cat .env
```

**Required environment variables:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this

# Session Secret
SESSION_SECRET=your-session-secret-key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com

# Environment
NODE_ENV=production
```

### 2. **Database Not Created or Tables Missing**
Check if your MySQL database and tables exist.

**How to check:**
1. Log into cPanel → phpMyAdmin
2. Select your database
3. Check if these tables exist:
   - `users`
   - `products`
   - `categories`
   - `product_variants`
   - `product_categories`
   - `orders`
   - `carts`
   - `wishlists`
   - `reviews`
   - `addresses`
   - `seller_profiles`

**If tables don't exist, run:**
```bash
# SSH into cPanel
cd ~/your-app-folder
mysql -u your_db_user -p your_db_name < config/schema.sql
```

### 3. **Check Server Logs**
With the updated error logging, check your server logs:

**Using PM2:**
```bash
pm2 logs maker-app --lines 100
```

**Or check Node.js logs in cPanel:**
- Go to cPanel → Setup Node.js App
- Click on your application
- View logs section

### 4. **Database Connection Issues**
Common database connection problems:

**Error: "ER_ACCESS_DENIED_ERROR"**
- Wrong username or password in `.env`
- Fix: Update DB_USER and DB_PASSWORD

**Error: "ER_BAD_DB_ERROR"**
- Database doesn't exist
- Fix: Create database in cPanel → MySQL Databases

**Error: "ER_NOT_SUPPORTED_AUTH_MODE"**
- MySQL 8+ using caching_sha2_password
- Fix: Change user password type to mysql_native_password:
```sql
ALTER USER 'your_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### 5. **Test Database Connection**
Create a test script to verify database connection:

```bash
# SSH into cPanel
cd ~/your-app-folder
node -e "
import('dotenv/config').then(() => {
  import('./config/database.js').then(async ({ connectDB }) => {
    try {
      const pool = await connectDB();
      const [rows] = await pool.query('SELECT DATABASE() as db, VERSION() as version');
      console.log('✅ Database connected:', rows[0]);
      process.exit(0);
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  });
});
"
```

Or visit: `https://your-domain.com/api/health`

### 6. **Restart Your Application**
After making changes:

```bash
# Using PM2
pm2 restart maker-app

# Or using cPanel Node.js App Manager
# Go to Setup Node.js App → Click Restart
```

### 7. **Check File Permissions**
Ensure your application files have correct permissions:

```bash
# Set correct permissions
cd ~/your-app-folder
chmod -R 755 .
chmod 644 .env
```

## Step-by-Step Debug Process

### Step 1: Check if .env file exists
```bash
ls -la .env
```
If it doesn't exist, create it using the template above.

### Step 2: Verify database credentials
```bash
# Try connecting manually
mysql -h localhost -u your_db_user -p your_db_name
# If this fails, your credentials are wrong
```

### Step 3: Check application logs
```bash
# Check PM2 logs
pm2 logs --lines 50

# Or check error logs
tail -100 logs/error.log
```

### Step 4: Test the health endpoint
```bash
curl https://your-domain.com/api/health
```
This should return database connection status.

### Step 5: Test register endpoint manually
```bash
curl -X POST https://your-domain.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!","role":"customer"}'
```

### Step 6: Test products endpoint
```bash
curl https://your-domain.com/api/products
```

## Common cPanel Deployment Issues

### Issue: Environment variables not loading
**Solution:** Ensure `.env` file is in the root of your application directory (same level as `server.js` or `index.js`)

### Issue: MySQL connection refused
**Solution:** Use `localhost` not `127.0.0.1` for DB_HOST on cPanel

### Issue: Port already in use
**Solution:** Change PORT in `.env` or let cPanel assign it automatically

### Issue: Module not found errors
**Solution:** Run `npm install` in your application directory

## Quick Fix Commands

```bash
# 1. Navigate to your app
cd ~/your-app-folder

# 2. Install dependencies
npm install

# 3. Check if .env exists and has correct values
cat .env

# 4. Test database connection
mysql -h localhost -u your_db_user -p your_db_name -e "SHOW TABLES;"

# 5. Restart application
pm2 restart all
# OR
pm2 restart maker-app

# 6. Check logs
pm2 logs --lines 100
```

## Need More Help?

After following these steps:
1. Check the logs for specific error messages
2. The updated code now logs detailed error information
3. Share the error messages from the logs for more specific help

## What Changed in the Code

I've updated three files to provide better error logging:

1. **config/database.js** - Shows detailed connection info and validates env vars
2. **controllers/mysql/authController.js** - Logs each step of registration
3. **controllers/mysql/productController.js** - Logs detailed product fetching info

Now when you get a 500 error, check your server logs to see the actual error message!
