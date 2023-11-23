const { Router } = require("express");
const { userAuth } = require("../middleware/auth-middleware");
const { adminVerify } = require("../middleware/admin-middleware");
const {
  getAdminPropertyList,

  togglePropertyBlockedStatus,
} = require("../controllers/propertiesController");
const {
  toggleUserBlockedStatus,
  getAllUserBlocked,
} = require("../controllers/profileController");
const {
  getPlans,
  createPlans,
  updatePlans,
  togglePlanStatus,
} = require("../controllers/plansController");

const router = Router();
router.use(userAuth, adminVerify);

router.get("/property", getAdminPropertyList);
router.delete("/property", togglePropertyBlockedStatus);
router.post("/users", toggleUserBlockedStatus);
router.get("/users", getAllUserBlocked);

router.get("/plans", getPlans);
router.post("/plans", createPlans);
router.patch("/plans", updatePlans);
router.get("/togglePlans", togglePlanStatus);

module.exports = router;
