const { Router } = require("express");
const {
  registerValidation,
  loginValidation,
  emailValidation,
  tokenValidation,
  emailExists,
} = require("../validators/auth");

const { validationMiddleware } = require("../middleware/validation-middleware");

const {
  register,
  login,
  verify,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  suggestionAutocomplete,
  nearbyLocalities,
  getLocationByCoordinates,
} = require("../controllers/Googleapiscontrolller");
const {
  listPropertiesOnSearch,
  getPropertyData,
  getPropertyDataForPg,
} = require("../controllers/propertiesController");
const { verifyEmail } = require("../controllers/profileController");
const { paymentStatus } = require("../controllers/paymentController");

const router = Router();

router.get("/", (req, res) => {
  return res.send("Hi");
});

router.post("/register", registerValidation, validationMiddleware, register);
router.post("/login", loginValidation, validationMiddleware, login);
router.post("/verify-token", verify);
router.post(
  "/forgot-password",
  emailValidation,
  validationMiddleware,
  forgotPassword
);
router.post(
  `/reset-password/:user_id/:token`,
  tokenValidation,
  validationMiddleware,
  resetPassword
);

router.post("/listProperties", listPropertiesOnSearch);
router.get("/autocomplete", suggestionAutocomplete);
router.get("/nearbyLocalities", nearbyLocalities);

router.get("/getProperty/:id", getPropertyData);

router.get("/getPropertyPg/:id", getPropertyDataForPg);

router.get(`/verifyEmail/:user_id/:email/:token`, emailExists, verifyEmail);

router.get("/getLocationByCoordinates", getLocationByCoordinates);

router.post("/payment-status", paymentStatus);
router.get("/payment-status", paymentStatus);

module.exports = router;
