const express = require("express");
const router = express.Router();
const artistsController = require("../controllers/artistsController");

const centralAsyncHandler = require("../middlewares/async-handler");

//centralAsyncHandler function removes the need for redundant try{}catch(){} blocks, making code more modular
// "/backend-api/artists"
router.get("/", centralAsyncHandler(artistsController.getPaginatedArtists));
router.delete(
  "/:artist_id",
  centralAsyncHandler(artistsController.deleteArtistByID)
);
router.get("/artist", centralAsyncHandler(artistsController.getArtistByName));
router.get("/totalCount", centralAsyncHandler(artistsController.getTotalCount));
router.get(
  "/dropdown",
  centralAsyncHandler(artistsController.getFirst100Artists)
);

module.exports = router;
