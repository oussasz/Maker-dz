#!/bin/bash

# API base URL
API_URL="http://localhost:3000/api/categories"

# Array of categories
declare -a categories=(
  '{
    "name": "Pottery & Ceramics",
    "arabicName": "الفخار والسيراميك",
    "frenchName": "Poterie et Céramique",
    "description": "Traditional clay work from Kabylie and beyond"
  }'
  '{
    "name": "Textiles & Weaving",
    "arabicName": "المنسوجات والنسيج",
    "frenchName": "Textiles et Tissage",
    "description": "Handwoven carpets, blankets, and traditional fabrics"
  }'
  '{
    "name": "Jewelry & Silver",
    "arabicName": "المجوهرات والفضة",
    "frenchName": "Bijoux et Argent",
    "description": "Berber silver, traditional Kabyle pieces"
  }'
  '{
    "name": "Leather Goods",
    "arabicName": "المنتجات الجلدية",
    "frenchName": "Produits en Cuir",
    "description": "Handcrafted bags, shoes, and accessories"
  }'
  '{
    "name": "Woodwork & Carving",
    "arabicName": "الأعمال الخشبية",
    "frenchName": "Travail du Bois et Sculpture",
    "description": "Intricate wooden art and furniture"
  }'
  '{
    "name": "Traditional Dress",
    "arabicName": "الأزياء التقليدية",
    "frenchName": "Vêtements Traditionnels",
    "description": "Karakou, Chedda, and regional costumes"
  }'
)

echo "Adding categories to database..."
echo "================================"

# Loop through categories and add them
for category in "${categories[@]}"; do
  echo ""
  echo "Adding category..."
  curl -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "$category"
  echo ""
done

echo ""
echo "================================"
echo "Categories added successfully!"
echo ""
echo "Fetching all categories:"
curl -s "$API_URL" | python3 -m json.tool || curl -s "$API_URL"
