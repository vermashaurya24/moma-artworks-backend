// Import the necessary modules for interacting with PostgreSQL and file system operations
const { Pool } = require("pg");
const fs = require("fs").promises;
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: "../.env" });

// Function to drop a table if it exists
const dropTableIfExists = async (pool, tableName) => {
  await pool.query(`DROP TABLE IF EXISTS ${tableName};`);
  // Log a message indicating whether the table was dropped successfully or didn't exist before
  console.log(
    `Table ${tableName} dropped successfully (or it didn't exist before).`
  );
};

// Function to create the artists table if it doesn't exist
const createArtistsTable = async (pool) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS artists (
      artist_id SERIAL PRIMARY KEY,
      DisplayName VARCHAR(255) NOT NULL,
      ArtistBio TEXT,
      Nationality VARCHAR(100),
      Gender VARCHAR(50),
      ConstituentID INT UNIQUE
    );
  `);
  // Log a message indicating that the artists table was created successfully
  console.log("Table artists created successfully");
};

// Function to create the artworks table if it doesn't exist
const createArtworksTable = async (pool) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS artworks (
      artwork_id SERIAL PRIMARY KEY,
      Title VARCHAR(255) NOT NULL,
      DisplayName VARCHAR(255),
      artist_id INTEGER,
      URL TEXT,
      ImageURL TEXT,
      Nationality VARCHAR(100),
      Date VARCHAR(255),
      FOREIGN KEY (artist_id) REFERENCES artists(ConstituentID) ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT fk_artist_id FOREIGN KEY (artist_id) REFERENCES artists(ConstituentID) ON DELETE CASCADE
    );
  `);
  // Log a message indicating that the artworks table was created successfully
  console.log("Table artworks created successfully");
};

// Function to insert artists data into the artists table
const insertArtistsData = async (pool, artists) => {
  for (const artist of artists) {
    const { ConstituentID, DisplayName, ArtistBio, Nationality, Gender } =
      artist;
    // Execute SQL query to insert artist data into the artists table
    await pool.query(
      `INSERT INTO artists (DisplayName, ArtistBio, Nationality, Gender, ConstituentID) VALUES ($1, $2, $3, $4, $5)`,
      [DisplayName, ArtistBio, Nationality, Gender, ConstituentID]
    );
  }
  // Log a message indicating that artists data was seeded successfully
  console.log("Artists data seeded successfully");
};

// Function to insert artworks data into the artworks table
const insertArtworksData = async (pool, artworks) => {
  for (const artwork of artworks) {
    const { Title, Artist, ConstituentID, Nationality, URL, ImageURL, Date } =
      artwork;
    let year = null;
    // Extract year from the Date field if available
    if (Date) {
      const match = Date.match(/^\d{4}/);
      if (match) {
        year = match[0];
      }
    }
    // Execute SQL query to insert artwork data into the artworks table
    await pool.query(
      `INSERT INTO artworks (Title, DisplayName, artist_id, URL, ImageURL, Nationality, Date) 
       VALUES (LEFT($1, 255), $2, $3, $4, $5, $6, $7)`,
      [Title, Artist[0], ConstituentID[0], URL, ImageURL, Nationality[0], year]
    );
  }
  // Log a message indicating that artworks data was seeded successfully
  console.log("Artworks data seeded successfully");
};

// Function to seed the database with artists and artworks data
const seedDb = async () => {
  // Create a new Pool instance with PostgreSQL connection settings from environment variables
  const pool = new Pool({
    host: process.env.HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    client_encoding: "utf8",
  });

  try {
    // Drop existing artworks and artists tables
    await dropTableIfExists(pool, "artworks");
    await dropTableIfExists(pool, "artists");

    // Create new artworks and artists tables
    await createArtistsTable(pool);
    await createArtworksTable(pool);

    // Read artists data from JSON file and insert into artists table
    const artistData = await fs.readFile(process.env.ARTISTS_PATH, "utf-8");
    const artists = JSON.parse(artistData);
    await insertArtistsData(pool, artists);

    // Read artworks data from JSON file and insert into artworks table
    const artworkData = await fs.readFile(process.env.ARTWORKS_PATH, "utf-8");
    const artworks = JSON.parse(artworkData);
    await insertArtworksData(pool, artworks);
  } catch (err) {
    // Log any errors that occur during database seeding
    console.error("Error:", err.stack);
  } finally {
    // Log a message indicating that database seeding is complete
    console.log("Database has been seeded. You can now run the server.");
    // End the database connection pool
    await pool.end();
  }
};

// Invoke the seedDb function to seed the database with data
seedDb();
