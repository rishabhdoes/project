const express = require("express");
const app = express();
const db = require("./db");
const { PORT, CLIENT_URL } = require("./config");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");

require("./middleware/passport-middleware");

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(passport.initialize());

const authRoutes = require("./routes/auth");

app.use(authRoutes);

app.get("/", async (req, res) => {
  const results = await db.query("select * from users");
  res.send("hi");
});

app.listen(PORT, () => {
  console.log("listening on port 5000");
});
