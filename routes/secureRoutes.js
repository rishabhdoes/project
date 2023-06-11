const { Router } = require("express");
const { userAuth } = require("../middleware/auth-middleware");

// image upload
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

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
} = require("../controllers/propertiesController");
const { updateProfile } = require("../controllers/profileController");

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

const router = Router();

router.use(userAuth);

// houses
router.post("/newProperty/house/create", newHouseProperty);
router.post(
  "/newProperty/house/update/:houseId",
  [isHouseOwner, housesValidation],
  updateHouseProperty
);

router.get("/gethouse", getHouse);

// pgs
router.post("/newProperty/pg/create", newPgProperty);
router.post("/newProperty/pg/update/:pgId", updatePgProperty);

// fetch all user listings
router.get("/user/me", getUser);
router.get("/user/mylistings", getMyListings);

// shortlist properties
router.post("/user/property/shortlist", shortlistProperty);
router.get("/user/myshortlists", showShortlists);

// media
router.post(
  "/newProperty/house/uploadImage/:houseId",
  isHouseOwner,
  upload.array("image"),
  handleHouseImageUpload
);

router.get("/getHouseImage/:houseId", getImages);
router.put("/house/uploadImage/change-description/:imageId", handleDescription);

router.delete("/house/deleteImage/:imageId", handleDeleteImage);
// profile
router.post("/updateProfile", updateProfile)

module.exports = router;
