const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middlewares/error-handler");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const artistsRouter = require("./routes/artists");
const artworksRouter = require("./routes/artworks");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(express.json());
app.use(cors());

app.use(helmet());

app.use(compression());

app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/backend-api/artists", artistsRouter);
app.use("/backend-api/artworks", artworksRouter);

app.use(errorHandler);

module.exports = app;
