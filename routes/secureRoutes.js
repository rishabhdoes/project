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
  listPropertiesOnSearch,
  getMyListings,
} = require("../controllers/propertiesController");

const router = Router();

router.use(userAuth);

// map


// properties
router.post("/newProperty/house/create", newHouseProperty);
router.post("/newProperty/house/update/:houseId", updateHouseProperty);
router.post("newProperty/pg/create", newPgProperty);
router.post("/newProperty/pg/update/:id", updatePgProperty);
router.get('/listProperties',listPropertiesOnSearch);


// fetch all user listings
router.get("/user/mylistings/", getMyListings);

module.exports = router;
