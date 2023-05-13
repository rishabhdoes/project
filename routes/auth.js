const { Router } = require("express");
const { registerValidation, loginValidation } = require("../validators/auth");
const { validationMiddleware } = require("../middleware/validation-middleware");
const { register, login } = require("../controllers/authController");
const router = Router();

router.get("/", (req, res) => {
  return res.send("Hi");
});

router.post("/register", registerValidation, validationMiddleware, register);
router.post("/login", loginValidation, validationMiddleware, login);

module.exports = router;
