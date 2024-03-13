const http = require("http");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const PORT = process.env.PORT;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
