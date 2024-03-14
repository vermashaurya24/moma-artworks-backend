const artworksModel = require("../models/artworksModel");

const getPaginatedArtworks = async (req, res) => {
  let { cursor } = req.query;
  cursor = cursor ? Math.floor(cursor / 100) * 100 : 0;
  const artworks = await artworksModel.fetchArtworks(cursor);
  res.json({ count: artworks.length, rows: artworks });
};

module.exports = { getPaginatedArtworks };
