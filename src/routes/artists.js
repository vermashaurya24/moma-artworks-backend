const express = require("express");
const router = express.Router();
const artistsController = require("../controllers/artistsController");

const centralAsyncHandler = require("../middlewares/async-handler");

// "/backend-api/artists"
router.get("/", centralAsyncHandler(artistsController.getPaginatedArtists));
router.delete(
  "/:artist_id",
  centralAsyncHandler(artistsController.deleteArtistByID)
);

module.exports = router;
