const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

const fetchArtworks = async (cursor) => {
  let query = {
    text: "SELECT * FROM artworks",
    values: [],
  };

  if (cursor > 0) {
    query.text += " WHERE artwork_id > $1";
    query.values.push(cursor);
  }

  query.text += " ORDER BY artwork_id ASC LIMIT 100;";

  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
};

const deleteArtist = async (artwork_id) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "DELETE FROM artworks WHERE artwork_id = $1",
      [artwork_id]
    );
    return result.rowCount;
  } finally {
    client.release();
  }
};

const fetchArtworksByTitle = async (Title, cursor) => {
  const queryValues = [`%${Title}%`];

  let queryText = `
    SELECT * FROM artworks
    WHERE title ILIKE $1`;

  if (cursor > 0) {
    queryText += " AND artwork_id > $2";
    queryValues.push(cursor);
  }

  queryText += " ORDER BY artwork_id ASC LIMIT 100;";

  try {
    const result = await pool.query(queryText, queryValues);
    return result.rows;
  } catch (error) {
    console.error("Error fetching artworks by title:", error);
    throw error;
  }
};

const fetchArtworksByArtistID = async (artist_id, cursor) => {
  const queryValues = [artist_id];

  let queryText = `
    SELECT * FROM artworks
    WHERE artist_id = $1`;

  if (cursor > 0) {
    queryText += " AND artwork_id > $2";
    queryValues.push(cursor);
  }

  queryText += " ORDER BY artwork_id ASC LIMIT 100;";

  try {
    const result = await pool.query(queryText, queryValues);
    return result.rows;
  } catch (error) {
    console.error("Error fetching artworks by artist id:", error);
    throw error;
  }
};

module.exports = {
  fetchArtworks,
  deleteArtist,
  fetchArtworksByTitle,
  fetchArtworksByArtistID,
};
