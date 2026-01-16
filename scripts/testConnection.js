import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testConnection = async () => {
  try {
    const connectionString = process.env.MONGODB_URL;
    const DBName = process.env.DATABASE_NAME;

    console.log("Testing MongoDB connection...\n");
    console.log("Environment variables:");
    console.log("- MONGODB_URL:", connectionString ? "✓ Set" : "✗ Not set");
    console.log("- DATABASE_NAME:", DBName ? `✓ ${DBName}` : "✗ Not set");
    console.log("");

    if (!connectionString) {
      console.error("❌ MONGODB_URL is not defined in .env file");
      process.exit(1);
    }

    console.log("Attempting to connect...");
    await mongoose.connect(connectionString, {
      dbName: DBName,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ Successfully connected to MongoDB!");
    console.log(`Database: ${mongoose.connection.db.databaseName}`);

    // Test reading categories
    const Category = mongoose.model(
      "Category",
      new mongoose.Schema({}, { strict: false })
    );
    const count = await Category.countDocuments();
    console.log(`Categories in database: ${count}`);

    await mongoose.connection.close();
    console.log("\n✅ Connection test successful!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Connection test failed!");
    console.error("Error:", error.message);

    if (error.message.includes("authentication failed")) {
      console.log("\nPossible solutions:");
      console.log("1. Check your MongoDB username and password");
      console.log(
        "2. Verify the password in your connection string is correct"
      );
      console.log("3. Check if the database user has proper permissions");
      console.log("4. In MongoDB Atlas, make sure your IP is whitelisted");
    }

    process.exit(1);
  }
};

testConnection();
