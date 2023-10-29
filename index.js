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
      "https://test.ccavenue.com",
      "https://test.ccavenue.com/transaction",
    ],
    credentials: true,
  })
);
var http = require("http"),
  fs = require("fs"),
  ccav = require("./ccavutil.js"),
  crypto = require("crypto"),
  qs = require("querystring");
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

// app.post("/payment", async (req, res) => {
//   try {
//     const {
//       merchant_id,
//       order_id,
//       currency,
//       amount,
//       redirect_url,
//       cancel_url,
//       language,
//     } = req.body;

//     // Generate encryption keys and encrypt payment data
//     const workingKey = "720702AAB0A040750D93E088C061049E"; // Replace with your actual working key
//     const accessCode = "AVYV17KJ86AH05VYHA";
//     const md5 = crypto.createHash("md5").update(workingKey).digest();
//     const keyBase64 = Buffer.from(md5).toString("base64");
//     var ivBase64 = Buffer.from([
//       0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
//       0x0c, 0x0d, 0x0e, 0x0f,
//     ]).toString("base64");

//     const requestData = {
//       // Construct payment data based on CCAvenue requirements
//       // Example: order_id, currency, merchant_id, redirect_url, cancel_url, etc.
//       merchant_id,
//       order_id,
//       currency,
//       amount,
//       redirect_url,
//       cancel_url,
//       language,
//     };
//     console.log("currency:", currency)

//     const encRequest = ccav.encrypt(
//       JSON.stringify(requestData),
//       keyBase64,
//       ivBase64
//     );

//     // Redirect to CCAvenue payment gateway with encrypted data
//     // res.redirect(
//     //   `https://instagram.com`
//     //   // `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encRequest}&access_code=${accessCode}`
//     // );
//     res.status(200).json({ url: `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encRequest}&access_code=${accessCode}&currency=${currency}` });
//   } catch (error) {
//     console.error("Error processing payment:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
app.post("/payment", async (request, response) => {
  var body = "",
    workingKey = "720702AAB0A040750D93E088C061049E", //Put in the 32-Bit key shared by CCAvenues.
    accessCode = "AVYV17KJ86AH05VYHA", //Put in the Access Code shared by CCAvenues.
    encRequest = "",
    formbody = "";
  const { data } = request.body;
  console.log("data:", data);

  //Generate Md5 hash for the key and then convert in base64 string
  var md5 = crypto.createHash("md5").update(workingKey).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");

  //Initializing Vector and then convert in base64 string
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");

  console.log("data:");
  if (data) {
    console.log("data:", data);
    body += JSON.stringify(data);
  }
  const jsonData = JSON.parse(body);
  const queryString = Object.keys(jsonData)
    .map((key) => {
      if (typeof jsonData[key] === "string") {
        return `${key}=${encodeURIComponent(jsonData[key])}`;
      }
      return `${key}=${jsonData[key]}`;
    })
    .join("&");

  // request.on("end", function () {
  if (data) {
    encRequest = ccav.encrypt(queryString, keyBase64, ivBase64);
    formbody = `<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encRequest}&access_code=${accessCode}"/> <input type="hidden" id="encRequest" name="encRequest" value="' +
      encRequest +
      '"><input type="hidden" name="access_code" id="access_code" value="' +
      accessCode +
      '"><input type="hidden" name="currency" id="currency" value="INR"><script language="javascript">document.redirect.submit();</script></form>`;
    // response.writeHeader(200, { "Content-Type": "text/html" });
    // response.write(formbody);
    const script =
      '<script language="javascript">console.log("Before form submission"); document.getElementById("nonseamless").submit(); console.log("After form submission");</script>';

    // Send the formbody and script in the response
    response.write(formbody + script);

    // End the response after sending all the data
    response.end();
  }
  // });
  return;
});
app.post("/", (req, res) => {
  res.redirect("https://homewale.com");
});
app.get("/", (req, res) => {
  res.redirect("https://homewale.com");
});

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
