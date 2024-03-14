const express = require("express");
const router = express.Router();
const artistsController = require("../controllers/artistsController");

const centralAsyncHandler = require("../middlewares/async-handler");

router.get("/", centralAsyncHandler(artistsController.getPaginatedArtists));

module.exports = router;
