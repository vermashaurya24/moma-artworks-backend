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

module.exports = {
  fetchArtworks,
  deleteArtist,
};
