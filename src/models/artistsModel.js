const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

const fetchArtists = async (cursor) => {
  let query = {
    text: "SELECT * FROM artists",
    values: [],
  };

  // If cursor is provided, filter artists with artist_id greater than cursor
  if (cursor > 0) {
    query.text += " WHERE artist_id > $1";
    query.values.push(cursor);
  }

  query.text += " ORDER BY artist_id ASC LIMIT 100;";

  // Connect to database pool
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
};

const deleteArtist = async (artist_id) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "DELETE FROM artists WHERE artist_id = $1",
      [artist_id]
    );
    return result.rowCount;
  } finally {
    client.release();
  }
};

const fetchArtistsByName = async (DisplayName, cursor) => {
  const queryValues = [`%${DisplayName}%`];
  let queryText = `
     SELECT * FROM artists
     WHERE DisplayName ILIKE $1`;

  if (cursor > 0) {
    queryText += " AND artist_id > $2";
    queryValues.push(cursor);
  }

  queryText += " ORDER BY artist_id ASC LIMIT 100;";

  try {
    const client = await pool.connect();
    const result = await client.query({
      text: queryText,
      values: queryValues,
    });
    return result.rows;
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw new Error("Failed to fetch artists");
  }
};

const fetchTotalCount = async () => {
  const queryText = `SELECT COUNT(*) FROM artists;`;
  try {
    const client = await pool.connect();
    const result = await client.query({ text: queryText });
    return result;
  } catch (error) {
    console.error("Error fetching artists count:", error);
    throw new Error("Failed to fetch artists count");
  }
};

const fetchFirst100Artists = async () => {
  const queryText = `
    SELECT * FROM artists
    ORDER BY DisplayName
    LIMIT 100;
  `;

  try {
    const result = await pool.query(queryText);
    return result.rows;
  } catch (error) {
    console.error("Error fetching first 100 artists:", error);
    throw error;
  }
};

module.exports = {
  fetchArtists,
  deleteArtist,
  fetchArtistsByName,
  fetchTotalCount,
  fetchFirst100Artists,
};
