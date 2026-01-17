#!/bin/bash

# Quick Test Script for maker-dz.net API
# Tests all major endpoints

echo "=================================="
echo "Testing maker-dz.net API"
echo "=================================="
echo ""

BASE_URL="https://maker-dz.net"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test 1: Health Check
echo -e "${BLUE}1. Testing Health Endpoint...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/health")
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓ Health check passed (200)${NC}"
    curl -s "$BASE_URL/api/health" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/api/health"
else
    echo -e "${RED}✗ Health check failed (HTTP $response)${NC}"
fi
echo ""

# Test 2: Products Endpoint
echo -e "${BLUE}2. Testing Products Endpoint...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/products")
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓ Products endpoint working (200)${NC}"
    curl -s "$BASE_URL/api/products?limit=2" | python3 -m json.tool 2>/dev/null | head -30 || curl -s "$BASE_URL/api/products?limit=2" | head -30
else
    echo -e "${RED}✗ Products endpoint failed (HTTP $response)${NC}"
    echo "Response:"
    curl -s "$BASE_URL/api/products"
fi
echo ""

# Test 3: Categories Endpoint
echo -e "${BLUE}3. Testing Categories Endpoint...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/categories")
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓ Categories endpoint working (200)${NC}"
    curl -s "$BASE_URL/api/categories?limit=3" | python3 -m json.tool 2>/dev/null | head -30 || curl -s "$BASE_URL/api/categories?limit=3" | head -30
else
    echo -e "${RED}✗ Categories endpoint failed (HTTP $response)${NC}"
fi
echo ""

# Test 4: Register Endpoint (with test data)
echo -e "${BLUE}4. Testing Register Endpoint...${NC}"
RANDOM_USER="testuser_$(date +%s)"
RANDOM_EMAIL="test_$(date +%s)@example.com"

response=$(curl -s -X POST "$BASE_URL/api/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$RANDOM_USER\",\"email\":\"$RANDOM_EMAIL\",\"password\":\"Test123!\",\"role\":\"customer\"}")

if echo "$response" | grep -q "successfully"; then
    echo -e "${GREEN}✓ Register endpoint working${NC}"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
else
    # Check if it's just a duplicate user error
    if echo "$response" | grep -q "already"; then
        echo -e "${YELLOW}⚠ Register endpoint working (user already exists)${NC}"
        echo "$response"
    else
        echo -e "${RED}✗ Register endpoint failed${NC}"
        echo "$response"
    fi
fi
echo ""

# Test 5: Cities Endpoint
echo -e "${BLUE}5. Testing Cities Endpoint...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/cities")
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓ Cities endpoint working (200)${NC}"
    curl -s "$BASE_URL/api/cities" | python3 -m json.tool 2>/dev/null | head -20 || curl -s "$BASE_URL/api/cities" | head -20
else
    echo -e "${RED}✗ Cities endpoint failed (HTTP $response)${NC}"
fi
echo ""

# Summary
echo "=================================="
echo "Test Summary"
echo "=================================="
echo ""
echo "Base URL: $BASE_URL"
echo ""
echo "To check logs on server:"
echo "  pm2 logs"
echo ""
echo "To view app status:"
echo "  pm2 status"
echo ""
echo "Frontend should connect to:"
echo "  API: https://maker-dz.net/api/"
echo ""
