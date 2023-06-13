const { SENDER_EMAIL, SENDER_PASSWORD } = require("../config");
const nodemailer = require("nodemailer");

exports.generateOTP = () => {
  let otp = "";

  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 9);
  }

  return otp;
};

exports.generateRandomString = () => {
  const length = 10;
  const characters = "qwertyuiopasdfghjklzxcvbnm@#$%^&*()!1234567890";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};

exports.mailTransport = () => {
  let transport = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASSWORD,
    },
  });

  return transport;
};
