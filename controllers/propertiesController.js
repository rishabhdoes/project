const db = require("../db");

exports.newHouseProperty = async (req, res) => {
  const { city } = req.body;
  const userId = req.user.id;

  const cities = ["gurgaon", "mumbai", "banglore", "delhi", "hyderabad"];

  if (!cities.includes(city)) {
    return res.status(404).json("Service not available in this area.");
  }

  const houseId = await db.query(
    "INSERT INTO house(city,owner_id) values ($1, $2) RETURNING id",
    [city, userId]
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
    "INSERT INTO house(city,owner_id) values ($1, $2) RETURNING id",
    [city, userId]
  );
  res.status(201).json({ message: "new house created", pgId });
};

exports.updateHouseProperty = async (req, res) => {
  const houseObject = ({
    id,
    user_id,
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
  } = req.body);

  const rows = await db.query("SELECT * FROM house WHERE id = $1", [id]);

  if (!rows.length) return res.status(404).json("House does not exist");

  const house = rows[0];

  if (!user_id || house.owner_id !== user_id)
    return res.json("Invalid request");

  const houseArray = [...houseObject];

  const filteredHouseArr = houseArray.filter((property) => {
    if (property) return property;
  });

  console.log(filteredHouseArr);
  res.json("Hi");
};

exports.updatePgProperty = async (req, res) => {};
