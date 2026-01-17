#!/bin/bash

# Quick Setup Script for cPanel Deployment
# Run this on your cPanel server after uploading files

echo "======================================"
echo "Maker App - cPanel Quick Setup"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to prompt for input with default
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    echo -ne "${BLUE}${prompt}${NC}"
    if [ ! -z "$default" ]; then
        echo -ne " [${default}]: "
    else
        echo -ne ": "
    fi
    read value
    
    if [ -z "$value" ] && [ ! -z "$default" ]; then
        value="$default"
    fi
    
    eval "$var_name='$value'"
}

echo "This script will help you set up your Maker app on cPanel."
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo -e "${YELLOW}⚠ .env file already exists!${NC}"
    echo -n "Do you want to recreate it? (y/N): "
    read recreate
    if [ "$recreate" != "y" ] && [ "$recreate" != "Y" ]; then
        echo "Skipping .env creation..."
        SKIP_ENV=true
    else
        echo "Backing up existing .env to .env.backup..."
        cp .env .env.backup
        SKIP_ENV=false
    fi
else
    SKIP_ENV=false
fi

# Create .env file
if [ "$SKIP_ENV" != "true" ]; then
    echo ""
    echo "======================================"
    echo "Step 1: Database Configuration"
    echo "======================================"
    echo ""
    echo "You can find your database credentials in cPanel → MySQL® Databases"
    echo ""
    
    prompt_with_default "Database Host" "localhost" DB_HOST
    prompt_with_default "Database Port" "3306" DB_PORT
    prompt_with_default "Database Name" "" DB_NAME
    prompt_with_default "Database User" "" DB_USER
    prompt_with_default "Database Password" "" DB_PASSWORD
    
    echo ""
    echo "======================================"
    echo "Step 2: Security Configuration"
    echo "======================================"
    echo ""
    
    # Generate random secrets
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || date +%s | sha256sum | base64 | head -c 32)
    SESSION_SECRET=$(openssl rand -base64 32 2>/dev/null || date +%s | sha256sum | base64 | head -c 32)
    
    echo "Generated JWT_SECRET: $JWT_SECRET"
    echo "Generated SESSION_SECRET: $SESSION_SECRET"
    echo ""
    echo -n "Use these generated secrets? (Y/n): "
    read use_generated
    
    if [ "$use_generated" = "n" ] || [ "$use_generated" = "N" ]; then
        prompt_with_default "JWT Secret" "$JWT_SECRET" JWT_SECRET
        prompt_with_default "Session Secret" "$SESSION_SECRET" SESSION_SECRET
    fi
    
    echo ""
    echo "======================================"
    echo "Step 3: Cloudinary Configuration"
    echo "======================================"
    echo ""
    echo "Get these from: https://cloudinary.com/console"
    echo ""
    
    prompt_with_default "Cloudinary Cloud Name" "" CLOUDINARY_CLOUD_NAME
    prompt_with_default "Cloudinary API Key" "" CLOUDINARY_API_KEY
    prompt_with_default "Cloudinary API Secret" "" CLOUDINARY_API_SECRET
    
    echo ""
    echo "======================================"
    echo "Step 4: Frontend Configuration"
    echo "======================================"
    echo ""
    
    prompt_with_default "Frontend URL (Vercel domain)" "https://maker-dz.vercel.app" FRONTEND_URL
    prompt_with_default "Application Port" "3001" PORT
    
    # Create .env file
    echo ""
    echo "Creating .env file..."
    
    cat > .env << EOF
# Database Configuration
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}

# Security
JWT_SECRET=${JWT_SECRET}
SESSION_SECRET=${SESSION_SECRET}

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}

# Frontend URL (for CORS)
FRONTEND_URL=${FRONTEND_URL}

# Application Configuration
NODE_ENV=production
PORT=${PORT}
EOF

    echo -e "${GREEN}✓${NC} .env file created successfully!"
fi

# Test database connection
echo ""
echo "======================================"
echo "Testing Database Connection"
echo "======================================"
echo ""

# Source .env
export $(cat .env | grep -v '^#' | xargs)

mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" "$DB_NAME" 2>&1 > /dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Database connection successful!"
    
    # Check if tables exist
    TABLE_COUNT=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -e "SHOW TABLES;" 2>&1 | wc -l)
    
    if [ $TABLE_COUNT -lt 2 ]; then
        echo ""
        echo -e "${YELLOW}⚠ No tables found in database${NC}"
        echo -n "Do you want to create database tables now? (Y/n): "
        read create_tables
        
        if [ "$create_tables" != "n" ] && [ "$create_tables" != "N" ]; then
            if [ -f config/schema.sql ]; then
                echo "Creating database tables..."
                mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < config/schema.sql
                
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✓${NC} Database tables created successfully!"
                else
                    echo -e "${RED}✗${NC} Error creating database tables"
                fi
            else
                echo -e "${RED}✗${NC} schema.sql file not found!"
            fi
        fi
    else
        echo -e "${GREEN}✓${NC} Database tables already exist"
    fi
else
    echo -e "${RED}✗${NC} Database connection failed!"
    echo "Please check your database credentials and try again."
    echo "You can manually edit the .env file."
    exit 1
fi

# Install dependencies
echo ""
echo "======================================"
echo "Installing Dependencies"
echo "======================================"
echo ""

if [ -f package.json ]; then
    echo "Running npm install..."
    npm install
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Dependencies installed successfully!"
    else
        echo -e "${RED}✗${NC} Error installing dependencies"
        exit 1
    fi
else
    echo -e "${RED}✗${NC} package.json not found!"
    exit 1
fi

# PM2 Setup
echo ""
echo "======================================"
echo "PM2 Setup"
echo "======================================"
echo ""

if command -v pm2 &> /dev/null; then
    echo "PM2 is installed"
    
    echo -n "Do you want to start/restart the application with PM2? (Y/n): "
    read start_pm2
    
    if [ "$start_pm2" != "n" ] && [ "$start_pm2" != "N" ]; then
        # Check if already running
        if pm2 list | grep -q "maker-app"; then
            echo "Restarting application..."
            pm2 restart maker-app
        else
            if [ -f ecosystem.config.js ]; then
                echo "Starting application with ecosystem.config.js..."
                pm2 start ecosystem.config.js
            else
                echo "Starting application with server.js..."
                pm2 start server.js --name maker-app
            fi
        fi
        
        echo ""
        echo "Saving PM2 configuration..."
        pm2 save
        
        echo ""
        echo -e "${GREEN}✓${NC} Application started successfully!"
    fi
else
    echo -e "${YELLOW}⚠ PM2 not installed${NC}"
    echo "Install PM2 globally: npm install -g pm2"
    echo "Or start manually: node server.js"
fi

# Summary
echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Your application is configured with:"
echo "  • Database: $DB_NAME @ $DB_HOST"
echo "  • Port: ${PORT:-3001}"
echo "  • Frontend: $FRONTEND_URL"
echo ""
echo "Next steps:"
echo "  1. Check logs: pm2 logs"
echo "  2. Test health endpoint: curl http://localhost:${PORT:-3001}/api/health"
echo "  3. Run diagnostics: ./diagnose.sh"
echo ""
echo "To view application status:"
echo "  pm2 status"
echo ""
echo "To view logs:"
echo "  pm2 logs maker-app"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
