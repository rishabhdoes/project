const { Coordinates } = require("../constants");
const db = require("../db");
const { houses, houseFacilities } = require("../db/tables");
const { getCoordinatesByLocation } = require("./Googleapiscontrolller");
const MAX_COUNT = 100;

const getHouse = async (req, res) => {
  try {
    const { houseId } = req.query;
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
    // //.log(rows[0]);
    if (!rows.length) {
      throw new Error("House not found");
    } else {
      return res.status(200).json(rows[0]);
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getPg = async (req, res) => {
  try {
    const { pgId } = req.query;

    const data = await db.query(
      ` SELECT *
  FROM pgs
  LEFT JOIN
  pgFacilities ON pgs.id = pgFacilities.pg_id
  WHERE pgs.id = $1;
  `,
      [pgId]
    );

    const { rows } = data;
    // //.log(rows[0]);
    if (!rows.length) {
      throw new Error("Pg not found");
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
      parking = null,
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
      houseNo = null,
      pincode = null,
      address = null,
      postPropertyPageNo: post_property_page_no = 0,
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
      parking,
      houseNo,
      pincode,
      address,
      post_property_page_no,
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
      "parking",
      "rank",
      "houseNo",
      "pincode",
      "address",
      "post_property_page_no",
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

        const { rows } = await db.query(updateQuery, parameterValues);

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
    console.log(pgId);

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
      food_available = null,
      rank = null,
      postPropertyPageNo: post_property_page_no = 0,
      modified_at,
      latitude = null,
      longitude = null,
    } = req.body;
    let coordinates;
    if (locality) {
      coordinates = await getCoordinatesByLocation(locality);
      console.log(coordinates);
    }

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
      food_available,
      rank,
      post_property_page_no,
      modified_at: new Date(Date.now()),
      latitude: coordinates[0],
      longitude: coordinates[1],
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
      "food_available",
      "rank",
      "post_property_page_no",
      "latitude",
      "longitude",
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
    const { id: userId } = req.user;
    const { propertyType } = req.query;

    let listings;

    if (propertyType === "pg") {
      listings = await db.query("SELECT * FROM pgs WHERE pgs.owner_id = $1", [
        userId,
      ]);

      let listingsWithImages = await Promise.all(
        listings.rows.map(async (pg) => {
          const fetchData = async () => {
            const { rows } = await db.query(
              "SELECT media_url, id FROM propertyMediaTable WHERE pg_id = $1",
              [pg.id]
            );
            return rows;
          };

          let newData = { ...pg, images: await fetchData() };
          return newData;
        })
      );

      res.status(200).json({ listings: listingsWithImages });
    } else {
      listings = await db.query(
        "SELECT * FROM houses WHERE houses.owner_id = $1",
        [userId]
      );

      let listingsWithImages = await Promise.all(
        listings.rows.map(async (house) => {
          const fetchData = async () => {
            const { rows } = await db.query(
              "SELECT media_url, id FROM propertyMediaTable WHERE house_id = $1",
              [house.id]
            );
            return rows;
          };

          let newData = { ...house, images: await fetchData() };
          return newData;
        })
      );

      res.status(200).json({ listings: listingsWithImages });
    }
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
      parking = undefined,
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
    SELECT houses.id as houses_id,*, housefacilities.id as housefacilities_id
    FROM houses
    LEFT JOIN housefacilities ON houses.id = housefacilities.house_id
    WHERE is_active='true'
    AND is_verified='true'
    AND city ILIKE $2
      AND locality ILIKE ANY (
        SELECT '%' || pattern || '%'
        FROM unnest($1::text[]) AS pattern
      )AND (bhk_type = ANY ($3) OR $3 IS NULL)
      AND (preferred_tenants = ANY ($4) OR $4 IS NULL)
      AND (rent >= $5 OR $5 IS NULL)
      AND (rent <= $6 OR $6 IS NULL)
      AND (facing = $7 OR $7 IS NULL)
      AND (available_from <= $8 OR $8 IS NULL)
      AND (available_from >= $9 OR $9 IS NULL)
      AND (furnishing_type = ANY ($10) OR $10 IS NULL)
      AND (parking = ANY ($11) OR $11 IS NULL)
      AND (property_type = $12 OR $12 IS NULL)
    ORDER BY (
      SELECT COUNT(DISTINCT word)
      FROM regexp_split_to_table(locality, E'\\s+') AS word
      WHERE word ILIKE ANY (
        SELECT '%' || pattern || '%'
        FROM unnest($1::text[]) AS pattern
      )
    ) DESC, houses.updated_at DESC
    OFFSET $13
    LIMIT $14;
  `;

    if (propertyType === "House" || propertyType === "house") {
      const houseData = await db.query(queryForHouse, [
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
        parking,
        property_type,
        10 * (pgNo - 1),
        10,
      ]);

      const houseIds = houseData.rows.map((row) => row.houses_id);

      const queryForhouseCount = `
      SELECT COUNT(*) AS total_count
      FROM houses
      LEFT JOIN housefacilities ON houses.id = housefacilities.house_id
      WHERE 
      is_active='true'
      AND is_verified='true'
      AND city ILIKE $2
        AND locality ILIKE ANY (
          SELECT '%' || pattern || '%'
          FROM unnest($1::text[]) AS pattern
        )AND (bhk_type = ANY ($3) OR $3 IS NULL)
        AND (preferred_tenants = ANY ($4) OR $4 IS NULL)
        AND (rent >= $5 OR $5 IS NULL)
        AND (rent <= $6 OR $6 IS NULL)
        AND (facing = $7 OR $7 IS NULL)
        AND (available_from <= $8 OR $8 IS NULL)
        AND (available_from >= $9 OR $9 IS NULL)
        AND (furnishing_type = ANY ($10) OR $10 IS NULL)
        AND (parking = ANY ($11) OR $11 IS NULL)
        AND (property_type = $12 OR $12 IS NULL)
        AND(media_count>=$13 OR $13 IS NULL)
          `;

      const totalCount = await db.query(queryForhouseCount, [
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
        parking,
        property_type,
        property_with_image,
      ]);

      const queryForMedia = `
      SELECT house_id, array_agg(DISTINCT filename) AS file_name,array_agg(DISTINCT media_url) AS media_url
      FROM propertymediatable
      WHERE house_id = ANY ($1)
      GROUP BY house_id;
    `;

      let mediaData = await db.query(queryForMedia, [houseIds]);

      const newMedia = mediaData.rows.map((mp) => {
        const mediaFiles = [];

        for (let i = 0; i < mp.file_name.length; i++) {
          mediaFiles.push({
            file_name: mp.file_name[i],
            media_url: mp.media_url[i],
          });
        }

        return { house_id: mp.house_id, images: mediaFiles };
      });

      //console.log(newMedia);

      const mergedData = houseData.rows.map((house) => {
        const media = newMedia.find(
          (item) => item.house_id === house.houses_id
        );
        return {
          ...house,
          ...media,
        };
      });

      let housesData = mergedData;
      if (property_with_image) {
        housesData = mergedData.filter((data) => {
          return data.file_name.length > 0;
        });
      }

      return res.status(200).json({
        totalCount: totalCount?.rows[0]?.total_count,
        allhouses: housesData,
      });

      // mergedData contains the combined information from house and media tables
      // Rest of your code
    } else {
      const queryForPg = `SELECT  pgs.id as pgs_id,*,pgfacilities.id as pgfacilities_id
      FROM pgs
      LEFT JOIN pgfacilities ON pgs.id = pgfacilities.pg_id
      WHERE is_active='true'
      AND is_verified='true'
      AND  city ILIKE $2
        AND locality ILIKE ANY (
          SELECT '%' || pattern || '%'
          FROM unnest($1::text[]) AS pattern
        )
        AND (room_type = ANY ($3) OR $3 IS NULL)
      AND (preferred_tenants = ANY ($4) OR $4 IS NULL)
      AND (rent >= $5 OR $5 IS NULL)
      AND (rent <= $6 OR $6 IS NULL)
      AND (available_from <= $7 OR $7 IS NULL)
      AND (available_from >= $8 OR $8 IS NULL)
      AND (parking = ANY ($9) OR $9 IS NULL)
      AND (breakfast='true'  OR $10 IS NULL)
      AND (lunch='true'  OR $11 IS NULL)
      AND (dinner='true'  OR $12 IS NULL)
      ORDER BY (
        SELECT COUNT(DISTINCT word)
        FROM regexp_split_to_table(locality, E'\\s+') AS word
        WHERE word ILIKE ANY (
          SELECT '%' || pattern || '%'
          FROM unnest($1::text[]) AS pattern
        )
      ) DESC, pgs.updated_at DESC
      OFFSET $3
      LIMIT $4;`;

      const queryForpgCount = `
      SELECT COUNT(*) AS total_count
      FROM pgs
      WHERE is_active='true'
      AND is_verified='true'                                                                                                                                                                                             
      AND  city ILIKE $2
        AND locality ILIKE ANY (
          SELECT '%' || pattern || '%'
          FROM unnest($1::text[]) AS pattern
        ); 
        AND (room_type = ANY ($3) OR $3 IS NULL)
      AND (preferred_tenants = ANY ($4) OR $4 IS NULL)
      AND (rent >= $5 OR $5 IS NULL)
      AND (rent <= $6 OR $6 IS NULL)
      AND (available_from <= $7 OR $7 IS NULL)
      AND (available_from >= $8 OR $8 IS NULL)
      AND (parking = ANY ($9) OR $9 IS NULL)
      AND (breakfast='true'  OR $10 IS NULL)
      AND (lunch='true'  OR $11 IS NULL)
      AND (dinner='true'  OR $12 IS NULL)
        `;

      const pgsData = await db.query(queryForPg, [
        allKeywords,
        city,
        10 * (pgNo - 1),
        10,
      ]);
      const pgsCount = await db.query(queryForpgCount, [allKeywords, city]);

      return res
        .status(200)
        .json({ allpgs: pgsData.rows, totalCount: pgsCount.rows[0] });
    }
  } catch (e) {
    //.log(e);
    res.status(400).json(e);
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

        newHouseShortlists = [...oldHouseShortlists, propertyId];
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
    } else {
      throw new Error("propertyType doesn't exist");
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
    const { id: userId } = req.user;

    const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    let shortlists = [];

    if (propertyType === "houses") {
      shortlists = rows[0].house_shortlists;

      const data = await Promise.all(
        shortlists.map(async (shortlistId) => {
          const { rows } = await db.query(
            "SELECT houses.id, houses.available_from, houses.builtup_area, houses.rent, houses.deposit, houses.furnishing_type, houses.bhk_type, houses.locality FROM houses WHERE houses.id = $1",
            [shortlistId]
          );

          const data = await db.query(
            "SELECT filename, id, media_url FROM propertymediatable WHERE house_id = $1",
            [shortlistId]
          );

          if (data.rows.length > 0) {
            rows[0] = { ...rows[0], images: data.rows };
          }

          return rows[0];
        })
      );

      return res.status(200).json({ data });
    } else if (propertyType === "pgs") {
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

      return res.status(200).json(data);
    } else {
      throw Error({
        message: "You are lost!",
      });
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getPropertyData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("id invalid");

    const query = `SELECT houses.id as houses_id,*,housefacilities.id as housefacilities_id 
   FROM houses
   LEFT JOIN housefacilities
   on houses.id=housefacilities.house_id
   where houses.id=$1
`;
    const { rows } = await db.query(query, [id]);

    const data = await db.query(
      "SELECT media_url, description FROM propertyMediaTable WHERE house_id = $1",
      [id]
    );
    const media = data.rows;

    res.status(200).json({ ...rows[0], media });
  } catch (e) {
    res.status(401).json({ message: "not able to find property" });
  }
};

const getPropertyDataForPg = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("id invalid");

    const query = `SELECT pgs.id as pgs_id,*,pgfacilities.id as pgfacilities_id 
   FROM pgs
   LEFT JOIN pgfacilities
   on pgs.id=pgfacilities.pg_id
   where pgs.id=$1
`;
    const { rows } = await db.query(query, [id]);

    const data = await db.query(
      "SELECT media_url, description FROM propertyMediaTable WHERE pg_id = $1",
      [id]
    );
    const media = data.rows;

    res.status(200).json({ ...rows[0], media });
  } catch (e) {
    res.status(401).json({ message: "not able to find property" });
  }
};

const getUser = async (req, res) => {
  const userId = req.user.id;

  if (!userId) throw new Error("UserId not found");

  try {
    const { rows, rowCount } = await db.query(
      "SELECT * FROM users WHERE id=$1",
      [userId]
    );
    if (rowCount) {
      return res.status(200).json(rows[0]);
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getOwnerDetails = async (req, res) => {
  try {
    const { propertyId = null, propertyType = null } = req.body;

    if (propertyType === "house") {
      const { rows, rowCount } = await db.query(
        "SELECT * FROM houses WHERE id = $1",
        [propertyId]
      );

      if (rowCount <= 0) {
        throw new Error("House does not exist");
      } else {
        const ownerId = rows[0].owner_id;
        const userId = req.user.id;

        // user Data
        let userData = await db.query(
          "SELECT owners_contacted, count_owner_contacted FROM users WHERE id = $1",
          [userId]
        );

        userData = userData.rows[0];

        const { count_owner_contacted, owners_contacted } = userData;

        let ownerData = await db.query(
          "SELECT name, email, phone_number FROM users WHERE id = $1",
          [ownerId]
        );
        ownerData = ownerData.rows[0];

        // console.log(userData, ownerData);

        // if user is himself the owner or
        // he has already seen contacts for this property
        // show owner details
        // console.log("owners_contacted: ", owners_contacted);
        // console.log("h_" + houseId);

        if (
          ownerId === req.user.id ||
          owners_contacted?.includes("h_" + houseId)
        ) {
          return res.status(200).json({ exists: true, ...ownerData });
        } else {
          // if user currently has more limit to view owners
          //.log(count_owner_contacted);
          if (count_owner_contacted > 0) {
            //.log("ser" + req.user.id);
            const ownerContacted = [...owners_contacted, "h_" + houseId];
            const countOwnerContacted = count_owner_contacted - 1;

            // console.log("owners_contacted: ", owners_contacted);
            // console.log("new_owners_contacted: ", ownerContacted);

            await db.query(
              "UPDATE users SET owners_contacted = $1, count_owner_contacted = $2 WHERE id = $3",
              [ownerContacted, countOwnerContacted, req.user.id]
            );

            return res.status(200).json({ exists: true, ...ownerData });
          } else {
            // user has reached his max free limit
            return res.status(200).json({
              exists: false,
              message: "You have used your free credits",
            });
          }
        }
      }
    } else if (propertyType === "pg") {
      const { rows, rowCount } = await db.query(
        "SELECT * FROM pgs WHERE id = $1",
        [propertyId]
      );

      if (rowCount <= 0) {
        throw new Error("Pg does not exist");
      } else {
        const ownerId = rows[0].owner_id;

        const data = await db.query(
          "SELECT owners_contacted, count_owner_contacted, name, email, phone_number FROM users WHERE id = $1",
          [ownerId]
        );

        const userData = data.rows[0];

        const {
          name,
          email,
          phone_number,
          count_owner_contacted,
          owners_contacted,
        } = userData;

        // if user is himself the owner or
        // he has already seen contacts for this property
        // show owner details
        if (ownerId === req.user.id || owners_contacted.includes("p_" + pgId)) {
          return res
            .status(200)
            .json({ exists: true, name, email, phone_number });
        } else {
          // if user currently has more limit to view owners
          if (count_owner_contacted > 0) {
            const ownerContacted = [...owners_contacted, "p_" + pgId];
            const countOwnerContacted = count_owner_contacted - 1;

            await db.query(
              "UPDATE users SET owners_contacted = $1, count_owner_contacted = $2 WHERE id = $3",
              [ownerContacted, countOwnerContacted, req.user.id]
            );

            return res
              .status(200)
              .json({ exists: true, name, phone_number, email });
          } else {
            // user has reached his max free limit
            return res.status(200).json({
              exists: false,
              message: "You have used your free credits",
            });
          }
        }
      }
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

const getAdminPropertyList = async (req, res, next) => {
  try {
    const {
      ownerEmail = null,
      ownerName = null,
      pgNo = 0,
      startDate = null,
      lastDate = null,
      propertyType = "both",
    } = req.body;

    // Assuming today's date if lastDate is not provided

    const today = new Date().toISOString().split("T")[0];
    const assumedLastDate = lastDate || today;

    const queryForHouse = `
  SELECT *
  FROM houses
   JOIN users ON houses.owner_id = users.id
   WHERE is_active='true'
  AND is_verified='true'
  AND (users.email = $1 OR $1 IS NULL)
  
  AND (users.name ILIKE $2 OR $2 IS NULL)
  
  ${
    startDate && assumedLastDate
      ? "AND houses.updated_at BETWEEN $3 AND $4"
      : ""
  }
  OFFSET $${startDate && assumedLastDate ? "5" : "3"}
  LIMIT $${startDate && assumedLastDate ? "6" : "4"};
`;

    const queryForPg = `
SELECT pgs.*
FROM pgs
 JOIN users ON pgs.owner_id = users.id
  WHERE is_active='true'
AND is_verified='true'
AND (users.email = $1 OR $1 IS NULL)
AND (users.name ILIKE $2 OR $2 IS NULL)
${startDate && assumedLastDate ? "AND pgs.updated_at BETWEEN $3 AND $4" : ""}
OFFSET $${startDate && assumedLastDate ? "5" : "3"}
LIMIT $${startDate && assumedLastDate ? "6" : "4"};

`;

    const queryForhouseCount = `
  SELECT count(*)
  FROM houses
  JOIN users ON houses.owner_id = users.id
    WHERE is_active='true'
  AND is_verified='true'
  AND  (users.email = $1 OR $1 IS NULL)
  AND (users.name ILIKE $2 OR $2 IS NULL)
  ${
    startDate && assumedLastDate
      ? "AND houses.updated_at BETWEEN $3 AND $4"
      : ""
  }
`;

    const queryForpgCount = `
SELECT count(pgs.id)
FROM pgs
 JOIN users ON pgs.owner_id = users.id
  WHERE is_active='true'
      AND is_verified='true'
      AND  (users.email = $1 OR $1 IS NULL)
AND (users.name ILIKE $2 OR $2 IS NULL)
${startDate && assumedLastDate ? "AND pgs.updated_at BETWEEN $3 AND $4" : ""}

`;
    let queryParams = [ownerEmail, ownerName];
    if (startDate && assumedLastDate) {
      queryParams.push(startDate, assumedLastDate);
    }
    let queryParamsForCount = [...queryParams];

    queryParams.push(10 * (pgNo - 1), 10);

    if (propertyType == "House") {
      const houseData = await db.query(queryForHouse, queryParams);
      const countData = await db.query(queryForhouseCount, queryParamsForCount);
      return res
        .status(200)
        .json({ houses: houseData?.rows, count: countData?.rows[0].count });
    } else if (propertyType == "Pg") {
      const pgData = await db.query(queryForPg, queryParams);
      const countData = await db.query(queryForpgCount, queryParamsForCount);
      return res
        .status(200)
        .json({ pgs: pgData?.rows, count: countData?.rows[0]?.count });
    } else {
      const houseData = await db.query(queryForHouse, queryParams);
      const pgData = await db.query(queryForPg, queryParams);
      const countData1 = await db.query(
        queryForhouseCount,
        queryParamsForCount
      );
      const countData2 = await db.query(queryForpgCount, queryParamsForCount);

      res.status(200).json({
        houses: houseData?.rows,
        pgs: pgData?.rows,
        count:
          parseInt(countData1?.rows[0].count) +
          parseInt(countData2?.rows[0].count),
      });
    }
  } catch (e) {
    next(e);
  }
};

const togglePropertyBlockedStatus = async (req, res, next) => {
  try {
    const { propertyId, propertyType } = req.body;
    if (propertyType === "House") {
      const queryUpdateIsActive = `
  UPDATE houses
  SET is_active = NOT is_active
  WHERE id = $1;
`;
      await db.query(queryUpdateIsActive, [propertyId]);
    } else {
      const queryUpdateIsActive = `
    UPDATE pgs
    SET is_active = !is_active
    WHERE id = $2;
  `;

      await db.query(queryUpdateIsActive, [propertyId]);
    }
    res.status(200).json({ message: "Updated!!" });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).clearCookie("token").json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

const getAllPropertiesContacted = async (req, res, next) => {
  try {
    const query = `SELECT owners_contacted FROM users WHERE id=$1`;
    const { id: userId } = req.user;

    const { rows } = await db.query(query, [userId]);

    const propertyIds = rows[0].owners_contacted;

    const propertyData = await Promise.all(
      propertyIds.map(async (id) => {
        if (id && id[0] === "h") {
          id = id.slice(2);
          const query = `SELECT * FROM houses where id=$1`;
          const data = await db.query(query, [id]);
          const imageData = await db.query(
            "SELECT media_url, filename FROM propertyMediaTable WHERE house_id = $1",
            [id]
          );
          return { ...data.rows[0], images: imageData.rows };
        } else {
          id = id.slice(2);
          const query = `SELECT * FROM pgs where id=$1`;
          const data = await db.query(query, [id]);
          const imageData = await db.query(
            "SELECT media_url, filename FROM propertyMediaTable WHERE pg_id = $1",
            [id]
          );
          //.log(data);
          return { ...data.rows[0], images: imageData.rows };
        }
      })
    );

    res.status(200).json(propertyData);
  } catch (err) {
    next(err);
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
  getUser,
  logout,
  getOwnerDetails,
  getPg,
  getAdminPropertyList,
  togglePropertyBlockedStatus,
  getAllPropertiesContacted,
  getPropertyDataForPg,
};
