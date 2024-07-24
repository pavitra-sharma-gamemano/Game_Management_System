const express = require("express");
const morgan = require("morgan");

const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "/.env" });
const prisma = require("./config/db.js");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import Routes
// let authRouter = require("./api/v1/routes/auth.routes");
// let playerRouter = require("./api/v1/routes/player.routes");
// let gamePlayRouter = require("./api/v1/routes/gamePlay.routes");
// let gameRouter = require("./api/v1/routes/game.routes");

//Middlewares
app.use(cors("*"));
app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(morgan("dev"));

//Version
// ? Check Version and Connectivity
app.get("/", (req, res) => {
  res.send("Server Working \n Version 2.5.2");
});

//Routes
// app.use("/v1/auth", authRouter);
// app.use("/v1/player", playerRouter);
// app.use("/v1/game", gamePlayRouter);
// app.use("/v1/admin/game", gameRouter);

//Default Route
app.use((req, res) => {
  res.status(404).send("Oops, seems like you are trying to access something that doesn't exist, please recheck your path");
});

prisma
  .$connect()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0");
    console.log(`Application is running at PORT: ${PORT}`);
  })
  .catch((err) => {
    console.error(err);
  });
