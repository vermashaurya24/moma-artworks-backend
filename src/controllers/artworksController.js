const artworksModel = require("../models/artworksModel");

const getPaginatedArtworks = async (req, res) => {
  // Extract cursor from query parameters
  let { cursor } = req.query;
  // If cursor is provided, convert it to the nearest multiple of 100, otherwise start from 0
  cursor = cursor ? Math.floor(cursor / 100) * 100 : 0;
  // Fetch artworks from model
  const artworks = await artworksModel.fetchArtworks(cursor);
  // Send response with count and artworks data
  res.json({ count: artworks.length, rows: artworks });
};

const deleteArtworkByID = async (req, res) => {
  // Extract the artwork_id from the request parameters and parse it into an integer
  const artwork_id = parseInt(req.params.artwork_id);
  if (isNaN(artwork_id)) {
    throw new Error("Invalid artwork_id: " + artwork_id);
  }
  // Call the deleteArtworkByID function from the artworksModel to delete the artwork
  const result = await artworksModel.deleteArtworkByID(artwork_id);
  // Check the result of the deletion operation
  if (result === 1) {
    return res.status(204).json({ message: "Artwork deleted successfully." });
  }
  // If the result is not 1, it means the artwork with the given ID was not found
  return res
    .status(404)
    .json({ error: "Artwork not found with ID: " + artwork_id });
};

const getArtworksByTitle = async (req, res) => {
  // Extract 'title' and 'cursor' from the request query parameters
  let { title, cursor } = req.query;

  const decodedTitle = decodeURIComponent(title);

  cursor = cursor ? Math.floor(cursor / 100) * 100 : 0;
  // Fetch artworks from the database based on the decoded title and cursor
  const artworks = await artworksModel.fetchArtworksByTitle(
    decodedTitle,
    cursor
  );
  // Send a JSON response containing the count of artworks and the artworks themselves
  res.json({ count: artworks.length, rows: artworks });
};

const getArtworksByArtistID = async (req, res) => {
  const { artist_id, cursor } = req.query;

  if (!artist_id || isNaN(artist_id)) {
    return res.status(400).json({ error: "Invalid artist_id" });
  }

  const parsedArtistId = parseInt(artist_id);

  const parsedCursor = cursor ? Math.floor(parseInt(cursor) / 100) * 100 : 0;
  // Fetch artworks from the database based on the parsed artist ID and cursor
  const artworks = await artworksModel.fetchArtworksByArtistID(
    parsedArtistId,
    parsedCursor
  );
  // Send a JSON response containing the count of artworks and the artworks themselves
  res.json({ count: artworks.length, rows: artworks });
};

const updateArtwork = async (req, res) => {
  const { artwork_id } = req.params;
  // Extract fields to update from the request body
  const { title, url, thumbnailUrl, nationality, date } = req.body;
  if (!artwork_id) {
    return res.status(400).json({ error: "Artwork ID is required" });
  }
  // Input Vaidation
  if (!title && !url && !thumbnailUrl && !nationality && !date) {
    return res
      .status(400)
      .json({ error: "At least one field to update is required" });
  }
  // Call the updateArtwork function from the artworksModel to update the artwork
  const updatedArtwork = await artworksModel.updateArtwork(artwork_id, {
    title,
    url,
    thumbnailUrl,
    nationality,
    date,
  });
  // Send a JSON response indicating successful update along with the updated artwork
  res.json({
    message: "Artwork updated successfully",
    artwork: updatedArtwork,
  });
};

const addArtwork = async (req, res) => {
  const {
    title,
    displayName,
    url,
    thumbnailUrl,
    nationality,
    date,
    artist_id,
  } = req.body;
  // Validate input parameters
  if (
    !title ||
    !displayName ||
    !url ||
    !thumbnailUrl ||
    !nationality ||
    !date ||
    !artist_id
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  // Add the artwork to the database
  const newArtwork = await artworksModel.addArtwork({
    title,
    displayName,
    artist_id,
    url,
    imageUrl: thumbnailUrl,
    nationality,
    date,
  });
  // Send success response
  res.status(201).json({
    message: "Artwork added successfully",
    artwork: newArtwork,
  });
};

const getTotalCount = async (req, res) => {
  // Fetch the total count of artworks from the database
  const totalCount = await artworksModel.fetchTotalCount();
  // Send a JSON response containing the total count of artworks
  res.json({ count: totalCount.rows });
};

module.exports = {
  getPaginatedArtworks,
  deleteArtworkByID,
  getArtworksByTitle,
  getArtworksByArtistID,
  updateArtwork,
  addArtwork,
  getTotalCount,
};
