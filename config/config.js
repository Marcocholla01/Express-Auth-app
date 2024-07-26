// Load environment variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// Database configuration
const databaseConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const port = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

// jwTS And COOKIE
const ACTIVATION_SECRET_KEY = process.env.ACTIVATION_SECRET_KEY;
const ACTIVATION_EXPIRES_IN = process.env.ACTIVATION_EXPIRES_IN;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const COOKIE_EXPIRES_IN = process.env.COOKIE_EXPIRES_IN;

//  Mailings
const SMTP_MAIL = process.env.SMTP_MAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_SERVICE = process.env.SMTP_SERVICE;

module.exports = {
  databaseConfig,
  port,
  FRONTEND_URL,
  ACTIVATION_SECRET_KEY,
  JWT_SECRET_KEY,
  JWT_EXPIRES_IN,
  SMTP_HOST,
  SMTP_MAIL,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_SERVICE,
  COOKIE_EXPIRES_IN,
  ACTIVATION_EXPIRES_IN,
};
