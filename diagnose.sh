#!/bin/bash

echo "================================"
echo "cPanel App Diagnostic Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
echo "1. Checking .env file..."
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    echo ""
    echo "Environment variables found:"
    grep -E "^(DB_HOST|DB_USER|DB_NAME|DB_PORT|JWT_SECRET|NODE_ENV)" .env | sed 's/=.*PASSWORD.*/=***HIDDEN***/' | sed 's/=.*SECRET.*/=***HIDDEN***/'
    echo ""
else
    echo -e "${RED}✗${NC} .env file NOT found!"
    echo "Please create a .env file with database credentials"
    exit 1
fi

# Source .env file
export $(cat .env | grep -v '^#' | xargs)

# Check database credentials are set
echo "2. Checking database credentials..."
if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_NAME" ]; then
    echo -e "${RED}✗${NC} Database credentials are incomplete"
    echo "Missing: "
    [ -z "$DB_USER" ] && echo "  - DB_USER"
    [ -z "$DB_PASSWORD" ] && echo "  - DB_PASSWORD"
    [ -z "$DB_NAME" ] && echo "  - DB_NAME"
    exit 1
else
    echo -e "${GREEN}✓${NC} Database credentials are set"
fi

# Test MySQL connection
echo ""
echo "3. Testing MySQL connection..."
DB_HOST_VAL=${DB_HOST:-localhost}
DB_PORT_VAL=${DB_PORT:-3306}

mysql -h "$DB_HOST_VAL" -P "$DB_PORT_VAL" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" "$DB_NAME" 2>&1 > /dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} MySQL connection successful"
    
    # Check tables
    echo ""
    echo "4. Checking database tables..."
    TABLES=$(mysql -h "$DB_HOST_VAL" -P "$DB_PORT_VAL" -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -e "SHOW TABLES;" 2>&1 | tail -n +2)
    
    if [ -z "$TABLES" ]; then
        echo -e "${YELLOW}⚠${NC} No tables found in database"
        echo "You may need to run: mysql -u $DB_USER -p $DB_NAME < config/schema.sql"
    else
        echo -e "${GREEN}✓${NC} Found tables:"
        echo "$TABLES" | sed 's/^/  - /'
        
        # Check for required tables
        REQUIRED_TABLES=("users" "products" "categories")
        for table in "${REQUIRED_TABLES[@]}"; do
            if echo "$TABLES" | grep -q "^$table$"; then
                echo -e "${GREEN}✓${NC} $table table exists"
            else
                echo -e "${RED}✗${NC} $table table MISSING"
            fi
        done
    fi
else
    echo -e "${RED}✗${NC} MySQL connection FAILED"
    echo "Error connecting to database. Check credentials in .env file"
    exit 1
fi

# Check JWT_SECRET
echo ""
echo "5. Checking JWT_SECRET..."
if [ -z "$JWT_SECRET" ]; then
    echo -e "${YELLOW}⚠${NC} JWT_SECRET not set"
else
    echo -e "${GREEN}✓${NC} JWT_SECRET is set"
fi

# Check Node.js version
echo ""
echo "6. Checking Node.js version..."
NODE_VERSION=$(node --version 2>&1)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Node.js version: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
fi

# Check if node_modules exists
echo ""
echo "7. Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
else
    echo -e "${YELLOW}⚠${NC} node_modules not found. Run: npm install"
fi

# Check if PM2 is running the app
echo ""
echo "8. Checking PM2 process..."
PM2_CHECK=$(pm2 list 2>&1 | grep -i "maker")
if [ ! -z "$PM2_CHECK" ]; then
    echo -e "${GREEN}✓${NC} PM2 process found:"
    pm2 list | grep -A 1 "maker"
else
    echo -e "${YELLOW}⚠${NC} No PM2 process found"
    echo "Start your app with: pm2 start ecosystem.config.js"
fi

# Summary
echo ""
echo "================================"
echo "Diagnostic Summary"
echo "================================"
echo ""
echo "If all checks passed, your app should work."
echo "If there are errors, fix them and restart your app:"
echo "  pm2 restart all"
echo ""
echo "To view live logs:"
echo "  pm2 logs"
echo ""
echo "To test the health endpoint:"
echo "  curl http://localhost:\${PORT:-3001}/api/health"
echo ""
