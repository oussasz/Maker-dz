# Quick Start: Adding Categories

## 🔧 First: Fix Your Database Connection

Run this test to check your database connection:

```bash
node scripts/testConnection.js
```

If it fails, you need to fix your MongoDB credentials in the `.env` file.

## ✅ Once Connection Works

### Add all 6 categories at once:

```bash
node scripts/seedCategories.js
```

### Or add them via the API:

```bash
# Make sure backend is running first!
bash scripts/addCategories.sh
```

## 📋 Categories Being Added

1. **Pottery & Ceramics** (الفخار والسيراميك)
2. **Textiles & Weaving** (المنسوجات والنسيج)
3. **Jewelry & Silver** (المجوهرات والفضة)
4. **Leather Goods** (المنتجات الجلدية)
5. **Woodwork & Carving** (الأعمال الخشبية)
6. **Traditional Dress** (الأزياء التقليدية)

## 🌐 View Categories

After adding, visit: **http://localhost:5173/categories**

---

For detailed troubleshooting, see [CATEGORY_SETUP_GUIDE.md](./CATEGORY_SETUP_GUIDE.md)
