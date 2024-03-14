const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/error-handler");
require("dotenv").config();

const artistsRouter = require("./routes/artists");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/backend-api/artists", artistsRouter);

app.use(errorHandler);

module.exports = app;
