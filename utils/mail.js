const { MAILTRAP_USERNAME, MAILTRAP_PASSWORD } = require("../config");
const nodemailer = require("nodemailer");

exports.generateOTP = () => {
  let otp = "";

  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 9);
  }

  return otp;
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
