const db = require("../db");
const cities = ["Gurgaon", "Mumbai", "Bangalore", "Delhi", "Hyderabad"];

const newHouseProperty = async (req, res) => {
  const { city } = req.body;

  const userId = req.user.id;

  if (!cities.includes(city)) {
    return res.status(404).json("Service not available in this area.");
  }

  const { rows } = await db.query(
    "INSERT INTO houses(city,owner_id,locality) values ($1, $2, $3) RETURNING *",
    [city, userId, city]
  );

  const house = rows[0];
  res.status(201).json({ message: "new house created", house });
};

const newPgProperty = async (req, res) => {
  const { city } = req.body;
  const userId = req.user.id;

  if (!cities.includes(city)) {
    return res.status(404).json("Service not available in this area.");
  }

  const { rows } = await db.query(
    "INSERT INTO pgs(city,owner_id,locality) values ($1, $2, $3) RETURNING *",
    [city, userId, city]
  );

  const pg = rows[0];
  res.status(201).json({ message: "new pg created", pg });
};

const updateHouseProperty = async (req, res) => {
  const userId = req.user.id;
  const { houseId } = req.params;

  const { rows } = await db.query("SELECT * FROM houses WHERE id = $1", [
    houseId,
  ]);

  if (!rows.length) return res.status(404).json("House does not exist");

  const house = rows[0];

  if (house.owner_id !== userId) return res.status(401).json("Not Authorised");

  let updatedHouse = {};

  const {
    title = null,
    is_apartment = null,
    apartment_type = null,
    apartment_name = null,
    bhk_type = null,
    description = null,
    builtup_area = null,
    property_age = null,
    facing = null,
    block = null,
    floor = null,
    total_floors = null,
    street = null,
    locality = null,
    colony = null,
    city = null,
    state = null,
    country = null,
    zip_code = null,
    rent = null,
    deposit = null,
    rent_negotiable = null,
    monthly_maintenance = null,
    maintenance_amount = null,
    preferred_tenants = null,
    furnishing = null,
    lockin_period = null,
    secondary_number = null,
    available_from = null,
    rank = null,
  } = req.body;

  const houseObj = {
    title,
    is_apartment,
    apartment_type,
    apartment_name,
    bhk_type,
    description,
    builtup_area,
    property_age,
    facing,
    block,
    floor,
    total_floors,
    street,
    locality,
    colony,
    city,
    state,
    country,
    zip_code,
    rent,
    deposit,
    rent_negotiable,
    monthly_maintenance,
    maintenance_amount,
    preferred_tenants,
    furnishing,
    lockin_period,
    secondary_number,
    available_from,
    rank,
  };

  // default array that contains all columns that exist in houses db
  const houseArrDBKeys = [
    "id",
    "owner_id",
    "title",
    "is_apartment",
    "apartment_type",
    "apartment_name",
    "bhk_type",
    "description",
    "builtup_area",
    "property_age",
    "facing",
    "block",
    "floor",
    "total_floors",
    "street",
    "locality",
    "colony",
    "city",
    "state",
    "country",
    "zip_code",
    "rent",
    "deposit",
    "rent_negotiable",
    "monthly_maintenance",
    "maintenance_amount",
    "preferred_tenants",
    "furnishing",
    "lockin_period",
    "secondary_number",
    "available_from",
    "rank",
  ];

  // check whether values are null or not
  // also check if key exists in db
  // (user cannot just put any key value, it must exist in db as well)
  const houseArr = Object.entries(houseObj)
    .filter(([key, value]) => {
      return value !== null && houseArrDBKeys.includes(key);
    })
    .map(([key, value]) => ({
      key,
      value,
    }));

  if (houseArr.length > 0) {
    const updateDbQuery = `UPDATE houses SET ${houseArr
      .map((house, index) => `${house.key} = $${index + 1}`)
      .join(", ")} WHERE id = $${houseArr.length + 1} RETURNING *`;

    const values = houseArr.map((cur) => {
      return cur.value;
    });

    updatedHouse = await db.query(updateDbQuery, [...values, houseId]);
  }

  const {
    ac_count = null,
    tv_count = null,
    bedrooms_count = null,
    bathrooms_count = null,
    cupboard_count = null,
    fridge = null,
    water_filter = null,
    washing_machine = null,
    microwave = null,
    geyser = null,
    gym = null,
    two_wheeler_parking = null,
    four_wheeler_parking = null,
    lift = null,
    cctv = null,
    swimming_pool = null,
    power_backup = null,
    water_supply = null,
    gas_pipeline = null,
    gated_security = null,
    park = null,
    wifi = null,
    visitor_parking = null,
    shopping_center = null,
    fire_safety = null,
    club_house = null,
  } = req.body;

  const houseFacilitiesObj = {
    ac_count,
    tv_count,
    bedrooms_count,
    bathrooms_count,
    cupboard_count,
    fridge,
    water_filter,
    washing_machine,
    microwave,
    geyser,
    gym,
    two_wheeler_parking,
    four_wheeler_parking,
    lift,
    cctv,
    swimming_pool,
    power_backup,
    water_supply,
    gas_pipeline,
    gated_security,
    park,
    wifi,
    visitor_parking,
    shopping_center,
    fire_safety,
    club_house,
  };

  // default array that contains all columns that exist in houseFacilities db
  const houseFacilitiesDBKeys = [
    "id",
    "house_id",
    "ac_count",
    "tv_count",
    "bedrooms_count",
    "bathrooms_count",
    "cupboard_count",
    "fridge",
    "water_filter",
    "washing_machine",
    "microwave",
    "geyser",
    "gym",
    "two_wheeler_parking",
    "four_wheeler_parking",
    "lift",
    "cctv",
    "swimming_pool",
    "power_backup",
    "water_supply",
    "gas_pipeline",
    "gated_security",
    "park",
    "wifi",
    "visitor_parking",
    "shopping_center",
    "fire_safety",
    "club_house",
  ];

  // check whether values are null or not
  // also check if key exists in db
  const houseFacilitiesArr = Object.entries(houseFacilitiesObj)
    .filter(([key, value]) => {
      value !== null && houseFacilitiesDBKeys.includes(key);
    })
    .map(([key, value]) => ({
      key,
      value,
    }));

  if (houseFacilitiesArr.length > 0) {
    let updatedHouseFacility = {};

    if (rows.length === 0) {
      const columns = houseFacilitiesArr
        .map((facility) => `"${facility.key}"`)
        .join(", ");
      const placeholders = houseFacilitiesArr
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      const dbQuery = `INSERT INTO houseFacilities (${columns}) VALUES (${placeholders}) RETURNING *`;

      const values = houseFacilitiesArr.map((cur) => {
        return cur.value;
      });

      updatedHouseFacility = await db.query(dbQuery, [...values, houseId]);
    } else {
      const updateFacilities = `UPDATE houseFacilities SET ${houseFacilitiesArr
        .map((facility, index) => `${facility.key} = $${index + 1}`)
        .join(", ")} WHERE house_id = $${
        houseFacilitiesArr.length + 1
      } RETURNING *`;

      const values = houseFacilitiesArr.map((cur) => {
        return cur.value;
      });

      updatedHouseFacility = await db.query(updateFacilities, [
        ...values,
        houseId,
      ]);
    }

    updatedHouse = { ...updatedHouse, ...updatedHouseFacility };
  }

  res
    .status(200)
    .json({ messgae: "Updated House Successfully", house: updatedHouse });
};

const updatePgProperty = async (req, res) => {
  const userId = req.user.id;
  const { pgId } = req.params;

  const { rows } = await db.query("SELECT * FROM pgs WHERE id = $1", [pgId]);

  if (!rows.length) return res.status(404).json("Pg does not exist");

  const pg = rows[0];

  if (pg.owner_id !== userId) return res.status(401).json("Not Authorised");

  let updatedPg = {};

  const {
    pg_name = null,
    description = null,
    block = null,
    street = null,
    locality = null,
    colony = null,
    city = null,
    state = null,
    country = null,
    zip_code = null,

    single_room = null,
    single_room_rent = null,
    single_room_deposit = null,

    double_room = null,
    double_room_rent = null,
    double_room_deposit = null,

    triple_room = null,
    triple_room_rent = null,
    triple_room_deposit = null,

    four_room = null,
    four_room_rent = null,
    four_room_deposit = null,

    lockin_period = null,
    preferred_tenants = null,
    gender = null,
    food = null,
    rank = null,
  } = req.body;

  const pgObject = {
    pg_name,
    description,
    block,
    street,
    locality,
    colony,
    city,
    state,
    country,
    zip_code,

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

    lockin_period,
    preferred_tenants,
    gender,
    food,
    rank,
  };

  const pgArrDBKeys = [
    "pg_name",
    "description",
    "block",
    "street",
    "locality",
    "colony",
    "city",
    "state",
    "country",
    "zip_code",
    "single_room",
    "single_room_rent",
    "single_room_deposit",
    "double_room",
    "double_room_rent",
    "double_room_deposit",
    "triple_room",
    "triple_room_rent",
    "triple_room_deposit",
    "four_room",
    "four_room_rent",
    "four_room_deposit",
    "lockin_period",
    "preferred_tenants",
    "gender",
    "food",
    "rank",
  ];

  const pgArr = Object.entries(pgObject)
    .filter(([key, value]) => value !== null && pgArrDBKeys.includes(key))
    .map(([key, value]) => ({
      key,
      value,
    }));

  if (pgArr.length > 0) {
    const updateDbQuery = `UPDATE pgs SET ${pgArr
      .map((pg, index) => `"${pg.key}" = $${index + 1}`)
      .join(", ")} WHERE id = $${pgArr.length + 1} RETURNING *`;

    const values = pgArr.map((cur) => cur.value);

    updatedPg = await db.query(updateDbQuery, [...values, pgId]);
  }

  const {
    ac = null,
    attached_bathroom = null,
    breakfast = null,
    lunch = null,
    dinner = null,
    fridge = null,
    water_filter = null,
    washing_machine = null,
    tv = null,
    cupboard = null,
    geyser = null,
    gym = null,
    two_wheeler_parking = null,
    four_wheeler_parking = null,
    lift = null,
    cctv = null,
    power_backup = null,
    water_supply = null,
    gated_security = null,
    wifi = null,
    cooking_followed = null,
    fire_safety = null,
    club_house = null,
    smoking = null,
    guardians_allowed = null,
    opposite_gender = null,
    drinking = null,
    nonveg = null,
    music_party = null,
    laundry = null,
    room_cleaning = null,
    biometric_security = null,
    tt_table = null,
    warden_facilities = null,
  } = req.body;

  const pgFacilitiesObj = {
    ac,
    attached_bathroom,
    breakfast,
    lunch,
    dinner,
    fridge,
    water_filter,
    washing_machine,
    tv,
    cupboard,
    geyser,
    gym,
    two_wheeler_parking,
    four_wheeler_parking,
    lift,
    cctv,
    power_backup,
    water_supply,
    gated_security,
    wifi,
    cooking_followed,
    fire_safety,
    club_house,
    smoking,
    guardians_allowed,
    opposite_gender,
    drinking,
    nonveg,
    music_party,
    laundry,
    room_cleaning,
    biometric_security,
    tt_table,
    warden_facilities,
  };

  const pgFacilitiesDBKeys = [
    "ac",
    "attached_bathroom",
    "breakfast",
    "lunch",
    "dinner",
    "fridge",
    "water_filter",
    "washing_machine",
    "tv",
    "cupboard",
    "geyser",
    "gym",
    "two_wheeler_parking",
    "four_wheeler_parking",
    "lift",
    "cctv",
    "power_backup",
    "water_supply",
    "gated_security",
    "wifi",
    "cooking_followed",
    "fire_safety",
    "club_house",
    "smoking",
    "guardians_allowed",
    "opposite_gender",
    "drinking",
    "nonveg",
    "music_party",
    "laundry",
    "room_cleaning",
    "biometric_security",
    "tt_table",
    "warden_facilities",
  ];

  const pgFacilitiesArr = Object.entries(pgFacilitiesObj)
    .filter(
      ([key, value]) => value !== null && pgFacilitiesDBKeys.includes(key)
    )
    .map(([key, value]) => ({
      key,
      value,
    }));

  if (pgFacilitiesArr.length > 0) {
    let updatedPgFacility = {};

    if (rows.length === 0) {
      const columns = pgFacilitiesArr
        .map((facility) => `"${facility.key}"`)
        .join(", ");
      const placeholders = pgFacilitiesArr
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      const dbQuery = `INSERT INTO pgFacilities (${columns}) VALUES (${placeholders}) RETURNING *`;

      const values = pgFacilitiesArr.map((cur) => cur.value);

      updatedPgFacility = await db.query(dbQuery, [...values, pgId]);
    } else {
      const values = pgFacilitiesArr.map((facility, index) => facility.value);
      const updateFacilities = `UPDATE pgFacilities SET ${pgFacilitiesArr
        .map((facility, index) => `"${facility.key}" = $${index + 1}`)
        .join(", ")} WHERE pg_id = $${pgFacilitiesArr.length + 1} RETURNING *`;

      updatedPgFacility = await db.query(updateFacilities, [...values, pgId]);
    }

    updatedPg = { ...updatedPg, ...updatedPgFacility };
  }

  res.status(200).json({ message: "Updated Pg Successfully", pg: updatedPg });
};

const getMyListings = async (req, res) => {
  const userId = req.user.id;

  const houses = await db.query(
    "SELECT * FROM houses LEFT JOIN houseFacilities ON houses.id = houseFacilities.house_id WHERE houses.owner_id = $1",
    [userId]
  );

  const pgs = await db.query(
    "SELECT * FROM pgs LEFT OUTER JOIN pgfacilities ON pgs.id = pgfacilities.pg_id WHERE pgs.owner_id = $1",
    [userId]
  );

  res.status(200).json({ house: houses.rows, pg: pgs.rows });
};

const listPropertiesOnSearch = async (req, res) => {
  const { propertyType, city, text, pgNo } = req.body;

  const keywords = text.map((textArray) => {
    const op = textArray.split(",");
    // console.log(op);
    return op;
  });

  const allKeywords = keywords.flat();

  const queryForHouse = `
  SELECT *
  FROM houses
  LEFT JOIN housefacilities
  on houses.id=housefacilities.house_id
  WHERE city ILIKE $2
    AND locality ILIKE ANY (
      SELECT '%' || pattern || '%'
      FROM unnest($1::text[]) AS pattern
    )
  ORDER BY (
    SELECT COUNT(DISTINCT word)
    FROM regexp_split_to_table(locality, E'\\s+') AS word
    WHERE word ILIKE ANY (
      SELECT '%' || pattern || '%'
      FROM unnest($1::text[]) AS pattern
    )
  ) DESC, houses.created_at DESC
  OFFSET $3
  LIMIT $4;
  
  
`;
  const queryForPg = `
SELECT *
FROM pgs
LEFT JOIN pgfacilities
on pgs.id=pgfacilities.pg_id
WHERE city ILIKE $2
  AND locality ILIKE ANY (
    SELECT '%' || pattern || '%'
    FROM unnest($1::text[]) AS pattern
  )
ORDER BY (
  SELECT COUNT(DISTINCT word)
  FROM regexp_split_to_table(locality, E'\\s+') AS word
  WHERE word ILIKE ANY (
    SELECT '%' || pattern || '%'
    FROM unnest($1::text[]) AS pattern
  )
) DESC, pgs.created_at DESC
OFFSET $3
LIMIT $4;


`;

  if (propertyType == "House") {
    const { rows } = await db.query(queryForHouse, [
      allKeywords,
      city,
      3 * pgNo,
      3,
    ]);

    return res.status(200).json(rows);
  } else {
    const { rows } = await db.query(queryForPg, [
      allKeywords,
      city,
      10 * pgNo,
      10,
    ]);

    return res.status(200).json(rows);
  }
};

module.exports = {
  newHouseProperty,
  newPgProperty,
  updateHouseProperty,
  updatePgProperty,
  listPropertiesOnSearch,
  getMyListings,
};
