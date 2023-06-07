const { check } = require("express-validator");
const db = require("../db");
const { compare } = require("bcryptjs");

const password = check("password")
  .isLength({ min: 6, max: 15 })
  .withMessage("Password has to be atleast 6 characters");

const newPassword = check("newPassword")
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

  try {
    const user = await db.query("SELECT * from users WHERE email = $1", [
      value,
    ]);
    if (user.rowCount > 0) {
      req.user = user.rows[0];
    } else {
      throw new Error("User doesn't exist please register");
    }
  } catch (err) {
    //console.log(err);
    err.status = 401;
    throw new Error(err);
  }
});




   
  
  const getUserFromId = check("user_id").custom(async (value, { req }) => {
    const user = await db.query("SELECT * from users WHERE id = $1", [value]);
    if(user.rowCount > 0)
    {
      req.user = user.rows[0];
    }
    else{
      throw new Error("User doesn't exist please register")
  }
});

const housesValidation = async (req, res, next) => {
  const {
    partNo,
    property_type,
    bhk_type,
    property_age,
    built_up_area,
    floor,
    total_floor,
    facing,
    city,
    locality,
    landmark_street,
    expected_rent,
    rent_negotiable,
    expected_deposit,
    monthly_maintenance,
    available_from,
    preferred_tenants,
    furnishing,
    parking,
    description,
    bathroom,
    balcony,
    water_supply,
    gym,
    non_veg_allowed,
    gated_security,
  } = req.body;

  try {
    if (partNo == 1) {
      if (!PropertyType.includes(property_type)) {
        throw new Error("Invalid Property type");
      }

      if (!BHKType.includes(bhk_type)) {
        throw new Error("Invalid BHK TYPE");
      }

      if (!PropertyAge.includes(property_age)) {
        throw new Error("Invalid PropertyAge");
      }
      if (!built_up_area || built_up_area < 100) {
        throw new Error("Invalid BuiltType Area");
      }

      if (!floor || floor < 0) {
        throw new Error("Invalid Floor");
      }

      if (!total_floor || total_floor < 0 || total_floor < floor) {
        throw new Error("Invalid Floor");
      }
      if (!facing || !Facing.includes(facing)) {
        throw new Error("Invalid Facing");
      }
    }

    if (partNo == 2) {
      if (!city || !Object.keys(Coordinates).includes(city)) {
        throw new Error("Invalid City");
      }

      await Coordinates.find(locality)
        .then()
        .catch((err) => {
          throw new Error("Invalid  Locality ");
        });

      if (!landmark_street) {
        throw new Error("Invalid Landmark");
      }
    }

    if (partNo == 3) {
      if (!expected_rent || expected_rent <= 0) {
        throw new Error("Invalid expected rent");
      }
      if (
        !rent_negotiable ||
        !(rent_negotiable === "true" || rent_negotiable === "true")
      ) {
        throw new Error("Invalid rent_negotiable");
      }
      if (
        !monthly_maintenance ||
        !(
          monthly_maintenance === "Maintenance Included" ||
          monthly_maintenance === "Maintenance Extra"
        )
      ) {
        throw new Error("Invalid monthly_maintenance");
      }
      if (!available_from) {
        throw new Error("Invalid available_from Date");
      }
      if (!preferred_tenants || !PreferredTenants.includes(preferred_tenants)) {
        throw new Error("Invalid preffered Tenants");
      }

      if (!furnishing || !Furnishing.includes(furnishing)) {
        throw new Error("Invalid furnishing type");
      }

      if (!parking || Parking.includes(parking)) {
        throw new Error("Invalid Parking type");
      }
    }

    if (partNo == 4) {
      if (!bathroom || bathroom < 1) {
        throw new Error("Invalid bathroom data");
      }

      if (balcony && balcony < 0) {
        throw new Error("Invalid balcony data");
      }
      if (!gated_security || !non_veg_allowed) {
        throw new Error("Invalid gated_Security data");
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerValidation: [email, password, phoneNumber, emailExists],
  loginValidation: [email, loginFieldsCheck],

  emailValidation: [email, emailExists, getUserFromEmail],
  tokenValidation: [password, getUserFromId],
  housesValidation,
};


