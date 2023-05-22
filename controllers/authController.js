const { JWT_SECRET } = require("../config");
const db = require("../db");
const { sign } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const { generateOTP, mailTransport } = require("../utils/mail");
const { sendMsg } = require("../utils/errors");

exports.register = async (req, res) => {
  const { email, username, phone_number, password } = req.body;

  try {
    const password_hash = await hash(password, 10);

    await db.query(
      "INSERT INTO users(username, email, phone_number, password_hash) values ($1, $2, $3, $4)",
      [username, email, phone_number, password_hash]
    );

    const OTP = generateOTP();

    const otptoken_hash = await hash(OTP, 10);

    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const { id } = user.rows[0];

    await db.query(
      "INSERT INTO otpTokens(userId, otptoken_hash) values ($1, $2)",
      [id, otptoken_hash]
    );

    mailTransport().sendMail({
      from: "yesbroker@gmail.com",
      to: email,
      subject: "Verify your email account",
      html: `<h1>${OTP}</h1>`,
    });

    return sendMsg(res, 201, true, "The registration was successfull");
  } catch (err) {
    console.log(err.message);
  }
};

exports.verify = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp.trim())
    return sendMsg(res, 401, false, "Invalid request, Missing Parameters!");

  const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

  if (!user || !user.rows) {
    return sendMsg(res, 401, false, "user not found!");
  }

  if (user.rows[0].verified)
    return sendMsg(res, 401, false, "Account already verified");

  const token = await db.query("SELECT * FROM otpTokens WHERE userId = $1", [
    userId,
  ]);

  if (!token || !token.rows) {
    return sendMsg(res, 401, false, "user not found!");
  }

  const isMatch = await compare(otp, token.rows[0].otptoken_hash);

  if (!isMatch) {
    return sendMsg(res, 401, false, "user not found!");
  }

  user.rows[0].verified = true;

  await db.query("DELETE FROM otpTokens WHERE userId = $1", [userId]);
  await db.query("UPDATE users SET verified = true WHERE id = $1", [userId]);

  res.json({ success: true, message: "email is verified" });
};

exports.login = async (req, res) => {
  let user = req.user;

  payload = {
    id: user.id,
    email: user.email,
  };

  try {
    const token = sign(payload, JWT_SECRET, { expiresIn: "365d" });

    return res.status(200).cookie("token", token, { httpOnly: true }).json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    return sendMsg(res, 500, false, error.message);
  }
};

exports.protected = async (req, res) => {
  res.send("Hi");
};
