// Importing required modules for interacting with PostgreSQL database
const { Pool } = require("pg");
const dotenv = require("dotenv");

// Loading environment variables from a .env file for enhanced security
dotenv.config({ path: "../.env" });

// Asynchronous function to drop a table if it exists in the database
const dropTableIfExists = async (pool, tableName) => {
  await pool.query(`DROP TABLE IF EXISTS ${tableName};`);
  console.log(
    `Table ${tableName} dropped successfully (or it didn't exist before).`
  );
};

// Asynchronous function to deseed the database by dropping existing tables
const deseedDb = async () => {
  // Creating a connection pool to the PostgreSQL database using environment variables
  const pool = new Pool({
    host: process.env.HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
  });

  try {
    // Dropping the 'artworks' and 'artists' tables if they exist
    await dropTableIfExists(pool, "artworks");
    await dropTableIfExists(pool, "artists");
  } catch (err) {
    // Handling any errors that occur during the deseeding process
    console.error("Error:", err.stack);
  } finally {
    console.log("Database cleaned. Tables emptied.");
    // Ending the pool connection after deseeding is completed
    await pool.end();
  }
};

// Initiating the deseeding process
deseedDb();
