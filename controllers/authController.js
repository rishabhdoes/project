const { JWT_SECRET } = require("../config");
const db = require("../db");
const { sign } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");

const {
  generateOTP,
  mailTransport,
  generateRandomString,
} = require("../utils/mail");

const { sendMsg } = require("../utils/errors");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, name, phone_number, password } = req.body;

    const password_hash = await hash(password, 10);

    const { rows } = await db.query(
      "INSERT INTO users(name, email, phone_number, password_hash) values ($1, $2, $3, $4) RETURNING *",
      [name, email, phone_number, password_hash]
    );

    const user = rows[0];
    const userId = user.id;

    const OTP = generateOTP();

    const otpTokenHash = await hash(OTP, 10);

    await db.query(
      "INSERT INTO otpTokens(user_id, otptoken_hash) values ($1, $2)",
      [userId, otpTokenHash]
    );

    mailTransport().sendMail({
      from: "yesbroker@gmail.com",
      to: email,
      subject: "Verify your email account",
      html: `<h1>${OTP}</h1>`,
    });

    return res.status(200).json({user, success:true});
    // return sendMsg(res, 201, true, { user });
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
};

exports.verify = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp.trim())
      return sendMsg(res, 400, false, "Invalid request, Missing Parameters!");

    const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (!rows || !rows.length) {
      return sendMsg(res, 400, false, "User not found!");
    }

    let user = rows[0];

    if (user.verified === true)
      return sendMsg(res, 400, false, "Account already verified");

    const { rows: tokenRows } = await db.query(
      "SELECT * FROM otpTokens WHERE user_id = $1",
      [userId]
    );

    if (!tokenRows || !tokenRows.length) {
      return sendMsg(res, 400, false, "User not found!");
    }

    let token = tokenRows[0];

    const isMatch = await compare(otp, token.otptoken_hash);

    if (!isMatch) {
      return sendMsg(res, 400, false, "Invalid OTP!");
    }

    user.verified = true;
    const verifiedUser = user;

    await db.query("DELETE FROM otpTokens WHERE user_id = $1", [userId]);
    await db.query("UPDATE users SET verified = true WHERE id = $1", [userId]);

    payload = {
      ...verifiedUser,
    };

    token = sign(payload, JWT_SECRET, { expiresIn: "365d" });

    return res.status(200).cookie("token", token, { httpOnly: true }).json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.toString(),
    });
  }
};

exports.login = async (req, res) => {
  try {
    let user = req.user;

    payload = {
      id: user.id,
      email: user.email,
    };

    const token = sign(payload, JWT_SECRET, { expiresIn: "365d" });

    return res.status(200).cookie("token", token, { httpOnly: true }).json({
      success: true,
      message: "Logged in successfully",
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.toString(),
    });
  }
};

exports.protected = async (req, res) => {
  res.send("Hi");
};

exports.forgotPassword = async (req, res) => {
  const user = req.user;
  const id = user?.id;
  const { email } = req.body;
  const randomString = generateRandomString();
  const token =
    jwt.sign({ email: email }, JWT_SECRET, { expiresIn: "15m" }) + randomString;
  const baseUrl = process.env.CLIENT_URL;
  const link = `${baseUrl}/resetpassword/${id}/${token}`;

  try {
    mailTransport().sendMail({
      from: "yesbroker@gmail.com",
      to: email,
      subject: "Change your password",
      html: `<a href="${link}">Click here to reset password</a>`,
    });
    return sendMsg(res, 201, true);
  } catch (error) {
    console.log(error);
  }
};

exports.resetPassword = async (req, res) => {
  let { user_id, token } = req.params;
  token = token.slice(0, -10);
  const newPassword = req.body.newPassword;
  try {
    const password_hash = await hash(newPassword, 10);
    const secret = JWT_SECRET;
    try {
      const verify = jwt.verify(token, secret);
      console.log("verify:", verify);

      await db.query(`UPDATE users SET password_hash=$1 WHERE id=$2`, [
        password_hash,
        user_id,
      ]);
      return sendMsg(res, 200, true, "Password Changed");
    } catch (error) {
      console.log(error);
      res.statusText = "Link Expired";
      return res.status(400).send("Link Expired");
      // res.json({ status: "Something Went Wrong" });
    }
  } catch (error) {}
};
