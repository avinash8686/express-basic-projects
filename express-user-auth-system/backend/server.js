require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
var rfs = require("rotating-file-stream"); // version 2.x

const cors = require("cors");
const app = express();
app.use(morgan("combined"));

// create a rotating write stream
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

app.use(cors());

const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL;

// Import Routes
const authRoute = require("./Routes/AuthRoutes");
const postRoute = require("./Routes/PostRoutes");

// Route Middleware
app.use(express.json());

// app.use("/", (req, res) => {
//   res.status(200).send("Welcome!");
// });
app.use("/api/user/", authRoute);
app.use("/api/posts/", postRoute);

// Connect to DB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, (req, res) => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
