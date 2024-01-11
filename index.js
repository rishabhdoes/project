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
app.use(
  cors({
    origin: [
      CLIENT_URL,
      "https://homewale.com",
      "https://www.homewale.com",
      "https://test.ccavenue.com",
      "https://test.ccavenue.com/transaction",
    ],
    credentials: true,
  })
);

// app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const publicRoutes = require("./routes/publicRoutes");
const secureRoutes = require("./routes/secureRoutes");
const privateRoutes = require("./routes/privateRoutes");

const { notFound, errorHandler } = require("./middleware/error-middleware");

app.use("/public/api", publicRoutes);
app.use("/secure/api", secureRoutes);
app.use("/private/api", privateRoutes);
app.use(express.json());

app.post("/", (req, res) => {
  console.log("req:", req.body)
  console.log("CLIENT_URL:", CLIENT_URL)
  res.redirect(CLIENT_URL);
});
app.get("/", (req, res) => {
  res.redirect(CLIENT_URL);
});

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
