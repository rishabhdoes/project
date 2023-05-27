const { Router } = require("express");
const { registerValidation, loginValidation, emailValidation, tokenValidation } = require("../validators/auth");
const { validationMiddleware } = require("../middleware/validation-middleware");
const {
  register,
  login,
  protected,
  verify,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { userAuth } = require("../middleware/auth-middleware");
const router = Router();

router.get("/", (req, res) => {
  return res.send("Hi");
});

router.post("/register", registerValidation, validationMiddleware, register);
router.post("/login", loginValidation, validationMiddleware, login);
router.post("/verify-token", verify);
router.post("/forgot-password", emailValidation, forgotPassword);
router.post(`/reset-password/:user_id/:token`, tokenValidation, resetPassword);

//example
router.get("/protected", userAuth, protected);

module.exports = router;
