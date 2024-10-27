const mysql = require('mysql2/promise');
const { config } = require('dotenv');

// Load environment variables from .env file
config();

const pool = mysql.createPool({
  host: process.env.DB_HOST, // Updated to use environment variable
  user: process.env.DB_USER, // Updated to use environment variable
  password: process.env.DB_PASSWORD, // Updated to use environment variable
  database: process.env.DB_NAME, // Updated to use environment variable
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

// Async function to test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection(); // Use await to get the connection
    console.log('Database connected successfully!');
    connection.release(); // Always release the connection back to the pool
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

// Call the function to test the connection
testConnection();

module.exports = pool;
