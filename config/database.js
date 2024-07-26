const mysql = require("mysql2");
const { promisify } = require("util");

// Load environment variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// Database configuration
const config = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create a connection pool
const db = mysql.createPool(config);

// Promisify the query method
db.query = promisify(db.query).bind(db);

// Function to check the database connection
const checkDbConnection = async () => {
  db.getConnection((error, connection) => {
    if (error) {
      console.log("Failed to connect to the database:".red, error.message);
      return;
    }
    if (connection) connection.release();
    console.log("Database connection established".cyan);
  });
};

module.exports = { db, checkDbConnection };
