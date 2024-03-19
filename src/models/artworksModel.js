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

const deleteArtworkByID = async (artwork_id) => {
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

const updateArtwork = async (artworkId, updateFields) => {
  const { title, url, thumbnailUrl, nationality, date } = updateFields;

  const queryText = `
    UPDATE artworks
    SET
      title = $1,
      url = $2,
      ImageURL = $3,
      nationality = $4,
      date = $5
    WHERE artwork_id = $6
    RETURNING *;
  `;

  const queryValues = [title, url, thumbnailUrl, nationality, date, artworkId];

  try {
    const result = await pool.query(queryText, queryValues);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating artwork:", error);
    throw error;
  }
};

const addArtwork = async (artworkData) => {
  const { title, displayName, artist_id, url, imageUrl, nationality, date } =
    artworkData;

  const queryText = `
    INSERT INTO artworks (Title, DisplayName, artist_id, URL, ImageURL, Nationality, Date)
    VALUES (LEFT($1, 255), $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const queryValues = [
    title,
    displayName,
    artist_id,
    url,
    imageUrl,
    nationality,
    date,
  ];

  try {
    const result = await pool.query(queryText, queryValues);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding artwork:", error);
    throw error;
  }
};

const fetchTotalCount = async () => {
  const queryText = `SELECT COUNT(*) FROM artworks;`;
  try {
    const client = await pool.connect();
    const result = await client.query({ text: queryText });
    return result;
  } catch (error) {
    console.error("Error fetching artists count:", error);
    throw new Error("Failed to fetch artists count");
  }
};

module.exports = {
  fetchArtworks,
  deleteArtworkByID,
  fetchArtworksByTitle,
  fetchArtworksByArtistID,
  updateArtwork,
  addArtwork,
  fetchTotalCount,
};
