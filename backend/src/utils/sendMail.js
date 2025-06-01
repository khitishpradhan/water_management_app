const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e513aa381a3b2a",
    pass: "257e1d0c3c8370"
  }
});

async function sendAlertEmail(to, name, usage, limit) {
  await transporter.sendMail({
    from: '"Water Monitor" <alerts@example.com>',
    to,
    subject: "Water Usage Limit Exceeded",
    text: `Hi ${name},\n\nYou have exceeded your water usage limit of ${limit}L. Current usage: ${usage}L.\n\nRegards,\n Your Water Monitoring Program`
  });
}

module.exports = sendAlertEmail;