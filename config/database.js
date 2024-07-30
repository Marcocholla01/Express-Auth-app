const mysql = require("mysql2");
const { databaseConfig } = require("./config");

// Create a connection pool
const db = mysql.createPool(databaseConfig);

// Function to check the database connection
const checkDbConnection = async () => {
  db.getConnection((error, connection) => {
    if (error) {
      console.log(
        `Failed to connect to the database: ${error.message}`.red.italic
      );
      return;
    }
    if (connection) connection.release();
    console.log(`Database connection established`.cyan.italic);
  });
};

module.exports = { db, checkDbConnection };
