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

const getArtworksByArtistID = async (req, res) => {
  const { artist_id, cursor } = req.query;
  if (!artist_id || isNaN(artist_id)) {
    return res.status(400).json({ error: "Invalid artist_id" });
  }
  const parsedArtistId = parseInt(artist_id);
  const parsedCursor = cursor ? Math.floor(parseInt(cursor) / 100) * 100 : 0;
  const artworks = await artworksModel.fetchArtworksByArtistID(
    parsedArtistId,
    parsedCursor
  );
  res.json({ count: artworks.length, rows: artworks });
};

const updateArtwork = async (req, res) => {
  const { artwork_id } = req.params;
  const { title, url, thumbnail_url, nationality, date } = req.body;

  if (!artwork_id) {
    return res.status(400).json({ error: "Artwork ID is required" });
  }
  if (!title && !url && !thumbnail_url && !nationality && !date) {
    return res
      .status(400)
      .json({ error: "At least one field to update is required" });
  }

  const updatedArtwork = await artworksModel.updateArtwork(artwork_id, {
    title,
    url,
    thumbnail_url,
    nationality,
    date,
  });

  res.json({
    message: "Artwork updated successfully",
    artwork: updatedArtwork,
  });
};

module.exports = {
  getPaginatedArtworks,
  deleteArtworkByID,
  getArtworksByTitle,
  getArtworksByArtistID,
  updateArtwork,
};
