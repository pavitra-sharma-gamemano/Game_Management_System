const express = require("express");
const morgan = require("morgan");

const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "/.env" });
const prisma = require("./config/db.js");
const cors = require("cors");

// Import Routes
const userRoutes = require("./routes/user.routes");
const gameRoutes = require("./routes/game.routes");
const scoreRoutes = require("./routes/score.routes");
const errorHandler = require("./middleware/error.middleware");

//Middlewares
app.use(cors("*"));
app.use(express.json()); // Parse JSON data
app.use(morgan("dev"));

//Version
// ? Check Version and Connectivity
app.get("/", (req, res) => {
  res.send("Server Working \n Version 2.5.2");
});

//Routes
app.use("/users", userRoutes);
app.use("/games", gameRoutes);
app.use("/scores", scoreRoutes);
app.use(errorHandler);

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

module.exports = app;
