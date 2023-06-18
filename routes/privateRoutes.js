const { Router } = require("express");
const { userAuth } = require("../middleware/auth-middleware");
const { adminVerify } = require("../middleware/admin-middleware");
const {
  getAdminPropertyList,
  deleteProperty,
} = require("../controllers/propertiesController");
const { toggleUserBlockedStatus } = require("../controllers/profileController");

const router = Router();
router.get("/property", userAuth, adminVerify, getAdminPropertyList);
router.delete("/property", userAuth, adminVerify, deleteProperty);
router.post("/users", userAuth, adminVerify, toggleUserBlockedStatus);

module.exports = router;
