const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

async function fetchArtists(cursor) {
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
}

module.exports = {
  fetchArtists,
};
