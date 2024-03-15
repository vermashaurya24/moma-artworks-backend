const express = require("express");
const router = express.Router();
const artworksController = require("../controllers/artworksController");

const centralAsyncHandler = require("../middlewares/async-handler");

// "/backend-api/artworks"
router.get("/", centralAsyncHandler(artworksController.getPaginatedArtworks));
router.delete(
  "/:artwork_id",
  centralAsyncHandler(artworksController.deleteArtworkByID)
);
router.get(
  "/byTitle",
  centralAsyncHandler(artworksController.getArtworksByTitle)
);
router.get(
  "/byArtistID",
  centralAsyncHandler(artworksController.getArtworksByArtistID)
);
router.put(
  "/:artwork_id",
  centralAsyncHandler(artworksController.updateArtwork)
);

module.exports = router;
