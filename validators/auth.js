const { check } = require("express-validator");
const db = require("../db");
const { compare } = require("bcryptjs");
const {
  PropertyType,
  BHKType,
  PropertyAge,
  PreferredTenants,
  Furnishing,
  Parking,
} = require("../constants");
const { Facing } = require("../constants");
const { Coordinates } = require("../constants");

const password = check("password")
  .isLength({ min: 6, max: 15 })
  .withMessage("Password has to be atleast 6 characters");

const email = check("email")
  .isEmail()
  .withMessage("Please provide a valid email");

const phoneNumber = check("phone_number")
  .isNumeric()
  .withMessage("Phone must be numeric")
  .custom((value) => {
    const stringVal = String(value);
    if (stringVal.length !== 12) {
      throw new Error("Invalid Phone Number");
    }

    return true;
  });

const emailExists = check("email").custom(async (value) => {
  const { rows } = await db.query("Select * from users where email = $1", [
    value,
  ]);

  if (rows.length) {
    throw new Error("Email already exists");
  }
});

// login validation
const loginFieldsCheck = check("email").custom(async (value, { req }) => {
  const user = await db.query("SELECT * from users WHERE email = $1", [value]);
  if (!user.rows.length) {
    throw new Error("Email does not exist");
  }

  const validPassword = await compare(
    req.body.password,
    user.rows[0].password_hash
  );

  if (!validPassword) {
    throw new Error("Wrong credentials");
  }

  req.user = user.rows[0];
});

const getUserFromEmail = check("email").custom(async (value, { req, res }) => {
  const user = await db.query("SELECT * from users WHERE email = $1", [value]);
  if (user.rowCount > 0) {
    req.user = user.rows[0];
  } else {
    res.status(400);
    throw new Error("User doesn't exist please register");
  }
});

const getUserFromId = check("id").custom(async (value, { req }) => {
  const user = await db.query("SELECT * from users WHERE id = $1", [value]);
  if (user.rowCount > 0) {
    req.user = user.rows[0];
  } else {
    const errorResponse = {
      error: "Validation Error",
      message: "User doesn't exist Please sign up",
    };
    res.status(400).json(errorResponse);
  }
});

module.exports = {
  registerValidation: [email, password, phoneNumber, emailExists],
  loginValidation: [email, loginFieldsCheck],
  emailValidation: [email, getUserFromEmail],
  tokenValidation: [password, getUserFromId],
};
