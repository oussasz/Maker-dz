import mysql from "mysql2/promise";

let pool;

export const connectDB = async () => {
  try {
    if (!pool) {
      console.log("=== Connecting to MySQL ===");
      console.log("Host:", process.env.DB_HOST || "localhost");
      console.log("Database:", process.env.DB_NAME || "not set");
      console.log("User:", process.env.DB_USER || "not set");
      console.log(
        "Password:",
        process.env.DB_PASSWORD ? "***SET***" : "NOT SET",
      );

      pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });

      // Test connection
      const [rows] = await pool.query("SELECT 1 as test");
      console.log("✅ MySQL database connected successfully");

      // Check if users table exists
      try {
        const [tables] = await pool.query("SHOW TABLES LIKE 'users'");
        if (tables.length === 0) {
          console.log(
            "⚠️ WARNING: 'users' table does not exist! Run setup-database.php first.",
          );
        } else {
          console.log("✅ 'users' table exists");
        }
      } catch (e) {
        console.log("⚠️ Could not check tables:", e.message);
      }
    }
    return pool;
  } catch (error) {
    console.error("❌ MySQL connection error:", error.message);
    console.error("Error code:", error.code);
    throw error;
  }
};

export const getConnection = async () => {
  if (!pool) {
    await connectDB();
  }
  return pool;
};

export default pool;
