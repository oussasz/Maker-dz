import mongoose from "mongoose";
import Category from "../models/Category.js";
import dotenv from "dotenv";

dotenv.config();

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

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    const connectionString = process.env.MONGODB_URL;
    const DBName = process.env.DATABASE_NAME;

    if (!connectionString) {
      console.error("MONGODB_URL is not defined in .env file");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(connectionString, {
      dbName: DBName,
      bufferCommands: false,
    });
    console.log("Connected to MongoDB");

    // Clear existing categories (optional - remove this if you want to keep existing ones)
    // await Category.deleteMany({});
    // console.log('Cleared existing categories');

    // Insert categories one by one to handle duplicates
    for (const category of categories) {
      try {
        const existingCategory = await Category.findOne({
          slug: category.slug,
        });
        if (existingCategory) {
          console.log(
            `Category "${category.name}" already exists, skipping...`
          );
        } else {
          await Category.create(category);
          console.log(`✓ Added category: ${category.name}`);
        }
      } catch (error) {
        console.error(
          `Error adding category "${category.name}":`,
          error.message
        );
      }
    }

    console.log("\nCategories seeding completed!");

    // Display all categories
    const allCategories = await Category.find();
    console.log(`\nTotal categories in database: ${allCategories.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
