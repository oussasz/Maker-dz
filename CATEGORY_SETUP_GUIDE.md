# Category Addition Guide

## Database Issue Detected

Your MongoDB connection is failing with authentication error. This needs to be fixed first.

## Steps to Fix Database Connection

1. **Check your .env file** in `maker-app-backend-main/`:

   ```bash
   cd maker-app-backend-main
   cat .env
   ```

2. **Verify these variables exist and are correct**:

   - `MONGODB_URL` - Should be your MongoDB connection string
   - `DATABASE_NAME` - Should be your database name

3. **Common Issues**:
   - Wrong password in connection string
   - Expired MongoDB Atlas credentials
   - IP address not whitelisted in MongoDB Atlas
   - Database user doesn't have write permissions

## Once Database is Fixed, Add Categories

### Method 1: Using the Seed Script (Recommended)

```bash
cd maker-app-backend-main
node scripts/seedCategories.js
```

### Method 2: Using curl (if backend is running)

```bash
# Start backend in one terminal:
cd maker-app-backend-main
npm start

# In another terminal, run:
bash scripts/addCategories.sh
```

### Method 3: Manual Database Entry

Use MongoDB Compass or Atlas and insert these documents into the `categories` collection:

```json
[
  {
    "name": "Pottery & Ceramics",
    "arabicName": "الفخار والسيراميك",
    "frenchName": "Poterie et Céramique",
    "slug": "pottery-ceramics",
    "description": "Traditional clay work from Kabylie and beyond",
    "isActive": true
  },
  {
    "name": "Textiles & Weaving",
    "arabicName": "المنسوجات والنسيج",
    "frenchName": "Textiles et Tissage",
    "slug": "textiles-weaving",
    "description": "Handwoven carpets, blankets, and traditional fabrics",
    "isActive": true
  },
  {
    "name": "Jewelry & Silver",
    "arabicName": "المجوهرات والفضة",
    "frenchName": "Bijoux et Argent",
    "slug": "jewelry-silver",
    "description": "Berber silver, traditional Kabyle pieces",
    "isActive": true
  },
  {
    "name": "Leather Goods",
    "arabicName": "المنتجات الجلدية",
    "frenchName": "Produits en Cuir",
    "slug": "leather-goods",
    "description": "Handcrafted bags, shoes, and accessories",
    "isActive": true
  },
  {
    "name": "Woodwork & Carving",
    "arabicName": "الأعمال الخشبية",
    "frenchName": "Travail du Bois et Sculpture",
    "slug": "woodwork-carving",
    "description": "Intricate wooden art and furniture",
    "isActive": true
  },
  {
    "name": "Traditional Dress",
    "arabicName": "الأزياء التقليدية",
    "frenchName": "Vêtements Traditionnels",
    "slug": "traditional-dress",
    "description": "Karakou, Chedda, and regional costumes",
    "isActive": true
  }
]
```

## Verify Categories Are Added

1. **Check via API**:

   ```bash
   curl http://localhost:3000/api/categories
   ```

2. **Check on Frontend**:
   - Navigate to http://localhost:5173/categories
   - You should see all 6 categories displayed

## Troubleshooting

### If categories don't appear:

1. Clear browser cache
2. Restart frontend dev server
3. Check browser console for errors
4. Verify backend API is returning data

### If database authentication fails:

1. Update MongoDB Atlas password
2. Whitelist your IP address
3. Check database user permissions
4. Update connection string in .env file
