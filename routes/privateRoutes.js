const { Router } = require("express");
const { userAuth } = require("../middleware/auth-middleware");
const { adminVerify } = require("../middleware/admin-middleware");
const { getAdminPropertyList } = require("../controllers/propertiesController");

const router = Router();
router.get("/property", userAuth, adminVerify, getAdminPropertyList);

module.exports = router;
