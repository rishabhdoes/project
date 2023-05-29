const { Router } = require("express");
const { userAuth } = require("../middleware/auth-middleware");

const {
  suggestionAutocomplete,
  nearbyLocalities,
} = require("../controllers/Googleapiscontrolller");

const {
  newHouseProperty,
  newPgProperty,
  updateHouseProperty,
  updatePgProperty,
  getMyListings,
} = require("../controllers/propertiesController");

const router = Router();

router.use(userAuth);

// map
router.get("/autocomplete", suggestionAutocomplete);
router.get("/nearbyLocalities", nearbyLocalities);

// properties
router.post("/newProperty/house/create", newHouseProperty);
router.post("/newProperty/house/update/:houseId", updateHouseProperty);
router.post("/newProperty/pg/create", newPgProperty);
router.post("/newProperty/pg/update/:pgId", updatePgProperty);

// fetch all user listings
router.get("/user/mylistings/", getMyListings);

module.exports = router;
