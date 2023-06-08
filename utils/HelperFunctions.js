const chalk = require("chalk");
const MemberModel = require("../models/User");
const bcrypt = require("bcryptjs");
const mailer = require("nodemailer");
require("dotenv").config();
const l = ''

sendEmail = async (msg) => {
  let transport = mailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    from: process.env.SMTP_FROM,
    useAuth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    secure: true,
  });

  let mailoptions = {
    from: process.env.SMTP_USER,
    to: msg.email,
    subject: msg.subject,
    html: msg.html,
  };

  await transport.sendMail(mailoptions, (err, data) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log("SMTP", data);
      return data;
    }
  });
};



const sendResponse = (
  res,
  status = false,
  statusCode = 200,
  statusMessage = "Ok",
  data = null,
  totalRecords
) => {
  // time taken to send the response
  console.time(statusMessage);
  let resSchema = {
    status,
    statusCode,
    statusMessage,
    totalRecords: totalRecords ? totalRecords : 0,
  };
  if (data != null) {
    resSchema.data = data;
  }
  console.timeEnd(statusMessage);
  return res?.status(200).json(resSchema);
};

module.exports = {
  sendResponse,
  sendEmail,
  uploadImageBase64,
  upload,
  hashValue,
  verifyHash,
  generateJwt,
  verifyToken,
  sendEmailInvite
};
