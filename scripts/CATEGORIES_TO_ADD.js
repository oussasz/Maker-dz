// Instructions to add categories to your database:
// ================================================
//
// OPTION 1: Fix database credentials and run the seed script
// -----------------------------------------------------------
// 1. Check your .env file in maker-app-backend-main/
// 2. Verify MONGODB_URL has correct credentials
// 3. Run: node scripts/seedCategories.js
//
// OPTION 2: Use MongoDB Compass or Atlas
// -----------------------------------------------------------
// 1. Open MongoDB Compass or MongoDB Atlas
// 2. Connect to your database
// 3. Go to the 'categories' collection
// 4. Insert the documents below manually
//
// OPTION 3: Use the API (if backend is running)
// -----------------------------------------------------------
// 1. Start your backend server
// 2. Use Postman or curl to POST to http://localhost:3000/api/categories
// 3. Send each category as JSON
//
// CATEGORIES TO ADD:
// ==================

const categories = [
  {
    name: "Pottery & Ceramics",
    arabicName: "الفخار والسيراميك",
    frenchName: "Poterie et Céramique",
    slug: "pottery-ceramics",
    description: "Traditional clay work from Kabylie and beyond",
    isActive: true,
  },
  {
    name: "Textiles & Weaving",
    arabicName: "المنسوجات والنسيج",
    frenchName: "Textiles et Tissage",
    slug: "textiles-weaving",
    description: "Handwoven carpets, blankets, and traditional fabrics",
    isActive: true,
  },
  {
    name: "Jewelry & Silver",
    arabicName: "المجوهرات والفضة",
    frenchName: "Bijoux et Argent",
    slug: "jewelry-silver",
    description: "Berber silver, traditional Kabyle pieces",
    isActive: true,
  },
  {
    name: "Leather Goods",
    arabicName: "المنتجات الجلدية",
    frenchName: "Produits en Cuir",
    slug: "leather-goods",
    description: "Handcrafted bags, shoes, and accessories",
    isActive: true,
  },
  {
    name: "Woodwork & Carving",
    arabicName: "الأعمال الخشبية",
    frenchName: "Travail du Bois et Sculpture",
    slug: "woodwork-carving",
    description: "Intricate wooden art and furniture",
    isActive: true,
  },
  {
    name: "Traditional Dress",
    arabicName: "الأزياء التقليدية",
    frenchName: "Vêtements Traditionnels",
    slug: "traditional-dress",
    description: "Karakou, Chedda, and regional costumes",
    isActive: true,
  },
];

// For MongoDB import (JSON format):
console.log(JSON.stringify(categories, null, 2));

// For curl commands:
console.log("\n\n=== CURL COMMANDS ===\n");
categories.forEach((cat) => {
  console.log(`curl -X POST http://localhost:3000/api/categories \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(cat)}'
`);
});
