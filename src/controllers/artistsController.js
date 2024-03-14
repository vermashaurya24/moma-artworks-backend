const artistsModel = require("../models/artistsModel");

async function getPaginatedArtists(req, res, next) {
  let { cursor } = req.query;
  cursor = cursor ? Math.floor(cursor / 100) * 100 : 0;
  const artists = await artistsModel.fetchArtists(cursor);
  res.json(artists);
}

module.exports = {
  getPaginatedArtists,
};
