const artistsModel = require("../models/artistsModel");

const getPaginatedArtists = async (req, res) => {
  let { cursor } = req.query;
  cursor = cursor ? Math.floor(cursor / 100) * 100 : 0;
  const artists = await artistsModel.fetchArtists(cursor);
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

module.exports = {
  getPaginatedArtists,
  deleteArtistByID,
  getArtistByName,
};
