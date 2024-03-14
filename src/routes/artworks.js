const express = require("express");
const router = express.Router();
const artworksController = require("../controllers/artworksController");

const centralAsyncHandler = require("../middlewares/async-handler");

// "/backend-api/artworks"
router.get("/", centralAsyncHandler(artworksController.getPaginatedArtworks));

module.exports = router;
