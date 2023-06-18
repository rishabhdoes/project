const db = require("../db");

const adminVerify = async (req, res, next) => {
  const query1 = `SELECT is_user_admin from users WHERE id=$1`;

  const { rows } = await db.query(query1, [req.user.id]);

  if (rows && rows[0].is_user_admin) next();
  else {
    next({ message: "not authorised" });
  }
};

module.exports = { adminVerify };
