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

const router = Router();
router.get("/property", userAuth, adminVerify, getAdminPropertyList);
router.delete("/property", userAuth, adminVerify, togglePropertyBlockedStatus);
router.post("/users", userAuth, adminVerify, toggleUserBlockedStatus);
router.get("/users", userAuth, adminVerify, getAllUserBlocked);

module.exports = router;
