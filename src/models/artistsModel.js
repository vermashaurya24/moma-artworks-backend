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
    if (isNaN(artist_id)) {
      throw new Error("Invalid artist_id: " + artist_id);
    }
    const result = await client.query(
      "DELETE FROM artists WHERE artist_id = $1",
      [artist_id]
    );
    return "Row deleted if previously existed.";
  } finally {
    client.release();
  }
};

module.exports = {
  fetchArtists,
  deleteArtist,
};
