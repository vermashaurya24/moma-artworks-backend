const express = require("express");
const router = express.Router();
const artworksController = require("../controllers/artworksController");

const centralAsyncHandler = require("../middlewares/async-handler");

//centralAsyncHandler function removes the need for redundant try{}catch(){} blocks, making code more modular
// "/backend-api/artworks"
router.get("/", centralAsyncHandler(artworksController.getPaginatedArtworks));
router.delete(
  "/delete/:artwork_id",
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
router.post("/create", centralAsyncHandler(artworksController.addArtwork));
router.get(
  "/totalCount",
  centralAsyncHandler(artworksController.getTotalCount)
);

module.exports = router;
