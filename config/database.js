import mysql from 'mysql2/promise';

let pool;

export const connectDB = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      });

      // Test connection
      await pool.query('SELECT 1');
      console.log('✅ MySQL database connected successfully');
    }
    return pool;
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
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
