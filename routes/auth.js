const { Router } = require("express");
const { registerValidation, loginValidation } = require("../validators/auth");
const { validationMiddleware } = require("../middleware/validation-middleware");
const {
  register,
  login,
  protected,
  verify,
} = require("../controllers/authController");
const { userAuth } = require("../middleware/auth-middleware");
const router = Router();

router.get("/", (req, res) => {
  return res.send("Hi");
});

router.post("/register", registerValidation, validationMiddleware, register);
router.post("/login", loginValidation, validationMiddleware, login);
router.post("/verify-token", validationMiddleware, verify);

//example
router.get("/protected", userAuth, protected);

module.exports = router;
