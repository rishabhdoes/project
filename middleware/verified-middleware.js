const db = require("../db");

const checkUserVerified = async (req, res, next) => {
  const query1 = `SELECT verified from users WHERE id=$1`;

  const { rows } = await db.query(query1, [req.user.id]);

  if (rows && rows[0].verified) next();
  else {
    next({ message: "not Verified User" });
  }
};
const checkUserBlocked = async (req, res, next) => {
  const query1 = `SELECT verified from users WHERE id=$1`;

  const { rows } = await db.query(query1, [req.user.id]);

  if (rows && !rows[0]?.is_blocked) next();
  else {
    next({ message: "You are blocked for this activity" });
  }
};

module.exports = { checkUserVerified, checkUserBlocked };
