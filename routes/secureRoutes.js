const { Router } = require("express");
const { userAuth } = require("../middleware/auth-middleware");

var http = require("http"),
  fs = require("fs"),
  ccav = require("../ccavutil.js"),
  crypto = require("crypto"),
  qs = require("querystring");
// image upload
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({
  storage,
  limits: {
    // Set the maximum file size (in bytes)
    fileSize: 5 * 1024 * 1024, // 1MB
    // Set the maximum number of files that can be uploaded
    files: 5,
  },
});

const {
  newHouseProperty,
  newPgProperty,
  updateHouseProperty,
  updatePgProperty,
  getMyListings,
  shortlistProperty,
  showShortlists,
  getHouse,
  getUser,
  getOwnerDetails,
  getPg,
  logout,
  getAllPropertiesContacted,
} = require("../controllers/propertiesController");
const {
  updateProfile,
  verifyEmail,
  generateVerificationEmail,
} = require("../controllers/profileController");

const {
  handleHouseImageUpload,
  handleDescription,
  handleDeleteImage,
  getImages,
} = require("../controllers/handleImage");

const {
  isHouseOwner,
  housesValidation,
} = require("../middleware/house-middleware");

const {
  checkUserVerified,
  checkUserBlocked,
} = require("../middleware/verified-middleware");

const router = Router();

router.use(userAuth);
router.use(checkUserBlocked);

// houses
router.post("/newProperty/house/create", checkUserVerified, newHouseProperty);
router.post(
  "/newProperty/house/update/:houseId",
  checkUserVerified,
  [isHouseOwner, housesValidation],
  updateHouseProperty
);

router.get("/gethouse", getHouse);
router.get("/getpg", getPg);

// pgs
router.post("/newProperty/pg/create", checkUserVerified, newPgProperty);
router.post(
  "/newProperty/pg/update/:pgId",
  checkUserVerified,
  updatePgProperty
);

// fetch all user listings
router.get("/user/me", getUser);
router.get("/user/mylistings", getMyListings);
router.get("/user/getAllPropertiesContacted", getAllPropertiesContacted);

// shortlist properties
router.post("/user/property/shortlist", checkUserVerified, shortlistProperty);
router.get("/user/myshortlists", checkUserVerified, showShortlists);

// media
router.post(
  "/newProperty/house/uploadImage/:houseId",
  checkUserVerified,
  isHouseOwner,
  upload.array("image"),
  handleHouseImageUpload
);
router.get("/getHouseImage/:houseId", getImages);
router.put(
  "/house/uploadImage/change-description/:imageId",
  checkUserVerified,
  handleDescription
);
router.delete(
  "/house/deleteImage/:imageId",
  checkUserVerified,
  handleDeleteImage
);
// profile
router.post("/updateProfile", updateProfile);
router.post("/generateVerificationEmail", generateVerificationEmail);
// owner details
router.post(
  "/user/listings/get-owner-details",
  checkUserVerified,
  getOwnerDetails
);

router.post("/payment", async (request, response) => {
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

router.get("/logout", logout);

module.exports = router;
