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
} = require("../controllers/propertiesController");

const router = Router();

router.use(userAuth);

// map
router.get("/autocomplete", suggestionAutocomplete);
router.get("/nearbyLocalities", nearbyLocalities);

// properties
router.post("/newProperty/house/create", newHouseProperty);
router.post("/newProperty/house/update/:id", updateHouseProperty);
router.post("newProperty/pg/create", newPgProperty);
router.post("/newProperty/pg/update/:id", updatePgProperty);

module.exports = router;
