const db = require("../db");

const isPgOwner = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { pgId } = req.params;

    if (!userId || !pgId) {
      throw new Error("Invalid request");
    }

    const { rows } = await db.query("SELECT * FROM pgs WHERE id = $1", [pgId]);

    if (!rows.length) throw new Error("PG not found");

    const pg = rows[0];

    const query1 = `SELECT is_user_admin from users WHERE id=$1`;

    const userData = await db.query(query1, [req.user.id]);

    if (userData?.rows[0]?.is_user_admin) return next();

    if (pg.owner_id !== userId)
      throw new Error("You do not have access to do that");

    next();
  } catch (err) {
    next(err);
  }
};

const {
  getCoordinatesByLocation,
} = require("../controllers/Googleapiscontrolller");

const { body, validationResult } = require("express-validator");

const pgValidation = async (req, res, next) => {
  const { partNo } = req.body;

  try {
    // validation for Property details page
    if (partNo === "1") {
      // Use the check function to apply validation rules for each field
      body("pg_name").trim().notEmpty().withMessage("PG name is required");
      body("food_available")
        .isBoolean()
        .withMessage("Invalid value for food availability");
      body("breakfast").isBoolean().withMessage("Invalid value for breakfast");
      body("lunch").isBoolean().withMessage("Invalid value for lunch");
      body("dinner").isBoolean().withMessage("Invalid value for dinner");
      body("gender")
        .isIn(["any", "male", "female"])
        .withMessage("Invalid gender");
      body("smoking").isBoolean().withMessage("Invalid value for smoking");
      body("drinking").isBoolean().withMessage("Invalid value for drinking");
      body("nonveg").isBoolean().withMessage("Invalid value for nonveg");
      body("party").isBoolean().withMessage("Invalid value for party");
      body("opposite_gender")
        .isBoolean()
        .withMessage("Invalid value for opposite gender");
      body("preferred_tenant")
        .isIn(["any", "male", "female"])
        .withMessage("Invalid preferred tenant");
      body("warden_facilities")
        .isBoolean()
        .withMessage("Invalid value for warden facilities");
    }

    // validation for locality
    if (partNo === "2") {
      body("city").trim().notEmpty().withMessage("City is required");
      body("locality").trim().notEmpty().withMessage("Locality is required");
      body("street").trim().notEmpty().withMessage("Street is required");
      body("pincode").trim().notEmpty().withMessage("Pincode is required");
      body("complete_address")
        .trim()
        .notEmpty()
        .withMessage("Complete address is required");
      const { description } = req.body;

      if (description !== undefined && description !== null) {
        body("description")
          .trim()
          .notEmpty()
          .withMessage("Description should not be empty");
      }
    }

    // validation for rent
    if (partNo === "3") {
      const {
        single_room,
        single_room_rent,
        single_room_deposit,
        double_room,
        double_room_rent,
        double_room_deposit,
        triple_room,
        triple_room_rent,
        triple_room_deposit,
        four_room,
        four_room_rent,
        four_room_deposit,
      } = req.body;
      // Validation for single_room if it's selected
      if (single_room) {
        body("single_room_rent")
          .isNumeric()
          .withMessage("Single room rent should be a number");
        body("single_room_deposit")
          .isNumeric()
          .withMessage("Single room deposit should be a number");
      }

      // Validation for double_room if it's selected
      if (double_room) {
        body("double_room_rent")
          .isNumeric()
          .withMessage("Double room rent should be a number");
        body("double_room_deposit")
          .isNumeric()
          .withMessage("Double room deposit should be a number");
      }

      // Validation for triple_room if it's selected
      if (triple_room) {
        body("triple_room_rent")
          .isNumeric()
          .withMessage("Triple room rent should be a number");
        body("triple_room_deposit")
          .isNumeric()
          .withMessage("Triple room deposit should be a number");
      }

      // Validation for four_room if it's selected
      if (four_room) {
        body("four_room_rent")
          .isNumeric()
          .withMessage("Four room rent should be a number");
        body("four_room_deposit")
          .isNumeric()
          .withMessage("Four room deposit should be a number");
      }
    }

    // validation for amenities
    if (partNo === "4") {
      const {
        ac,
        attached_bathroom,
        fridge,
        water_filter,
        washing_machine,
        tv,
        geyser,
        two_wheeler_parking,
        four_wheeler_parking,
        lift,
        cctv,
        power_backup,
        gated_security,
        wifi,
        fire_safety,
        club_house,
        room_cleaning,
        tt_table,
        gym,
        cooking_allowed,
      } = req.body;

      // Validation for water_supply
      body("water_supply")
        .isIn(["CORPORATION", "BOREWELL"])
        .withMessage("Invalid water supply value");

      // Validation for all boolean fields
      const booleanFields = [
        "ac",
        "attached_bathroom",
        "fridge",
        "water_filter",
        "washing_machine",
        "tv",
        "geyser",
        "two_wheeler_parking",
        "four_wheeler_parking",
        "lift",
        "cctv",
        "power_backup",
        "gated_security",
        "wifi",
        "fire_safety",
        "club_house",
        "room_cleaning",
        "tt_table",
        "gym",
        "cooking_allowed",
      ];

      booleanFields.forEach((field) => {
        body(field).isBoolean().withMessage(`Invalid value for ${field}`);
      });
    }

    await Promise.all(validationResult(req).array());

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // If validation passes, move to the next middleware or route handler
    next();
  } catch (err) {
    // Handle any unexpected errors that might occur during validation
    console.error("Error during validation:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { isPgOwner, pgValidation };
