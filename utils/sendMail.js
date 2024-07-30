const nodemailer = require(`nodemailer`);

const dotenv = require("dotenv");
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_MAIL,
  SMTP_PASSWORD,
  SMTP_SERVICE,
} = require("../config/config");

dotenv.config({ path: "../config/.env" });

const sendMail = async (options) => {
  const transpoter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    service: SMTP_SERVICE,
    auth: {
      user: SMTP_MAIL,
      pass: SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: options.from,
    reply: options.reply,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  await transpoter.sendMail(mailOptions);
};

module.exports = sendMail;
