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
  // Validate artist_id
  if (isNaN(artist_id)) {
    throw new Error("Invalid artist_id: " + artist_id);
  }

  // Perform delete operation
  const result = await artistsModel.deleteArtist(artist_id);

  // Check if artist was found and deleted
  if (result === 1) {
    return res.status(204).json({ message: "Artist deleted successfully." });
  }

  // Return error if artist not found
  return res
    .status(404)
    .json({ error: "Artist not found with ID: " + artist_id });
};

const getArtistByName = async (req, res) => {
  const { displayName, cursor } = req.query;

  // Check if displayName parameter is provided
  if (!displayName) {
    return res
      .status(400)
      .json({ message: "displayName parameter is required" });
  }

  // Decode display name if encoded
  const decodedName = decodeURIComponent(displayName);

  // Validate cursor for pagination
  const validatedCursor = cursor ? Math.floor(cursor / 100) * 100 : 0;

  // Fetch artists by name from model
  const artists = await artistsModel.fetchArtistsByName(
    decodedName,
    validatedCursor
  );

  // Check if artists were found
  if (artists.length) {
    return res.json({ count: artists.length, rows: artists });
  } else {
    return res
      .status(404)
      .json({ message: "No artists found with given name" });
  }
};

const getTotalCount = async (req, res) => {
  // Fetch total count of artists from the database
  const totalCount = await artistsModel.fetchTotalCount();

  // Return response with total count
  res.json({ count: totalCount.rows });
};

const getFirst100Artists = async (req, res) => {
  // Fetch the first 100 lexicographically sorted artists from the database
  const artists = await artistsModel.fetchFirst100Artists();

  // Return response with count and list of artists
  res.json({ count: artists.length, artists });
};

module.exports = {
  getPaginatedArtists,
  deleteArtistByID,
  getArtistByName,
  getTotalCount,
  getFirst100Artists,
};
