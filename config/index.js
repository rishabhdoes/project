const { config } = require("dotenv");
config();

module.exports = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  MAILTRAP_USERNAME: process.env.MAILTRAP_USERNAME,
  MAILTRAP_PASSWORD: process.env.MAILTRAP_PASSWORD,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
  SENDER_EMAIL: process.env.SENDER_EMAIL,
  SENDER_PASSWORD: process.env.SENDER_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT
};
