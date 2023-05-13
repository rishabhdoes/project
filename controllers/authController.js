const { JWT_SECRET } = require("../config");
const db = require("../db");
const { sign } = require("jsonwebtoken");
const { hash } = require("bcryptjs");

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query("select * from users");
    console.log(rows);
  } catch (error) {
    console.log(error.message);
  }
};

exports.register = async (req, res) => {
  const { email, username, phone_number, password } = req.body;

  try {
    const password_hash = await hash(password, 10);
    await db.query(
      "INSERT INTO users(username, email, phone_number, password_hash) values ($1, $2, $3, $4)",
      [username, email, phone_number, password_hash]
    );

    return res.status(201).json({
      success: true,
      message: "The registration was successfull",
    });
  } catch (err) {
    console.log(err.message);
  }
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
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.protected = async (req, res) => {
  res.send("Hi");
};
