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
} = require("../controllers/propertiesController");

const { housesValidation } = require("../validators/auth");
const { handleHouseImageUpload } = require("../controllers/handleImage");
const { isHouseOwner } = require("../middleware/house-middleware");

const router = Router();

router.use(userAuth);

// houses
router.post("/newProperty/house/create", newHouseProperty);
router.post(
  "/newProperty/house/update/:houseId",
  isHouseOwner,
  updateHouseProperty
);

// pgs
router.post("/newProperty/pg/create", newPgProperty);
router.post("/newProperty/pg/update/:pgId", updatePgProperty);

// fetch all user listings
router.get("/user/mylistings/", getMyListings);

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

module.exports = router;
