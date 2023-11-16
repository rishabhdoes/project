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
  handleHouseDeleteImage,
  getHouseImages,

  getPgImages,
  handlePgDeleteImage,
  handlePgImageUpload,
} = require("../controllers/handleImage");

const {
  isHouseOwner,
  housesValidation,
} = require("../middleware/house-middleware");

const {
  checkUserVerified,
  checkUserBlocked,
} = require("../middleware/verified-middleware");
const {
  paymentInitiation,
  getAllPaymentPlans,
  getPlanData,
} = require("../controllers/paymentController.js");

const { isPgOwner, pgValidation } = require("../middleware/pg-middleware");

const router = Router();

//checks
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

// pgs
router.post("/newProperty/pg/create", checkUserVerified, newPgProperty);
router.post(
  "/newProperty/pg/update/:pgId",
  checkUserVerified,
  [isPgOwner],
  updatePgProperty
);
router.get("/getpg", getPg);

// fetch all user listings
router.get("/user/me", getUser);
router.get("/user/mylistings", getMyListings);
router.get("/user/getAllPropertiesContacted", getAllPropertiesContacted);

// shortlist properties
router.post("/user/property/shortlist", checkUserVerified, shortlistProperty);
router.get("/user/myshortlists", checkUserVerified, showShortlists);

// media - houses

// POST IMAGE
router.post(
  "/newProperty/house/uploadImage/:houseId",
  checkUserVerified,
  isHouseOwner,
  upload.array("image"),
  handleHouseImageUpload
);

// GET IMAGE
router.get("/getHouseImage/:houseId", getHouseImages);

// UPDATE IMAGE DETAIL
router.put(
  "/house/uploadImage/change-description/:imageId",
  checkUserVerified,
  handleDescription
);

// DELETE IMAGE
router.delete(
  "/house/deleteImage/:imageId",
  checkUserVerified,
  handleHouseDeleteImage
);

// media - pgs

// UPLOAD PG IMAGE
router.post(
  "/newProperty/pg/uploadImage/:pgId",
  checkUserVerified,
  isPgOwner,
  upload.array("image"),
  handlePgImageUpload
);
// GET PG IMAGE
router.get("/getPgImage/:pgId", getPgImages);
// UPDATE IMAGE DETAIL
router.put(
  "/pg/uploadImage/change-description/:imageId",
  checkUserVerified,
  handleDescription
);
// DELETE PG IMAGE
router.delete(
  "/pg/deleteImage/:imageId",
  checkUserVerified,
  handlePgDeleteImage
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

router.post("/payment", paymentInitiation);

// get all payment plans
router.get("/payment-plans", getAllPaymentPlans);
router.get("/plan-data", getPlanData);

router.get("/logout", logout);

module.exports = router;
