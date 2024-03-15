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
  const result = await artworksModel.deleteArtist(artwork_id);
  if (result === 1) {
    return res.status(204).json({ message: "Artwork deleted successfully." });
  }
  return res
    .status(404)
    .json({ error: "Artwork not found with ID: " + artwork_id });
};

const getArtworksByTitle = async (req, res) => {
  let { title, cursor } = req.query;
  const decodedTitle = decodeURIComponent(title);
  cursor = cursor ? Math.floor(cursor / 100) * 100 : 0;
  const artworks = await artworksModel.fetchArtworksByTitle(
    decodedTitle,
    cursor
  );
  res.json({ count: artworks.length, rows: artworks });
};

module.exports = {
  getPaginatedArtworks,
  deleteArtworkByID,
  getArtworksByTitle,
};
