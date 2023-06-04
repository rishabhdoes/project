const { MAILTRAP_USERNAME, MAILTRAP_PASSWORD } = require("../config");
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
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USERNAME,
      pass: MAILTRAP_PASSWORD,
    },
  });

  return transport;
};
