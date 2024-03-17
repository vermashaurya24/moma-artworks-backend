const artistsModel = require("../models/artistsModel");

const getPaginatedArtists = async (req, res) => {
  // Extract cursor from query parameters
  let { cursor } = req.query;

  // If cursor is provided and less than 0, handle it appropriately
  if (cursor !== undefined && parseInt(cursor) < 0) {
    return res.status(400).json({ error: "Invalid cursor value" });
  }

  // If cursor is provided, convert it to nearest multiple of 100, otherwise start from 0
  cursor = cursor ? Math.floor(cursor / 100) * 100 : 0;

  // Fetch artists from model
  const artists = await artistsModel.fetchArtists(cursor);
  // Send response with count and artists data
  res.json({ count: artists.length, rows: artists });
};

const deleteArtistByID = async (req, res) => {
  const artist_id = parseInt(req.params.artist_id);
  if (isNaN(artist_id)) {
    throw new Error("Invalid artist_id: " + artist_id);
  }
  const result = await artistsModel.deleteArtist(artist_id);
  if (result === 1) {
    return res.status(204).json({ message: "Artist deleted successfully." });
  }
  return res
    .status(404)
    .json({ error: "Artist not found with ID: " + artist_id });
};

const getArtistByName = async (req, res) => {
  const { displayName, cursor } = req.query;
  if (!displayName) {
    return res
      .status(400)
      .json({ message: "displayName parameter is required" });
  }
  const decodedName = decodeURIComponent(displayName);
  const validatedCursor = cursor ? Math.floor(cursor / 100) * 100 : 0;

  const artists = await artistsModel.fetchArtistsByName(
    decodedName,
    validatedCursor
  );

  return artists.length
    ? res.json({ count: artists.length, rows: artists })
    : res.status(404).json({ message: "No artists found with given name" });
};

const getTotalCount = async (req, res) => {
  const totalCount = await artistsModel.fetchTotalCount();
  res.json({ count: totalCount.rows });
};

const getFirst100Artists = async (req, res) => {
  const artists = await artistsModel.fetchFirst100Artists();
  res.json({ count: artists.length, artists });
};

module.exports = {
  getPaginatedArtists,
  deleteArtistByID,
  getArtistByName,
  getTotalCount,
  getFirst100Artists,
};
