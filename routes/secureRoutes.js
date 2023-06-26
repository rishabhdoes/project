const { Router } = require("express");
const { userAuth } = require("../middleware/auth-middleware");

// image upload
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({
  storage,
  limits: {
    // Set the maximum file size (in bytes)
    fileSize: 1 * 1024 * 1024, // 1MB
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

router.get("/logout", logout);

module.exports = router;
