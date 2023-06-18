const db = require("../db");

const isHouseOwner = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { houseId } = req.params;

    if (!userId || !houseId) {
      throw new Error("Invalid request");
    }

    const { rows } = await db.query("SELECT * FROM houses WHERE id = $1", [
      houseId,
    ]);

    if (!rows.length) throw new Error("House not found");

    const house = rows[0];

    const query1 = `SELECT is_user_admin from users WHERE id=$1`;

    const userData = await db.query(query1, [req.user.id]);

    if (userData?.rows[0]?.is_user_admin) return next();

    if (house.owner_id !== userId)
      throw new Error("You do not have access to do that");

    next();
  } catch (err) {
    next(err);
  }
};

const {
  PropertyType,
  BHKType,
  PropertyAge,
  PreferredTenants,
  Furnishing,
  Parking,
  Facing,
  Coordinates,
  WATER_SUPPLY,
} = require("../constants");
const {
  getCoordinatesByLocation,
} = require("../controllers/Googleapiscontrolller");

const housesValidation = async (req, res, next) => {
  const {
    // part - 1
    partNo,
    property_type,
    apartment_name,
    bhk_type,
    floor,
    total_floors,
    property_age,
    facing,
    builtup_area,

    // part - 2
    city,
    locality,
    street,

    // part 3
    rent,
    rent_negotiable,
    deposit,
    monthly_maintenance,
    maintenance_amount,
    available_from,
    preferred_tenants,
    furnishing_type,
    parking,

    // part 4
    description,
    bathrooms_count,
    balcony_count,
    water_supply,
    gym,
  } = req.body;

  try {
    // validation for Property details page
    if (partNo === "1") {
      if (!property_type || !PropertyType.includes(property_type)) {
        throw new Error("Invalid Property type");
      }

      if (!BHKType.includes(bhk_type)) {
        throw new Error("Invalid BHK TYPE");
      }

      if (!PropertyAge.includes(property_age)) {
        throw new Error("Invalid PropertyAge");
      }

      if (!builtup_area) {
        throw new Error("Invalid BuiltType Area");
      }

      if (!floor || floor < 0) {
        throw new Error("Invalid Floor");
      }

      if (!total_floors || total_floors < 0 || total_floors < floor) {
        throw new Error("Invalid Floor");
      }

      if (!facing || !Facing.includes(facing)) {
        throw new Error("Invalid Facing");
      }
    }

    // validation for Location details page
    if (partNo === "2") {
      if (!city || !Object.keys(Coordinates).includes(city)) {
        throw new Error("Invalid City");
      }

      await getCoordinatesByLocation(locality)
        .then((res) => {
          req.body.latitude = res[0];
          req.body.longitude = res[1];
        })
        .catch((err) => {
          throw new Error("Invalid  Locality");
        });

      if (!street) {
        throw new Error("Invalid Landmark");
      }
    }

    // validation for rental details page
    if (partNo === "3") {
      if (!rent || rent <= 0) {
        throw new Error("Invalid expected rent");
      }

      if (!(rent_negotiable === true || rent_negotiable === false)) {
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

      if (!furnishing_type || !Furnishing.includes(furnishing_type)) {
        throw new Error("Invalid furnishing type");
      }

      if (!parking || !Parking.includes(parking)) {
        throw new Error("Invalid Parking type");
      }
    }

    // validation for amenities details page
    if (partNo === "4") {
      if (!bathrooms_count || bathrooms_count < 1) {
        throw new Error("Invalid bathroom data");
      }

      if (!balcony_count || balcony_count < 0) {
        throw new Error("Invalid balcony data");
      }

      if (!water_supply || !WATER_SUPPLY.includes(water_supply)) {
        throw new Error("Invalid water supply data");
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { housesValidation };
module.exports = { isHouseOwner, housesValidation };
