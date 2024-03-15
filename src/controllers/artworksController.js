const artworksModel = require("../models/artworksModel");

const getPaginatedArtworks = async (req, res) => {
  let { cursor } = req.query;
  cursor = cursor ? Math.floor(cursor / 100) * 100 : 0;
  const artworks = await artworksModel.fetchArtworks(cursor);
  res.json({ count: artworks.length, rows: artworks });
};

const deleteArtworkByID = async (req, res) => {
  const artwork_id = parseInt(req.params.artwork_id);
  if (isNaN(artwork_id)) {
    throw new Error("Invalid artwork_id: " + artwork_id);
  }
  const result = await artworksModel.deleteArtworkByID(artwork_id);
  if (result === 1) {
    return res.status(204).json({ message: "Artwork deleted successfully." });
  }
  return res
    .status(404)
    .json({ error: "Artwork not found with ID: " + artwork_id });
};

module.exports = { getPaginatedArtworks, deleteArtworkByID };
