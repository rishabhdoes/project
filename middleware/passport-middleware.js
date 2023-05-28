const passport = require("passport");
const { Strategy } = require("passport-jwt");
const { JWT_SECRET } = require("../config");
const db = require("../db");

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) token = req.cookies["token"];
  return token;
};

const opts = {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: cookieExtractor,
};

passport.use(
  new Strategy(opts, async (obj, done) => {
    const { id } = obj.verifiedUser;

    try {
      const { rows } = await db.query(
        "SELECT id, email FROM users WHERE id = $1",
        [id]
      );

      if (!rows.length) {
        throw new Error("401 not authorised");
      }

      let user = { id: rows[0].id, email: rows[0].email };

      return await done(null, user);
    } catch (error) {
      console.log(error.message);
      done(null, false);
    }
  })
);
