const express = require("express");
const app = express();
const db = require("./db");
const { PORT, CLIENT_URL } = require("./config");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");

require("./middleware/passport-middleware");

app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const publicRoutes = require("./routes/publicRoutes");
const secureRoutes = require("./routes/secureRoutes");

const { notFound, errorHandler } = require("./middleware/error-middleware");

app.use("/public/api", publicRoutes);
app.use("/secure/api", secureRoutes);

app.get("/", async (req, res) => {
  const results = await db.query("select * from users");
  res.send("hi");
});

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
