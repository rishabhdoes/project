const { JWT_SECRET, SENDER_EMAIL } = require("../config");
const db = require("../db");
const { sendMsg } = require("../utils/errors");
const { generateRandomString, mailTransport } = require("../utils/mail");
const jwt = require("jsonwebtoken");

const getProfile = async (req, res) => {
  try {
    const { id } = req.body;
    const { rows, rowCount } = await db.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );
    if (rowCount === 0) {
      return sendMsg(res, 400, false, "User not found!");
    }
    const user = rows[0];
    return sendMsg(res, 200, true, user);
  } catch (error) {
    console.log("error:", error);
    res.status(400).json({
      message: error.toString(),
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id, newName, newEmail, newPhoneNumber } = req.body;
    const { rows, rowCount } = await db.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );
    if (rowCount === 0) {
      return sendMsg(res, 400, false, "User not found!");
    }
    const user = rows[0];
    await db.query(
      `UPDATE users SET name = $2, email = $3, phone_number = $4 WHERE id = $1`,
      [id, newName, newEmail, newPhoneNumber]
    );
    return sendMsg(res, 200, true, "Profile Updated");
  } catch (error) {
    console.log("error:", error);
    res.status(400).json({
      message: error.toString(),
    });
  }
};

const toggleUserBlockedStatus = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const queryToggleIsBlocked = `
  UPDATE users
  SET is_blocked = NOT is_blocked
  WHERE id = $1;
`;

    await db.query(queryToggleIsBlocked, [userId]);
    res.status(200).json({ message: "Updated!!" });
  } catch (e) {
    next(e);
  }
};

const generateVerificationEmail = async (req, res) => {
  const user = req.user;

  const id = user?.id;
  const { email } = req.body;

  const randomString = generateRandomString();
  const token =
    jwt.sign({ email: email }, JWT_SECRET, { expiresIn: "15m" }) + randomString;
  const baseUrl = process.env.CLIENT_URL;
  const link = `${baseUrl}/verifyEmail/${id}/${email}/${token}`;

  try {
    await mailTransport().sendMail({
      from: SENDER_EMAIL,
      to: email,
      subject: "Verify email",
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://example.com/homewale-logo.png" alt="Homewale Logo" style="width: 150px;">
      </div>
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>Email Verification</h2>
        <p>Hello,</p>
        <p>Thank you for registering with Homewale.com! To complete your registration, please click the verification button below:</p>
        <div style="text-align: center;">
          <a href="${link}" style="display: inline-block; padding: 12px 24px; font-size: 18px; text-decoration: none; background-color: #007bff; color: #fff; border-radius: 4px;">Verify Email</a>
        </div>
        <p>If the button above doesn't work, you can also copy and paste the following link into your web browser:</p>
        <p><strong>${link}</strong></p>
        <p>Please verify your email within the next 15 minutes to activate your account.</p>
        <p>If you didn't register on Homewale.com, please ignore this email.</p>
        <p>Thank you,</p>
        <p>The Homewale.com Team</p>
      </div>
      <div style="text-align: center;">
        <p style="font-size: 12px;">This email was sent by Homewale.com, a brokerage site similar to Housing.com and Nobroker. If you have any questions or need assistance, please <a href="https://homewale.com/contact">contact us</a>.</p>
      </div>
    </div>`,
    });
    return sendMsg(res, 201, true);
  } catch (error) {
    console.log(error);
  }
};

const verifyEmail = async (req, res) => {
  let { user_id, email, token } = req.params;

  token = token.slice(0, -10);

  try {
    const secret = JWT_SECRET;
    const verify = jwt.verify(token, secret);

    const { rows } = await db.query(
      `UPDATE users SET verified=$1, email=$2 WHERE id=$3 returning *`,
      [true, email, user_id]
    );
    return sendMsg(res, 200, true, "Password Changed");
  } catch (error) {
    console.log(error);
    sendMsg(res, 400, true, "Link expired");
    // return res.status(400).send("Link Expired");
  }
};

const getAllUserBlocked = async (req, res, next) => {
  try {
    const query = `SELECT * FROM users WHERE is_blocked='true'`;

    const { rows } = await db.query(query);

    res.status(200).json({ blockedUsers: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateProfile,
  getProfile,
  toggleUserBlockedStatus,
  verifyEmail,
  generateVerificationEmail,
  getAllUserBlocked,
};
