const { Router } = require("express");
const { userAuth } = require("../middleware/auth-middleware");

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

const router = Router();

router.use(userAuth);

// map

// properties
router.post("/newProperty/house/create", newHouseProperty);
router.post(
  "/newProperty/house/update/:houseId",

  updateHouseProperty
);
router.post("/newProperty/pg/create", newPgProperty);
router.post("/newProperty/pg/update/:pgId", updatePgProperty);

// fetch all user listings
router.get("/user/mylistings/", getMyListings);

// shortlist properties
router.post("/user/property/shortlist", shortlistProperty);
router.get("/user/myshortlists", showShortlists);

module.exports = router;
