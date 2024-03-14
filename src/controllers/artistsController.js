const artistsModel = require("../models/artistsModel");

const getPaginatedArtists = async (req, res) => {
  let { cursor } = req.query;
  cursor = cursor ? Math.floor(cursor / 100) * 100 : 0;
  const artists = await artistsModel.fetchArtists(cursor);
  res.json({ count: artists.length, rows: artists });
};

const deleteArtistByID = async (req, res) => {
  let artist_id = parseInt(req.params.artist_id);
  const result = await artistsModel.deleteArtist(artist_id);
  return res.status(204).json({ message: result });
};

module.exports = {
  getPaginatedArtists,
  deleteArtistByID,
};
