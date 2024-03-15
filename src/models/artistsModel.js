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

  if (cursor > 0) {
    query.text += " WHERE artist_id > $1";
    query.values.push(cursor);
  }

  query.text += " ORDER BY artist_id ASC LIMIT 100;";
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

module.exports = {
  fetchArtists,
  deleteArtist,
  fetchArtistsByName,
};
