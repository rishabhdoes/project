require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./db");

const PORT = process.env.PORT || 3001;

app.get("/", async (req, res) => {
  res.send("hi");
});

app.listen(PORT, () => {
  console.log("listening on port 3000");
});
