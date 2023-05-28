const db = require("../db");

exports.newHouseProperty = async (req, res) => {
  const { city } = req.body;
  const userId = req.user.id;

  const cities = ["gurgaon", "mumbai", "banglore", "delhi", "hyderabad"];

  if (!cities.includes(city)) {
    return res.status(404).json("Service not available in this area.");
  }

  const houseId = await db.query(
    "INSERT INTO houses(city,owner_id,locality) values ($1, $2, $3) RETURNING id",
    [city, userId, city]
  );

  res.status(201).json({ message: "new house created", houseId });
};

exports.newPgProperty = async (req, res) => {
  const { city } = req.body;
  const userId = req.user.id;

  const cities = ["gurgaon", "mumbai", "banglore", "delhi", "hyderabad"];

  if (!cities.includes(city)) {
    return res.status(404).json("Service not available in this area.");
  }

  const pgId = await db.query(
    "INSERT INTO pgs(city,owner_id,locality) values ($1, $2, $3) RETURNING id",
    [city, userId, city]
  );

  res.status(201).json({ message: "new pg created", pgId });
};

exports.updateHouseProperty = async (req, res) => {
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

exports.updatePgProperty = async (req, res) => {
  const userId = req.user.id;
  const { pgId } = req.params;

  const rows = await db.query("SELECT * FROM house WHERE id = $1", [pgId]);

  if (!rows.length) return res.status(404).json("Pg does not exist");

  const pg = rows[0];

  if (pg.owner_id !== userId) return res.status(401).json("Not Authorised");

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

  const pgArr = Object.entries(pgObject)
    .filter(([key, value]) => value !== null)
    .map(([key, value]) => {
      key, value;
    });

  const updateDbQuery = `UPDATE pgs SET ${pgArr
    .map((pg, index) => `${pg} = $${index + 1}`)
    .join(", ")} WHERE id = $${pgArr.length + 1}`;

  const values = pgArr.map((cur) => {
    return cur.value;
  });

  await db.query(updateDbQuery, [...values, pgId]);
  res.status(200).json("Updated Pg Successfully");
};
