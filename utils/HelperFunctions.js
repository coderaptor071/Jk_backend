const chalk = require("chalk");
const MemberModel = require("../models/User");
const bcrypt = require("bcryptjs");
const mailer = require("nodemailer");
require("dotenv").config();
const l = ''

sendEmail = async (msg) => {
  let transport = mailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    from: process.env.SMTP_FROM,
    secure: true,
    secureConnection: false,
    tls: {
      ciphers: 'SSLv3'
    },
    auth: {
      user: process.env.SMTP_FROM,
      pass: "jkExport@123#",
    },
  }
  );
  // console.log("transport", transport)
  let mailoptions = {
    from: process.env.SMTP_FROM,
    to: process.env.SMTP_USER,
    subject: `Inquiry from ${msg.username} received on JKharbles.com`,
    html: `
        <!doctype html>
      <html lang="en">
      <head> </head>
        <body>
        <h2> Message from ${msg.Email} <h2>
            <p>${msg.Message} <p>
        </body>
      </html> `,
  };
  console.log("in smtp")
  await transport.sendMail(mailoptions, (err, data) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      // console.log("SMTP", data);
      return data;
    }
  });
};

module.exports = { sendEmail };

