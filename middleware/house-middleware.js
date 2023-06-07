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

    if (house.owner_id !== userId)
      throw new Error("You do not have access to do that");

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { isHouseOwner };
