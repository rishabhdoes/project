const { Coordinates } = require("../constants");
const db = require("../db");
const { houses, houseFacilities } = require("../db/tables");
const MAX_COUNT = 100;

const getHouse = async (req, res) => {
  try {
    const { houseId } = req.query;
    // console.log(houseId);
    const data = await db.query(
      `SELECT houses.*,
      houseFacilities.ac,
      houseFacilities.tv,
      houseFacilities.fridge,
      houseFacilities.water_filter,
      houseFacilities.washing_machine,
      houseFacilities.geyser,
      houseFacilities.gym,
      houseFacilities.lift,
      houseFacilities.cctv,
      houseFacilities.swimming_pool,
      houseFacilities.power_backup,
      houseFacilities.gas_pipeline,
      houseFacilities.gated_security,
      houseFacilities.park,
      houseFacilities.wifi,
      houseFacilities.visitor_parking,
      houseFacilities.shopping_center,
      houseFacilities.fire_safety,
      houseFacilities.club_house,
      houseFacilities.balcony_count,
      houseFacilities.furniture,
      houseFacilities.bathrooms_count 
  FROM
    houses
  LEFT JOIN
    houseFacilities ON houses.id = houseFacilities.house_id
  WHERE houses.id = $1;
  `,
      [houseId]
    );

    const { rows } = data;
    // console.log(rows[0]);
    if (!rows.length) {
      throw new Error("House not found");
    } else {
      return res.status(200).json(rows[0]);
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

const newHouseProperty = async (req, res) => {
  try {
    const { city } = req.body;

    const userId = req.user.id;

    const cities = Object.keys(Coordinates);

    if (!cities.includes(city)) {
      return res
        .status(404)
        .json({ message: "Service not available in this area." });
    }

    const { rows } = await db.query(
      "INSERT INTO houses(city,owner_id,locality) values ($1, $2, $3) RETURNING *",
      [city, userId, city]
    );

    const house = rows[0];
    res.status(201).json({ message: "new house created", house });
  } catch (error) {
    res.status(400).json({
      message: error.toString(),
    });
  }
};

const newPgProperty = async (req, res) => {
  try {
    const { city } = req.body;
    const userId = req.user.id;

    const cities = Object.keys(Coordinates);

    if (!cities.includes(city)) {
      return res.status(404).json("Service not available in this area.");
    }

    const { rows } = await db.query(
      "INSERT INTO pgs(city,owner_id,locality) values ($1, $2, $3) RETURNING *",
      [city, userId, city]
    );

    const pg = rows[0];
    res.status(201).json({ message: "new pg created", pg });
  } catch (error) {
    res.status(400).json({
      message: error.toString(),
    });
  }
};

const updateHouseProperty = async (req, res) => {
  try {
    const { houseId } = req.params;

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
      latitude = null,
      longitude = null,
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
      furnishing_type = null,
      lockin_period = null,
      secondary_number = null,
      available_from = null,
      property_type = null,
      water_supply = null,
      rank = null,
    } = req.body;

    const houseObj = {
      title,
      water_supply,
      is_apartment,
      apartment_type,
      apartment_name,
      bhk_type,
      description,
      builtup_area,
      property_age,
      facing,
      block,
      latitude,
      longitude,
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
      furnishing_type,
      lockin_period,
      secondary_number,
      available_from,
      property_type,
      rank,
    };

    // default array that contains all columns that exist in houses db
    const houseArrDBKeys = [
      "id",
      "owner_id",
      "water_supply",
      "title",
      "is_apartment",
      "apartment_type",
      "apartment_name",
      "bhk_type",
      "property_type",
      "description",
      "builtup_area",
      "property_age",
      "facing",
      "block",
      "latitude",
      "longitude",
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
      "furnishing_type",
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
        
        const { rows } = await db.query(updateDbQuery, [...values, houseId]);
        updatedHouse = rows[0];
      }

    const {
      ac = null,
      tv = null,
      bathrooms_count = null,
      bedrooms_count = null,
      balcony_count = null,
      cupboard_count = null,
      furniture = null,
      fridge = null,
      water_filter = null,
      washing_machine = null,
      geyser = null,
      gym = null,
      two_wheeler_parking = null,
      four_wheeler_parking = null,
      lift = null,
      cctv = null,
      swimming_pool = null,
      power_backup = null,
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
      ac,
      tv,
      balcony_count,
      furniture,
      bedrooms_count,
      bathrooms_count,
      cupboard_count,
      fridge,
      water_filter,
      washing_machine,
      geyser,
      gym,
      two_wheeler_parking,
      four_wheeler_parking,
      lift,
      cctv,
      swimming_pool,
      power_backup,
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
      "ac",
      "tv",
      "balcony_count",
      "furniture",
      "bedrooms_count",
      "bathrooms_count",
      "cupboard_count",
      "fridge",
      "water_filter",
      "washing_machine",
      "geyser",
      "gym",
      "two_wheeler_parking",
      "four_wheeler_parking",
      "lift",
      "cctv",
      "swimming_pool",
      "power_backup",
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
        return value !== null && houseFacilitiesDBKeys.includes(key);
      })
      .map(([key, value]) => ({
        key,
        value,
      }));

    if (houseFacilitiesArr.length > 0) {
      let updatedHouseFacilities = {};

      const { rows, rowCount } = await db.query(
        "SELECT * FROM houseFacilities WHERE house_id = $1",
        [houseId]
      );

      if (rowCount > 0) {
        const parameterValues = houseFacilitiesArr.map(
          (facility) => facility.value
        );
        parameterValues.push(houseId);

        const setClause = houseFacilitiesArr
          .map((facility, index) => `${facility.key} = $${index + 1}`)
          .join(", ");

        const updateQuery = `UPDATE houseFacilities SET ${setClause} WHERE house_id = $${
          houseFacilitiesArr.length + 1
        } RETURNING *`;

        const { rows,  } = await db.query(updateQuery, parameterValues);

        if (rows.length > 0) updatedHouseFacilities = rows[0];
      } else {
        houseFacilitiesArr.push({ key: "house_id", value: houseId });

        const parameterKeys = houseFacilitiesArr
          .map((facility) => facility.key)
          .join(", ");
        const parameterValues = houseFacilitiesArr.map(
          (facility) => facility.value
        );

        const setClause = houseFacilitiesArr
          .map((_, index) => `$${index + 1}`)
          .join(", ");

        const insertQuery = `INSERT INTO houseFacilities (${parameterKeys}) VALUES (${setClause}) RETURNING *`;

        const { rows } = await db.query(insertQuery, [...parameterValues]);

        if (rows.length > 0) updatedHouseFacilities = rows[0];
      }

      updatedHouse = { ...updatedHouse, ...updatedHouseFacilities };
    }

    res
      .status(200)
      .json({ message: "Updated House Successfully", house: updatedHouse });
  } catch (error) {
    res.status(400).json({
      message: error.toString(),
    });
  }
};

const updatePgProperty = async (req, res) => {
  try {
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
      modified_at,
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
      modified_at: new Date(Date.now()),
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
          .join(", ")} WHERE pg_id = $${
          pgFacilitiesArr.length + 1
        } RETURNING *`;

        updatedPgFacility = await db.query(updateFacilities, [...values, pgId]);
      }

      updatedPg = { ...updatedPg, ...updatedPgFacility };
    }

    res.status(200).json({ message: "Updated Pg Successfully", pg: updatedPg });
  } catch (error) {
    res.status(400).json({
      message: error.toString(),
    });
  }
};

const getMyListings = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
};

const listPropertiesOnSearch = async (req, res) => {
  try {
    const {
      propertyType = "",
      city = "",
      text = [],
      pgNo = 1,
      filters = {},
    } = req.body;

    const {
      bhk_type = undefined,
      preferred_tenants = undefined,
      price_greater_than = undefined,
      price_less_than = undefined,
      facing = undefined,
      available_from = undefined,
      furnishing_type = undefined,
      four_wheeler_parking = undefined,
      two_wheeler_parking = undefined,
      property_with_image = undefined,
      property_type = undefined,
    } = filters || {};

    let available_date_less_than = undefined;
    let available_date_greater_than = undefined;
    if (available_from === "immediate") {
      available_date_less_than = new Date();
    } else if (available_from === "within 15 days") {
      available_date_less_than = new Date() + 15 * 24 * 60 * 60 * 1000;
    } else if (available_from === "within 30 days") {
      available_date_less_than += new Date() + 30 * 24 * 60 * 60 * 1000;
    } else if (available_from === "after 30 days") {
      available_date_greater_than += new Date() + 30 * 24 * 60 * 60 * 1000;
    }
    const keywords = text.map((textArray) => {
      const op = textArray.split(",");
      return op;
    });

    const allKeywords = keywords.flat();

    const queryForHouse = `
    SELECT    houses.id as houses_id,*,housefacilities.id as housefacilities_id 
    FROM houses
    LEFT JOIN housefacilities
    on houses.id=housefacilities.house_id
    LEFT JOIN propertymediatable 
    ON houses.id = propertymediatable.house_id
    WHERE city ILIKE $2
      AND locality ILIKE ANY (
        SELECT '%' || pattern || '%'
        FROM unnest($1::text[]) AS pattern
      )
      AND (bhk_type = ANY ($5) OR $5 IS NULL)
      AND (preferred_tenants = ANY ($6) OR $6 IS NULL)
      AND (rent >= $7 OR $7 IS NULL)
      AND (rent <= $8 OR $8 IS NULL)
      AND (facing = $9 OR $9 IS NULL)
      AND (available_from <= $10 OR $10 IS NULL)
      AND (available_from >= $11 OR $11 IS NULL)
      AND (furnishing_type = ANY ($12) OR $12 IS NULL)
      AND (four_wheeler_parking = $13 OR $13 IS NULL)
      AND (two_wheeler_parking = $14 OR $14 IS NULL)
      AND (media_url = $15 OR $15 IS NULL)
      AND (property_type = $16 OR $16 IS NULL)
    ORDER BY (
      SELECT COUNT(DISTINCT word)
      FROM regexp_split_to_table(locality, E'\\s+') AS word
      WHERE word ILIKE ANY (
        SELECT '%' || pattern || '%'
        FROM unnest($1::text[]) AS pattern
      )
    ) DESC, houses.updated_at DESC
    OFFSET $3
    LIMIT $4;
`;

    const queryForhouseCount = `
SELECT COUNT(*) AS total_count
FROM houses
LEFT JOIN housefacilities
    on houses.id=housefacilities.house_id
    LEFT JOIN propertymediatable 
    ON houses.id = propertymediatable.house_id
WHERE city ILIKE $2
  AND locality ILIKE ANY (
    SELECT '%' || pattern || '%'
    FROM unnest($1::text[]) AS pattern
  )
  AND (bhk_type = ANY ($3) OR $3 IS NULL)
  AND (preferred_tenants = ANY ($4) OR $4 IS NULL)
  AND (rent >= $5 OR $5 IS NULL)
  AND (rent <= $6 OR $6 IS NULL)
  AND (facing = $7 OR $7 IS NULL)
  AND (available_from <= $8 OR $8 IS NULL)
  AND (available_from >= $9 OR $9 IS NULL)
  AND (furnishing_type = ANY ($10) OR $10 IS NULL)
  AND (four_wheeler_parking = $11 OR $11 IS NULL)
  AND (two_wheeler_parking = $12 OR $12 IS NULL)
  AND (media_url = $13 OR $13 IS NULL)
  AND (property_type = $14 OR $14 IS NULL)
  ;

`;
    const queryForPg = `
    SELECT    pgs.id as pgs_id,*,pgfacilities.id as pgfacilities_id 
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
    ) DESC, pgs.updated_at DESC
    OFFSET $3
    LIMIT $4; 
`;
    const queryForpgCount = `
SELECT COUNT(*) AS total_count
FROM pgs
WHERE city ILIKE $2
  AND locality ILIKE ANY (
    SELECT '%' || pattern || '%'
    FROM unnest($1::text[]) AS pattern
  );

`;

    if (propertyType == "House" || propertyType == "house") {
      const data = await db.query(queryForHouse, [
        allKeywords,
        city,
        10 * (pgNo - 1),
        10,
        bhk_type,
        preferred_tenants,
        price_greater_than,
        price_less_than,
        facing,
        available_date_less_than,
        available_date_greater_than,
        furnishing_type,
        four_wheeler_parking,
        two_wheeler_parking,
        property_with_image,
        property_type,
      ]);
      const { rows } = data;

      const count = await db.query(queryForhouseCount, [
        allKeywords,
        city,
        bhk_type,
        preferred_tenants,
        price_greater_than,
        price_less_than,
        facing,
        available_date_less_than,
        available_date_greater_than,
        furnishing_type,
        four_wheeler_parking,
        two_wheeler_parking,
        property_with_image,
        property_type,
      ]);
      //console.log(count);
      // ...

      return res
        .status(200)
        .json({ count: count.rows[0].total_count, allhouses: rows });
    } else {
      const { rows } = await db.query(queryForPg, [
        allKeywords,
        city,
        10 * (pgNo - 1),
        10,
      ]);

      const count = await db.query(queryForpgCount, [allKeywords, city]);

      return res
        .status(200)
        .json({ count: count.rows[0].total_count, allpgs: rows });
    }
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
};

const shortlistProperty = async (req, res) => {
  try {
    const { propertyType, propertyId } = req.body;
    const { id: userId } = req.user;

    if (!userId || !propertyType || !propertyId)
      return res.status(401).json(res, false, "Invalid request");

    // check for house
    if (propertyType === "house") {
      const data = await db.query("SELECT id FROM houses WHERE houses.id=$1", [
        propertyId,
      ]);

      if (data.rows.length === 0) {
        return res.status(400).json({ message: "House not found" });
      }

      const { rows } = await db.query(
        "SELECT house_shortlists, count_shortlists FROM users WHERE id=$1",
        [userId]
      );

      if (rows.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      let oldHouseShortlists = rows[0].house_shortlists;
      let countShortlists = parseInt(rows[0].count_shortlists);

      let newHouseShortlists = [];

      // already shortlisted, remove from shortlist
      if (oldHouseShortlists.includes(propertyId)) {
        newHouseShortlists = oldHouseShortlists.filter(
          (shortlist) => shortlist !== propertyId
        );
        countShortlists -= 1;
      }
      // add shortlist
      else {
        if (countShortlists === MAX_COUNT)
          return res
            .status(401)
            .json(
              "Max limit reached. Please remove some from shortlists before shortlisting more properties"
            );

        newHouseShortlists = [...newHouseShortlists, propertyId];
        countShortlists += 1;
      }

      await db.query(
        `UPDATE users SET house_shortlists = $1, count_shortlists = $2 WHERE id=$3`,
        [newHouseShortlists, countShortlists, userId]
      );

      return res.status(200).json("Updated House Shortlists");
    } else if (propertyType === "pg") {
      const data = await db.query("SELECT id FROM pgs WHERE pgs.id=$1", [
        propertyId,
      ]);

      if (data.rows.length === 0) {
        res.status(400).json({ message: "Pg not found!" });
      }

      const { rows } = await db.query(
        "SELECT pg_shortlists, count_shortlists FROM users WHERE id=$1",
        [userId]
      );

      if (rows.length === 0) {
        return res.status(400).json({ message: "User not found!" });
      }

      let oldPgShortlists = rows[0].pg_shortlists;
      let countShortlists = parseInt(rows[0].count_shortlists);

      let newPgShortlists = [];

      if (oldPgShortlists.includes(propertyId)) {
        newPgShortlists = oldPgShortlists.filter(
          (shortlist) => shortlist !== propertyId
        );
        countShortlists -= 1;
      } else {
        if (countShortlists === MAX_COUNT)
          return res
            .status(401)
            .json(
              "Max limit reached. Please remove some from shortlists before shortlisting more properties"
            );

        newPgShortlists = [...newPgShortlists, propertyId];
        countShortlists += 1;
      }

      await db.query(
        `UPDATE users SET pg_shortlists = $1, count_shortlists = $2 WHERE id=$3`,
        [newPgShortlists, countShortlists, userId]
      );

      return res.status(200).json({ message: "Updated PG Shortlists" });
    }
    else{
      throw new Error("propertyType doesn't exist")
    }
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
};

const showShortlists = async (req, res) => {
  try {
    const { propertyType } = req.query;
    const userId = req.user.id;

    const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    let shortlists = [];

    if (propertyType === "house") {
      shortlists = rows[0].house_shortlists;

      const data = await Promise.all(
        shortlists.map(async (shortlistId) => {
          const { rows } = await db.query(
            "SELECT houses.id, houses.available_from, houses.builtup_area, houses.rent, houses.deposit, houses.furnishing_type, houses.bhk_type FROM houses WHERE houses.id = $1",
            [shortlistId]
          );

          const data = await db.query(
            "SELECT * FROM propertyMediaTable WHERE house_id = $1",
            [shortlistId]
          );

          if (data.rows.length > 0) rows[0].push(data.rows);

          return rows[0];
        })
      );

      return res.status(200).json({ data });
    } else if (propertyType === "pg") {
      shortlists = rows[0].pg_shortlists;

      const data = await Promise.all(
        shortlists.map(async (shortlistId) => {
          const { rows } = await db.query(
            "SELECT pgs.id, pgs.single_room, pgs.single_room_deposit, pgs.single_room_rent, pgs.double_room, pgs.double_room_rent, pgs.double_room_deposit, pgs.food, pgs.pg_name, pgs.locality, pgs.city, pgs.gender FROM pgs WHERE pgs.id = $1",
            [shortlistId]
          );

          const data = await db.query(
            "SELECT * FROM propertyMediaTable WHERE pg_id = $1",
            [shortlistId]
          );

          if (data.rows.length > 0) rows[0].push(data.rows);

          return rows[0];
        })
      );

      return res.status(200).json({ data });
    } else {
      throw Error({
        message: "You are lost!",
      });
    }
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

const getPropertyData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("id invalid");

    const query = `SELECT    houses.id as houses_id,*,housefacilities.id as housefacilities_id 
   FROM houses
   LEFT JOIN housefacilities
   on houses.id=housefacilities.house_id
   LEFT JOIN propertymediatable 
   ON houses.id = propertymediatable.house_id
   where houses.id=$1

`;

    const { rows } = await db.query(query, [id]);

    res.status(200).json({ data: rows[0] });
  } catch (e) {
    res.status(401).json({ message: "not able to find property" });
  }
};

module.exports = {
  newHouseProperty,
  newPgProperty,
  updateHouseProperty,
  updatePgProperty,
  listPropertiesOnSearch,
  shortlistProperty,
  getMyListings,
  showShortlists,
  getHouse,
  getPropertyData,
};
